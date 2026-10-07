#!/usr/bin/env bash
# CDS IGRL — secure Telegram lead-delivery setup.
# Run this in YOUR terminal:  bash setup-telegram.sh
# The bot token is typed at a prompt, never echoed, never stored in this repo.

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VERCEL_PROJECT="cdsigrl"
VERCEL_SCOPE="rawbeths-projects"

echo
echo "=== CDS IGRL — Telegram lead delivery setup ==="
echo

# 1. Token ------------------------------------------------------------------
if [ -z "${TELEGRAM_BOT_TOKEN:-}" ]; then
  read -rsp "Bot token (from @BotFather): " TELEGRAM_BOT_TOKEN
  echo
fi
if ! printf '%s' "$TELEGRAM_BOT_TOKEN" | grep -qE '^[0-9]{6,}:[A-Za-z0-9_-]{30,}$'; then
  echo "!! That does not look like a bot token (expected 123456789:AA...)." >&2
  exit 1
fi

# 2. Verify the token, capture the bot name ---------------------------------
echo "-> Verifying token with Telegram..."
ME_JSON="$(curl -sS "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe")"
if ! printf '%s' "$ME_JSON" | grep -q '"ok":true'; then
  echo "!! Telegram rejected the token:" >&2
  printf '%s\n' "$ME_JSON" >&2
  exit 1
fi
BOT_NAME="$(printf '%s' "$ME_JSON" | sed -n 's/.*"username":"\([^"]*\)".*/\1/p')"
echo "   OK — bot @${BOT_NAME}"

# 3. Chat id -----------------------------------------------------------------
echo
echo "Now send any message to @${BOT_NAME} in Telegram (or add it to the group"
echo "you want leads delivered to, then send a message there)."
read -rp "Press Enter once sent... " _

CHAT_ID=""
for _ in 1 2 3 4 5; do
  UPD="$(curl -sS "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates")"
  CHAT_ID="$(printf '%s' "$UPD" | sed -n 's/.*"chat":{"id":\(-\?[0-9]*\).*/\1/p' | tail -1)"
  [ -n "$CHAT_ID" ] && break
  echo "   no message seen yet, retrying in 3s..."
  sleep 3
done
if [ -z "$CHAT_ID" ]; then
  echo "!! Could not detect a chat id. Send a message to the bot and re-run." >&2
  exit 1
fi
echo "   OK — chat id ${CHAT_ID}"

# 4. Confirm the bot can actually post there ---------------------------------
echo "-> Sending a test message..."
TEST="$(curl -sS -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -H 'Content-Type: application/json' \
  -d "{\"chat_id\":\"${CHAT_ID}\",\"text\":\"CDS IGRL lead delivery is connected. Test message.\"}")"
if ! printf '%s' "$TEST" | grep -q '"ok":true'; then
  echo "!! Test message failed:" >&2
  printf '%s\n' "$TEST" >&2
  echo "   (For a group, promote the bot to admin or disable privacy mode via /setprivacy.)" >&2
  exit 1
fi
echo "   OK — check Telegram, the test message is there."

# 5. Push env vars to Vercel --------------------------------------------------
echo "-> Setting Vercel environment variables (production)..."
cd "$PROJECT_DIR"
for ENVNAME in TELEGRAM_BOT_TOKEN TELEGRAM_CHAT_ID; do
  VALUE="$TELEGRAM_BOT_TOKEN"; [ "$ENVNAME" = "TELEGRAM_CHAT_ID" ] && VALUE="$CHAT_ID"
  vercel env rm "$ENVNAME" production --scope "$VERCEL_SCOPE" --yes >/dev/null 2>&1 || true
  printf '%s' "$VALUE" | vercel env add "$ENVNAME" production --scope "$VERCEL_SCOPE" >/dev/null
  echo "   set ${ENVNAME}"
done

# 6. Redeploy so the function picks them up -----------------------------------
echo "-> Redeploying to production..."
vercel --prod --yes --scope "$VERCEL_SCOPE" >/dev/null
echo "   deployed"

# 7. End-to-end check against the live function -------------------------------
echo "-> Testing the live endpoint..."
API_RESP="$(curl -sS -X POST "https://cdsigrl.theboostnation.space/api/lead" \
  -H 'Content-Type: application/json' \
  -d '{"source":"setup-test","formData":{"name":"Setup Test","email":"setup@example.com","message":"Automated end-to-end check — ignore."}}')"
echo "   response: ${API_RESP}"

echo
if printf '%s' "$API_RESP" | grep -q '"ok":true'; then
  echo "SUCCESS — contact form leads now arrive in Telegram."
else
  echo "!! The endpoint did not return ok. Check the Vercel function logs:"
  echo "   vercel logs cdsigrl.theboostnation.space --scope ${VERCEL_SCOPE}"
fi
echo
echo "Delete the test lead from Telegram, then you are done."
