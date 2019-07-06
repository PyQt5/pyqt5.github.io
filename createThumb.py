#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Created on 2019年6月17日
@author: Irony
@site: 
@email: 892768447@qq.com
@file: 
@description: 生成缩略图
"""
from PIL import Image
import requests
import traceback
import sys
import os

try:
    os.mkdir('tmp')
except:
    pass

def download(url, src, dst):
    try:
        resp = requests.get(url)
        open(src, 'wb').write(resp.content)
        thumbnail(src, dst)
    except:
        traceback.print_exc()


def thumbnail(src, dst):
    try:
        img = Image.open(src)
        img = img.convert('RGB')
        img.thumbnail((80, 80), Image.ANTIALIAS)
        img.save(dst)
    except:
        traceback.print_exc()


if __name__ == '__main__':
    length = len(sys.argv)
    if length == 3:
        # 本地文件生成缩略图
        _, src, dst = sys.argv
        thumbnail(src, dst)
    elif length == 4:
        # 远程文件生成缩略图
        _, url, src, dst = sys.argv
        download(url, src, dst)
