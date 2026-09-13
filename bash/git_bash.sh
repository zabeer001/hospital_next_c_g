#!/usr/bin/env bash

set -Eeuo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

usage() {
  cat <<'EOF'
Usage:
  ./bash/git_bash.sh local "your commit message"
  ./bash/git_bash.sh production
EOF
}

case "${1:-}" in
  local)
    COMMIT_MESSAGE="${2:-}"

    if [ -z "$COMMIT_MESSAGE" ]; then
      echo "A commit message is required." >&2
      usage
      exit 1
    fi

    git add --all

    if git diff --cached --quiet; then
      echo "No frontend changes to commit."
      exit 0
    fi

    git commit -m "$COMMIT_MESSAGE"
    echo "Local commit created. Run './bash/git_bash.sh production' to deploy it."
    ;;

  production)
    CURRENT_BRANCH="$(git branch --show-current)"

    if [ "$CURRENT_BRANCH" != "main" ]; then
      echo "Production deployment must be run from the main branch; current branch: $CURRENT_BRANCH" >&2
      exit 1
    fi

    if ! git diff --quiet || ! git diff --cached --quiet; then
      echo "Uncommitted changes found. Commit them with the local command first." >&2
      exit 1
    fi

    if ! command -v gh >/dev/null 2>&1; then
      echo "GitHub CLI (gh) is required to configure and monitor deployment." >&2
      exit 1
    fi

    gh auth status

    set -a
    source .env
    set +a

    : "${VPS_ROOT_ACCESS:?Missing VPS_ROOT_ACCESS in .env}"
    : "${VPS_PASSWORD:?Missing VPS_PASSWORD in .env}"
    : "${VPS_PROJECT_DIR:?Missing VPS_PROJECT_DIR in .env}"
    : "${VPS_APP_CONTAINER:?Missing VPS_APP_CONTAINER in .env}"

    # GitHub needs only the VPS connection details. NEXT_PUBLIC_* values stay
    # in the production VPS .env and are consumed by Docker Compose there.
    printf '%s' "$VPS_ROOT_ACCESS" | gh secret set VPS_ROOT_ACCESS
    printf '%s' "$VPS_PASSWORD" | gh secret set VPS_PASSWORD
    printf '%s' "$VPS_PROJECT_DIR" | gh secret set VPS_PROJECT_DIR
    printf '%s' "$VPS_APP_CONTAINER" | gh secret set VPS_APP_CONTAINER

    HEAD_SHA="$(git rev-parse HEAD)"
    git push origin main

    RUN_ID=""
    for attempt in $(seq 1 15); do
      RUN_ID="$(gh run list --workflow deploy.yml --commit "$HEAD_SHA" --limit 1 --json databaseId --jq '.[0].databaseId')"
      if [ -n "$RUN_ID" ]; then
        break
      fi
      sleep 2
    done

    if [ -z "$RUN_ID" ]; then
      echo "CI/CD run was not found for commit $HEAD_SHA" >&2
      exit 1
    fi

    gh run watch "$RUN_ID" --exit-status
    ;;

  *)
    usage
    exit 1
    ;;
esac
