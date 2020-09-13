#!/bin/bash

#
#——————————————————————————-
# Name:     stop.sh
# Purpose:  Stops the Minecraft server.
# Authors:  King Lai; Zi Cheng Huang
#——————————————————————————-

cd /home
USERNAME=$(ls | cut -f 1 -d " ")

minecraft_dir=/home/${USERNAME}/minecraft

cd ${minecraft_dir}
echo "Shutting down Minecraft Server.. Theres a creeper nearby.."

/usr/bin/screen -r minecraft -p 0 -X stuff $"stop^M"

# Prepared by Zi Cheng Huang and King Lai.
# Copyright 2020
# Do not distribute without permission.
# END
