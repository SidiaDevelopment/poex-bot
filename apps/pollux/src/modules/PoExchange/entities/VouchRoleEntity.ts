import {Column, Entity, PrimaryColumn} from "typeorm"
import {autoLoadEntity} from "@pollux/database"

@autoLoadEntity()
@Entity()
export class VouchRoleEntity {
    @PrimaryColumn()
    public guildId!: string

    @PrimaryColumn()
    public roleId!: string

    @Column()
    public threshold!: number
}
