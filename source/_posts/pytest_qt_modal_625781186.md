---
author: 人间白头
title: pytest-qt 测试模态窗体.
date: 2020年4月27日22:19:27
top: 1
tags: 
 - pytest-qt
categories: 教程
---

步骤分别是 :

1. 点击 开始扫描 弹出 选择路径窗口 ;

2. 勾选路基 ;

3.点击确定 ;
<!-- more -->

大概想测一下这个界面 :

![image.png](https://upload-images.jianshu.io/upload_images/10769157-c1ed0bd52808c5b8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


步骤分别是 :

1. 点击 开始扫描 弹出 选择路径窗口 ;

2. 勾选路基 ;

3.点击确定 ;

需要测试的函数 :

![image.png](https://upload-images.jianshu.io/upload_images/10769157-b5265859d74b269d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


测试函数 :

![image.png](https://upload-images.jianshu.io/upload_images/10769157-58f4310a54a815ee.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


可以发现断言失败 .

![image.png](https://upload-images.jianshu.io/upload_images/10769157-939c73b5be19c21e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


官方文档 : 测试模态窗体.

[https://pytest-qt.readthedocs.io/en/latest/note_dialogs.html](https://pytest-qt.readthedocs.io/en/latest/note_dialogs.html)

用的是官方的 `monkeypatch` 方式 .

大致意思就是替换 `FileSelectPathDialog` 类的exec函数.
