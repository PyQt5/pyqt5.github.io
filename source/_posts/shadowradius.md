---
author: Irony
title: PyQt5无边框圆角阴影
date: 2019-04-26 00:06:26
tags: 
 - PyQt
 - 无边框
 - 阴影
 - 圆角
categories: 例子
---

在做PyQt窗口开发中经常会遇到要做一些无边框不规则的窗口，可能还会带有阴影效果，这里演示做一个简单的无边框圆角的窗口，原理就在于背景窗口的透明和一层有色背景控件的叠加。
<!-- more -->

## 原理说明

1. 黑色（方便说明）的`QDialog`或者`QWidget`作为全透明无边框窗口。
2. 其中白色的`QWidget`才是主要显示圆角和阴影的窗口，用于承载其它控件的显示。
3. 注意红色和紫色的方框内的层次。
4. 另：如果要熟悉纯代码编写请看 [FramelessDialog.py](https://github.com/PyQt5/PyQt/blob/master/Demo/FramelessDialog.py)

如图：

![FramelessDialog1](https://github.com/PyQt5/PyQt/raw/master/Demo/ScreenShot/FramelessDialog1.png)

## 代码

https://github.com/PyQt5/PyQt/blob/master/Demo/FramelessDialog.py

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Created on 2019年4月25日
@author: Irony
@site: https://pyqt5.com https://github.com/892768447
@email: 892768447@qq.com
@file: FramelessWidget
@description: 无边框圆角带阴影窗口 
"""
from PyQt5.QtCore import Qt
from PyQt5.QtWidgets import QDialog, QGraphicsDropShadowEffect
from frameless import Ui_Dialog


__Author__ = 'Irony'
__Copyright__ = 'Copyright (c) 2019'


class Window(QDialog, Ui_Dialog):

    def __init__(self, *args, **kwargs):
        super(Window, self).__init__(*args, **kwargs)
        self.mPos = None
        self.setupUi(self)
        self.closeButton.clicked.connect(self.close)
        # 重点
        # 无边框
        self.setWindowFlags(self.windowFlags() | Qt.FramelessWindowHint)
        # 背景透明（就是ui中黑色背景的那个控件）
        self.setAttribute(Qt.WA_TranslucentBackground, True)

        # 添加阴影
        effect = QGraphicsDropShadowEffect(self)
        effect.setBlurRadius(12)
        effect.setOffset(0, 0)
        effect.setColor(Qt.gray)
        self.setGraphicsEffect(effect)

    # 加上简单的移动功能

    def mousePressEvent(self, event):
        """鼠标点击事件"""
        if event.button() == Qt.LeftButton:
            self.mPos = event.pos()
        event.accept()

    def mouseReleaseEvent(self, event):
        '''鼠标弹起事件'''
        self.mPos = None
        event.accept()

    def mouseMoveEvent(self, event):
        if event.buttons() == Qt.LeftButton and self.mPos:
            self.move(self.mapToGlobal(event.pos() - self.mPos))
        event.accept()


if __name__ == '__main__':
    import sys
    from PyQt5.QtWidgets import QApplication
    app = QApplication(sys.argv)
    w = Window()
    w.show()
    sys.exit(app.exec_())
```


## 效果图

![FramelessDialog](https://github.com/PyQt5/PyQt/raw/master/Demo/ScreenShot/FramelessDialog.png)

## 下载

[无边框圆角阴影.zip](/files/无边框圆角阴影.zip)