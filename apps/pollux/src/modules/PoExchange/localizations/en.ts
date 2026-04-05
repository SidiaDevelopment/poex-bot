export default {
    poex: {
        settings: {
            vouchEnabled: "Enable the vouch button on service messages",
            vouchChannel: "Channel where vouch messages are posted"
        },
        vouch: {
            button: "Vouch",
            notConfigured: "Vouch service is not configured.",
            noLinkedAccount: "Could not process vouch: the user has no linked account. They can link it here:",
            success: "Vouch registered!",
            uniqueVouches: "unique vouches",
            totalVouches: "total",
            failed: "Failed to process vouch. Please try again later.",
            channelMessage: "vouched for"
        },
        commands: {
            vouch: {
                description: "Vouch for a user",
                userOption: "The user to vouch for",
                count: {
                    description: "Get vouch count for a user",
                    userOption: "The user to check"
                }
            },
            set: {
                description: "Set a channel mapping",
                mappingOption: "The channel type to map",
                channelOption: "The Discord channel to post in",
                reply: {
                    title: "Channel Mapping",
                    success: "Channel mapping set"
                }
            },
            remove: {
                description: "Remove a channel mapping",
                mappingOption: "The channel type to remove",
                reply: {
                    title: "Channel Mapping",
                    success: "Channel mapping removed",
                    notFound: "Channel mapping not found"
                }
            }
        },
        format: {
            seller: "Seller",
            host: "Host",
            vouches: "Vouches",
            mapType: {
                buyer: "Your Map",
                seller: "My Map",
                both: "Your or My Map"
            },
            titles: {
                bossKilling: "WTS Boss Killing",
                nightmareMaps: "WTS Nightmare Maps",
                fiveWay: "WTS 5-Way",
                campaignSkip: "WTS Campaign Skip",
                goldRotation: "WTS Gold Rotation",
                templeHost: "WTS Temple Host",
                challengeCompletion: "WTS Challenge Completion",
                bloodlines: "WTS Bloodlines",
                labyrinth: "WTS Labyrinth",
                benchCraft: "WTS Bench Craft"
            },
            browseServices: "Browse services",
            listServices: "List services",
            whispers: {
                bossKilling: "Hi, I'd like to buy your boss killing service",
                nightmareMaps: "Hi, I'd like to buy your nightmare map service",
                fiveWay: "Hi, I'd like to join your 5-way run",
                campaignSkip: "Hi, I'd like to buy your campaign skip service",
                goldRotation: "Hi, I'd like to join your gold rotation",
                templeHost: "Hi, I'd like to use your temple room",
                challengeCompletion: "Hi, I'd like to buy your challenge completion service",
                bloodlines: "Hi, I'd like to buy your bloodlines service",
                labyrinth: "Hi, I'd like to buy your labyrinth carry",
                benchCraft: "Hi, I need your bench craft service"
            }
        }
    }
}
