import {injectService, Service} from "@pollux/service"
import {ControllerContext, useContext} from "@pollux/core"
import {ConfigContext} from "@pollux/config"
import {DiscordService} from "@pollux/discord"
import {
    APIApplicationCommandOptionChoice,
    ApplicationCommandOptionType,
    ContextMenuCommandBuilder,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    SlashCommandSubcommandGroupBuilder,
    REST,
    Routes,
} from "discord.js"
import {LogLevel} from "@pollux/logging"
import {IDiscordCommandControllerData} from "../IDiscordCommandControllerData"
import {DiscordCommandController} from "../DiscordCommandController"
import {DiscordContextMenuController} from "../DiscordContextMenuController"
import {IDiscordCommandOption} from "../IDiscordCommandOption"
import {IDiscordCommandData} from "../IDiscordCommandData"
import {translate} from "@pollux/i18n"

enum BranchType {
    SelfCommand,
    Command,
    SubCommand,
    SubCommandGroup
}

interface ICommandTreeData {
    data?: IDiscordCommandControllerData
    children?: { [id: string]: ICommandTreeData }
    type: BranchType
}

interface ICommandTree {
    children: { [id: string]: ICommandTreeData }
}

export class DiscordUpdateCommandsService extends Service {
    @injectService
    private discordService!: DiscordService

    public init = async (): Promise<void> => {
        const {discordCommands} = useContext(ConfigContext)

        if (!discordCommands?.updateCommandsOnStart) return
        DiscordService.onClientReady.addListener(async () => {
            await this.updateCommands()
        })
    }

    public async updateCommands() {
        const {loggingController} = useContext(ControllerContext)
        const commands = DiscordCommandController.getAllCommands()
        const tree = this.buildCommandTree(commands)
        const builtCommands: object[] = await this.buildCommands(tree)

        const contextMenuCommands = DiscordContextMenuController.getAllCommands()
        for (const cmd of contextMenuCommands) {
            const builder = new ContextMenuCommandBuilder()
                .setName(cmd.config.name)
                .setType(cmd.config.type)
            if (cmd.config.defaultMemberPermissions !== undefined) {
                builder.setDefaultMemberPermissions(cmd.config.defaultMemberPermissions)
            }
            builtCommands.push(builder.toJSON())
            loggingController.log("@pollux/discord-commands", LogLevel.Debug, `  [ctx] ${cmd.config.name}`)
        }

        loggingController.log("@pollux/discord-commands", LogLevel.Debug, `Pushing ${builtCommands.length} command(s) to Discord:`)
        for (const cmd of builtCommands) {
            const subcommands = (cmd.options ?? [])
                .filter(o => o.type === ApplicationCommandOptionType.Subcommand || o.type === ApplicationCommandOptionType.SubcommandGroup)
                .map(o => o.name)
            if (subcommands.length > 0) {
                loggingController.log("@pollux/discord-commands", LogLevel.Debug, `  /${cmd.name} [${subcommands.join(", ")}]`)
            } else {
                loggingController.log("@pollux/discord-commands", LogLevel.Debug, `  /${cmd.name}`)
            }
        }

        await this.sendUpdate(builtCommands)
    }

    private async sendUpdate(builtCommands: object[]): Promise<void> {
        const {discord: {key}} = useContext(ConfigContext)
        if (!key) return
        const client = this.discordService.getClient()
        if (!client) return
        const app = client.application
        if (!app) return

        const {loggingController} = useContext(ControllerContext)
        try {
            loggingController.log("@pollux/discord-commands", LogLevel.Debug, "Started refreshing application commands.")

            const rest = new REST({version: "10"}).setToken(key)

            await rest.put(
                Routes.applicationCommands(app.id),
                {body: builtCommands},
            )

            loggingController.log("@pollux/discord-commands", LogLevel.Debug, "Successfully reloaded application commands.")
        } catch (error) {
            loggingController.log("@pollux/discord-commands", LogLevel.Error, `Failed to push commands: ${error instanceof Error ? error.message : String(error)}`)
            if (error instanceof Error && error.stack) {
                loggingController.log("@pollux/discord-commands", LogLevel.Error, error.stack)
            }
        }
    }

    private buildCommands = async (tree: ICommandTree): Promise<RESTPostAPIChatInputApplicationCommandsJSONBody[]> => {
        const jsons = []

        for (const branchKey in tree.children) {
            const branch = tree.children[branchKey]
            const builder = new SlashCommandBuilder()
            await this.buildCommand(branchKey, branch, builder)
            jsons.push(builder.toJSON())
        }
        return jsons
    }

    private buildCommand = async (name: string, treeData: ICommandTreeData, builder: SlashCommandBuilder): Promise<void> => {
        if (treeData.type == BranchType.SelfCommand && treeData.data) {
            await this.buildCommandLeaf(name, treeData, builder)
            const permissions = treeData.data.instance.config.defaultMemberPermissions
            if (permissions !== undefined) {
                builder.setDefaultMemberPermissions(permissions)
            }
        }
        if (treeData.type == BranchType.Command && treeData.children) {
            builder.setName(name)
            builder.setDescription("...")
            const permissions = this.resolvePermissions(treeData.children)
            if (permissions !== undefined) {
                builder.setDefaultMemberPermissions(permissions)
            }
            for (const branchKey in treeData.children) {
                const branch = treeData.children[branchKey]
                if (branch.type == BranchType.SubCommand)
                    await this.buildSubCommand(branchKey, branch, builder)

                if (branch.type == BranchType.SubCommandGroup)
                    await this.buildSubCommandGroup(branchKey, branch, builder)
            }
        }
    }

    private resolvePermissions(children: { [id: string]: ICommandTreeData }): bigint | undefined {
        for (const key in children) {
            const child = children[key]
            if (child.data?.instance.config.defaultMemberPermissions !== undefined) {
                return child.data.instance.config.defaultMemberPermissions
            }
            if (child.children) {
                const nested = this.resolvePermissions(child.children)
                if (nested !== undefined) return nested
            }
        }
        return undefined
    }

    private buildSubCommand = async (name: string, treeData: ICommandTreeData, builder: SlashCommandBuilder | SlashCommandSubcommandGroupBuilder): Promise<void> => {
        const localBuilder = new SlashCommandSubcommandBuilder()
        await this.buildCommandLeaf(name, treeData, localBuilder)
        builder.addSubcommand(localBuilder)
    }

    private buildSubCommandGroup = async (name: string, treeData: ICommandTreeData, builder: SlashCommandBuilder): Promise<void> => {
        const localBuilder = new SlashCommandSubcommandGroupBuilder()
        localBuilder.setName(name)
        localBuilder.setDescription("...")
        for (const branchKey in treeData.children) {
            const branch = treeData.children[branchKey]
            if (branch.type == BranchType.SubCommand)
                await this.buildSubCommand(branchKey, branch, localBuilder)
        }
        builder.addSubcommandGroup(localBuilder)
    }

    private buildCommandLeaf = async (name: string, treeData: ICommandTreeData, builder: SlashCommandBuilder | SlashCommandSubcommandBuilder): Promise<void> => {
        const instance = treeData.data!.instance
        builder.setName(name)
        builder.setDescription(translate(instance.config.description))
        builder.setDescriptionLocalizations({
            de: translate(instance.config.description, "de")
        })

        const params = instance.config.options as IDiscordCommandOption<IDiscordCommandData>[]
        if (!params) return

        for (const parameter of params) {
            switch (parameter.type) {
            case ApplicationCommandOptionType.String:
                builder.addStringOption(await this.addOption(parameter))
                break
            case ApplicationCommandOptionType.Integer:
                builder.addIntegerOption(await this.addOption(parameter))
                break
            case ApplicationCommandOptionType.Boolean:
                builder.addBooleanOption(await this.addOption(parameter))
                break
            case ApplicationCommandOptionType.User:
                builder.addUserOption(await this.addOption(parameter))
                break
            case ApplicationCommandOptionType.Channel:
                builder.addChannelOption(await this.addOption(parameter))
                break
            case ApplicationCommandOptionType.Role:
                builder.addRoleOption(await this.addOption(parameter))
                break
            case ApplicationCommandOptionType.Mentionable:
                builder.addMentionableOption(await this.addOption(parameter))
                break
            case ApplicationCommandOptionType.Number:
                builder.addNumberOption(await this.addOption(parameter))
                break
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private addOption = async (parameter: IDiscordCommandOption<IDiscordCommandData>): Promise<(option: any) => any> => {
        const choices: APIApplicationCommandOptionChoice[] = []
        if (parameter.choices != null) {
            choices.push(...parameter.choices)
        } else if (parameter.choicesCallback) {
            choices.push(...(await parameter.choicesCallback()))
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (option: any) => {
            option.setName(parameter.name)
            option.setDescription(translate(parameter.description))
            option.setRequired(!!parameter.required)
            option.setDescriptionLocalizations({
                de: translate(parameter.description, "de")
            })
            if (parameter.autocomplete || parameter.autocompleteCallback) {
                option.setAutocomplete(true)
            }
            if (choices.length > 0)
                option.setChoices(...choices)

            return option
        }
    }

    private buildCommandTree(commands: IDiscordCommandControllerData[]): ICommandTree {
        const tree: ICommandTree = {children: {}}

        for (const command of commands) {
            if (command.subCommandGroup && command.subCommand) {
                tree.children[command.command] ??= {
                    type: BranchType.Command,
                    children: {
                        [command.subCommandGroup]: {
                            type: BranchType.SubCommandGroup,
                            children: {
                                [command.subCommand]: {
                                    type: BranchType.SubCommand,
                                    data: command
                                }
                            }
                        }
                    }
                }
                tree.children[command.command].children![command.subCommandGroup] ??= {
                    type: BranchType.SubCommandGroup,
                    children: {
                        [command.subCommand]: {
                            type: BranchType.SubCommand,
                            data: command
                        }
                    }
                }
                tree.children[command.command].children![command.subCommandGroup].children![command.subCommand] ??= {
                    type: BranchType.SubCommand,
                    data: command
                }
            } else if (command.subCommand) {
                tree.children[command.command] ??= {
                    type: BranchType.Command,
                    children: {}
                }
                tree.children[command.command].children![command.subCommand] = {
                    type: BranchType.SubCommand,
                    data: command
                }
            } else {
                tree.children[command.command] ??= {
                    type: BranchType.SelfCommand,
                    data: command
                }
            }
        }
        return tree
    }
}
