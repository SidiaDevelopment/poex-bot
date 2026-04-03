import {Service} from "@pollux/service"
import {ColorResolvable, EmbedBuilder} from "discord.js"
import {translate} from "@pollux/i18n"

export class EmbedService extends Service {
    public async init(): Promise<void> {}

    public static readonly ICON_URL = "https://cdn.discordapp.com/attachments/1489434889110683758/1489434912753979483/Weltraum-Emblem_mit_leuchtendem_Stern.png?ex=69d067db&is=69cf165b&hm=3ed0f098d96f0cc52bb231d13f4b3de4c68789fcc2edae56dc3222a9f69060dc&"

    public getDefaultBuilder(color: ColorResolvable): EmbedBuilder {
        return new EmbedBuilder()
            .setColor(color)
    }
}
