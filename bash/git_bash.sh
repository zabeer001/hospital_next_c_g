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

    git push origin main

    if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
      gh run watch --exit-status
    else
      echo "Push completed and CI/CD was triggered. Check GitHub Actions for its status."
    fi
    ;;

  *)
    usage
    exit 1
    ;;
esac
