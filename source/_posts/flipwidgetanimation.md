---
author: Irony
title: PyQt5窗口翻转动画
date: 2019-05-15 22:48:00
tags: 
 - PyQt
 - 动画
 - 翻转
categories: 例子
---

QQ的界面一直是用来模仿练习做界面的好东西，这里就有一个类似QQ登录界面的实现翻转效果，当然这里并没有用两个窗口去做，而是用了`QStackedWidget`包含两个控件做切换，同时单独使用一个窗口做动画绘制。
<!-- more -->

## 原理说明

1. 用了两个`QLabel`来显示模拟的图片界面，并实现鼠标点击模拟真实的窗口对应位置点击
2. 用了`QStackedWidget`来存放上面的两个界面`QLabel`
3. 点击切换时主要是对上面的两个界面进行截图并传递给翻转动画窗口
4. 通过`setWindowOpacity`控制主窗口的显示隐藏（保留任务栏），当然也可以用`hide`
5. 动画窗口`FlipWidget.py`主要实现两张图片的翻转显示，考虑到0-90和90-180之前的情况，以及图片的缩放动画

## 核心实现

1. 主要是在`paintEvent`方法中使用`QTransform`对`QPainter`进行圆心变换以及`rotate`设置翻转角度
2. 同时根据翻转的角度范围对图片进行切换和缩放

```python
def paintEvent(self, event):
    super(FlipWidget, self).paintEvent(event)

    if hasattr(self, 'image1') and hasattr(self, 'image2') and self.isVisible():

        painter = QPainter(self)
        painter.setRenderHint(QPainter.Antialiasing, True)
        painter.setRenderHint(QPainter.SmoothPixmapTransform, True)

        # 变换
        transform = QTransform()
        # 把圆心设置为矩形中心
        transform.translate(self.width() / 2, self.height() / 2)

        if self._angle >= -90 and self._angle <= 90:
            # 当翻转角度在90范围内显示第一张图，且从大图缩放到小图的过程
            painter.save()
            # 设置翻转角度
            transform.rotate(self._angle, Qt.YAxis)
            painter.setTransform(transform)
            # 缩放图片高度
            width = self.image1.width() / 2
            height = int(self.image1.height() *
                         (1 - abs(self._angle / self.Scale) / 100))
            image = self.image1.scaled(
                self.image1.width(), height,
                Qt.IgnoreAspectRatio, Qt.SmoothTransformation)
            painter.drawPixmap(
                QPointF(-width, -height / 2), image)
            painter.restore()
        else:
            # 当翻转角度在90范围内显示第二张图，且从小图缩放到原图的过程
            painter.save()
            if self._angle > 0:
                angle = 180 + self._angle
            else:
                angle = self._angle - 180
            # 设置翻转角度， 注意这里角度有差异
            transform.rotate(angle, Qt.YAxis)
            painter.setTransform(transform)
            # 缩放图片高度
            width = self.image2.width() / 2
            height = int(self.image2.height() *
                         (1 - ((360 - abs(angle)) / self.Scale / 100)))
            image = self.image2.scaled(
                self.image2.width(), height,
                Qt.IgnoreAspectRatio, Qt.SmoothTransformation)
            painter.drawPixmap(
                QPointF(-width, -height / 2), image)
            painter.restore()
```

## 代码

https://github.com/PyQt5/PyQt/blob/master/QPropertyAnimation/FlipWidgetAnimation.py


## 效果图

![FlipWidgetAnimation](https://github.com/PyQt5/PyQt/raw/master/QPropertyAnimation/ScreenShot/FlipWidgetAnimation.gif)