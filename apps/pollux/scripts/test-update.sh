#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/../.env" ]; then
  export $(grep -v '^#' "$SCRIPT_DIR/../.env" | xargs)
fi

API_URL="${1:-https://poex.sidia.net}"
GUILD_ID="${2:-1242243721852878900}"
API_KEY="${3:-$API_KEY}"

ENDPOINT="$API_URL/poex/push?apiKey=$API_KEY"

echo "=== Creating post ==="
RESPONSE=$(curl -s -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{
    \"guildId\": \"$GUILD_ID\",
    \"user\": {
      \"name\": \"Sidia_Mirage\",
      \"discordId\": \"183382329400623104\",
      \"vouches\": 125
    },
    \"posts\": [
      {
        \"channelId\": \"POE1_BOSS_KILLING\",
        \"action\": \"update\",
        \"browseUrl\": \"https://maxroll.gg/poe/poexchange/services/listings\",
        \"listUrl\": \"https://maxroll.gg/poe/poexchange/services/my-listings\",
        \"services\": [
          {\"name\": \"Maven\", \"priceValue\": 5, \"priceType\": \"d\", \"mapType\": \"Buyer\"},
          {\"name\": \"Searing Exarch\", \"priceValue\": 3, \"priceType\": \"d\", \"mapType\": \"Both\"},
          {\"name\": \"Shaper\", \"priceValue\": 8, \"priceType\": \"d\", \"mapType\": \"Buyer\"}
        ]
      }
    ]
  }")

echo "$RESPONSE"

MSG_ID=$(echo "$RESPONSE" | grep -o '"messageId":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$MSG_ID" ]; then
  echo "Could not extract messageId."
  exit 1
fi

echo ""
echo "Got messageId: $MSG_ID"
echo "Updating in 3 seconds (adding bosses, changing prices)..."
sleep 3

echo "=== Updating post ==="
curl -s -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{
    \"guildId\": \"$GUILD_ID\",
    \"user\": {
      \"name\": \"Sidia_Mirage\",
      \"discordId\": \"183382329400623104\",
      \"vouches\": 130
    },
    \"posts\": [
      {
        \"channelId\": \"POE1_BOSS_KILLING\",
        \"action\": \"update\",
        \"messageId\": \"$MSG_ID\",
        \"browseUrl\": \"https://maxroll.gg/poe/poexchange/services/listings\",
        \"listUrl\": \"https://maxroll.gg/poe/poexchange/services/my-listings\",
        \"services\": [
          {\"name\": \"Maven\", \"priceValue\": 4, \"priceType\": \"d\", \"mapType\": \"Buyer\"},
          {\"name\": \"Searing Exarch\", \"priceValue\": 2, \"priceType\": \"d\", \"mapType\": \"Both\"},
          {\"name\": \"Shaper\", \"priceValue\": 7, \"priceType\": \"d\", \"mapType\": \"Buyer\"},
          {\"name\": \"Uber Elder\", \"priceValue\": 15, \"priceType\": \"d\", \"mapType\": \"Buyer\"},
          {\"name\": \"Cortex\", \"priceValue\": 10, \"priceType\": \"d\", \"mapType\": \"Buyer\"},
          {\"name\": \"Sirus\", \"priceValue\": 5, \"priceType\": \"d\", \"mapType\": \"Seller\"}
        ]
      }
    ]
  }"

echo ""
