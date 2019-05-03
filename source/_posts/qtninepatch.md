---
author: Irony
title: PyQt5显示.9格式的PNG图片
date: 2018-10-26 10:00:08
top: 1
tags: 
 - PyQt
 - 图片
 - 气泡
 - .9png
categories: 例子
---

做过安卓开发的和使用过QQ的都知道`.9.png`这种图片格式，效果就如QQ的聊天气泡一样可以拉伸，这种格式的图片允许开发人员定义可扩展区域，当需要延伸图片以填充比图片本身更大区域时，可扩展区的内容被延展；允许开发人员定义内容显示区，用于显示文字或其他内容。目前在`Github`上有两个C++版本的，在这里我把它们都用Python实现了一遍。另外一个我也为`PyQt`提供了编译好的pyd文件。
<!-- more -->

## C++版本

在Github开源库中搜索到两个C++版本的

1. 一个是 [NinePatchQt](https://github.com/Roninsc2/NinePatchQt)
2. 一个是 [QtNinePatch](https://github.com/soramimi/QtNinePatch)

## PyQt5版本

这里也分为两个版本，都是基于上面的C++源码翻译改写过来的，具体的例子见项目里面的测试代码吧。

1. [QtNinePatch](https://github.com/PyQt5/PyQt/blob/master/QLabel/QtNinePatch.py)是参考第一个源码编写，用法是在`paintEvent`中调用
2. [QtNinePatch2](https://github.com/PyQt5/PyQt/blob/master/QLabel/QtNinePatch2.py)是参考第二个源码编写，用法是`pixmap = QtNinePatch.createPixmapFromNinePatchImage(self.image, self.width(), self.height())`直接得到一个处理好的`QPixmap`对象来使用

## 说明

1. 建议优先使用pyd版本的（后续提供Python3.4 3.5 3.6 3.7 编译好的32为库文件），也可以自行编译，编译步骤见下文。
2. 其次可以使用纯python版本2的（个人觉得方便调用）
3. 最后再考虑纯python版本1的吧
4. 以上为个人意见，两个C++版本的写法不一样，但是核心算法应该是类似的。

## 自行编译

1. 首先要安装好Qt、PyQt5、编译安装对应的sip、对应的VC++编译工具
2. 用Qt Creator 打开pro文件进行编译
3. 进入源码中的sip文件夹修改configure.py文件
```
# 这里是你的VC版本和对应的Qt目录中的文件夹
config.platform = "win32-msvc2010"
qt_path = 'D:/soft/Qt/Qt5.5.1/5.5/msvc2010'
```
4. 最后执行python configure.py来编译

## 下载

https://github.com/PyQt5/PyQt/tree/master/QLabel

## 效果图

![NinePatchImage](https://github.com/PyQt5/PyQt/raw/master/QLabel/ScreenShot/NinePatchImage.gif)

