---
author: Irony
title: PyQt5调整窗口显示边框
date: 2019-04-26 22:19:26
top: 1
tags: 
 - PyQt
 - 边框
categories: 教程
---

在`windows`某些场景下调整窗口大小或者移动后就会导致里面的内容重绘（速度慢，卡顿，闪烁），其实在以前`windows`在低配置设备为了减少这种频繁绘制的情况，默认会开启这种效果，不过目前设备越来越好了就关闭了该功能。具体是在控制面板中->调整`Windows`的外观和性能->去掉勾选 拖动时显示窗口内容。
<!-- more -->

由于这个开关是全局状态的，而我们只需要在自己的窗口中实现该效果有两种方式。

1. 一种是自己绘制一个边框效果，放开鼠标时才操作真正的窗口。
2. 二是替换窗口的处理过程函数`wndproc`处理`WM_NCLBUTTONDOWN`消息事件。

今天讲第二种方法：

1. 需要了解 `SystemParametersInfo` API函数
2. `SPI_GETDRAGFULLWINDOWS`：确定是否允许拖拉到最大窗口
3. `SPI_SETDRAGFULLWINDOWS`：设置是否允许拖至最大窗口

效果就是这样的：

![ShowFrameWhenDrag](https://github.com/PyQt5/PyQt/raw/master/Demo/ScreenShot/ShowFrameWhenDrag.gif)

正如图片所看的那样，窗体在移动的时候，窗体并没有绘制出来，而是绘制出窗体的边框，等到窗体不在移动的时候就直接把窗体图像数据全部绘制出来，这样就避免了窗体在移动的时候出现闪烁的现象。

## 代码

https://github.com/PyQt5/PyQt/blob/master/Demo/ShowFrameWhenDrag.py

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Created on 2019年4月23日
@author: Irony
@site: https://pyqt5.com https://github.com/892768447
@email: 892768447@qq.com
@file: ShowFrameWhenDrag
@description: 调整窗口显示边框
"""
from ctypes import sizeof, windll, c_int, byref, c_long, c_void_p, c_ulong, c_longlong,\
    c_ulonglong, WINFUNCTYPE, c_uint

from PyQt5.QtWidgets import QWidget, QVBoxLayout, QLabel


__Author__ = 'Irony'
__Copyright__ = 'Copyright (c) 2019 Irony'
__Version__ = 1.0

if sizeof(c_long) == sizeof(c_void_p):
    WPARAM = c_ulong
    LPARAM = c_long
elif sizeof(c_longlong) == sizeof(c_void_p):
    WPARAM = c_ulonglong
    LPARAM = c_longlong

WM_NCLBUTTONDOWN = 0x00a1
GWL_WNDPROC = -4
SPI_GETDRAGFULLWINDOWS = 38
SPI_SETDRAGFULLWINDOWS = 37
WNDPROC = WINFUNCTYPE(c_long, c_void_p, c_uint, WPARAM, LPARAM)

try:
    CallWindowProc = windll.user32.CallWindowProcW
    SetWindowLong = windll.user32.SetWindowLongW
    SystemParametersInfo = windll.user32.SystemParametersInfoW
except:
    CallWindowProc = windll.user32.CallWindowProcA
    SetWindowLong = windll.user32.SetWindowLongA
    SystemParametersInfo = windll.user32.SystemParametersInfoA


def GetDragFullwindows():
    rv = c_int()
    SystemParametersInfo(SPI_GETDRAGFULLWINDOWS, 0, byref(rv), 0)
    return rv.value


def SetDragFullwindows(value):
    SystemParametersInfo(SPI_SETDRAGFULLWINDOWS, value, 0, 0)


class Window(QWidget):

    def __init__(self, *args, **kwargs):
        super(Window, self).__init__(*args, **kwargs)
        layout = QVBoxLayout(self)
        layout.addWidget(QLabel('拖动或者调整窗口试试看'))

        # 重点替换窗口处理过程
        self._newwndproc = WNDPROC(self._wndproc)
        self._oldwndproc = SetWindowLong(
            int(self.winId()), GWL_WNDPROC, self._newwndproc)

    def _wndproc(self, hwnd, msg, wparam, lparam):
        if msg == WM_NCLBUTTONDOWN:
            # 获取系统本身是否已经开启
            isDragFullWindow = GetDragFullwindows()
            if isDragFullWindow != 0:
                # 开启虚线框
                SetDragFullwindows(0)
                # 系统本身处理
                ret = CallWindowProc(
                    self._oldwndproc, hwnd, msg, wparam, lparam)
                # 关闭虚线框
                SetDragFullwindows(1)
                return ret
        return CallWindowProc(self._oldwndproc, hwnd, msg, wparam, lparam)


if __name__ == '__main__':
    import sys
    from PyQt5.QtWidgets import QApplication
    app = QApplication(sys.argv)
    w = Window()
    w.show()
    sys.exit(app.exec_())
```

## 片尾

替换窗口过程可以处理很多系统窗口的处理过程，更多需要读者自行去发现。