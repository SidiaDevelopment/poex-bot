import "@pollux/core"
import "@pollux/service"

// Module config side-effect
import "./config/DiscordCommandConfig"

export * from "./DiscordCommandModule"
export * from "./services/DiscordCommandService"
export * from "./services/DiscordUpdateCommandsService"
export * from "./services/EmbedService"

export * from "./decorators/command"
export * from "./DiscordCommand"
export * from "./DiscordCommandController"
export * from "./IDiscordCommandOption"
export * from "./IDiscordCommandData"
export * from "./IDiscordCommandConfig"
export * from "./IDiscordCommandControllerData"
