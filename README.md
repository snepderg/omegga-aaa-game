<!--

When uploading your plugin to github/gitlab
start your repo name with "omegga-"

example: https://github.com/snepderg/omegga-aaa-game

Your plugin will be installed via omegga install gh:snepderg/aaa-game

-->

# aaa-game

A typed safe plugin for [omegga](https://github.com/brickadia-community/omegga).

- Features config for cooldown and role restrictions.

## Install

`omegga install gh:snepderg/aaa-game`

## Usage

* Command: `/aaa <str>`: Interact with the game. The script will prompt you with the previous phrase. Your goal is to increment the phrase alphabetically (don't forget to carry!)
- Example | If the current sequence is `POG`, the game expects a user to type `/aaa POH` (case-insensitive, spaces are okay). If they type the wrong phrase, it will tell them what the previous phrase was.
- Note: If you get the phrase incorrect, the script whispers in response, on success the phrase you typed is broadcasted.
