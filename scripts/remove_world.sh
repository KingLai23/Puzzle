#!/bin/bash

#
#——————————————————————————-
# Name:     remove_world.sh
# Purpose:  removes a world
# Authors:  King Lai; Zi Cheng Huang
#——————————————————————————-

cd /home
USERNAME=$(ls | cut -f 1 -d " ")

minecraft_dir=/home/${USERNAME}/minecraft

cd ${minecraft_dir}
if [ $# -eq 1 ]; then
  if [ $(ls ${minecraft_dir}/world_list | wc -l) -eq 1 ]; then
    echo You cannot remove your only world..
    exit 0
  elif [ "$1" = "$(cat ${minecraft_dir}/current_world.txt)" ]; then
    echo You cannot remove the current world..
    exit 0
  fi
  sudo rm -r ${minecraft_dir}/world_list/$1/
fi

# Prepared by Zi Cheng Huang and King Lai.
# Copyright 2020
# Do not distribute without permission.
# END
