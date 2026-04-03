import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm"
import {autoLoadEntity} from "@pollux/database"
import {GuildEntity} from "@pollux/discord"

@autoLoadEntity()
@Entity()
export class PoExchangeCategoryEntity {
    @PrimaryColumn()
    public channelKey!: string

    @PrimaryColumn()
    public guildId!: string

    @ManyToOne(() => GuildEntity, {createForeignKeyConstraints: false})
    @JoinColumn({name: "guildId"})
    public guild!: GuildEntity

    @Column()
    public discordChannelId!: string
}
