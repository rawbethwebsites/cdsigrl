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
BOT_NAME="$(printf '%s' "$ME_JSON" | python3 -c 'import sys,json; d=json.load(sys.stdin); print(d.get("result",{}).get("username",""))')"
if [ -z "$BOT_NAME" ]; then
  echo "!! Could not read the bot username:" >&2
  printf '%s\n' "$ME_JSON" >&2
  exit 1
fi
echo "   OK — bot @${BOT_NAME}"

# 3. Chat id -----------------------------------------------------------------
echo
echo "Now send any message to @${BOT_NAME} in Telegram."
echo "For a GROUP: add the bot to the group, then send a message there."
read -rp "Press Enter once sent... " _

CHAT_ID=""
CHAT_TITLE=""
for _ in 1 2 3 4 5 6; do
  PARSED="$(curl -sS "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates" | python3 -c '
import sys, json
try:
    d = json.load(sys.stdin)
except Exception:
    sys.exit(0)
best = None
for u in d.get("result", []):
    m = u.get("message") or u.get("channel_post") or u.get("edited_message") or {}
    c = m.get("chat") or {}
    if c.get("id") is not None:
        best = c
if best:
    title = best.get("title") or best.get("first_name") or best.get("username") or ""
    print("%s\t%s" % (best["id"], title))
')"
  if [ -n "$PARSED" ]; then
    CHAT_ID="${PARSED%%	*}"
    CHAT_TITLE="${PARSED#*	}"
    break
  fi
  echo "   no message seen yet, retrying in 3s..."
  sleep 3
done
if [ -z "$CHAT_ID" ]; then
  echo "!! Could not detect a chat id. Send a message to the bot and re-run." >&2
  exit 1
fi
echo "   OK — chat id ${CHAT_ID} (${CHAT_TITLE:-private chat})"

# 4. Confirm the bot can actually post there ---------------------------------
echo "-> Sending a test message..."
TEST="$(curl -sS -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -H 'Content-Type: application/json' \
  --data "$(python3 -c '
import json, sys
print(json.dumps({"chat_id": sys.argv[1],
                  "text": "CDS IGRL lead delivery is connected.\nThis is a test message from setup-telegram.sh."}))
' "$CHAT_ID")")"
if ! printf '%s' "$TEST" | grep -q '"ok":true'; then
  echo "!! Test message failed:" >&2
  printf '%s\n' "$TEST" >&2
  echo "   For a group: promote the bot to admin, or run /setprivacy in @BotFather and pick Disable." >&2
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
  echo "Delete the two test messages from Telegram, then you are done."
else
  echo "!! The endpoint did not return ok. Check the Vercel function logs:"
  echo "   vercel logs cdsigrl.theboostnation.space --scope ${VERCEL_SCOPE}"
fi
echo
echo "Note: 'vercel env add' also writes the value to ${PROJECT_DIR}/.env.local."
echo "It is gitignored, but remove it once you have confirmed the setup."
echo
