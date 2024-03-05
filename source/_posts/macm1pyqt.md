---
author: Irony
title: 如何在Mac M1上快速安装PyQt5
date: 2023-10-07 14:08:06
tags: 
 - PyQt
 - Mac
 - M1
categories: 笔记
---

由于官方并没有在M1上编译PyQt导致安装存在一些问题。
M1上的Python不能直接使用x64的 PyQt5。但是M1上可以运行x64的Python。所以通过安装x64的Python然后再安装PyQt5即可。
<!-- more -->

**1. 安装Python**
[python-3.9.13-macosx10.9.pkg](https://www.python.org/ftp/python/3.9.13/python-3.9.13-macosx10.9.pkg)

**2. 勾选自定义同时只勾选安装pip**

![step1.png](/images/macpyqtstep1.png)

![step1.png](/images/macpyqtstep2.png)

**3. 设置pip源**
```shell
/Library/Frameworks/Python.framework/Versions/3.9/bin/pip3 install pqi
/Library/Frameworks/Python.framework/Versions/3.9/bin/pqi use tuna
```

**4. 安装PyQt5**
```shell
/Library/Frameworks/Python.framework/Versions/3.9/bin/pip3 install PyQt5
```

**5. 测试**
```shell
/Library/Frameworks/Python.framework/Versions/3.9/bin/python3
```

![step3.png](/images/macpyqtstep3.png)



📢📢📢

也可以直接安装 [Miniconda](https://docs.anaconda.com/free/miniconda/miniconda-install/)

然后：conda install -c conda-forge pyqt
