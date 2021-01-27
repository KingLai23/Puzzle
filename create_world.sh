#!/bin/bash

#
#——————————————————————————-
# Name:     create_world.sh
# Purpose:  creates a new world
# Authors:  King Lai; Zi Cheng Huang
#——————————————————————————-

cd /home
USERNAME=$(ls | cut -f 1 -d " ")

minecraft_dir=/home/${USERNAME}/minecraft

cd ${minecraft_dir}
if [ $# -eq 1 ]; then
  mkdir ${minecraft_dir}/world_list/$1
fi

# Prepared by Zi Cheng Huang and King Lai.
# Copyright 2020
# Do not distribute without permission.
# END
