#!/bin/bash

#
#——————————————————————————-
# Name:     start.sh
# Purpose:  Starts the Minecraft server.
# Authors:  King Lai; Zi Cheng Huang
#——————————————————————————-

cd /home
USERNAME=$(ls | cut -f 1 -d " ")

minecraft_dir=/home/${USERNAME}/minecraft

cd ${minecraft_dir}
echo "Starting Minecraft 1.16.1 Server HOLAYY"
echo "ssss.. don't die to creepers.. KABOOM"
echo ""
echo "screen -r minecraft to open and Ctrl-A, Ctrl-D to close"
/usr/bin/screen -dmS minecraft /usr/bin/java -jar -Xms512M -Xmx6144M ${minecraft_dir}/server.jar --nogui

# Prepared by Zi Cheng Huang and King Lai.
# Copyright 2020
# Do not distribute without permission.
# END
