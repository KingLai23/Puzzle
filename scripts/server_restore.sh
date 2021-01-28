#!/bin/bash

#
#——————————————————————————-
# Name:     server_restore.sh
# Purpose:  Restores a backup from the SVN repository.
# Authors:  King Lai; Zi Cheng Huang
#——————————————————————————-

cd /home
USERNAME=$(ls | cut -f 1 -d " ")

minecraft_dir=/home/${USERNAME}/minecraft
svn_dir=/home/${USERNAME}/minecraft/Minecraft
restore_dir=/home/${USERNAME}/minecraft

cd ${minecraft_dir}
sudo ./stop.sh

sleep 10

cd ${svn_dir}

if [ $# -eq 1 ]; then
  if [ -d $1 ]; then
    backup=$1
  else 
    cd ${restore_dir}
    echo "Restore unsuccessful: Backup folder cannot be found" >> server_restore.log
    exit 1
  fi
else
  backup=$(ls | sort | tail -3 | head -1)
fi

backup_path=${svn_dir}/${backup}/world

cd ${minecraft_dir}

rm -R world
cp -R ${backup_path} ${minecraft_dir}

sudo ./start.sh

cd ${restore_dir}
echo "Restored from $(date +'%Y-%m-%d--%H_%M_%S') to ${backup}" >> server_restore.log

# Prepared by Zi Cheng Huang and King Lai.
# Copyright 2020
# Do not distribute without permission.
# END
