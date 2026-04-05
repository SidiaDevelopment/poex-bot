#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/../.env" ]; then
  export $(grep -v '^#' "$SCRIPT_DIR/../.env" | xargs)
fi

API_URL="${1:-http://localhost:3000}"
GUILD_ID="${2:-1242243721852878900}"
API_KEY="${3:-$API_KEY}"

ENDPOINT="$API_URL/poex/push?apiKey=$API_KEY"

echo "Testing PoExchange POST endpoint"
echo "Guild ID: $GUILD_ID"
echo "---"
echo ""

echo "=== All Categories ==="
RESPONSE=$(curl -s -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{
    \"guildId\": \"$GUILD_ID\",
    \"user\": {
      \"name\": \"Sidia_Mirage_\",
      \"discordId\": \"183382329400623104\",
      \"vouches\": 125
    },
    \"posts\": [
      {
        \"channelId\": \"POE1_BOSS_KILLING\",
        \"action\": \"update\",
        \"services\": [
          {\"name\": \"Maven\", \"priceValue\": 5, \"priceType\": \"d\", \"mapType\": \"Buyer\"},
          {\"name\": \"Searing Exarch\", \"priceValue\": 3, \"priceType\": \"d\", \"mapType\": \"Both\"},
          {\"name\": \"Eater of Worlds\", \"priceValue\": 3, \"priceType\": \"d\", \"mapType\": \"Both\"},
          {\"name\": \"Shaper\", \"priceValue\": 8, \"priceType\": \"d\", \"mapType\": \"Buyer\"},
          {\"name\": \"Elder\", \"priceValue\": 8, \"priceType\": \"d\", \"mapType\": \"Buyer\"},
          {\"name\": \"Uber Elder\", \"priceValue\": 15, \"priceType\": \"d\", \"mapType\": \"Buyer\"},
          {\"name\": \"Cortex\", \"priceValue\": 10, \"priceType\": \"d\", \"mapType\": \"Buyer\"},
          {\"name\": \"Sirus\", \"priceValue\": 6, \"priceType\": \"d\", \"mapType\": \"Seller\"}
        ]
      },
      {
        \"channelId\": \"POE1_NIGHTMARE_MAPS\",
        \"action\": \"update\",
        \"services\": [
          {\"name\": \"T17 Abomination\", \"priceValue\": 2, \"priceType\": \"d\", \"customMessage\": \"All mods\", \"mapType\": \"Seller\"},
          {\"name\": \"T17 Citadel\", \"priceValue\": 3, \"priceType\": \"d\", \"mapType\": \"Seller\"},
          {\"name\": \"T17 Fortress\", \"priceValue\": 2, \"priceType\": \"d\", \"mapType\": \"Buyer\"},
          {\"name\": \"T17 Sanctuary\", \"priceValue\": 4, \"priceType\": \"d\", \"customMessage\": \"No regen ok\", \"mapType\": \"Both\"},
          {\"name\": \"T16 Nightmare\", \"priceValue\": 1, \"priceType\": \"d\", \"mapType\": \"Buyer\"}
        ]
      },
      {
        \"channelId\": \"POE1_INVITATIONS\",
        \"action\": \"update\",
        \"services\": [
          {\"name\": \"The Feared\", \"priceValue\": 20, \"priceType\": \"d\", \"mapType\": \"Buyer\"},
          {\"name\": \"The Hidden\", \"priceValue\": 8, \"priceType\": \"d\", \"mapType\": \"Both\"},
          {\"name\": \"The Formed\", \"priceValue\": 10, \"priceType\": \"d\", \"mapType\": \"Buyer\"}
        ]
      },
      {
        \"channelId\": \"POE1_INCARNATIONS\",
        \"action\": \"update\",
        \"services\": [
          {\"name\": \"Lycia\", \"priceValue\": 12, \"priceType\": \"d\", \"mapType\": \"Buyer\"},
          {\"name\": \"Asenath\", \"priceValue\": 10, \"priceType\": \"d\", \"mapType\": \"Seller\"}
        ]
      },
      {
        \"channelId\": \"POE1_GUARDIANS\",
        \"action\": \"update\",
        \"services\": [
          {\"name\": \"Minotaur\", \"priceValue\": 2, \"priceType\": \"d\", \"mapType\": \"Seller\"},
          {\"name\": \"Phoenix\", \"priceValue\": 2, \"priceType\": \"d\", \"mapType\": \"Seller\"},
          {\"name\": \"Hydra\", \"priceValue\": 2, \"priceType\": \"d\", \"mapType\": \"Both\"},
          {\"name\": \"Chimera\", \"priceValue\": 2, \"priceType\": \"d\", \"mapType\": \"Both\"}
        ]
      },
      {
        \"channelId\": \"POE1_BLOODLINES\",
        \"action\": \"update\",
        \"services\": [
          {\"name\": \"Bloodlines Pack\", \"priceValue\": 5, \"priceType\": \"d\", \"mapType\": \"Buyer\"}
        ]
      },
      {
        \"channelId\": \"POE1_LABYRINTH\",
        \"action\": \"update\",
        \"services\": [
          {\"name\": \"Uber Lab\", \"priceValue\": 50, \"priceType\": \"c\"},
          {\"name\": \"Uber Lab + Enchant\", \"priceValue\": 2, \"priceType\": \"d\", \"customMessage\": \"Specific enchant on request\"}
        ]
      },
      {
        \"channelId\": \"POE1_5_WAY\",
        \"action\": \"update\",
        \"services\": [
          {\"name\": \"Softcore 5-Way AFK Run\", \"priceValue\": 6, \"priceType\": \"d\", \"customMessage\": \"Region: [EU]\\nPrice: 6 DIV = 5 Runs\\nGuarantees: 10.500 Kills | Aurabot 88% res\\nParty: Clients 1/4 Resetter 1/1 Aurabot 1/1\"}
        ]
      },
      {
        \"channelId\": \"POE1_CAMPAIGN_SKIP\",
        \"action\": \"update\",
        \"services\": [
          {\"name\": \"Act 1-10\", \"priceValue\": 10, \"priceType\": \"d\"},
          {\"name\": \"Act 6-10\", \"priceValue\": 150, \"priceType\": \"c\"}
        ]
      },
      {
        \"channelId\": \"POE1_GOLD_ROTATION\",
        \"action\": \"update\",
        \"services\": [
          {\"name\": \"Gold Rota T16\", \"priceValue\": 1, \"priceType\": \"d\", \"customMessage\": \"6-man, fast clear\"},
          {\"name\": \"Gold Rota T17\", \"priceValue\": 2, \"priceType\": \"d\", \"customMessage\": \"Need good build\"}
        ]
      },
      {
        \"channelId\": \"POE1_TEMPLE_HOST\",
        \"action\": \"update\",
        \"services\": [
          {\"name\": \"Locus of Corruption\", \"priceValue\": 3, \"priceType\": \"d\", \"mapType\": \"Seller\"},
          {\"name\": \"Doryani's Institute\", \"priceValue\": 5, \"priceType\": \"d\", \"mapType\": \"Seller\"}
        ]
      },
      {
        \"channelId\": \"POE1_CHALLENGE_COMPLETION\",
        \"action\": \"update\",
        \"services\": [
          {\"name\": \"Conditional Boss Kill\", \"priceValue\": 10, \"priceType\": \"d\", \"customMessage\": \"Any boss, any condition\"},
          {\"name\": \"Endgame Grind\", \"priceValue\": 200, \"priceType\": \"c\", \"customMessage\": \"All grinds available, ask for details\"}
        ]
      },
      {
        \"channelId\": \"POE1_BENCH_CRAFT\",
        \"action\": \"update\",
        \"services\": [
          {\"name\": \"Multimod\", \"priceValue\": 2, \"priceType\": \"d\"},
          {\"name\": \"Prefixes Cannot Be Changed\", \"priceValue\": 50, \"priceType\": \"c\"},
          {\"name\": \"Cannot Roll Attack Mods\", \"priceValue\": 30, \"priceType\": \"c\"}
        ]
      }
    ]
  }")

echo "$RESPONSE"
echo ""

echo "=== Strike Test: Creating message ==="
STRIKE_RESPONSE=$(curl -s -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{
    \"guildId\": \"$GUILD_ID\",
    \"user\": {
      \"name\": \"StrikeTest_User\",
      \"vouches\": 10
    },
    \"posts\": [
      {
        \"channelId\": \"POE1_BOSS_KILLING\",
        \"action\": \"update\",
        \"services\": [
          {\"name\": \"Maven\", \"priceValue\": 3, \"priceType\": \"d\", \"mapType\": \"Buyer\"},
          {\"name\": \"Shaper\", \"priceValue\": 5, \"priceType\": \"d\", \"mapType\": \"Seller\"}
        ]
      }
    ]
  }")

echo "$STRIKE_RESPONSE"

STRIKE_MSG_ID=$(echo "$STRIKE_RESPONSE" | grep -o '"messageId":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$STRIKE_MSG_ID" ]; then
  echo ""
  echo "Could not extract messageId, skipping strike test."
  exit 1
fi

echo ""
echo "Got strike test messageId: $STRIKE_MSG_ID"
echo "Striking in 3 seconds..."
sleep 3

echo "=== Strike Test: Striking ==="
curl -s -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{
    \"guildId\": \"$GUILD_ID\",
    \"user\": {
      \"name\": \"StrikeTest_User\",
      \"vouches\": 10
    },
    \"posts\": [
      {
        \"channelId\": \"POE1_BOSS_KILLING\",
        \"action\": \"strike\",
        \"messageId\": \"$STRIKE_MSG_ID\"
      }
    ]
  }"

echo ""
echo ""
echo "---"
echo "Make sure you have set ALL channel mappings first:"
echo "  /poex channel set mapping:<choice> target:#channel"
