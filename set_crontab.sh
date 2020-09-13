#!/bin/bash
#PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin:/home/{USERNAME}/bin

#
#——————————————————————————-
# Name:     set_crontab.sh
# Purpose:  Sets the time in which the server backs up.
# Authors:  King Lai; Zi Cheng Huang
#——————————————————————————-

cd /home
USERNAME=$(ls | cut -f 1 -d " ")
minecraft_dir=/home/${USERNAME}/minecraft

minute=0
hour=5
day_of_month=*
month=*
day_of_week=*

cd ${minecraft_dir}

crontab -l > tempfile
if [ $# -eq 5 ]; then
  echo "$1 $2 $3 $4 $5 " ${minecraft_dir}/server_backup.sh > tempfile
else
  echo "${minute} ${hour} ${day_of_month} ${month} ${day_of_week} " ${minecraft_dir}/server_backup.sh > tempfile
fi

crontab tempfile
rm tempfile

# Prepared by Zi Cheng Huang and King Lai.
# Copyright 2020
# Do not distribute without permission.
# END
