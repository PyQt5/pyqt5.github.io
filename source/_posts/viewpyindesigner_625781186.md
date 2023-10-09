---
author: 不许人间见白头
title: 如何和设计师中查看ui转换的py代码
date: 2019-04-30 13:11:09
tags: 
 - PyQt
 - Designer
 - 设计师
categories: 教程
---

通过 设计师  查看ui转换的py代码

当初我刚学pyqt的时候 , 也有很多疑惑 , 用什么属性把控件加到布局 , 改了这个属性会发生什么 , 为什么这个会这样, 那个会那样 。。。 。。。

后来就看ui 转成的py代码 , 注释一下 , 什么效果消失了 , 就是那个api引起的 。
<!-- more -->

再来后发现了官方文档 , 查一查函数就行了 .

但是有些api文档找起来麻烦 , 用设计师点几下就行了 , 然后把转换出来的代码拷贝一下就完事了.

可是需要单独把ui转为py文件 , 之后再删除这个文件也是很烦的一件事 .

好 , 话不多说 , 接下来手把手教你如何快速在ui中查看py代码 .

官方也考虑过这种情况 , 所以 设计师中 是有这个功能的 , 但是qt的是没问题的 , pyqt的毕竟是绑定过来的 , 所以正常来说 你点击之后会弹出一个找不到应用程序的提示 .

看到这个东西是不是很眼熟 , 我们用的命令pyuic5 和这个东西应该是一样的 .

![viewpyindesigner1](/images/viewpyindesigner1.jpg)

所以接下来 , 我们找找电脑上有没有这个东西

![viewpyindesigner2](/images/viewpyindesigner2.jpg)

果然在pyqt5-toos文件夹下有这个东西 ,

我们根据第一张图的提示 , 把这个东西拷贝到相应的目录 (如果没有那个bin文件夹, 手动创建),

![viewpyindesigner3](/images/viewpyindesigner3.jpg)

好了 , 大功告成 !
