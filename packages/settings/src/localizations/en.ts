export default {
    settings: {
        adminServer: {
            description: "Server ID allowed to manage global settings and admin-only commands"
        },
        adminUser: {
            description: "User ID allowed to manage global settings and admin-only commands"
        },
        commands: {
            set: {
                description: "Set a setting value",
                keyOption: "The setting key to update",
                valueOption: "The new value",
                reply: {
                    title: "Setting Updated",
                    unknownKey: "Unknown setting key",
                    unauthorized: "Only the admin server or admin user can change global settings"
                }
            },
            get: {
                description: "Get a setting value",
                keyOption: "The setting key to read",
                reply: {
                    title: "Setting",
                    unknownKey: "Unknown setting key",
                    unauthorized: "Only the admin server or admin user can read hidden settings"
                }
            },
            list: {
                description: "List all settings of a module",
                moduleOption: "The module name",
                reply: {
                    title: "Settings",
                    noSettings: "No settings found for this module",
                    default: "default"
                }
            }
        }
    }
}
