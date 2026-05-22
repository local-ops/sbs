#!/usr/bin/env bash
# Print where to open a static app after docker-start (reads ports/domains from .env).
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env"
SERVICE="${1:?usage: print-app-url.sh <compose-service-name>}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "print-app-url: missing ${ENV_FILE} — run export_config.sh first" >&2
  exit 1
fi

# shellcheck disable=SC1091
set -a
source "$ENV_FILE"
set +a

case "$SERVICE" in
  whyeven-web)
    port="${APPS_STATIC_WHYEVEN_LOCAL_PORT:-9080}"
    domain="${APPS_STATIC_WHYEVEN_DOMAIN:-whyeven.localhost}"
    label="whyeven"
    ;;
  ai-consult-web)
    port="${APPS_STATIC_AI_CONSULT_LOCAL_PORT:-9081}"
    domain="${APPS_STATIC_AI_CONSULT_DOMAIN:-ai.localhost}"
    label="ai-consult"
    ;;
  *)
    echo "print-app-url: unknown service '${SERVICE}'" >&2
    exit 1
    ;;
esac

printf '\n'
printf '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
printf '  %s — container running\n' "$label"
printf '  Direct:  http://127.0.0.1:%s/\n' "$port"
printf '  Traefik: https://%s/  (requires task dev:start + /etc/hosts)\n' "$domain"
printf '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
printf '\n'
