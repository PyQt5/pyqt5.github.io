---
author: Irony
title: QWebEngineView与Javascript交互
date: 2019-04-27 17:07:36
top: 1
tags: 
 - PyQt
 - QWebEngineView
 - 浏览器
categories: 例子
---

以前还是`QWebView`的时候和`Javascript`交互起来很方便，但是到了Qt5.6以后改用了`QWebEngineView`，并通过其提供的`qwebchannel.js`来进行交互。可能是由于刚出来的原因，这玩意儿有个bug就是必须在每次加载页面的时候手动注入，跳转页面后就失效了，需要手动注入，目前有没有修复具体未测试。
<!-- more -->

## 说明

1. 通过`QWebChannel.registerObject('Bridge', QObject)` 把对象传递到`Javascript`中
2. 可以通过`@pyqtSlot`装饰器来申明该方法可以暴露给`Javascript`调用
```python
@pyqtSlot(str)
def callFromJs(self, text):
    QMessageBox.information(self, "提示", "来自js调用：{}".format(text))
```
3. 在`Javascript`中获取该对象，可以通过该对象对窗口属性以及信号和暴露出的方法进行调用
```javascript
new QWebChannel(qt.webChannelTransport,
    function(channel) {
        window.Bridge = channel.objects.Bridge;
        
        // 这里绑定窗口的标题变化信号（这个信号是由QWidget内部的）
        Bridge.windowTitleChanged.connect(function(title) {
            showLog("标题被修改为：" + title);
        });
        
        // 绑定自定义的信号customSignal
        Bridge.customSignal.connect(function(text) {
           showLog("收到自定义信号内容：" + text);
        });
    }
);
```

## 代码

https://github.com/PyQt5/PyQt/blob/master/QWebEngineView/JsSignals.py

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Created on 2019年4月27日
@author: Irony
@site: https://pyqt5.com https://github.com/892768447
@email: 892768447@qq.com
@file: QWebEngineView.JsSignals
@description: 
"""
import os
from time import time

from PyQt5.QtCore import QUrl, pyqtSlot, pyqtSignal
from PyQt5.QtWebChannel import QWebChannel
from PyQt5.QtWebEngineWidgets import QWebEngineView, QWebEngineSettings
from PyQt5.QtWidgets import QMessageBox, QWidget, QVBoxLayout, QPushButton


__Author__ = 'Irony'
__Copyright__ = 'Copyright (c) 2019'


class WebEngineView(QWebEngineView):

    customSignal = pyqtSignal(str)

    def __init__(self, *args, **kwargs):
        super(WebEngineView, self).__init__(*args, **kwargs)
        self.channel = QWebChannel(self)
        # 把自身对象传递进去
        self.channel.registerObject('Bridge', self)
        # 设置交互接口
        self.page().setWebChannel(self.channel)

        # START #####以下代码可能是在5.6 QWebEngineView刚出来时的bug,必须在每次加载页面的时候手动注入
        #### 也有可能是跳转页面后就失效了，需要手动注入，有没有修复具体未测试

#         self.page().loadStarted.connect(self.onLoadStart)
#         self._script = open('Data/qwebchannel.js', 'rb').read().decode()

#     def onLoadStart(self):
#         self.page().runJavaScript(self._script)

        # END ###########################

    # 注意pyqtSlot用于把该函数暴露给js可以调用
    @pyqtSlot(str)
    def callFromJs(self, text):
        QMessageBox.information(self, "提示", "来自js调用：{}".format(text))

    def sendCustomSignal(self):
        # 发送自定义信号
        self.customSignal.emit('当前时间: ' + str(time()))

    @pyqtSlot(str)
    @pyqtSlot(QUrl)
    def load(self, url):
        '''
        eg: load("https://pyqt5.com")
        :param url: 网址
        '''
        return super(WebEngineView, self).load(QUrl(url))


class Window(QWidget):

    def __init__(self, *args, **kwargs):
        super(Window, self).__init__(*args, **kwargs)
        layout = QVBoxLayout(self)
        self.webview = WebEngineView(self)
        layout.addWidget(self.webview)
        layout.addWidget(QPushButton(
            '发送自定义信号', self, clicked=self.webview.sendCustomSignal))

        self.webview.windowTitleChanged.connect(self.setWindowTitle)
        self.webview.load(QUrl.fromLocalFile(
            os.path.abspath('Data/JsSignals.html')))


if __name__ == "__main__":
    from PyQt5.QtWidgets import QApplication
    import sys
    # 开启F12 控制台功能，需要单独通过浏览器打开这个页面
    # 这里可以做个保护, 发布软件,启动时把这个环境变量删掉。防止他人通过环境变量开启
    os.environ['QTWEBENGINE_REMOTE_DEBUGGING'] = '9966'
    app = QApplication(sys.argv)
    w = Window()
    w.show()
    w.move(100, 100)

    # 打开调试页面
    dw = QWebEngineView()
    dw.setWindowTitle('开发人员工具')
    dw.load(QUrl('http://127.0.0.1:9966'))
    dw.move(600, 100)
    dw.show()
    sys.exit(app.exec_())
```


## 效果图

![JsSignals](https://github.com/PyQt5/PyQt/raw/master/QWebEngineView/ScreenShot/JsSignals.gif)