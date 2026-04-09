import {AutocompleteInteraction, ButtonInteraction, ChatInputCommandInteraction, Events, Interaction, MessageFlags, UserContextMenuCommandInteraction} from "discord.js"
import {ControllerContext, useContext} from "@pollux/core"
import {LogLevel} from "@pollux/logging"
import {injectService, Service} from "@pollux/service"
import {DiscordEventService} from "@pollux/discord"
import {DiscordCommandController} from "../DiscordCommandController"
import {DiscordContextMenuController} from "../DiscordContextMenuController"
import {DiscordButtonController} from "../DiscordButtonController"
import {EphemeralButtonController} from "../EphemeralButtonController"
import {IDiscordCommandControllerData} from "../IDiscordCommandControllerData"
import {IDiscordCommandOption} from "../IDiscordCommandOption"
import {IDiscordCommandData} from "../IDiscordCommandData"

// Accessed by name to avoid circular dependency with @pollux/settings
const SETTING_ADMIN_SERVER = "pollux.adminServer"
const SETTING_ADMIN_USER = "pollux.adminUser"

interface ISettingsAccess {
    get(key: string, guildId: string): string
}

export class DiscordCommandService extends Service {
    @injectService
    private discordEventService!: DiscordEventService

    public init = async (): Promise<void> => {
        const {loggingController} = useContext(ControllerContext)
        const commands = DiscordCommandController.getAllCommands()
        const contextMenuCommands = DiscordContextMenuController.getAllCommands()
        const buttons = DiscordButtonController.getAllButtons()

        loggingController.log("@pollux/discord-command", LogLevel.Debug, `Registered commands (${commands.length}):`)
        for (const cmd of commands) {
            loggingController.log("@pollux/discord-command", LogLevel.Debug, `  ${this.formatCommandSignature(cmd)}`)
        }

        if (contextMenuCommands.length > 0) {
            loggingController.log("@pollux/discord-command", LogLevel.Debug, `Registered context menu commands (${contextMenuCommands.length}):`)
            for (const cmd of contextMenuCommands) {
                loggingController.log("@pollux/discord-command", LogLevel.Debug, `  [${cmd.config.type === 2 ? "user" : "message"}] ${cmd.config.name}`)
            }
        }

        if (buttons.length > 0) {
            loggingController.log("@pollux/discord-command", LogLevel.Debug, `Registered buttons (${buttons.length}):`)
            for (const btn of buttons) {
                loggingController.log("@pollux/discord-command", LogLevel.Debug, `  ${btn.config.customId}`)
            }
        }

        this.discordEventService.subscribe(Events.InteractionCreate, this.onInteraction)
    }

    private formatCommandSignature(cmd: IDiscordCommandControllerData): string {
        let sig = `/${cmd.command}`
        if (cmd.subCommandGroup) sig += ` ${cmd.subCommandGroup}`
        if (cmd.subCommand) sig += ` ${cmd.subCommand}`

        const options = cmd.instance.config.options as IDiscordCommandOption<IDiscordCommandData>[] | undefined
        if (options) {
            for (const opt of options) {
                const name = String(opt.name)
                sig += opt.required ? ` ${name}:<${name}>` : ` [${name}:<${name}>]`
            }
        }
        return sig
    }

    private isAdmin(interaction: ChatInputCommandInteraction): boolean {
        const {serviceController} = useContext(ControllerContext)
        // Access SettingsService by name to avoid circular dependency with @pollux/settings
        const settingsService = serviceController.get({name: "SettingsService"} as never) as unknown as ISettingsAccess | undefined
        if (!settingsService) return false
        const adminServer = settingsService.get(SETTING_ADMIN_SERVER, interaction.guildId ?? "")
        const adminUser = settingsService.get(SETTING_ADMIN_USER, interaction.guildId ?? "")
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

        if (interaction.isButton()) {
            this.onButton(interaction)
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

    private onButton = (interaction: ButtonInteraction): void => {
        if (interaction.user.bot) return

        const {loggingController} = useContext(ControllerContext)

        const button = DiscordButtonController.getButton(interaction.customId)
        if (button) {
            if (button.config.adminOnly && !this.isAdmin(interaction as unknown as ChatInputCommandInteraction)) {
                interaction.reply({content: "This button is restricted to the admin server or admin user.", flags: [MessageFlags.Ephemeral]})
                return
            }

            loggingController.log(
                "@pollux/discord-command",
                LogLevel.Debug,
                `Executing button handler for customId: ${interaction.customId}`
            )
            button.handle(interaction).catch(error => {
                loggingController.log("@pollux/discord-command", LogLevel.Error, `Unhandled button interaction error (${interaction.customId}): ${error}`)
            })
            return
        }

        const ephemeral = EphemeralButtonController.get(interaction.customId)
        if (!ephemeral) return

        loggingController.log(
            "@pollux/discord-command",
            LogLevel.Debug,
            `Executing ephemeral button handler for customId: ${interaction.customId}`
        )
        ephemeral.handle(interaction).catch(error => {
            loggingController.log("@pollux/discord-command", LogLevel.Error, `Unhandled ephemeral button interaction error (${interaction.customId}): ${error}`)
        })
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
