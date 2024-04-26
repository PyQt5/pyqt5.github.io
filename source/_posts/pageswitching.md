---
author: Irony
title: PyQt5之图片轮播
date: 2018-11-24 21:45:06
tags: 
 - PyQt
 - 轮播
 - 动画
categories: 例子
---

之前看到了`QStackedWidget`做切换动画，让界面不那么生硬，于是参考了 http://qt.shoutwiki.com/wiki/Extending_QStackedWidget_for_sliding_page_animations_in_Qt 做了一个`QStackedWidget`的切换动画，然后利用`QStackedWidget`结合多个`QLabel`显示图片来做一个轮播效果。

其实在写之前也在网上找了很多例子，参看过后发现大多例子都是利用到了`paintEvent`去绘制，这样其实还是比较麻烦，个人觉得更好的方式是使用`QPropertyAnimation`属性动画修改控件中`QLabel`图片控件的pos位置属性就可以达到移动效果了。
<!-- more -->

1. 比较核心的算法就是要计算当前页面和下一个页面的位置偏移量，比如:

```python
# 计算偏移量
offsetX = self.frameRect().width()
offsetY = self.frameRect().height()
w_next.setGeometry(0, 0, offsetX, offsetY)

if direction == self.BOTTOM2TOP:
    offsetX = 0
    offsetY = -offsetY
elif direction == self.TOP2BOTTOM:
    offsetX = 0
elif direction == self.RIGHT2LEFT:
    offsetX = -offsetX
    offsetY = 0
elif direction == self.LEFT2RIGHT:
    offsetY = 0

# 重新定位显示区域外部/旁边的下一个窗口小部件
pnext = w_next.pos()
pnow = w_now.pos()
self._pnow = pnow

# 移动到指定位置并显示
w_next.move(pnext.x() - offsetX, pnext.y() - offsetY)
w_next.show()
w_next.raise_()
```

2. 其次是对这两个页面增加关联`pos`属性的`QPropertyAnimation`动画，然后加入到并行动画组`QParallelAnimationGroup`中再启动即可。

3. 对`QStackedWidget`的`setCurrentIndex`和`setCurrentWidget`这两个函数进行了覆盖重写达到及时手动调用这两个函数也会产生动画效果的目的。

## 代码

https://github.com/PyQt5/PyQt/blob/master/QPropertyAnimation/PageSwitching.py

## 效果图

![PageSwitching](/PyQt/QPropertyAnimation/ScreenShot/PageSwitching.gif)