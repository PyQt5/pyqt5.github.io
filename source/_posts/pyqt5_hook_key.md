---
author: 人间白头　
title: 在pyqt中使用python全局钩子模块
date: 2019-07-07 01:37:22
top: 1
tags:
 - Python
 - pyqt hook key
categories: 随笔
---

在某些时候需要为自己的软件增加全局键盘监听，比如软件最小化隐藏后可以通过热键唤醒，又或者比如像QQ一样可以全局热键截图。这里介绍几个方法实现在PyQt中使用Python全局钩子模块实现全局热键功能。

<!-- more -->


1. `pyHook3`

安装命令 : `pip install pyhook3`

[https://blog.csdn.net/q871063970/article/details/86648386](https://blog.csdn.net/q871063970/article/details/86648386)

似乎将pyhook支持py3版本的了?  没有太多研究.

缺点: 只支持win平台.

2.`keyboard` & `mouse`

安装命令: `pip install keyboard mouse`
```

from PyQt5 import  QtGui, QtWidgets, QtCore
from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *
import keyboard
class Window(QWidget):

    def __init__(self, *args, **kwargs):
        super(Window, self).__init__(*args, **kwargs)
        layout = QVBoxLayout(self)
        self.testBtn = QPushButton(self)
        layout.addWidget(self.testBtn)

        keyboard.add_hotkey('ctrl+shift+x', lambda:print('triggered', 'hotkey'))
        keyboard.add_hotkey('ctrl+shift+c', self.abc,args=('aa',"bb","cc"))

    def abc(self,a,b,c):
        print(a,b,c)
        
if __name__ == '__main__':
    import sys
    from PyQt5.QtWidgets import QApplication
    app = QApplication(sys.argv)
    w = Window()
    w.show()
    sys.exit(app.exec_())
```

更详细例子 : [pyqt中使用keyboard全局热键](https://github.com/PyQt5/PyQt/blob/63c6376358acb1863313fb5593097e6e0210cad6/Test/%E5%85%A8%E5%B1%80%E7%83%AD%E9%94%AE/HotKey.py)

优点: 跨平台 ;

缺点: 模块名字取得太差, 不容易被发现.
