---
author: Irony
title: PyQt5之QSlider滑动条点击定位
date: 2018-11-05 23:12:26
tags: 
 - PyQt
 - 滑动条
categories: 例子
---

`QSlider` 在通常情况下支持鼠标点击可以任意拖动，或者鼠标点击则往鼠标点击的方向移动一小格，这种移动一小格通常情况下用起来很不方便，比如我要做一个播放器的播放进度条，肯定是点击某个位置就直接跳到该位置，为此需要对 `QSlider` 的鼠标事件`mousePressEvent`进行重写。
<!-- more -->

## 实现方法

一般的想法就是重写`mousePressEvent`后，得到鼠标点击的x和y点然后进行比例换算，再通过`setValue`来设置值，其实`QSlider`的`style`里面是有一个`sliderValueFromPosition`方法来计算值的。直接调用这个方法即可。

1. 首先通过`QSlider.style().subControlRect`方法计算得到滑块的区域，当鼠标点击区域在此次时则交给系统自己处理（比如按住不放拖动）
2. 通过`orientation`判断滑动条的方向（横竖）
3. 通过`invertedAppearance`判断滑动条是否反向（左右、上下）
4. 通过`QSlider.style().sliderValueFromPosition(最小值, 最大值, x或者y坐标, 宽度或者高度)`来计算得到值
5. 最后通过`setValue`来设置值

## 代码

https://github.com/PyQt5/PyQt/blob/master/QSlider/ClickJumpSlider.py

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Created on 2018年11月5日
@author: Irony
@site: https://pyqt5.com https://github.com/892768447
@email: 892768447@qq.com
@file: JumpSlider
@description: 
"""
from PyQt5.QtCore import Qt
from PyQt5.QtWidgets import QSlider, QStyleOptionSlider, QStyle, QWidget,\
    QFormLayout, QLabel


__Author__ = """By: Irony
QQ: 892768447
Email: 892768447@qq.com"""
__Copyright__ = "Copyright (c) 2018 Irony"
__Version__ = "Version 1.0"


class JumpSlider(QSlider):

    def mousePressEvent(self, event):
        # 获取上面的拉动块位置
        option = QStyleOptionSlider()
        self.initStyleOption(option)
        rect = self.style().subControlRect(
            QStyle.CC_Slider, option, QStyle.SC_SliderHandle, self)
        if rect.contains(event.pos()):
            # 如果鼠标点击的位置在滑块上则交给Qt自行处理
            super(JumpSlider, self).mousePressEvent(event)
            return
        if self.orientation() == Qt.Horizontal:
            # 横向，要考虑invertedAppearance是否反向显示的问题
            self.setValue(self.style().sliderValueFromPosition(
                self.minimum(), self.maximum(),
                event.x() if not self.invertedAppearance() else (self.width(
                ) - event.x()), self.width()))
        else:
            # 纵向
            self.setValue(self.style().sliderValueFromPosition(
                self.minimum(), self.maximum(),
                (self.height() - event.y()) if not self.invertedAppearance(
                ) else event.y(), self.height()))


class TestWindow(QWidget):

    def __init__(self, *args, **kwargs):
        super(TestWindow, self).__init__(*args, **kwargs)
        layout = QFormLayout(self)

        self.label1 = QLabel('0', self)
        layout.addRow(self.label1, JumpSlider(
            Qt.Horizontal, valueChanged=lambda v: self.label1.setText(str(v))))

        # 横向-反向显示
        self.label2 = QLabel('0', self)
        layout.addRow(self.label2, JumpSlider(
            Qt.Horizontal, invertedAppearance=True,
            valueChanged=lambda v: self.label2.setText(str(v))))

        self.label3 = QLabel('0', self)
        layout.addRow(self.label3, JumpSlider(
            Qt.Vertical, minimumHeight=200, valueChanged=lambda v: self.label3.setText(str(v))))

        # 纵向反向显示
        self.label4 = QLabel('0', self)
        layout.addRow(self.label4, JumpSlider(
            Qt.Vertical, invertedAppearance=True,
            minimumHeight=200, valueChanged=lambda v: self.label4.setText(str(v))))


if __name__ == '__main__':
    import sys
    import cgitb
    sys.excepthook = cgitb.enable(1, None, 5, '')
    from PyQt5.QtWidgets import QApplication
    app = QApplication(sys.argv)
    w = TestWindow()
    w.show()
    sys.exit(app.exec_())
```

## 效果图

![ClickJumpSlider](https://github.com/PyQt5/PyQt/raw/master/QSlider/ScreenShot/ClickJumpSlider.gif)

