#!/usr/bin/env python
# coding: utf-8

import sys
import json
import textwrap
import base64
import os
from PIL import Image
from io import BytesIO
from Adafruit_Thermal import *


# Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])


# def get_serialport():
#     fn = os.path.abspath('./db.json')
#     with open(fn) as data_file:
#         data = json.load(data_file)

#     return data['config'][0]['serialport']


# def get_baudrate():
#     fn = os.path.abspath('./db.json')
#     with open(fn) as data_file:
#         data = json.load(data_file)

#     return int(data['config'][0]['baudrate'])

def text_parser(text):
    return text.encode('utf-8', 'replace').strip()


def print_image(imageString, printer):
    if imageString != '':
        img = Image.open(BytesIO(base64.b64decode(imageString)))
        basewidth = 384
        wpercent = (basewidth/float(img.size[0]))
        hsize = int((float(img.size[1])*float(wpercent)))
        img = img.resize((basewidth, hsize), PIL.Image.ANTIALIAS)
        img = img.convert('1')
        w, h = img.size
        printer.justify('C')
        printer.printBitmap(img.getdata(), w, h, True)
        printer.justify('C')


def print_content(text, printer):
    if text != '':
        printer.justify('L')
        printer.println(textwrap.fill(text_parser(text)))


def print_from(text, printer):
    if text != '':
        printer.justify('R')
        printer.boldOn()
        printer.println(text_parser('>> ' + text))
        printer.boldOff()


def print_divider(printer):
    printer.justify('L')
    printer.println('________________________________')
    printer.feed(3)


def main():
    serialport = '/dev/ttyS0'
    baudrate = 9600
    timeout = 5

    # create printer object
    p = Adafruit_Thermal(serialport, baudrate, timeout=timeout)

    # get our data as an array from read_in()
    data = read_in()

    print_image(data.get('image', ''), p)
    print_content(data.get('message', ''), p)
    print_from(data.get('sender', 'anon'), p)
    print_divider(p)


# Start process
if __name__ == '__main__':
    main()
