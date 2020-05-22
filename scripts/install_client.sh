#!/bin/bash


logthis() {
  now=$(date +"%T")
  name=PRINTERPRINTER
  echo "$name ($now): $1"
}

logthis 'Get updates'
sudo apt-get update -y

eclogthisho 'Install needed packages via apt-get'
sudo apt-get install -y git build-essentials wget python-pip

logthis 'Install nodejs lts'
wget -O - https://raw.githubusercontent.com/sdesalas/node-pi-zero/master/install-node-v.lts.sh | bash

logthis 'Install python packages via PIP'
pip install Pillow

logthis 'Please activate GPIO serial port'
logthis 'see: https://www.abelectronics.co.uk/kb/article/1035/raspberry-pi-3--4-and-zero-w-serial-port-usage'
logthis 'Select: 5 Interfacing Options'
logthis 'Select: P6 Serial'
logthis 'DISABLE for shell access'
logthis 'ENABLE as serial port'

read -n 1 -s -r -p "Press any key to continue"

sudo raspi-config

logthis 'Modify /boot/cmdline.txt'
echo 'root=/dev/mmcblk0p2 rootfstype=ext4 elevator=deadline fsck.repair=yes rootwait' | sudo tee /boot/cmdline.txt

logthis 'Install PM2 + Logrotate'
sudo npm install -g pm2
pm2 install pm2-logrotate

logthis 'Configure PM2 Logrotate'
pm2 set pm2-logrotate:max_size 20M
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:rotateInterval '0 0 * * *'

logthis 'Reboot'
sudo reboot

