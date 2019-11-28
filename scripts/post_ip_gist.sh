#!/bin/bash
echo 'Make sure to define the $GITHUB_ACCESS_TOKEN variable'

DATE=$(date '+%Y_%m_%d_%H_%M_%S')
FILENAME=headless_device_ip_$DATE.txt

if [[ "$OSTYPE" == "linux-gnu" ]]; then
  MSG_CONTENT=$(hostname -I | tr '\n' '; ')
elif [[ "$OSTYPE" == "darwin"* ]]; then
  # MSG_CONTENT=$(ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk -'{print $2}'-)
  MSG_CONTENT=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | cut -d\  -f2 | tr '\n' '; ')
elif [[ "$OSTYPE" == "cygwin" ]]; then
  # POSIX compatibility layer and Linux environment emulation for Windows
  MSG_CONTENT="no ip fetch script present"
elif [[ "$OSTYPE" == "msys" ]]; then
  # Lightweight shell and GNU utilities compiled for Windows (part of MinGW)
  MSG_CONTENT="no ip fetch script present"
elif [[ "$OSTYPE" == "win32" ]]; then
  MSG_CONTENT="no ip fetch script present"
elif [[ "$OSTYPE" == "freebsd"* ]]; then
  # ...
  MSG_CONTENT="no ip fetch script present"
else
  MSG_CONTENT="no ip found :("
fi

echo 'posting '$FILENAME' to your github gist'

wget --verbose \
  --method POST \
  --header "Content-Type: application/json" \
  --header "Authorization: token ${GITHUB_ACCESS_TOKEN}" \
  --header 'User-Agent: PostmanRuntime/7.19.0' \
  --header 'Accept: */*' \
  --header 'Cache-Control: no-cache' \
  --header 'Host: api.github.com' \
  --header 'Accept-Encoding: gzip, deflate' \
  --header 'Connection: keep-alive' \
  --header 'cache-control: no-cache' \
  --body-data "{ \"description\": \"Auto generated gist with rpi ip\", \"public\": \"false\", \"files\": { \"${FILENAME}\": { \"content\": \"${MSG_CONTENT}\" }}}" \
  --output-document \
  - https://api.github.com/gists
