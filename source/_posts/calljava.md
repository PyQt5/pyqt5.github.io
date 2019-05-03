---
author: Irony
title: Python调用Java对Excel截图
date: 2019-03-12 21:15:06
top: 1
tags: 
 - Python
 - 截图
categories: 教程
---

有的时候会遇到一些奇葩的需求，就是用Excel做报表，但是需要对里面的数据进行填充并生成报表图片，发送出去。这里记录用python调用jar包对excel文件进行公式计算和截图，数据填充可以用xlrd或者openpyxl
<!-- more -->

利用`jpype`模块初始化java虚拟机加载jar包然后执行其中的功能。

## 代码

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Created on 2019年3月12日
@author: Irony
@site: https://pyqt5.com https://github.com/892768447
@email: 892768447@qq.com
@file: CallJava
@description: 
"""
import os

import jpype


__Author__ = 'Irony'
__Copyright__ = 'Copyright (c) 2019'


def convertToImage():
    Workbook = jpype.JClass('com.aspose.cells.Workbook')
    ImageFormat = jpype.JClass('com.aspose.cells.ImageFormat')
    ImageOrPrintOptions = jpype.JClass(
        'com.aspose.cells.ImageOrPrintOptions')
    SheetRender = jpype.JClass('com.aspose.cells.SheetRender')

    book = Workbook(os.path.abspath('data/test.xlsx').replace('\\', '/'))
    # 保存为html
    book.save('data/index.html', 12)
    # 保存为pdf
    book.save('data/test.pdf')

    # 截图
    imgOptions = ImageOrPrintOptions()
    # imgOptions.setQuality(100)
    imgOptions.setOnePagePerSheet(True)

    # 输出图片格式
#     imgOptions.setImageFormat(ImageFormat.getJpeg())
    imgOptions.setImageFormat(ImageFormat.getPng())

    # 计算
    CalculationOptions = jpype.JClass(
        'com.aspose.cells.CalculationOptions')
    opt = CalculationOptions()
    # 对Sheet1中的公式进行计算
    sheet = book.getWorksheets().get('Sheet1')
    sheet.calculateFormula(opt, True)

    # 设置区域
    pageSetup = sheet.getPageSetup()
    # 去掉边距
    pageSetup.setBottomMargin(0.)
    pageSetup.setLeftMargin(0.)
    pageSetup.setRightMargin(0.)
    pageSetup.setTopMargin(0.)
    # 设置要截图的区域(对角线)
    pageSetup.setPrintArea('A0:C2')
    # Create a SheetRender object for the target sheet
    sr = SheetRender(sheet, imgOptions)
    for page in range(sr.getPageCount()):
        # Generate an image for the worksheet
        sr.toImage(
            page, os.path.join('data', '%d.png' % (page + 1)))


def test():
    # emm这里不知道什么用绝对路径就报错
    libs = '{};{}'.format(
        'libs/bcprov-jdk16-146.jar',
        'libs/aspose-cells-19.2.jar'
    )
    command = (jpype.getDefaultJVMPath(),
                   '-ea', '-Xmn128m', '-Xms512M', '-Xmx512M',
                   '-Djava.class.path={0}'.format(libs))
    print(command)
    jpype.startJVM(jpype.getDefaultJVMPath(),
                   '-ea', '-Xmn128m', '-Xms512M', '-Xmx512M',
                   '-Djava.class.path={0}'.format(libs)
                   )
    # 解决多线程问题
    jpype.attachThreadToJVM()
    # 对excel截图
    convertToImage()
    # 关闭虚拟机
    jpype.shutdownJVM()
    print('截图完成')


if __name__ == '__main__':
    test()
```

## 附件

[调用java生成报表.7z](/files/调用java生成报表.7z)

解压后进入whls文件夹安装对应版本的jpype包

## 效果图

![calljava](/images/calljava.png)