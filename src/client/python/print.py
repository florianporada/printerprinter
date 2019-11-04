#!/usr/bin/env python
# coding: utf-8

import sys
import json
import textwrap
import base64
import os
import PIL
from Adafruit_Thermal import *

# Read data from stdin


def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])


def get_serialport():
    fn = os.path.abspath('./db.json')
    with open(fn) as data_file:
        data = json.load(data_file)

    return data['config'][0]['serialport']


def get_baudrate():
    fn = os.path.abspath('./db.json')
    with open(fn) as data_file:
        data = json.load(data_file)

    return int(data['config'][0]['baudrate'])


def main():
    serialport = get_serialport()
    baudrate = get_baudrate()

    # create printer object
    p = Adafruit_Thermal(serialport=serialport, baudrate=baudrate)

    # get our data as an array from read_in()
    lines = read_in()

    p.justify('L')
    # print textwrap.fill('u' + lines['content'].encode('utf-8').strip()) + '\n'
    p.print_text(textwrap.fill(
        lines['content'].encode('utf-8').strip()) + '\n')

    if lines['image'] != '':
        from PIL import Image
        from io import BytesIO
        data = lines['image']
        img = Image.open(BytesIO(base64.b64decode(data)))
        basewidth = 384
        wpercent = (basewidth/float(img.size[0]))
        hsize = int((float(img.size[1])*float(wpercent)))
        img = img.resize((basewidth, hsize), PIL.Image.ANTIALIAS)
        img = img.convert('1')
        w, h = img.size
        p.justify('C')
        p.print_bitmap(img.getdata(), w, h, True)
        p.justify('C')

    p.justify('R')
    p.print_text('--------' + '\n')
    p.font_b()
    p.print_text(lines['from'].encode('utf-8').strip() + '\n')
    p.font_b(False)
    # print lines['from']

    p.justify('R')
    p.font_b()
    p.print_text(lines['meta'].encode('utf-8').strip() + '\n')
    p.font_b(False)
    # print lines['meta']

    p.justify('L')
    p.print_text('________________________________')
    p.linefeed()
    p.linefeed()
    p.linefeed()

    # Print lines
    # for item in lines:
    #    print item
    #    print item['content']
    #    print item['meta']
    #    p.print_text(item)
    #    p.linefeed()
    #    p.linefeed()
    #    p.linefeed()
# Start process
if __name__ == '__main__':
    main()
