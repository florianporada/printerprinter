#!/bin/bash

logthis() {
  now=$(date +"%T")
  name=PRINTERPRINTER
  echo "$name ($now): $1"
}

logthis 'Get updates'
sudo apt-get update -y

logthis 'Install needed packages via apt-get'
sudo apt-get install -y git build-essential wget python-pip libjpeg-dev zlib1g-dev

logthis 'Install nodejs lts'
wget -O - https://raw.githubusercontent.com/sdesalas/node-pi-zero/master/install-node-v.lts.sh | bash

logthis 'Install python packages via PIP'
sudo pip --no-cache-dir install Pillow pyserial

logthis 'Please activate GPIO serial port'
logthis 'see: https://www.abelectronics.co.uk/kb/article/1035/raspberry-pi-3--4-and-zero-w-serial-port-usage'
logthis 'Select: 5 Interfacing Options'
logthis 'Select: P6 Serial'
logthis 'DISABLE for shell access'
logthis 'ENABLE as serial port'

read -n 1 -s -r -p "Press any key to continue"
sleep 5000

sudo raspi-config

logthis 'Modify /boot/cmdline.txt'
echo 'root=/dev/mmcblk0p2 rootfstype=ext4 elevator=deadline fsck.repair=yes rootwait' | sudo tee /boot/cmdline.txt

logthis 'Install PM2 + Logrotate'
npm install -g pm2
sudo ln -s /opt/nodejs/bin/pm2 /usr/bin/pm2
sudo pm2 install pm2-logrotate

logthis 'Configure PM2 Logrotate'
sudo pm2 set pm2-logrotate:max_size 20M
sudo pm2 set pm2-logrotate:compress true
sudo pm2 set pm2-logrotate:rotateInterval '0 0 * * *'

logthis 'Install printerprinter client'
git clone https://github.com/florianporada/printerprinter.git
cd printerprinter
npm install
npm build

logthis 'Configure client to run on startup'
sudo pm2 start ./src/client/ecosystem.config.yaml
sudo pm2 startup
sudo pm2 save

logthis 'Finished installed script. Visit http://<ip-of-client>:8080/'

