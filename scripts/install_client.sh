#!/bin/bash

echo 'Get updates'
sudo apt-get update -y

echo 'Install needed packages via apt-get'
sudo apt-get install -y git build-essentials wget python-pip

echo 'Install nodejs lts'
wget -O - https://raw.githubusercontent.com/sdesalas/node-pi-zero/master/install-node-v.lts.sh | bash

echo 'Install python packages via PIP'
pip install Pillow

echo 'Please activate GPIO serial port'
echo 'see: https://www.abelectronics.co.uk/kb/article/1035/raspberry-pi-3--4-and-zero-w-serial-port-usage'
echo 'Select: 5 Interfacing Options'
echo 'Select: P6 Serial'
echo 'DISABLE for shell access'
echo 'ENABLE as serial port'

read -n 1 -s -r -p "Press any key to continue"

sudo raspi-config

echo 'Modify /boot/cmdline.txt'
echo 'root=/dev/mmcblk0p2 rootfstype=ext4 elevator=deadline fsck.repair=yes rootwait' | sudo tee /boot/cmdline.txt

sudo reboot

