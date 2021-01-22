#!/bin/bash

#
#——————————————————————————-
# Name:     refresh_active_players.sh
# Purpose:  Gets the current number of players on the server.
# Authors:  King Lai; Zi Cheng Huang
#——————————————————————————-

cd /home
USERNAME=$(ls | cut -f 1 -d " ")
minecraft_dir=/home/${USERNAME}/minecraft

cd ${minecraft_dir}
max_players=$(cat server.properties | grep "^max-players" | sed 's@^[^0-9]*\([0-9]\+\).*@\1@')

lines=$(sudo screen -list | grep -E 'minecraft.*Detached' | wc -l)
if (( lines > 0 )); then
  /usr/bin/screen -r minecraft -p 0 -X stuff $"list^M"
fi

cd ${minecraft_dir}/logs
players=$(tail -n 1 latest.log | cut -d " " -f2- | sed 's@^[^0-9]*\([0-9]\+\).*@\1@')
number_check='^[0-9]+$'

if ! [[ $players =~ $number_check ]] ; then
  players=0
else
  if (( players > max_players )); then
    players=0
  fi
fi

echo "$players/$max_players"

# Prepared by Zi Cheng Huang and King Lai.
# Copyright 2020
# Do not distribute without permission.
# END
