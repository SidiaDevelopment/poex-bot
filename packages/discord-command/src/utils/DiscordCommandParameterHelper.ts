import {ApplicationCommandOptionType, ChatInputCommandInteraction} from "discord.js"
import {IDiscordCommandData} from "../IDiscordCommandData"
import {IDiscordCommandOption} from "../IDiscordCommandOption"

export type ParameterData<T> = Omit<T, keyof IDiscordCommandData>

export class DiscordCommandParameterHelper {
    public static collectParameters<T extends IDiscordCommandData>(parameters: IDiscordCommandOption<T>[], interaction: ChatInputCommandInteraction): ParameterData<T> {
        const data: Partial<ParameterData<T>> = {}
        for (const parameter of parameters) {
            DiscordCommandParameterHelper.collectParameter(data, interaction, parameter.name as string, parameter.type)
        }
        return data as ParameterData<T>
    }

    public static collectParameter(data: Record<string, unknown>, interaction: ChatInputCommandInteraction, name: string, parameterType: ApplicationCommandOptionType): void {
        switch (parameterType) {
        case ApplicationCommandOptionType.String:
            data[name] = interaction.options.getString(name)
            break
        case ApplicationCommandOptionType.Integer:
            data[name] = interaction.options.getInteger(name)
            break
        case ApplicationCommandOptionType.Boolean:
            data[name] = interaction.options.getBoolean(name)
            break
        case ApplicationCommandOptionType.User:
            data[name] = interaction.options.getUser(name)
            break
        case ApplicationCommandOptionType.Channel:
            data[name] = interaction.options.getChannel(name)
            break
        case ApplicationCommandOptionType.Role:
            data[name] = interaction.options.getRole(name)
            break
        case ApplicationCommandOptionType.Mentionable:
            data[name] = interaction.options.getMentionable(name)
            break
        case ApplicationCommandOptionType.Number:
            data[name] = interaction.options.getNumber(name)
            break
        }
    }
}
