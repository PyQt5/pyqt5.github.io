---
author: Irony
title: PyQt5窗口跟随其它窗口
date: 2018-10-23 15:08:56
top: 1
tags: 
 - PyQt
 - 窗口
categories: 例子
---

要实现`PyQt`窗口跟随其它外部的窗口，能想到两点办法，一个是hook系统事件得到目标窗口的位置和大小以及是否关闭等，二是通过循环检测窗口的位置来实现。
<!-- more -->

## 基于Windows定时检测目标窗口

1. 利用`win32gui`模块获取目标窗口的句柄
2. 通过句柄获取目标窗口的大小位置，并设置自己的位置
3. 主要是检测时间，在10毫秒以下很流畅
4. 窗口关闭是根据目标句柄无效来判断

https://github.com/PyQt5/PyQt/blob/master/Demo/FollowWindow.py

## 代码

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Created on 2018年10月22日
@author: Irony
@site: https://github.com/892768447
@email: 892768447@qq.com
@file: FollowWindow
@description: 
"""
import os

from PyQt5.QtCore import QTimer
from PyQt5.QtWidgets import QWidget, QVBoxLayout, QPushButton
import win32gui


__Author__ = """By: Irony
QQ: 892768447
Email: 892768447@qq.com"""
__Copyright__ = "Copyright (c) 2018 Irony"
__Version__ = "Version 1.0"


class Window(QWidget):

    def __init__(self, *args, **kwargs):
        super(Window, self).__init__(*args, **kwargs)
        layout = QVBoxLayout(self)
        layout.addWidget(QPushButton('test', self))
        self.tmpHwnd = None
        # 启动定时器检测记事本的位置大小和是否关闭
        self.checkTimer = QTimer(self, timeout=self.checkWindow)
        self.checkTimer.start(10)  # 10毫秒比较流畅

    def checkWindow(self):
        # 查找
        hwnd = win32gui.FindWindow('Notepad', None)
        if self.tmpHwnd and not hwnd:
            # 表示记事本关闭了
            self.checkTimer.stop()
            self.close()  # 关闭自己
            return
        if not hwnd:
            return
        self.tmpHwnd = hwnd
        # 获取位置
        rect = win32gui.GetWindowRect(hwnd)
        print(rect)
        self.move(rect[2], rect[1])


if __name__ == '__main__':
    import sys
    from PyQt5.QtWidgets import QApplication
    # 先检测是否已有记事本打开
    hwnd = win32gui.FindWindow('Notepad', None)
    print('hwnd', hwnd)
    if not hwnd:
        # 启动记事本
        os.startfile('notepad')
    app = QApplication(sys.argv)
    w = Window()
    w.show()
    sys.exit(app.exec_())
```

## 效果图

![FollowWindow](https://github.com/PyQt5/PyQt/raw/master/Demo/ScreenShot/FollowWindow.gif)