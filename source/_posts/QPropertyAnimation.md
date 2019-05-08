---
author: Irony
title: PyQt属性动画(QPropertyAnimation)
date: 2019-05-08 15:43:06
top: 1
tags: 
 - PyQt
 - 动画
categories: 笔记
---

`QPropertyAnimation`继承自`QVariantAnimation`，其作为Qt的属性动画用于针对控件的属性或者继承自`QObject`的对象中定义的属性做修改，
简单来说就是基类是`QObject`且定义了属性变量，就可以用`QPropertyAnimation`来做属性动画。同时也可以通过`pyqtProperty`来增加自定义属性。
<!-- more -->

首先，通过构造函数`QPropertyAnimation(QObject, Union[QByteArray, bytes, bytearray], parent: QObject = None)`创建一个对象，其中

1. 第一个参数是动画作用的对象，也可以通过`setTargetObject`设置
2. 第二个参数是属性名，在py3中类型是bytes，也可以通过`setPropertyName`设置

## 函数

一些常见的设置函数

|                 |              |
| :-------------- | :---------- |
| setPropertyName |   设置属性名  |
| setTargetObject | 设置动画作用对象  |
|   setDuration   | 设置动画持续时间（毫秒）  |
|  setStartValue  |   设置开始值  |
|   setEndValue   |   设置结束值  |
|  setEasingCurve | 设置动画曲线  |
|  setKeyValueAt  |  插入线性值   |
|   setLoopCount  | 设置循环次数（-1为永久）  |

## 示例

比如这个例子：

1. 修改控件的`geometry`大小
2. 修改自定义属性
3. 修改进度条的value值

![QPropertyAnimation](/images/QPropertyAnimation.gif)

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Created on 2019年5月8日
@author: Irony
@site: https://pyqt5.com https://github.com/892768447
@email: 892768447@qq.com
@file: 
@description: 
"""
from PyQt5.QtCore import QPropertyAnimation, QRect, pyqtProperty, QEasingCurve
from PyQt5.QtWidgets import QWidget, QPushButton, QVBoxLayout,\
    QLabel, QProgressBar, QSpacerItem, QSizePolicy


__Author__ = 'Irony'
__Copyright__ = 'Copyright (c) 2019 Irony'
__Version__ = 1.0


class Window(QWidget):

    def __init__(self, *args, **kwargs):
        super(Window, self).__init__(*args, **kwargs)
        self.resize(400, 400)
        self._value = 0
        self.button = QPushButton('属性动画测试', self)
        self.button.clicked.connect(self.doStart)
        self.button.setGeometry(0, 0, 80, 40)

        self.buttonc = QPushButton('自定义属性 测试', self)
        self.buttonc.clicked.connect(self.doStartCustom)

        self.label = QLabel('', self)

        self.progressbar = QProgressBar(self)
        self.progressbar.setRange(0, 99)

        layout = QVBoxLayout(self)
        layout.addItem(QSpacerItem(
            20, 60, QSizePolicy.Fixed, QSizePolicy.Fixed))
        layout.addWidget(self.buttonc)
        layout.addWidget(self.label)
        layout.addWidget(self.progressbar)

        # 进度条动画
        self.progressStart()

    # 此处是自定义属性，并通过动画修改后，设置QLabel的值
    @pyqtProperty(int)
    def value(self):
        return self._value

    @value.setter
    def value(self, v):
        self._value = v
        self.label.setText('当前值：{}'.format(v))

    def doStart(self):
        # 第一个参数是要执行的对象
        animation = QPropertyAnimation(self.button, b'geometry', self)
        animation.setDuration(2000)  # 持续时间
        # 缓和曲线风格,加了曲线动画会很大程度影响
        animation.setEasingCurve(QEasingCurve.OutBounce)
        animation.setStartValue(QRect(0, 0, 40, 40))
        animation.setEndValue(QRect(250, 250, 80, 80))
        animation.start(animation.DeleteWhenStopped)

    def doStartCustom(self):
        # 自定义属性动画
        # 由于定义的属性是在继承的QWidget, 所以第一个参数是self
        # 第二个参数就是 value
        animation = QPropertyAnimation(self, b'value', self)
        animation.setDuration(2000)  # 持续时间
        animation.setStartValue(0)
        animation.setEndValue(100)
        animation.start(animation.DeleteWhenStopped)

    def progressStart(self):
        # 进度条动画
        # 这里 value是QProgressBar自带的属性，具体可以看文档
        # https://doc.qt.io/qt-5/qprogressbar.html#properties
        animation = QPropertyAnimation(self.progressbar, b'value', self)
        animation.setDuration(2000)  # 持续时间
        animation.setLoopCount(-1)
        # 这里采用插入线性值,第一个参数的范围是（0-1）
        # 第二个参数的范围是进度（最小值-最大值）
        animation.setKeyValueAt(0, self.progressbar.minimum())
        animation.setKeyValueAt(0.1, 10)
        animation.setKeyValueAt(0.2, 30)
        animation.setKeyValueAt(0.5, 60)
        animation.setKeyValueAt(0.7, 80)
        animation.setKeyValueAt(1, self.progressbar.maximum())
        animation.start(animation.DeleteWhenStopped)


if __name__ == '__main__':
    import sys
    from PyQt5.QtWidgets import QApplication
    app = QApplication(sys.argv)
    w = Window()
    w.show()
    sys.exit(app.exec_())

```