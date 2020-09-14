#!/bin/bash

server_status=0

clear

file_exists () {
  for filename in "$@"
  do
    if [ -e $filename ]; then
      echo $filename exists
    else
      echo $filename does not exist
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

file_exists server.jar start.sh stop.sh server_backup.sh server_restore.sh set_crontab.sh

java -version > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "java is installed"
else 
  echo "java is not installed"
fi

printf "\n\n 
███╗   ███╗██╗███╗   ██╗███████╗ ██████╗██████╗  █████╗ ███████╗████████╗    ███████╗███████╗██████╗ ██╗   ██╗███████╗██████╗  
████╗ ████║██║████╗  ██║██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝╚══██╔══╝    ██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗ 
██╔████╔██║██║██╔██╗ ██║█████╗  ██║     ██████╔╝███████║█████╗     ██║       ███████╗█████╗  ██████╔╝██║   ██║█████╗  ██████╔╝ 
██║╚██╔╝██║██║██║╚██╗██║██╔══╝  ██║     ██╔══██╗██╔══██║██╔══╝     ██║       ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══╝  ██╔══██╗ 
██║ ╚═╝ ██║██║██║ ╚████║███████╗╚██████╗██║  ██║██║  ██║██║        ██║       ███████║███████╗██║  ██║ ╚████╔╝ ███████╗██║  ██║ 
╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝        ╚═╝       ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝ 
                                                                                                                               
 █████╗ ██████╗ ███╗   ███╗██╗███╗   ██╗██╗███████╗████████╗██████╗  █████╗ ████████╗██╗ ██████╗ ███╗   ██╗     ██╗    ██████╗ 
██╔══██╗██╔══██╗████╗ ████║██║████╗  ██║██║██╔════╝╚══██╔══╝██╔══██╗██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║    ███║   ██╔═████╗
███████║██║  ██║██╔████╔██║██║██╔██╗ ██║██║███████╗   ██║   ██████╔╝███████║   ██║   ██║██║   ██║██╔██╗ ██║    ╚██║   ██║██╔██║
██╔══██║██║  ██║██║╚██╔╝██║██║██║╚██╗██║██║╚════██║   ██║   ██╔══██╗██╔══██║   ██║   ██║██║   ██║██║╚██╗██║     ██║   ████╔╝██║
██║  ██║██████╔╝██║ ╚═╝ ██║██║██║ ╚████║██║███████║   ██║   ██║  ██║██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║     ██║██╗╚██████╔╝
╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝     ╚═╝╚═╝ ╚═════╝ 
                                                                                                                                \n"

is_server_running
if [ $server_status -eq 1 ]; then
  echo "server is running"
else
  echo "server is not running"
fi

printf "
[1] Start Server
[2] Stop Server
[3] Backup Server
[4] Restore Server
[5] Set Crontab
[6] Exit
"

read option

if [ $option == '1' ]; then
  is_server_running
  if [ $server_status -eq 1 ]; then
    echo "server is alreay running, can't start again"
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
  
  read option4
  
  if [ $option4 == '1' ]; then
    print_menu_screen
  elif [ $option4 == '2' ]; then
    sudo ./server_restore.sh
  else
    cd Minecraft
    echo "Pick a date to restore from:"
    ls | grep "[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]--[0-9][0-9]_[0-9][0-9]_[0-9][0-9]" 
    
    read restore_name
    
    cd ..
    sudo ./server_restore.sh $restore_name
  fi
elif [ $option == '5' ]; then
  printf "
[1]       Go Back
[2]       Set Default
[Any Key] Set Custom
"

  read option5
  
  if [ $option5 == '1' ]; then
    print_menu_screen
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
  exit 0
else 
  echo "bad"
fi


