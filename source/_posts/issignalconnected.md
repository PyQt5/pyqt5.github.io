---
author: Irony
title: PyQt5判断信号是否连接
date: 2019-04-26 22:06:26
tags: 
 - PyQt
 - 信号
categories: 教程
---

在`PyQt`中某些情况下需要取消原来的信号连接，此时需要使用`disconnect`方法，但是在逻辑不严谨的情况下可能会导致多次调用`disconnect`方法而导致报错，当然可以通过try except来包裹代码。这里通过 `isSignalConnected` 来判断信号是否连接。
<!-- more -->

在QOjbect文档中这样写到：

```c++
static const QMetaMethod valueChangedSignal = QMetaMethod::fromSignal(&MyObject::valueChanged);
if (isSignalConnected(valueChangedSignal)) {
    QByteArray data;
    data = get_the_value();       // expensive operation
    emit valueChanged(data);
}
```

通过直接传入信号就行了，但是这在PyQt中不可行。需要这么做

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Created on 2019年2月24日
@author: Irony
@site: https://pyqt5.com https://github.com/892768447
@email: 892768447@qq.com
@file: IsSignalConnected
@description: 判断信号是否连接
"""

from PyQt5.QtWidgets import QWidget, QVBoxLayout, QPushButton, QTextBrowser


__Author__ = """By: Irony
QQ: 892768447
Email: 892768447@qq.com"""
__Copyright__ = 'Copyright (c) 2019 Irony'
__Version__ = 1.0


class Window(QWidget):

    def __init__(self, *args, **kwargs):
        super(Window, self).__init__(*args, **kwargs)
        layout = QVBoxLayout(self)
        self.button1 = QPushButton('已连接', self, clicked=self.doTest)
        self.button2 = QPushButton('未连接', self)
        self.retView = QTextBrowser(self)
        layout.addWidget(self.button1)
        layout.addWidget(self.button2)
        layout.addWidget(self.retView)

    def doTest(self):
        self.retView.append("""
        # button1 clicked 是否连接: %s
        # button2 clicked 是否连接: %s
        """ % (
            self.isSignalConnected(self.button1, 'clicked()'),
            self.isSignalConnected(self.button2, 'clicked()')
        ))

    def isSignalConnected(self, obj, name):
        """判断信号是否连接
        :param obj:        对象
        :param name:       信号名，如 clicked()
        """
        index = obj.metaObject().indexOfMethod(name)
        if index > -1:
            method = obj.metaObject().method(index)
            if method:
                return obj.isSignalConnected(method)
        return False


if __name__ == '__main__':
    import sys
    from PyQt5.QtWidgets import QApplication
    app = QApplication(sys.argv)
    w = Window()
    w.show()
    sys.exit(app.exec_())
```

## 效果图

![IsSignalConnected](/PyQt/Demo/ScreenShot/IsSignalConnected.png)