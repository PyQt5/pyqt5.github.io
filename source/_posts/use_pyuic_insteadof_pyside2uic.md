---
author: 人间白头　
title: 修改pyuic代替pyside2-uic.
date: 2019-12-26 19:49:41
tags:
 - PyQt5 PySide2
 
categories: 随笔
---

修改pyuic代替pyside2-uic

<!-- more -->
修改pyuic代替pyside2-uic.

最近看到挺多人用pyside2的uic编译ui文件有问题 . 
写个解决办法.

首先 , 
`pip install qtpy` , 
这个是兼容pyqt5和pyside2的 , 无缝转换 .

然后 , 
修改 pyqt5 的 uic ,

![image.png](https://upload-images.jianshu.io/upload_images/10769157-2ed1053f322c26a6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

最后用pyuic5 , 生成Ui_XXX.py文件 .
