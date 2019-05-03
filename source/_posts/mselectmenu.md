---
author: Irony
title: PyQt5菜单之多选功能
date: 2018-10-25 09:53:34
top: 1
tags: 
 - PyQt
 - 菜单
categories: 例子
---

有时候会遇到这种需求：在界面某个位置弹出一个菜单，其中里面的菜单项可以多选（类似配置选项），此时用`QMenu`会遇到点击一个菜单项就会自动关闭，当然可以通过其他方式实现该功能，不过这里就采用`QMenu`通过特殊的方式来实现该需求。
<!-- more -->

## 需求

要实现的效果：

1. 菜单1
2. 菜单2
3. 菜单3
4. 菜单4

点击菜单1、2、3可以多选不关闭菜单

点击菜单4可以勾选，并且关闭菜单

## 原理

1. 设置菜单项可勾选：通过`QAction.setCheckable(True)`方法实现
2. 设置菜单不可关闭：通过覆盖QMenu的鼠标释放`mouseReleaseEvent`方法（可直接替换或者通过`installEventFilter`安装事件过滤器实现）
3. 在菜单的鼠标释放事件中，当点击菜单项后是通过点击点坐标来查找是否有`QAction`，然后触发对应的`QAction`。
4. 故在没有`QAction`的地方则直接交还给`QMenu`自行处理逻辑，在有`QAction`的地方可以根据自己的需求进行处理（如上所提）

## 代码

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Created on 2018年10月24日
@author: Irony
@site: https://github.com/892768447
@email: 892768447@qq.com
@file: 菜单多选不关闭
@description: 
"""
from PyQt5.QtWidgets import QWidget, QVBoxLayout, QLabel, QPushButton, QMenu,\
    QAction


__Author__ = """By: Irony
QQ: 892768447
Email: 892768447@qq.com"""
__Copyright__ = "Copyright (c) 2018 Irony"
__Version__ = "Version 1.0"


class Window(QWidget):

    def __init__(self, *args, **kwargs):
        super(Window, self).__init__(*args, **kwargs)
        layout = QVBoxLayout(self)
        self.labelInfo = QLabel(self)
        self.button = QPushButton('带按钮的菜单', self)
        layout.addWidget(self.labelInfo)
        layout.addWidget(self.button)

        # 添加菜单
        self._initMenu()

    def _initMenu(self):
        # 创建菜单
        self._menu = QMenu(self.button)
        # 替换menu的鼠标释放事件达到选择性不关闭菜单
        self._menu.mouseReleaseEvent = self._menu_mouseReleaseEvent
        self._menu.addAction('菜单1', self._checkAction)
        self._menu.addAction('菜单2', self._checkAction)
        self._menu.addAction(
            QAction('菜单3', self._menu, triggered=self._checkAction))
        action = QAction('菜单4', self._menu, triggered=self._checkAction)
        # 添加自定义的属性,判断该属性可以关闭菜单
        action.setProperty('canHide', True)
        self._menu.addAction(action)
        for action in self._menu.actions():
            # 循环设置可勾选
            action.setCheckable(True)
        self.button.setMenu(self._menu)

    def _menu_mouseReleaseEvent(self, event):
        action = self._menu.actionAt(event.pos())
        if not action:
            # 没有找到action就交给QMenu自己处理
            return QMenu.mouseReleaseEvent(self._menu, event)
        if action.property('canHide'):  # 如果有该属性则给菜单自己处理
            return QMenu.mouseReleaseEvent(self._menu, event)
        # 找到了QAction则只触发Action
        action.activate(action.Trigger)

    def _checkAction(self):
        # 三个action都响应该函数
        self.labelInfo.setText('\n'.join(['{}\t选中：{}'.format(
            action.text(), action.isChecked()) for action in self._menu.actions()]))


if __name__ == '__main__':
    import sys
    import cgitb
    sys.excepthook = cgitb.enable(1, None, 5, 'text')
    from PyQt5.QtWidgets import QApplication
    app = QApplication(sys.argv)
    w = Window()
    w.resize(400, 400)
    w.show()
    sys.exit(app.exec_())
```

## 效果图

![MultiSelect](https://github.com/PyQt5/PyQt/raw/master/QMenu/ScreenShot/MultiSelect.gif)