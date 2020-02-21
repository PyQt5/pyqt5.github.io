---
author: 人间白头　
title: python 状态机模块 　
date: 2019-7-17 17:03:33
top: 1
tags:
 - Python
 - python 状态机
 
categories: 随笔
---

用状态来取代if...else判断。

<!-- more -->

GUI涉及到挺多的状态改变 , 以前一直用 if...else 来判断 , 最近读了设计模式 ,发现有个状态模式 , 随后发现了状态机这个东西 .

python的状态机模块挺多的 , 不过好像很多都不更新了.
推荐2个状态机模块 , 但是也没有太深入的使用经验 , 就跑跑例子 , 以后有更详细的pyqt例子再补上 .

1: `pip install python-statemachine`

官方例子 : [https://github.com/fgmacedo/python-statemachine](https://github.com/fgmacedo/python-statemachine)

2.`pip install state_machine`

官方例子 : [https://github.com/jtushman/state_machine](https://github.com/jtushman/state_machine)

1的 最近一次更新在6个月以前 , 使用`类继承`和`mixin`方式 , 不过有些地方不如2个人性化;

2的设计更人性化一些 , 包括状态改变`before`和 `after` , 不过由于是装饰器实现的动态增加属性 , 有些地方编辑器智能提示可能就靠不上了.

两者实现实现方式不一样 , 有兴趣可以读读源码 .

3. qt内置状态机框架

https://blog.csdn.net/amnes1a/article/details/62418196

https://blog.csdn.net/dongfenghuojian/article/details/78187131

http://blog.sina.com.cn/s/articlelist_3284623693_0_1.html (系列教程)    
