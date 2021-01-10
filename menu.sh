#!/bin/bash

cd /home
USERNAME=$(ls | cut -f 1 -d " ")

minecraft_dir=/home/${USERNAME}/minecraft

cd ${minecraft_dir}

server_status=0

clear

echo 0 > requirements.txt

file_exists () {
  for filename in "$@"
  do
    if [ -e $filename ]; then
      echo "[MSA] ~ $filename found... [GOOD]"
    else
      echo "[MSA] ~ $filename not found... [BAD]"
      echo 1 > requirements.txt
    fi
  done
}

is_server_running () {
  if sudo screen -list | grep -w -q 'minecraft'; then
    server_status=1
  else
    server_status=0
  fi
}

while :
do
CURRENT_WORLD=$(<${minecraft_dir}/current_world.txt)
file_exists paper-246.jar start.sh stop.sh server_backup.sh server_restore.sh set_crontab.sh

java -version > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "[MSA] ~ Java is installed... [GOOD]"
else 
  echo "[MSA] ~ Java is not installed... [BAD]"
  echo 1 > requirements.txt
fi

if  grep -q '1' requirements.txt ; then
  printf "\nWARNING:\nMissing requirements (marked as [BAD])."
  printf "\nPlease make sure you satisfy the requirements in order to continue using MSA.\n\n"
  exit 1
fi

echo "
██████╗░██╗░░░██╗███████╗███████╗██╗░░░░░███████╗  ░░███╗░░░░░██████╗░
██╔══██╗██║░░░██║╚════██║╚════██║██║░░░░░██╔════╝  ░████║░░░░░╚════██╗
██████╔╝██║░░░██║░░███╔═╝░░███╔═╝██║░░░░░█████╗░░  ██╔██║░░░░░░░███╔═╝
██╔═══╝░██║░░░██║██╔══╝░░██╔══╝░░██║░░░░░██╔══╝░░  ╚═╝██║░░░░░██╔══╝░░
██║░░░░░╚██████╔╝███████╗███████╗███████╗███████╗  ███████╗██╗███████╗
╚═╝░░░░░░╚═════╝░╚══════╝╚══════╝╚══════╝╚══════╝  ╚══════╝╚═╝╚══════╝                                                                     
A Minecraft Server Manager written by King Lai and Zi Cheng Huang.
"

is_server_running
if [ $server_status -eq 1 ]; then
  echo "[]-----------------------[]"
  echo -e "  Server Status: \033[0;32mONLINE \\033[37m"
  echo -e "  World: \033[0;32m$CURRENT_WORLD \\033[37m"
  echo "[]-----------------------[]"
else
  echo "[]------------------------[]"
  echo -e "  Server Status: \033[0;31mOFFLINE \\033[37m"
  echo -e "  World: \033[0;32m$CURRENT_WORLD \\033[37m"
  echo "[]------------------------[]"
fi

if [ "$CURRENT_WORLD" == "no_world" ]; then
  echo "There is no world loaded. Be very careful about backing up. Starting the server will create a fresh world file."
fi

printf "\nListing all worlds in repository:\n"
    ls -1 ${minecraft_dir}/world_list/

printf "
[1] Start Server
[2] Stop Server
[3] Backup Server
[4] Restore Server
[5] Set Crontab
[6] Create World
[7] Remove World
[8] Switch World
[9] Exit

"

echo -n "Enter an option: "
read option

if [ $option == '1' ]; then
  is_server_running
  if [ $server_status -eq 1 ]; then
    printf "\nThe server is already online. Cannot start again.\n\n"
  else
    sudo ./start.sh
  fi
elif [ $option == '2' ]; then
  is_server_running
  if [ $server_status -eq 1 ]; then
    sudo ./stop.sh
  else
    echo "server is not running, can't stop"
  fi
elif [ $option == '3' ]; then
  sudo ./server_backup.sh
elif [ $option == '4' ]; then
  printf "
[1]       Go Back
[2]       Restore Latest
[Any Key] Restore Custom

"
  
  echo -n "Enter an option: "
  read option4
  
  if [ $option4 == '1' ]; then
    echo ""
  elif [ $option4 == '2' ]; then
    sudo ./server_restore.sh
  else
    echo "Pick a date to restore from:"
    ls Minecraft | grep "[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]--[0-9][0-9]_[0-9][0-9]_[0-9][0-9]" 
    
    read restore_name
    
    sudo ./server_restore.sh $restore_name
  fi
elif [ $option == '5' ]; then
  printf "
[1]       Go Back
[2]       Set Default
[Any Key] Set Custom

"
  
  echo -n "Enter an option: "
  read option5
  
  if [ $option5 == '1' ]; then
    echo ""  
  elif [ $option5 == '2' ]; then
    sudo ./set_crontab.sh
  else 
    echo "Enter the parameters in this format: 
[minute] 
[hour] 
[day_of_month] 
[month] 
[day_of_week] 
Write '*' for every."
    read cron1
    read cron2
    read cron3
    read cron4
    read cron5
    
    sudo ./set_crontab.sh "$cron1" "$cron2" "$cron3" "$cron4" "$cron5"
  fi 
elif [ $option == '6' ]; then
  is_server_running
  if [ $server_status -eq 1 ]; then
    echo "The server is currently running. You cannot do this operation."
  else 
    printf "\nListing all worlds in repository:\n"
    ls -1 ${minecraft_dir}/world_list/
    printf "\nEnter a world name, making sure it's not a duplicate: "
    read world_name
  
    sudo ./create_world.sh $world_name
  fi
elif [ $option == '7' ]; then
  is_server_running
  if [ $server_status -eq 1 ]; then
    echo "The server is currently running. You cannot do this operation."
  else 
    printf "\nListing all worlds in repository:\n"
    ls -1 ${minecraft_dir}/world_list/
    printf "\nType in the world name to delete: "
    read world_name
  
    sudo ./remove_world.sh $world_name
  fi
elif [ $option == '8' ]; then
  is_server_running
  if [ $server_status -eq 1 ]; then
    echo "The server is currently running. You cannot do this operation."
  else 
    printf "\nListing all worlds in repository:\n"
    ls -1 ${minecraft_dir}/world_list/
    printf "\nType in the world name to switch to: "
    read world_name
  
    sudo ./switch_world.sh $world_name
  fi
elif [ $option == '9' ]; then
  clear
  exit 0 
else 
  echo "bad"
fi

echo -ne "Returning to menu screen in 5s. \r"
sleep 1
echo -ne "Returning to menu screen in 4s. \r"
sleep 1
echo -ne "Returning to menu screen in 3s. \r"
sleep 1
echo -ne "Returning to menu screen in 2s. \r"
sleep 1
echo -ne "Returning to menu screen in 1s. \r"
sleep 1

clear
done
