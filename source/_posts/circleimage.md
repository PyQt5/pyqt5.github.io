---
author: Irony
title: PyQt5圆形图片
date: 2018-09-25 22:13:26
top: 1
tags: 
 - PyQt
 - 圆形
 - 图片
categories: 例子
---

实现圆形图片的方法有很多，比如用遮罩（mask）,裁切等等。这里比较几种实现方式，选出个人认为最优的方案。
<!-- more -->

https://github.com/PyQt5/PyQt/blob/master/QLabel/CircleImage.py

## 采用mask方式

具体参考 [【Qt】QLabel实现的圆形图像 - 米罗西 - 博客园](https://www.cnblogs.com/zhehan54/p/9515124.html)

## 画圆形遮盖（适合纯色背景）

原理是在原图片上画一个4角有颜色，中间圆形镂空的图片。

![circleimage1](/images/circleimage1.png)

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

'''
Created on 2017年8月25日
@author: Irony."[讽刺]
@site: https://pyqt5.com, https://github.com/892768447
@email: 892768447@qq.com
@description: 
'''
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QPixmap, QPainter, QPainterPath
from PyQt5.QtWidgets import QLabel, QWidget, QHBoxLayout


__Author__ = "By: Irony.\"[讽刺]\nQQ: 892768447\nEmail: 892768447@qq.com"
__Copyright__ = "Copyright (c) 2017 Irony.\"[讽刺]"
__Version__ = "Version 1.0"


class Label(QLabel):

    def __init__(self, *args, antialiasing=True, **kwargs):
        super(Label, self).__init__(*args, **kwargs)
        self.Antialiasing = antialiasing
        self.setMaximumSize(200, 200)
        self.setMinimumSize(200, 200)
        self.radius = 100

        #加载图片并缩放
        self.image = QPixmap("head.jpg").scaled(
            200, 200, Qt.KeepAspectRatioByExpanding, Qt.SmoothTransformation)

        painter = QPainter(self.image)
        if self.Antialiasing:
            painter.setRenderHint(QPainter.Antialiasing, True)
            painter.setRenderHint(QPainter.HighQualityAntialiasing, True)
            painter.setRenderHint(QPainter.SmoothPixmapTransform, True)

        path = QPainterPath()
        path.addRoundedRect(
            0, 0, self.width(), self.height(), self.radius, self.radius)
        path.addRect(0,0,self.width(),self.height())
        painter.setPen(Qt.NoPen)
        painter.setBrush(Qt.green)
        painter.drawPath(path)
        self.setPixmap(self.image)


class Window(QWidget):

    def __init__(self, *args, **kwargs):
        super(Window, self).__init__(*args, **kwargs)
        layout = QHBoxLayout(self)
        layout.addWidget(Label(self))
        layout.addWidget(Label(self, antialiasing=False))
        self.setStyleSheet("background: black;")

if __name__ == "__main__":
    import sys
    from PyQt5.QtWidgets import QApplication
    app = QApplication(sys.argv)
    w = Window()
    w.show()
    sys.exit(app.exec_())
```

## 使用QPainter的setCompositionMode

具体参考 [Qt 圆形头像制作工具 抗锯齿 可缩放编辑](https://qtdream.com/topic/911/qt-%E5%9C%86%E5%BD%A2%E5%A4%B4%E5%83%8F%E5%88%B6%E4%BD%9C%E5%B7%A5%E5%85%B7-%E6%8A%97%E9%94%AF%E9%BD%BF-%E5%8F%AF%E7%BC%A9%E6%94%BE%E7%BC%96%E8%BE%91)

```c++
//result_avatar_size 是我们最后生成的图片的长宽，可以是QSize(200, 200)的正圆
destination_image = QImage(result_avatar_size, QImage::Format_ARGB32_Premultiplied);
//在黑色的正方形中间画一个透明的圆，作为头像遮罩
QPainter painter(&destination_image);
painter.setRenderHint(QPainter::Antialiasing);
//全涂黑
painter.fillRect(destination_image.rect(), QBrush(Qt::black, Qt::SolidPattern));
painter.setCompositionMode(QPainter::CompositionMode_SourceOut);
painter.setPen(Qt::NoPen);
painter.setBrush(QBrush(Qt::transparent, Qt::SolidPattern));
//画透明区域
painter.drawEllipse(destination_image.rect());
```

## 使用QPainter的切割方法（推荐）

利用`QPainter.setClipPath`方法切割一个圆形的`QPainterPath`

![circleimage2](/images/circleimage2.png)

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

'''
Created on 2017年8月25日
@author: Irony."[讽刺]
@site: https://pyqt5.com, https://github.com/892768447
@email: 892768447@qq.com
@file: 
@description: 
'''
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QPixmap, QPainter, QPainterPath, QPen
from PyQt5.QtWidgets import QLabel, QWidget, QHBoxLayout


__Author__ = "By: Irony.\"[讽刺]\nQQ: 892768447\nEmail: 892768447@qq.com"
__Copyright__ = "Copyright (c) 2017 Irony.\"[讽刺]"
__Version__ = "Version 1.0"


class Label(QLabel):

    def __init__(self, *args, antialiasing=True, **kwargs):
        super(Label, self).__init__(*args, **kwargs)
        self.Antialiasing = antialiasing
        self.setMaximumSize(200, 200)
        self.setMinimumSize(200, 200)
        self.radius = 100

        #####################核心实现#########################
        self.target = QPixmap(self.size())  # 大小和控件一样
        self.target.fill(Qt.transparent)  # 填充背景为透明

        p = QPixmap("head.jpg").scaled(  # 加载图片并缩放和控件一样大
            200, 200, Qt.KeepAspectRatioByExpanding, Qt.SmoothTransformation)

        painter = QPainter(self.target)
        if self.Antialiasing:
            # 抗锯齿
            painter.setRenderHint(QPainter.Antialiasing, True)
            painter.setRenderHint(QPainter.HighQualityAntialiasing, True)
            painter.setRenderHint(QPainter.SmoothPixmapTransform, True)

#         painter.setPen(# 测试黑色圆圈
#             QPen(Qt.black, 5, Qt.SolidLine, Qt.RoundCap, Qt.RoundJoin))
        path = QPainterPath()
        path.addRoundedRect(
            0, 0, self.width(), self.height(), self.radius, self.radius)
        #**** 切割为圆形 ****#
        painter.setClipPath(path)
#         painter.drawPath(path)  # 测试黑色圆圈

        painter.drawPixmap(0, 0, p)
        self.setPixmap(self.target)
        #####################核心实现#########################

class Window(QWidget):

    def __init__(self, *args, **kwargs):
        super(Window, self).__init__(*args, **kwargs)
        layout = QHBoxLayout(self)
        layout.addWidget(Label(self))
        layout.addWidget(Label(self, antialiasing=False))
        self.setStyleSheet("background: black;")

if __name__ == "__main__":
    import sys
    from PyQt5.QtWidgets import QApplication
    app = QApplication(sys.argv)
    w = Window()
    w.show()
    sys.exit(app.exec_())
```