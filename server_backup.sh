#!/bin/bash
#PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin:/home/zi-server/bin

#
#——————————————————————————-
# Name:     server_backup.sh
# Purpose:  Backs up Minecraft Server onto the SVN repository and creates a log file.
# Authors:  King Lai; Zi Cheng Huang
#——————————————————————————-

cd /home
USERNAME=$(ls | cut -f 1 -d " ")
SVN_USER='user'
SVN_PASSWORD='password'
MAX_BACKUPS=20
LONGTERM_BACKUP_DAY=Monday
 
minecraft_dir=/home/${USERNAME}/minecraft
svn_dir=/home/${USERNAME}/minecraft/Minecraft
start_time=$(date +'%Y-%m-%d--%H_%M_%S')
log_name=${start_time}-log.txt
longterm_log_name=${start_time}-longterm-log.txt

cd ${minecraft_dir}
sudo ./stop.sh

sleep 10

cd ${svn_dir}/logs
echo Log date: ${start_time} >> ${svn_dir}/logs/${log_name}

cd ${svn_dir}
if [ $(ls | wc -l) -gt $(expr ${MAX_BACKUPS} + 1) ]; then 
  svn rm $(ls | sort | head -1)
  if [ $? -eq 0 ]; then
    echo Removed oldest world file succesfully. >> ${svn_dir}/logs/${log_name}
  else 
    echo Failed to remove oldest world file. >> ${svn_dir}/logs/${log_name}
  fi
 
  cd ${svn_dir}/logs
  svn rm $(ls | sort | head -1)
  if [ $? -eq 0 ]; then
    echo Removed corresponding log successfully. >> ${svn_dir}/logs/${log_name} 
  else 
    echo Failed to remove corresponding log. >> ${svn_dir}/logs/${log_name}
  fi
fi

mkdir ${svn_dir}/${start_time}
cp -r ${minecraft_dir}/world ${svn_dir}/${start_time}

if [ $(date +%A) == ${LONGTERM_BACKUP_DAY} ]; then
  mkdir ${svn_dir}/longterm_backup/${start_time}-longterm
  cp -r ${minecraft_dir}/world ${svn_dir}/longterm_backup/${start_time}-longterm
  
  cd ${svn_dir}/longterm_backup
  svn add ${start_time}-longterm
fi

cd ${svn_dir}
svn add ${start_time}

if [ $? -eq 0 ]; then
  echo Added world file successfully. >> ${svn_dir}/logs/${log_name} 
else 
  echo Failed to add world file. >> ${svn_dir}/logs/${log_name}
fi

cd ${svn_dir}
svn commit -m "$(date +'%Y-%m-%d') daily Minecraft server backup." --username $SVN_USER --password $SVN_PASSWORD --non-interactive

if [ $? -eq 0 ]; then
  echo Committed world file successfully. >> ${svn_dir}/logs/${log_name} 
else 
  echo Failed to committed world file. >> ${svn_dir}/logs/${log_name}
fi

cd ${svn_dir}
svn update --username $SVN_USER --password $SVN_PASSWORD --non-interactive

if [ $? -eq 0 ]; then
  echo Updated current repository. >> ${svn_dir}/logs/${log_name}
else 
  echo Failed to update repository. >> ${svn_dir}/logs/${log_name}
fi

cur_revision=`expr $(svn info --show-item last-changed-revision) + 1`
echo The current revision is ${cur_revision}. >> ${svn_dir}/logs/${log_name}

if [ $(date +%A) == ${LONGTERM_BACKUP_DAY} ]; then
  cp ${svn_dir}/logs/${log_name} ${svn_dir}/longterm_backup/longterm_logs/${longterm_log_name}
  
  cd ${svn_dir}/longterm_backup/longterm_logs
  svn add ${longterm_log_name}
fi

cd ${svn_dir}/logs
svn add ${log_name}

cd ${svn_dir}
svn commit -m "$(date +'%Y-%m-%d') daily Minecraft server backup log file." --username $SVN_USER --password $SVN_PASSWORD --non-interactive
svn update --username $SVN_USER --password $SVN_PASSWORD --non-interactive

cd ${minecraft_dir}
sudo ./start.sh

# Prepared by Zi Cheng Huang and King Lai.
# Copyright 2020
# Do not distribute without permission.
# END
