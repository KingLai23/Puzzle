# Puzzle 1.0 - Minecraft Server Administration
Simple Shell Scripting to backup, restore, and maintain a Minecraft server running on a Linux machine.

![1](1.PNG "Puzzle Menu Screen")

## Requirements
- A Linux machine for server administration
- An external location to store the backups (we used a Raspberry Pi 4)  

Note: Do make sure both the Linux machine and external location have at least 128GB of storage in order to keep up with the backups.

## How to Set-up
### (1) Set-up an SVN Server
You're gonna have to figure this one out yourself, depending on what kind of computer you use to host the SVN server.

Check out this excellent tutorial if you're using the Raspberry Pi >> https://www.jeremymorgan.com/tutorials/raspberry-pi/raspberry-pi-how-to-svn-server/

Just make sure that your SVN repository follows this:
- The SVN repository is named, *Minecraft*.
- There is a folder in Minecraft named, *logs* (ie. Minecraft/logs).
- There is a folder in Minecraft named, *longterm_backup* (ie. Minecraft/longterm_backup).

### (2) Set-up Server Administration
Under construction by Zi Cheng Hagu.

## How to Use Puzzle 
### Run The Main Menu
To run the main menu, go into the *minecraft* folder, and type the following (you will be prompted to enter your user password):
```
sudo ./menu.sh
```

### Things To Consider Before Running The Main Menu
Make sure these are in your minecraft folder:
- The Minecraft SVN repository checkout.
- server.jar, menu.sh, server_backup.sh, server_restore.sh, set_crontab.sh, start.sh, and stop.sh.
- All the files and folders created when generating a minecraft world.

Make sure you have Java installed on your Linux machine.

That's all, EASY.
