#!/usr/bin/env python
# coding: utf-8

import sys
import argparse
import json
import textwrap
import base64
import os
from PIL import Image
from io import BytesIO
from Adafruit_Thermal import *


parser = argparse.ArgumentParser(
    description='Sends a JSON messge to the printer via stdin (e.g.: { "text": "hello world!", "sender": "internet" })')
parser.add_argument("--baudrate", default=9600,
                    help="Baudrate to communicate with the printer")
parser.add_argument("--serialport", default='/dev/ttyS0',
                    help="Serialport on which the printer is connected")

args = parser.parse_args()


# Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])


def text_parser(text):
    return text.encode('utf-8', 'replace').strip()


def print_image(imageString, printer):
    if imageString != '':
        img = Image.open(BytesIO(base64.b64decode(imageString)))
        printer.justify('C')
        printer.printImage(img, True)
        printer.justify('C')


def print_text(text, printer):
    if text != '':
        printer.justify('L')
        printer.println(textwrap.fill(text_parser(text)))


def print_sender(text, printer):
    if text != '':
        printer.justify('R')
        printer.boldOn()
        printer.println(text_parser('>> ' + text))
        printer.boldOff()


def print_divider(printer):
    printer.justify('L')
    printer.println('________________________________')
    printer.feed(2)


def main():
    serialport = args.serialport
    baudrate = int(args.baudrate)
    timeout = 5

    # create printer object
    p = Adafruit_Thermal(serialport, baudrate, timeout=timeout)

    # get our data as an array from read_in()
    data = read_in()

    print_image(data.get('image', ''), p)
    print_text(data.get('text', ''), p)
    print_sender(data.get('sender', ''), p)
    print_divider(p)


# Start process
if __name__ == '__main__':
    main()
