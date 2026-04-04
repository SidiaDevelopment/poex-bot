import {
    command,
    DiscordCommand,
    EmbedService,
    IDiscordCommand,
    IDiscordCommandData,
} from "@pollux/discord-command"
import {Colors, PermissionFlagsBits} from "discord.js"
import {injectService} from "@pollux/service"
import {DiscordService} from "@pollux/discord"

const commandConfig: IDiscordCommand<IDiscordCommandData> = {
    command: "ping",
    description: "ping.commands.ping.description",
    defaultMemberPermissions: PermissionFlagsBits.ManageGuild
}

@command(commandConfig)
export class PingCommand extends DiscordCommand<IDiscordCommandData> {
    @injectService
    private discordService!: DiscordService

    @injectService
    private embedService!: EmbedService

    public async handle({interaction}: IDiscordCommandData): Promise<void> {
        const client = this.discordService.getClient()

        const rtt = client.ws.ping
        const rttString = rtt == -1 ? "still evaluating" : rtt + "ms"
        const message = this.embedService.getDefaultBuilder(Colors.Green)
        message.setTitle("Ping!")
        message.setDescription("You have requested a ping!")
        message.addFields(
            {name: "Uptime", value: this.msToTime(client.uptime ?? 0)},
            {name: "API", value: rttString},
            {name: "Server", value: "pinging..."},
        )

        const response = await interaction.reply({embeds: [message], withResponse: true})
        const reply = response.resource!.message!
        message.setFields(
            {name: "Uptime", value: this.msToTime(client.uptime ?? 0)},
            {name: "API", value: rttString},
            {name: "Server", value: (reply.createdTimestamp - interaction.createdTimestamp).toString() + "ms"},
        )
        await reply.edit({embeds: [message]})
    }

    private msToTime(ms: number): string {
        const days = Math.floor(ms / (60 * 1000 * 60 * 24))
        const daysms = ms % (60 * 1000 * 60 * 24)
        const hours = Math.floor(daysms / (60 * 1000 * 60))
        const hoursms = ms % (60 * 1000 * 60)
        const minutes = Math.floor(hoursms / (60 * 1000))
        const minutesms = ms % (60 * 1000)
        const sec = Math.floor(minutesms / 1000)

        let str = ""
        if (days) str = str + days + "d" + " "
        if (hours) str = str + hours + "h" + " "
        if (minutes) str = str + minutes + "m" + " "
        if (sec) str = str + sec + "s"

        return str
    }
}
