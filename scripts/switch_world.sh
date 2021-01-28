#!/bin/bash

#
#——————————————————————————-
# Name:     switch_world.sh
# Purpose:  switches to a world
# Authors:  King Lai; Zi Cheng Huang
#——————————————————————————-

cd /home
USERNAME=$(ls | cut -f 1 -d " ")

minecraft_dir=/home/${USERNAME}/minecraft
current_world=$(cat ${minecraft_dir}/current_world.txt)

cd ${minecraft_dir}
if [ $# -eq 1 ]; then
  if [ -d "${minecraft_dir}/world_list/$1" ]; then
	sudo rm -r ${minecraft_dir}/world_list/${current_world}/world
	sudo rm -r ${minecraft_dir}/world_list/${current_world}/world_nether
	sudo rm -r ${minecraft_dir}/world_list/${current_world}/world_the_end

	sudo cp -R ${minecraft_dir}/world ${minecraft_dir}/world_list/${current_world}
	sudo cp -R ${minecraft_dir}/world_nether ${minecraft_dir}/world_list/${current_world}
	sudo cp -R ${minecraft_dir}/world_the_end ${minecraft_dir}/world_list/${current_world}
 
  	sudo rm -r ${minecraft_dir}/world
  	sudo rm -r ${minecraft_dir}/world_nether
  	sudo rm -r ${minecraft_dir}/world_the_end

  	sudo cp -R ${minecraft_dir}/world_list/$1/world .
  	sudo cp -R ${minecraft_dir}/world_list/$1/world_nether .
  	sudo cp -R ${minecraft_dir}/world_list/$1/world_the_end .
  	
  	echo "$1" > current_world.txt
  else
  	echo "Target world does not exist. Exiting."
  fi
fi

# Prepared by Zi Cheng Huang and King Lai.
# Copyright 2020
# Do not distribute without permission.
# END
