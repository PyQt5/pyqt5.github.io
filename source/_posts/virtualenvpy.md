---
author: 人间白头　
title: python 拷贝虚拟环境(一) 　
date: 2019-05-02 15:21:01
top: 1
tags:
 - Python
 - virtualenvwrapper
 - virtualenv
categories: 随笔
---

通常来说 ,  刚开始使用python的时候都是把包装到全局路径 , 随着各个项目安装的包越来越多 , 之后每开始一个项目 , pycharm创建索引的时间都越来越漫长 , 所以不可避免得开始使用虚拟环境。
经过一番了解 ，虚拟环境的优点有这些：
- 改善 pycharm 索引时间;
- 各个项目的库不会冲突；
- 理论上虚拟环境可以给同版本的操作系统使用(未试验过);
- pip freeze > requestment.txt 导出的依赖清晰;
- 各个版本的python共存;
- ...
<!-- more -->

python虚拟环境库除了自带的venv , 还有三方库`virtualenv` , 此外 在`virtualenv`基础上又开发了`virtualenvwrapper(virtualenvwrapper_win)` 来管理

本文基于`virtualenvwrapper` 创建的虚拟环境来讲解.

    以下是收集的一些virtualenvwrapper配置教程:
    # linux平台
    https://www.cnblogs.com/netfoxman/p/5994697.html
    # window平台
    https://blog.csdn.net/shaququ/article/details/54292043  　
    https://blog.csdn.net/iaau0908/article/details/54021518
虚拟环境创建多了我们就会发现 ,
有时候使用相同版本的环境,一些常用的库是需要重新安装的, 
那么能不能创建一个基础环境, 默认拥有这些库, 然后在这个基础环境上继续安装三方库呢 ?

本文经过试验发现是可行的:

1. 创建基础虚拟环境 `mkvirtualenv <环境名称> [-p空格python其他版本的解释器路径]`.  例如 `mkvirtualenv py34 -p c:\Python34\python.exe`

2. 切换到虚拟环境`workon py34` , 然后安装一下三方库, 然后复制`py34`这个文件夹备份一下 ;
3. 接着复制这个`py34`文件夹, 把复制后的文件夹改名为我们需要需要的文件夹例如`new34`
4. 进入`new34文件夹`, 用任意编辑器全路径搜索`py34`(替换虚拟环境的路径)
5. 删除`new34/Scripts`下的`pip.exe, pip3.exe, pip3.x.exe, easy_install.exe`(因为安装路径硬编码到这里面了, 改不了, 需要重新安装)
6. https://blog.csdn.net/douniwan007009/article/details/81463958 按方式二 , 源码安装 `setuptools` 后再用`easy_install pip` 安装pip后 , 完成 ;
 如果有问题, 就继续按照方式一的源码安装pip;
7. 在`new34`环境下 用`pip show 三方库` 来看一些库的位置, 确保正确.

   
