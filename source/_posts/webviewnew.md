---
author: Irony
title: PyQt5编译QWebView与QWebEngineView共存
date: 2019-01-12 19:28:06
top: 1
tags: 
 - PyQt
 - QWebView
 - 浏览器
categories: 教程
---

在PyQt5.5过后移除了`QWebView`控件，改用`QWebEngineView`，但是这个刚开始用起来不是很方便，最近在整理一些例子的时候需要同时使用`QWebView`和`QWebEngineView`，故希望把`QWebView`重新加入到后面的PyQt5版本中，查看PyQt5.10.1的源码发现里面其实是有`QWebView`的，只是因为Qt5.10.1中没有编译好的dll等导致无法编译。
<!-- more -->

## 准备工作

1. 安装VS2015
2. 安装Qt5.10.1
3. 前往 https://github.com/annulen/webkit/releases 下载对应的文件，比如：qtwebkit-5.212.0_alpha2-qt59-msvc2015-x86.zip
4. 下载PyQt5.10.1源码
5. 下载对应版本的sip源码

## 编译

1. 设置环境变量`set PATH=D:\soft\Qt\Qt5.10.1\5.10.1\msvc2015\bin;%PATH%`
2. 首先进入vs2015命令行编译sip并安装，`python configure.py && nmake && nmake install`
3. 进入PyQt5.10.1源码编译安装即可
4. 如果要减少PyQt5.10.1的编译可以试试以下代码

```
D:\soft\Python35\python configure.py --confirm-license --no-designer-plugin --no-qml-plugin --disable=dbus --disable=QAxContainer --disable=QtAndroidExtras --disable=QtBluetooth --disable=QtDBus --disable=QtDesigner --disable=Enginio --disable=QtLocation --disable=QtMacExtras --disable=QtMultimedia --disable=QtMultimediaWidgets --disable=QtNfc --disable=QtSerialPort --disable=QtSql --disable=QtSvg --disable=QtTest --disable=QtWinExtras --disable=QtX11Extras --disable=QtXml --disable=QtXmlPatterns --disable=pylupdate --disable=pyrcc
```