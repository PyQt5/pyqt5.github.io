---
author: Irony
title: PyQt5仿网页图片鼠标移动特效
date: 2018-10-23 17:57:03
tags: 
 - PyQt
 - 特效
categories: 例子
---

em，就是类似于那种游戏官网首页的图片，鼠标放上去后来回移动，图片的前景和背景错位移动。
<!-- more -->

## 原理分析

1. 2张一样大小的透明图片，1张作为背景，一张作为前景（比如说人物）。
2. 当鼠标往左移动时，前景人物跟着往左移动，背景往右移动
3. 计算好偏移量（见代码中）

https://github.com/PyQt5/PyQt/blob/master/QLabel/ImageSlipped.py

## 关键代码

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Created on 2018年10月18日
@author: Irony
@site: https://pyqt5.com https://github.com/892768447
@email: 892768447@qq.com
@file: ImageSlipped
@description: 
"""
from PyQt5.QtGui import QPixmap, QPainter
from PyQt5.QtWidgets import QWidget


__Author__ = """By: Irony
QQ: 892768447
Email: 892768447@qq.com"""
__Copyright__ = "Copyright (c) 2018 Irony"
__Version__ = "Version 1.0"


class SlippedImgWidget(QWidget):

    def __init__(self, bg, fg, *args, **kwargs):
        super(SlippedImgWidget, self).__init__(*args, **kwargs)
        # 开启鼠标跟踪
        self.setMouseTracking(True)
        # 背景
        self.bgPixmap = QPixmap(bg)
        # 前景
        self.pePixmap = QPixmap(fg)
        # 最小尺寸(背景右边和下方隐藏10个像素)
        size = self.bgPixmap.size()
        self.setMinimumSize(size.width() - 10, size.height() - 10)
        self.setMaximumSize(size.width() - 10, size.height() - 10)
        # 分成10份用于鼠标移动判断
        self.stepX = size.width() / 10
        self.stepY = size.height() / 10
        # 偏移量
        self._offsets = [-4, -4, -4, -4]  # 背景(-4,-4),前景(-4,-4)

    def mouseMoveEvent(self, event):
        super(SlippedImgWidget, self).mouseMoveEvent(event)
        pos = event.pos()

        # 偏移量
        offsetX = 5 - int(pos.x() / self.stepX)
        offsetY = 5 - int(pos.y() / self.stepY)
        self._offsets[0] = offsetX
        self._offsets[1] = offsetY
        self._offsets[2] = offsetX
        self._offsets[3] = offsetY
        # 刷新
        self.update()

    def paintEvent(self, event):
        super(SlippedImgWidget, self).paintEvent(event)
        # 绘制图形
        painter = QPainter(self)
        painter.setRenderHint(QPainter.Antialiasing)
        # 左上角偏移5个像素画背景图片
        painter.drawPixmap(
            -5 + self._offsets[0],
            -5 + self._offsets[1], self.bgPixmap)
        # 右下角偏移5个像素画前景图片
        painter.drawPixmap(
            self.width() - self.pePixmap.width() + 5 - self._offsets[2],
            self.height() - self.pePixmap.height() + 5 - self._offsets[3],
            self.pePixmap
        )


if __name__ == '__main__':
    import sys
    from PyQt5.QtWidgets import QApplication
    app = QApplication(sys.argv)
    w = SlippedImgWidget('images/bg.png', 'images/fg.png')
    w.show()
    sys.exit(app.exec_())
```

## 效果图

![ImageSlipped](/PyQt/QLabel/ScreenShot/ImageSlipped.gif)