---
author: Irony
title: PyQt5仿网页鼠标移动点阵特效
date: 2018-10-29 16:49:10
tags: 
 - PyQt
 - 动画
 - 特效
categories: 例子
---

Orz，前段时间有个zz需求，就是要做一个类似网页上很多个多点连线、鼠标移动跟随的那种炫酷特效，然后花了点时间在网上找了js做的，刚开始打算是嵌入`QWebView`来显示网页，后来研究了下js的算法代码，遂改用`QWidget`的`paintEvent`直接绘制。
<!-- more -->

## 大概思路

1. 先根据窗口大小随机创建一些点
2. 遍历这些点并找到与之相关联的点
3. 在动画过程中绘制圆点和画两点之间的连线
4. 属性动画`QPropertyAnimation`改变颜色的透明度

## 题外

1. 这里没有仔细去研究js里的算法优化,在浏览器里嗖嗖的就生成了,在py里好慢....
2. 尽量在py里优化了循环操作,也简单的做了个cython加速也才提高了1s ? 1倍?...
3. 不要只是为了好看用这玩意儿,和网页的效果一样,占CPU !!!!!!没有任何意义
4. 如果有更好的优化算法请告知, 3Q
5. pyd是python3.4生成的,删掉pyd也能运行

## 代码

https://github.com/PyQt5/PyQt/blob/master/QPropertyAnimation/RlatticeEffect.py

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Created on 2018年11月22日
@author: Irony
@site: https://pyqt5.com, https://github.com/892768447
@email: 892768447@qq.com
@file: 
@description: 
"""
from random import random
from time import time

from PyQt5.QtCore import QPropertyAnimation, QObject, pyqtProperty, QEasingCurve,\
    Qt, QRectF, pyqtSignal
from PyQt5.QtGui import QColor, QPainterPath, QPainter
from PyQt5.QtWidgets import QWidget


__Author__ = """By: Irony
QQ: 892768447
Email: 892768447@qq.com"""
__Copyright__ = 'Copyright (c) 2018 Irony'
__Version__ = 1.0


try:
    import pointtool  # @UnusedImport @UnresolvedImport
    getDistance = pointtool.getDistance
    findClose = pointtool.findClose
except:
    import math

    def getDistance(p1, p2):
        return math.pow(p1.x - p2.x, 2) + math.pow(p1.y - p2.y, 2)

    def findClose(points):
        plen = len(points)
        for i in range(plen):
            closest = [None, None, None, None, None]
            p1 = points[i]
            for j in range(plen):
                p2 = points[j]
                dte1 = getDistance(p1, p2)
                if p1 != p2:
                    placed = False
                    for k in range(5):
                        if not placed:
                            if not closest[k]:
                                closest[k] = p2
                                placed = True
                    for k in range(5):
                        if not placed:
                            if dte1 < getDistance(p1, closest[k]):
                                closest[k] = p2
                                placed = True
            p1.closest = closest


class Target:

    def __init__(self, x, y):
        self.x = x
        self.y = y


class Point(QObject):

    valueChanged = pyqtSignal()

    def __init__(self, x, ox, y, oy, *args, **kwargs):
        super(Point, self).__init__(*args, **kwargs)
        self.__x = x
        self._x = x
        self.originX = ox
        self._y = y
        self.__y = y
        self.originY = oy
        # 5个闭合点
        self.closest = [0, 0, 0, 0, 0]
        # 圆半径
        self.radius = 2 + random() * 2
        # 连线颜色
        self.lineColor = QColor(156, 217, 249)
        # 圆颜色
        self.circleColor = QColor(156, 217, 249)

    def initAnimation(self):
        # 属性动画
        if not hasattr(self, 'xanimation'):
            self.xanimation = QPropertyAnimation(
                self, b'x', self, valueChanged=self.valueChanged.emit,
                easingCurve=QEasingCurve.InOutSine)
            self.yanimation = QPropertyAnimation(
                self, b'y', self, valueChanged=self.valueChanged.emit,
                easingCurve=QEasingCurve.InOutSine,
                finished=self.updateAnimation)
            self.updateAnimation()

    def updateAnimation(self):
        self.xanimation.stop()
        self.yanimation.stop()
        duration = (1 + random()) * 1000
        self.xanimation.setDuration(duration)
        self.yanimation.setDuration(duration)
        self.xanimation.setStartValue(self.__x)
        self.xanimation.setEndValue(self.originX - 50 + random() * 100)
        self.yanimation.setStartValue(self.__y)
        self.yanimation.setEndValue(self.originY - 50 + random() * 100)
        self.xanimation.start()
        self.yanimation.start()

    @pyqtProperty(float)
    def x(self):
        return self._x

    @x.setter
    def x(self, x):
        self._x = x

    @pyqtProperty(float)
    def y(self):
        return self._y

    @y.setter
    def y(self, y):
        self._y = y


class Window(QWidget):

    def __init__(self, *args, **kwargs):
        super(Window, self).__init__(*args, **kwargs)
        self.setMouseTracking(True)
        self.resize(800, 600)
        self.points = []
        self.target = Target(self.width() / 2, self.height() / 2)
        self.initPoints()

    def paintEvent(self, event):
        super(Window, self).paintEvent(event)
        painter = QPainter()
        painter.begin(self)
        painter.setRenderHint(QPainter.Antialiasing)
        painter.fillRect(self.rect(), Qt.black)
        self.animate(painter)
        painter.end()

    def mouseMoveEvent(self, event):
        super(Window, self).mouseMoveEvent(event)
        # 鼠标移动时更新xy坐标
        self.target.x = event.x()
        self.target.y = event.y()
        self.update()

    def initPoints(self):
        t = time()
        self.points.clear()
        # 创建点
        stepX = self.width() / 20
        stepY = self.height() / 20
        for x in range(0, self.width(), int(stepX)):
            for y in range(0, self.height(), int(stepY)):
                ox = x + random() * stepX
                oy = y + random() * stepY
                point = Point(ox, ox, oy, oy)
                point.valueChanged.connect(self.update)
                self.points.append(point)
        print(time() - t)

        t = time()
        # 每个点寻找5个闭合点
        findClose(self.points)
        print(time() - t)

    def animate(self, painter):
        for p in self.points:
            # 检测点的范围
            value = abs(getDistance(self.target, p))
            if value < 4000:
                # 其实就是修改颜色透明度
                p.lineColor.setAlphaF(0.3)
                p.circleColor.setAlphaF(0.6)
            elif value < 20000:
                p.lineColor.setAlphaF(0.1)
                p.circleColor.setAlphaF(0.3)
            elif value < 40000:
                p.lineColor.setAlphaF(0.02)
                p.circleColor.setAlphaF(0.1)
            else:
                p.lineColor.setAlphaF(0)
                p.circleColor.setAlphaF(0)

            # 画线条
            if p.lineColor.alpha():
                for pc in p.closest:
                    if not pc:
                        continue
                    path = QPainterPath()
                    path.moveTo(p.x, p.y)
                    path.lineTo(pc.x, pc.y)
                    painter.save()
                    painter.setPen(p.lineColor)
                    painter.drawPath(path)
                    painter.restore()

            # 画圆
            painter.save()
            painter.setPen(Qt.NoPen)
            painter.setBrush(p.circleColor)
            painter.drawRoundedRect(QRectF(
                p.x - p.radius, p.y - p.radius, 2 * p.radius, 2 * p.radius), p.radius, p.radius)
            painter.restore()

            # 开启动画
            p.initAnimation()


if __name__ == '__main__':
    import sys
    import cgitb
    sys.excepthook = cgitb.enable(1, None, 5, '')
    from PyQt5.QtWidgets import QApplication
    app = QApplication(sys.argv)
    w = Window()
    w.show()
    sys.exit(app.exec_())
```

## 效果图

![RlatticeEffect](/PyQt/QPropertyAnimation/ScreenShot/RlatticeEffect.gif)

