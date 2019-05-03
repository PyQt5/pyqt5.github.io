---
author: Irony
title: FFmpeg合成加密HLS记录
date: 2019-01-12 19:28:06
top: 1
tags: 
 - Python
 - FFmpeg
 - HLS
categories: 笔记
---

记录在某个需求中要求截图并合成加密视频文件，这里采用FFmpeg的管道流来实现生成HLS加密文件。
<!-- more -->

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Created on 2019年3月4日
@author: Irony
@site: https://pyqt5.com https://github.com/892768447
@email: 892768447@qq.com
@file: 
@description: 
"""

from pathlib import Path
from subprocess import Popen, PIPE


__Author__ = """By: Irony
QQ: 892768447
Email: 892768447@qq.com"""
__Copyright__ = 'Copyright (c) 2019 Irony'
__Version__ = 1.0


# p = Popen([r'D:\soft\ffmpeg\bin\ffmpeg.exe', '-y',
#            '-threads', '2',
#            '-f', 'image2pipe',
#            '-vcodec', 'mjpeg', '-r', '24', '-i', '-',
#            '-vcodec', 'h264', '-r', '24',
#            #            '-encryption_scheme', 'cenc-aes-ctr',
#            #            '-encryption_key', '617D8A125A284DF48E3C6B1866348A3F',
#            #            '-encryption_kid', 'B326F895B6A24CC5A4DC70995728059C',
#            r'F:\Workspace\Test\videos\video.mp4'], stdin=PIPE)

p = Popen([r'D:\soft\ffmpeg\bin\ffmpeg.exe',
           '-re',   # 按照实际帧率读取输入文件
           '-y',        # 覆盖已存在文件
           '-threads', '2',  # 线程数量
           '-f', 'image2pipe',  # PIPE图片流
           '-vcodec', 'mjpeg',  # 图片编码
           '-r', '24',  # 帧率
           '-i', '-',  # 指定输入流为PIPE
           '-vcodec', 'h264',  # 输出编码
           '-r', '24',  # 帧率
           '-map', '0',
#            '-crf','20',     # 降低质量
           '-b', '720k',        # 码率
           '-f', 'hls',
           '-codec:v', 'libx264',
           '-vbsf', 'h264_mp4toannexb',
           # 指定加密密匙文件
           '-hls_key_info_file', r'F:\Workspace\Test\videokey.info',
           '-hls_time', '20',
           '-hls_list_size', '0',
           '-hls_wrap', '0',
#            '-hls_flags', 'single_file',  # 生成单个文件(有bug)
           r'F:\Workspace\Test\videos\playlist.m3u8'], stdin=PIPE)
print(p)

t = 1 / 24
for i, path in enumerate(Path('frames').rglob('*.jpg')):
    #     print(i, path)
    p.stdin.write(open(str(path), 'rb').read())

p.stdin.close()
p.wait()
print('ok')
```