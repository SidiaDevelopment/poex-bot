import {AutocompleteInteraction, ChatInputCommandInteraction, Events, Interaction, MessageFlags, UserContextMenuCommandInteraction} from "discord.js"
import {ControllerContext, useContext} from "@pollux/core"
import {LogLevel} from "@pollux/logging"
import {injectService, Service} from "@pollux/service"
import {DiscordEventService} from "@pollux/discord"
import {DiscordCommandController} from "../DiscordCommandController"
import {DiscordContextMenuController} from "../DiscordContextMenuController"
import {IDiscordCommandOption} from "../IDiscordCommandOption"
import {IDiscordCommandData} from "../IDiscordCommandData"

export class DiscordCommandService extends Service {
    @injectService
    private discordEventService!: DiscordEventService

    public init = async (): Promise<void> => {
        const {loggingController} = useContext(ControllerContext)
        const commands = DiscordCommandController.getAllCommands()
        loggingController.log("@pollux/discord-command", LogLevel.Debug, `Registered commands (${commands.length}):`)
        for (const cmd of commands) {
            loggingController.log("@pollux/discord-command", LogLevel.Debug, `  ${DiscordCommandController.getUniqueIdentifier(cmd.command, cmd.subCommand, cmd.subCommandGroup)}`)
        }

        this.discordEventService.subscribe(Events.InteractionCreate, this.onInteraction)
    }

    private isAdmin(interaction: ChatInputCommandInteraction): boolean {
        const {serviceController} = useContext(ControllerContext)
        // Access SettingsService by name to avoid circular dependency with @pollux/settings
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const settingsService = serviceController.get({name: "SettingsService"} as any) as any
        if (!settingsService) return false
        const adminServer = settingsService.get("pollux.adminServer", interaction.guildId ?? "")
        const adminUser = settingsService.get("pollux.adminUser", interaction.guildId ?? "")
        return interaction.guildId === adminServer || interaction.user.id === adminUser
    }

    private onInteraction = (interaction: Interaction): void => {
        if (interaction.isAutocomplete()) {
            this.onAutocomplete(interaction)
            return
        }

        if (interaction.isUserContextMenuCommand()) {
            this.onContextMenu(interaction)
            return
        }

        if (!interaction.isChatInputCommand()) return
        if (interaction.user.bot) return

        const commandName = interaction.commandName
        const subCommand = interaction.options.getSubcommand(false)
        const subCommandGroup = interaction.options.getSubcommandGroup(false)

        const {loggingController} = useContext(ControllerContext)

        const data = DiscordCommandController.getCommand(commandName, subCommand, subCommandGroup)
        if (!data) {
            loggingController.log(
                "@pollux/discord-command",
                LogLevel.Error,
                `Could not find command for chain: ${DiscordCommandController.getUniqueIdentifier(commandName, subCommand, subCommandGroup)}`
            )
            return
        }

        if (data.instance.config.adminOnly && !this.isAdmin(interaction)) {
            interaction.reply({content: "This command is restricted to the admin server or admin user.", flags: [MessageFlags.Ephemeral]})
            return
        }

        loggingController.log(
            "@pollux/discord-command",
            LogLevel.Debug,
            `Executing command for chain: ${DiscordCommandController.getUniqueIdentifier(commandName, subCommand, subCommandGroup)}`
        )
        data.instance.execute(interaction)
    }

    private onContextMenu = (interaction: UserContextMenuCommandInteraction): void => {
        const {loggingController} = useContext(ControllerContext)

        const command = DiscordContextMenuController.getCommand(interaction.commandName)
        if (!command) {
            loggingController.log(
                "@pollux/discord-command",
                LogLevel.Error,
                `Could not find context menu command: ${interaction.commandName}`
            )
            return
        }

        if (command.config.adminOnly && !this.isAdmin(interaction as unknown as ChatInputCommandInteraction)) {
            interaction.reply({content: "This command is restricted to the admin server or admin user.", flags: [MessageFlags.Ephemeral]})
            return
        }

        loggingController.log(
            "@pollux/discord-command",
            LogLevel.Debug,
            `Executing context menu command: ${interaction.commandName}`
        )
        command.handle(interaction)
    }

    private onAutocomplete = async (interaction: AutocompleteInteraction): Promise<void> => {
        const commandName = interaction.commandName
        const subCommand = interaction.options.getSubcommand(false)
        const subCommandGroup = interaction.options.getSubcommandGroup(false)

        const data = DiscordCommandController.getCommand(commandName, subCommand, subCommandGroup)
        if (!data) return

        const focused = interaction.options.getFocused(true)
        const options = data.instance.config.options as IDiscordCommandOption<IDiscordCommandData>[] | undefined
        const option = options?.find(o => (o.name as string) === focused.name)
        if (!option?.autocompleteCallback) return

        const choices = await option.autocompleteCallback(focused.value)
        await interaction.respond(choices.slice(0, 25))
    }
}
