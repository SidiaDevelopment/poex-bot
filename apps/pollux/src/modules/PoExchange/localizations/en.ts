export default {
    poex: {
        management: {
            settings: "Settings",
            channelMappings: "Channel Mappings",
            channelKey: "Category",
            channel: "Channel",
            vouchRoles: "Vouch Roles",
            role: "Role",
            threshold: "Vouches Required"
        },
        categories: {
            bossKilling: "Boss Killing",
            nightmareMaps: "Nightmare Maps",
            invitations: "Invitations",
            bloodlines: "Bloodlines",
            labyrinth: "Labyrinth",
            fiveWay: "5-Way",
            campaignSkip: "Campaign Skip",
            goldRotation: "Gold Rotation",
            templeHost: "Temple Host",
            challengeCompletion: "Challenge Completion",
            benchCraft: "Bench Craft",
            stdBossKilling: "Std Boss Killing",
            stdNightmareMaps: "Std Nightmare Maps",
            stdInvitations: "Std Invitations",
            stdBloodlines: "Std Bloodlines",
            stdLabyrinth: "Std Labyrinth",
            stdFiveWay: "Std 5-Way",
            stdCampaignSkip: "Std Campaign Skip",
            stdGoldRotation: "Std Gold Rotation",
            stdTempleHost: "Std Temple Host",
            stdChallengeCompletion: "Std Challenge Completion",
            stdBenchCraft: "Std Bench Craft"
        },
        settings: {
            vouchEnabled: "Enable the vouch button on service messages",
            vouchChannel: "Channel where vouch messages are posted"
        },
        vouch: {
            button: "Vouch",
            notConfigured: "Vouch service is not configured.",
            noLinkedAccount: "Could not process vouch: the user has no linked account.",
            userNotFound: "Could not find user: the user has no linked account.",
            linkDiscord: "Link Discord account here",
            success: "Vouch registered!",
            vouchSaved: "Vouch saved! The user has {amount} pending vouch(es) that will be attributed once they link their Discord account.",
            uniqueVouches: "Unique Vouches",
            seasonVouches: "Cycle Vouches",
            currentCycle: "Current cycle",
            totalVouches: "Total Vouches",
            discordLinked: "Discord Linked",
            discordAccountAge: "Account Age",
            discordJoinDate: "Joined Server",
            memberSince: "PoExchange member since",
            yes: "Yes",
            no: "No",
            selfVouch: "You cannot vouch for yourself.",
            countFailed: "Could not request vouches.",
            failed: "Failed to process vouch. Please try again later.",
            channelMessage: "vouched for",
            noDiscordLinked: "no discord linked",
            contextMenu: "Vouch Info",
            infoSent: "Vouch info sent to the vouch channel.",
            infoRequested: "here is the requested vouch info:",
            roleEarned: "has earned the role"
        },
        commands: {
            vouch: {
                description: "Vouch for a user",
                userOption: "The user to vouch for",
                count: {
                    description: "Get vouch count for a user",
                    userOption: "The user to check"
                },
                roles: {
                    add: {
                        description: "Add a vouch role threshold",
                        roleOption: "The role to assign",
                        countOption: "Number of unique vouches required",
                        reply: {
                            title: "Vouch Roles",
                            success: "Vouch role added"
                        }
                    },
                    remove: {
                        description: "Remove a vouch role threshold",
                        roleOption: "The role to remove",
                        reply: {
                            title: "Vouch Roles",
                            success: "Vouch role removed",
                            notFound: "Vouch role not found"
                        }
                    },
                    list: {
                        description: "List all vouch role thresholds",
                        reply: {
                            title: "Vouch Roles",
                            empty: "No vouch roles configured"
                        }
                    }
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
            regions: "Preferred Regions",
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
