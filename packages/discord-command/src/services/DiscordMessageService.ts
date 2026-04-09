import {Service} from "@pollux/service"
import {
    ActionRow,
    ActionRowBuilder,
    APIActionRowComponent,
    APIButtonComponent,
    APIEmbed,
    APIMessageActionRowComponent,
    ButtonBuilder,
    ComponentType,
    EmbedBuilder,
    Interaction,
    InteractionEditReplyOptions,
    InteractionReplyOptions,
    Message,
    MessageActionRowComponent,
    MessageCreateOptions,
    MessageEditOptions,
    MessageFlags,
    MessageReplyOptions,
    RepliableInteraction,
    SendableChannels,
    TextBasedChannel,
} from "discord.js"
import {EphemeralButtonController} from "../EphemeralButtonController"
import {IEphemeralButtonTarget} from "../IEphemeralButtonTarget"

export interface ISendPayload {
    content?: string
    embeds?: (EmbedBuilder | APIEmbed)[]
    components?: ActionRowBuilder<ButtonBuilder>[]
    flags?: MessageFlags[]
}

type SendableDiscordChannel = TextBasedChannel & SendableChannels
type DisabledComponents = (ActionRowBuilder<ButtonBuilder> | APIActionRowComponent<APIMessageActionRowComponent>)[]

export class DiscordMessageService extends Service {
    /**
     * Dispatches a payload to a repliable interaction or a channel. For interactions, auto-picks
     * between reply / editReply (when deferred) / followUp (when already replied).
     *
     * For message-reply semantics use {@link replyTo}. For editing an existing message use {@link edit}.
     */
    public async respond(context: Interaction | SendableDiscordChannel, payload: ISendPayload): Promise<Message> {
        if (this.isInteraction(context)) {
            if (!context.isRepliable()) {
                throw new Error("DiscordMessageService.respond: interaction is not repliable")
            }

            if (context.deferred && !context.replied) {
                return this.editReply(context, payload)
            }
            if (context.replied) {
                return this.followUp(context, payload)
            }
            return this.reply(context, payload)
        }

        return this.send(context, payload)
    }

    public async reply(interaction: RepliableInteraction, payload: ISendPayload): Promise<Message> {
        const options: InteractionReplyOptions = {
            ...this.toBaseOptions(payload),
            withResponse: true
        }
        const response = await interaction.reply(options)
        const message = response.resource?.message ?? await interaction.fetchReply()
        this.attachEphemeralTargets(payload.components, this.messageTarget(message, interaction))
        return message
    }

    public async editReply(interaction: RepliableInteraction, payload: ISendPayload): Promise<Message> {
        const options: InteractionEditReplyOptions = this.toBaseOptions(payload)
        const message = await interaction.editReply(options)
        this.attachEphemeralTargets(payload.components, this.interactionTarget(interaction))
        return message
    }

    public async followUp(interaction: RepliableInteraction, payload: ISendPayload): Promise<Message> {
        const options: InteractionReplyOptions = this.toBaseOptions(payload)
        const message = await interaction.followUp(options)
        this.attachEphemeralTargets(payload.components, this.followUpTarget(interaction, message.id))
        return message
    }

    public async send(channel: SendableDiscordChannel, payload: ISendPayload): Promise<Message> {
        const options: MessageCreateOptions = this.toBaseOptions(payload)
        const message = await channel.send(options)
        this.attachEphemeralTargets(payload.components, this.messageTarget(message))
        return message
    }

    public async edit(message: Message, payload: ISendPayload): Promise<Message> {
        const options: MessageEditOptions = this.toBaseOptions(payload)
        const edited = await message.edit(options)
        this.attachEphemeralTargets(payload.components, this.messageTarget(edited))
        return edited
    }

    /** Threaded reply to an existing message. */
    public async replyTo(message: Message, payload: ISendPayload): Promise<Message> {
        const options: MessageReplyOptions = this.toBaseOptions(payload)
        const sent = await message.reply(options)
        this.attachEphemeralTargets(payload.components, this.messageTarget(sent))
        return sent
    }

    /** Fetches a message by id and edits it. Returns null if the message no longer exists. */
    public async fetchAndEdit(channel: SendableDiscordChannel, messageId: string, payload: ISendPayload): Promise<Message | null> {
        try {
            const msg = await channel.messages.fetch(messageId)
            return await this.edit(msg, payload)
        } catch {
            return null
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private toBaseOptions(payload: ISendPayload): any {
        const options: Record<string, unknown> = {}
        if (payload.content !== undefined) options.content = payload.content
        if (payload.embeds) options.embeds = payload.embeds
        if (payload.components) options.components = payload.components
        if (payload.flags && payload.flags.length > 0) options.flags = payload.flags
        return options
    }

    private attachEphemeralTargets(components: ActionRowBuilder<ButtonBuilder>[] | undefined, target: IEphemeralButtonTarget): void {
        if (!components) return
        for (const row of components) {
            for (const component of row.components) {
                const customId = component.data.custom_id
                if (!customId) continue
                const button = EphemeralButtonController.get(customId)
                button?.attachTarget(target)
            }
        }
    }

    private messageTarget(message: Message, fallbackInteraction?: RepliableInteraction): IEphemeralButtonTarget {
        let current: Message = message
        const performEdit = async (payload: MessageEditOptions): Promise<void> => {
            try {
                current = await current.edit(payload)
            } catch (error) {
                if (fallbackInteraction) {
                    const edited = await fallbackInteraction.editReply(payload as InteractionEditReplyOptions)
                    if (edited) current = edited
                    return
                }
                throw error
            }
        }
        return {
            edit: performEdit,
            disableButton: async (customId: string) => {
                const components = this.disableButtonInRows(current.components, customId)
                if (!components) return
                await performEdit({components} as MessageEditOptions)
            }
        }
    }

    private interactionTarget(interaction: RepliableInteraction): IEphemeralButtonTarget {
        return {
            edit: (payload: MessageEditOptions) => interaction.editReply(payload as InteractionEditReplyOptions),
            disableButton: async (customId: string) => {
                const reply = await interaction.fetchReply()
                const components = this.disableButtonInRows(reply.components, customId)
                if (!components) return
                await interaction.editReply({components} as InteractionEditReplyOptions)
            }
        }
    }

    private followUpTarget(interaction: RepliableInteraction, messageId: string): IEphemeralButtonTarget {
        return {
            edit: (payload: MessageEditOptions) => interaction.webhook.editMessage(messageId, payload as InteractionEditReplyOptions),
            disableButton: async (customId: string) => {
                const message = await interaction.webhook.fetchMessage(messageId)
                const components = this.disableButtonInRows(message.components, customId)
                if (!components) return
                await interaction.webhook.editMessage(messageId, {components} as InteractionEditReplyOptions)
            }
        }
    }

    /**
     * Rebuilds the row containing `customId` with that button disabled; passes all other rows
     * through untouched (select menus, unrelated button rows). Returns null when the button
     * isn't found or is already disabled — signals "no edit needed".
     */
    private disableButtonInRows(
        rows: ActionRow<MessageActionRowComponent>[] | undefined,
        customId: string
    ): DisabledComponents | null {
        if (!rows || rows.length === 0) return null

        let modified = false
        const result: DisabledComponents = []

        for (const row of rows) {
            const targetIndex = row.components.findIndex(c =>
                c.type === ComponentType.Button
                && "custom_id" in c.data
                && c.data.custom_id === customId
            )

            if (targetIndex === -1) {
                result.push(row.toJSON())
                continue
            }

            const targetComponent = row.components[targetIndex]
            if ((targetComponent.data as APIButtonComponent).disabled) {
                // already disabled — no-op for this button, but other rows might still need work
                result.push(row.toJSON())
                continue
            }

            const builder = new ActionRowBuilder<ButtonBuilder>()
            for (const component of row.components) {
                if (component.type !== ComponentType.Button) continue
                const btn = ButtonBuilder.from(component.data as APIButtonComponent)
                if (component === targetComponent) btn.setDisabled(true)
                builder.addComponents(btn)
            }
            result.push(builder)
            modified = true
        }

        return modified ? result : null
    }

    private isInteraction(context: Interaction | SendableDiscordChannel): context is Interaction {
        return typeof (context as Interaction).isRepliable === "function"
    }
}
