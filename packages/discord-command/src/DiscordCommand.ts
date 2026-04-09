import {Ctor} from "@pollux/utils"
import {IDiscordCommandData} from "./IDiscordCommandData"
import {IDiscordCommand} from "./IDiscordCommandConfig"
import {ChatInputCommandInteraction} from "discord.js"
import {DiscordCommandParameterHelper} from "./utils/DiscordCommandParameterHelper"
import {IDiscordCommandOption} from "./IDiscordCommandOption"
import {DiscordContextMenuCommand} from "./DiscordContextMenuCommand"
import {DiscordButton} from "./DiscordButton"

export interface IModuleDiscordConfig {
    tag: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    discordCommands?: Ctor<DiscordCommand<any>>[]
    discordContextMenuCommands?: Ctor<DiscordContextMenuCommand>[]
    discordButtons?: Ctor<DiscordButton>[]
}

declare module "@pollux/core/types" {
    interface IModule {
        discord?: IModuleDiscordConfig
    }
}

export abstract class DiscordCommand<T extends IDiscordCommandData> {
    public config!: IDiscordCommand<T>

    public execute = async (interaction: ChatInputCommandInteraction) => {
        const data = this.collectData(interaction)
        await this.handle(data)
    }

    private collectData(interaction: ChatInputCommandInteraction): T {
        const standardData = this.collectStandardData(interaction)

        const params = this.config.options as IDiscordCommandOption<IDiscordCommandData>[] | undefined
        const parameterData = DiscordCommandParameterHelper.collectParameters(params ?? [], interaction)

        return {...standardData, ...parameterData} as T
    }

    private collectStandardData(interaction: ChatInputCommandInteraction): IDiscordCommandData {
        const data: IDiscordCommandData = {
            user: interaction.user,
            interaction: interaction
        }

        if (interaction.guild) {
            data.guild = interaction.guild
        }

        if (interaction.channel) {
            data.channel = interaction.channel
        }

        return data
    }

    public abstract handle(data: T): Promise<void>
}
