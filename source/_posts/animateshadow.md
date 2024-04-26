---
author: Irony
title: PyQt5动画边框阴影
date: 2018-09-25 23:38:12
tags: 
 - PyQt
 - 动画
 - 阴影
categories: 例子
---

为子控件增加动画阴影效果，结合`QGraphicsDropShadowEffect`和`QPropertyAnimation`动态改变阴影半径达到效果，在旧版本的Qt中`QGraphicsDropShadowEffect`可能会有点问题（父控件会影响子控件）
<!-- more -->

## 原理

原理是利用QGraphicsDropShadowEffect添加边框阴影，然后使用动画不停改变阴影的模糊半径来达到效果，如图：

![ShadowEffect](/PyQt/QGraphicsDropShadowEffect/ScreenShot/ShadowEffect.gif)

## 简单说明

1. 继承`QGraphicsDropShadowEffect`增加动态属性`radius`
2. 通过`setGraphicsEffect`方法设置控件的边框阴影
3. 通过`QPropertyAnimation`属性动画不断改变`radius`的值并调用`setBlurRadius`更新半径值

https://github.com/PyQt5/PyQt/blob/master/QGraphicsDropShadowEffect/ShadowEffect.py

## 自定义类

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Created on 2018年9月25日
@author: Irony
@site: https://pyqt5.com, https://github.com/892768447
@email: 892768447@qq.com
@file: AnimationShadowEffect
@description: 边框动画阴影动画
"""
from PyQt5.QtCore import QPropertyAnimation, pyqtProperty
from PyQt5.QtWidgets import QGraphicsDropShadowEffect


__Author__ = """By: Irony
QQ: 892768447
Email: 892768447@qq.com"""
__Copyright__ = 'Copyright (c) 2018 Irony'
__Version__ = 1.0


class AnimationShadowEffect(QGraphicsDropShadowEffect):

    def __init__(self, color, *args, **kwargs):
        super(AnimationShadowEffect, self).__init__(*args, **kwargs)
        self.setColor(color)
        self.setOffset(0, 0)
        self.setBlurRadius(0)
        self._radius = 0
        self.animation = QPropertyAnimation(self)
        self.animation.setTargetObject(self)
        self.animation.setDuration(2000)  # 一次循环时间
        self.animation.setLoopCount(-1)  # 永久循环
        self.animation.setPropertyName(b'radius')
        # 插入线行值
        self.animation.setKeyValueAt(0, 1)
        self.animation.setKeyValueAt(0.5, 30)
        self.animation.setKeyValueAt(1, 1)

    def start(self):
        self.animation.start()

    @pyqtProperty(int)
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, r):
        self._radius = r
        self.setBlurRadius(r)
```

## 测试代码

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Created on 2018年9月25日
@author: Irony
@site: https://pyqt5.com, https://github.com/892768447
@email: 892768447@qq.com
@file: Test
@description: 
"""
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QPixmap
from PyQt5.QtWidgets import QWidget, QHBoxLayout, QLabel, QPushButton, QLineEdit

from AnimationShadowEffect import AnimationShadowEffect  # @UnresolvedImport


__Author__ = """By: Irony
QQ: 892768447
Email: 892768447@qq.com"""
__Copyright__ = 'Copyright (c) 2018 Irony'
__Version__ = 1.0


class Window(QWidget):

    def __init__(self, *args, **kwargs):
        super(Window, self).__init__(*args, **kwargs)
        layout = QHBoxLayout(self)

        # 绿色边框
        labelGreen = QLabel(self, pixmap=QPixmap('1.jpg').scaled(100, 100))
        layout.addWidget(labelGreen)
        aniGreen = AnimationShadowEffect(Qt.darkGreen, labelGreen)
        labelGreen.setGraphicsEffect(aniGreen)
        aniGreen.start()

        # 红色边框,圆形图片
        labelRed = QLabel(self)
        labelRed.setMinimumSize(100, 100)
        labelRed.setMaximumSize(100, 100)
        labelRed.setStyleSheet('border-image: url(1.jpg);border-radius: 50px;')
        layout.addWidget(labelRed)
        aniRed = AnimationShadowEffect(Qt.red, labelGreen)
        labelRed.setGraphicsEffect(aniRed)
        aniRed.start()

        # 蓝色边框按钮
        button = QPushButton('按钮', self)
        aniButton = AnimationShadowEffect(Qt.blue, button)
        layout.addWidget(button)
        button.setGraphicsEffect(aniButton)
        aniButton.start()

        # 青色边框输入框
        lineedit = QLineEdit(self)
        aniEdit = AnimationShadowEffect(Qt.cyan, lineedit)
        layout.addWidget(lineedit)
        lineedit.setGraphicsEffect(aniEdit)
        aniEdit.start()


if __name__ == '__main__':
    import sys
    from PyQt5.QtWidgets import QApplication
    app = QApplication(sys.argv)
    w = Window()
    w.show()
    sys.exit(app.exec_())
```