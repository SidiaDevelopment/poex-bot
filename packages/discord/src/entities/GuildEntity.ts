import {Column, Entity, PrimaryColumn} from "typeorm"
import {autoLoadEntity} from "@pollux/database"

@autoLoadEntity()
@Entity()
export class GuildEntity {
    @PrimaryColumn()
    public id!: string

    @Column()
    public name!: string
}
