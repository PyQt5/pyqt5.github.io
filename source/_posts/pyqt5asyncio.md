---
author: Irony
title: PyQt5结合Asyncio异步
date: 2018-10-24 14:32:26
top: 1
tags: 
 - PyQt
 - Asyncio
 - 异步
categories: 例子
---

今天尝试了下[quamash](https://github.com/harvimt/quamash)框架，该框架是一个`PyQt`的异步事件循环封装库，使用Python3+ 的`asyncio`这个异步库。在看了该项目的内容后发现只有一个简单的进度条例子，故尝试用其来下载网络图片并显示。
<!-- more -->

## 安装依赖

1. pip install quamash
2. pip install aiohttp
3. Python3.5+ 和 PyQt5

这里使用`aiohttp`是因为它基于`asyncio`封装的网络操作库，常见的`get`、`post`等方法，不过它只支持Python3.5及以上的版本，主要是它使用了async def 这样的语法。

## 说明

1. 在创建`QApplication`后随即设置替换事件循环`loop`
```python
app = QApplication(sys.argv)
loop = QEventLoop(app)
asyncio.set_event_loop(loop)
w = Window()
```
2. 通过`asyncio.ensure_future(func(), loop=loop)`来执行某个异步函数

## 流程

|           |    |                             |
|:----------|:--:|----------------------------:|
| Window    |  → | initSession（初始化session） |
| ↓         |    |                             |
| 下载按钮   |  → | doDownload（执行_doDownload方法） |
| ↓         |    |                             |
| session.get（下载json数据进行解析） |   |      |
| ↓         |    |                             |
| 添加到界面 |  ← | _doDownloadImage（对单张图片进行下载） |

## 源码

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Created on 2018年10月24日
@author: Irony
@site: https://github.com/892768447
@email: 892768447@qq.com
@file: AsyncioUiClient
@description: 
"""
import asyncio

from PyQt5.QtCore import Qt
from PyQt5.QtGui import QPixmap, QMovie
from PyQt5.QtWidgets import QWidget, QVBoxLayout, QPushButton,\
    QApplication, QListWidget, QListWidgetItem, QLabel, QMessageBox
import aiohttp
from quamash import QEventLoop


__Author__ = """By: Irony
QQ: 892768447
Email: 892768447@qq.com"""
__Copyright__ = "Copyright (c) 2018 Irony"
__Version__ = "Version 1.0"

Url = 'https://www.doutula.com/api/search?keyword=%E6%9C%80%E6%96%B0%E8%A1%A8%E6%83%85&mime=0&page={}'
Headers = {
    ':authority': 'www.doutula.com',
    ':method': 'GET',
    ':scheme': 'https',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'accept-language': 'zh-CN,zh;q=0.9',
    'cache-control': 'max-age=0',
    'dnt': '1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.26 Safari/537.36 Core/1.63.6756.400 QQBrowser/10.2.2498.400'
}


class Window(QWidget):

    def __init__(self, *args, **kwargs):
        super(Window, self).__init__(*args, **kwargs)
        layout = QVBoxLayout(self)
        self.listWidget = QListWidget(self)
        self.listWidget.setSpacing(2)  # item直接的间隔
        # 隐藏横向滚动条
        self.listWidget.setHorizontalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        # 让list 从左到右排列
        self.listWidget.setFlow(self.listWidget.LeftToRight)
        # 自动换行
        self.listWidget.setWrapping(True)
        self.listWidget.setResizeMode(self.listWidget.Adjust)

        self.buttonMsg = QPushButton('弹出提示框', self, clicked=self.showMessage)
        self.buttonDown = QPushButton('下载图片', self, clicked=self.doDownload)
        layout.addWidget(self.listWidget)
        layout.addWidget(self.buttonMsg)
        layout.addWidget(self.buttonDown)
        self.currentPage = 0
        self.initSession()  # 其实没必要，session主要用在需要登录的网站。缓存cookie用

    def initSession(self):
        async def _initSession():
            # 初始化session
            self.session = aiohttp.ClientSession(loop=loop)
            print(self.session)
        asyncio.ensure_future(_initSession(), loop=loop)

    async def _doDownloadImage(self, url):
        # 下载图片并添加到界面
        async with self.session.get(url) as resp:
            data = await resp.read()
            if not data:
                print('下载失败: ', url)
                return
            path = os.path.join('tmp', os.path.basename(url))
            with open(path, 'wb') as fp:
                fp.write(data)
            item = QListWidgetItem(url, self.listWidget)
            image = QPixmap(path)
            item.setSizeHint(image.size())
            label = QLabel(self.listWidget)
            label.setPixmap(image)
            if path.endswith('.gif'):  # 可能是动态图
                label.setMovie(QMovie(path))
            self.listWidget.setItemWidget(item, label)
            self.listWidget.scrollToBottom()

    async def _doDownload(self):
        # 下载工作
        if self.currentPage == -1:
            QMessageBox.information(self, '提示', '已经没有更多了')
            return
        self.currentPage += 1
        url = Url.format(self.currentPage)
        print('get url: ', url)
        async with self.session.get(url, headers=Headers) as resp:
            data = await resp.json()
            if not data:
                return
            data = data.get('data', None)
            if not data:
                self.currentPage = -1
                print('已经是最后一页了')
                return
            # 解析json并生成item添加到界面中
            for entity in data.get('list', []):
                url = entity.get('image_url', None)
                if not url:
                    continue
                await self._doDownloadImage(url)  # 下载图片

    def doDownload(self):
        # 响应按钮点击调用
        asyncio.ensure_future(self._doDownload(), loop=loop)

    def showMessage(self):
        # 显示对话框
        app.aboutQt()

    def closeEvent(self, event):
        if not self.session.closed:
            asyncio.ensure_future(self.session.close(), loop=loop)
        super(Window, self).closeEvent(event)


if __name__ == '__main__':
    import sys
    import cgitb
    import os
    os.makedirs('tmp', exist_ok=True)
    sys.excepthook = cgitb.enable(1, None, 5, 'text')
    app = QApplication(sys.argv)
    loop = QEventLoop(app)
    asyncio.set_event_loop(loop)
    w = Window()
    w.show()
    with loop:
        loop.run_forever()
```

## 效果图

![pyqt5asyncio](/images/pyqt5asyncio.gif)