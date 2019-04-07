#!/usr/bin/env bash
set -ex

# Set the script directory, so we know where step.py is
THIS_SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Install ts-node and typescript globally. This is done so that ts-node can be
# called via a shebang. No real reason for doing so, it just looks nicer.
sudo npm install -g ts-node typescript

# Install the npm dependencies into the script directory
#
# NOTE: While a cd is used here, this is inside a subshell and is therefore
#       an entirely separate process, much like how the SCRIPT_DIR was
#       obtained.
#
# NOTE THE SECOND: Yes, this step does attempt to download dependencies from
#       the internet, however, there is a fallback in the event it fails.
#       For more information on the fallback,
#       see https://yarnpkg.com/blog/2016/11/24/offline-mirror/
( cd "${THIS_SCRIPT_DIR}"; yarn install )

# Now (without using cd), run the script
${THIS_SCRIPT_DIR}/index.ts \
  --zulip-domain="${zulip_step_domain}" \
  --bot-email="${zulip_step_bot_email}" \
  --bot-key="${zulip_step_bot_key}" \
  --recipients="${zulip_step_recipients}" \
  --template="${zulip_step_template}" \
  --topic="${zulip_step_topic}" \
  --recipients-pull-request="${zulip_step_recipients_pull_request}" \
  --template-pull-request="${zulip_step_template_pull_request}" \
  --topic-pull-request="${zulip_step_topic_pull_request}" \
  --emoji-success="${zulip_step_emoji_success}" \
  --emoji-failure="${zulip_step_emoji_failure}" \
  --git-commit="${zulip_step_git_commit}" \
  --git-message="${zulip_step_git_message}" \
  --build-number="${zulip_step_build_number}" \
  --build-status="${zulip_step_build_status}" \
  --build-url="${zulip_step_build_url}" \
  --pull-request="${zulip_step_pull_request}" \
  --pull-request-id="${zulip_step_pull_request_id}" \
  --pull-request-repository="${zulip_step_pull_request_repository}"
