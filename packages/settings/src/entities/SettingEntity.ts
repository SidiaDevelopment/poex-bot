import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm"
import {autoLoadEntity} from "@pollux/database"
import {GuildEntity} from "@pollux/discord"

@autoLoadEntity()
@Entity()
export class SettingEntity {
    @PrimaryColumn()
    public key!: string

    @PrimaryColumn()
    public guildId!: string

    @ManyToOne(() => GuildEntity, {nullable: true, createForeignKeyConstraints: false})
    @JoinColumn({name: "guildId"})
    public guild!: GuildEntity | null

    @Column()
    public value!: string
}
