#!/usr/bin/env bash
# Ensure Docker daemon is reachable; on macOS dev hosts start Colima profile "docker".
set -euo pipefail

COLIMA_PROFILE="${SBS_COLIMA_PROFILE:-docker}"
DOCKER_CONTEXT="${SBS_DOCKER_CONTEXT:-colima-docker}"

if docker info >/dev/null 2>&1; then
  echo "ensure-docker: daemon already reachable"
else
  if ! command -v colima >/dev/null 2>&1; then
    echo "ensure-docker: docker unreachable and colima not installed" >&2
    exit 1
  fi
  echo "ensure-docker: starting Colima --profile=${COLIMA_PROFILE} ..."
  colima start --profile="${COLIMA_PROFILE}"
fi

if docker context inspect "${DOCKER_CONTEXT}" >/dev/null 2>&1; then
  docker context use "${DOCKER_CONTEXT}"
fi

if ! docker info >/dev/null 2>&1; then
  echo "ensure-docker: docker still not available after Colima start" >&2
  exit 1
fi

if docker buildx ls 2>/dev/null | grep -q "${DOCKER_CONTEXT}"; then
  docker buildx use "${DOCKER_CONTEXT}" 2>/dev/null || true
fi

echo "ensure-docker: ready (context: $(docker context show))"
