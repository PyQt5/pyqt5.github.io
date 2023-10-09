---
author: Irony
title: 如何查阅Qt文档
date: 2019-05-04 20:50:20
tags: 
 - PyQt
categories: 笔记
---

很多网友在问有没有PyQt5的文档之类的问题，在PyQt4的时候PyQt官网有了英文版的文档，随后有网友翻译成了中文。不过现在PyQt5官方的文档都指向了C++的Qt文档，其实C++的Qt API文档结构很清晰，翻阅很容易的，需要注意几点。
<!-- more -->

作为一个开发人员确实需要具备查阅文档、查询资料等基础技能，会为自己的开发带来很大的帮助，要善于搜索，通过不同的方式去搜索才能找到自己需要的东西。

拿Qt C++文档来说，官网地址是：https://doc.qt.io/qt-5/qtwidgets-module.html 这里面记录了所有控件的详细函数文档。

比如拿 输入框 `QLineEdit` 来说，怎么去查询它的用法和信号槽等资料？

https://doc.qt.io/qt-5/qlineedit.html

## 左侧目录

在文档左侧目录中有如下几个：

Properties - 控件里的属性（比如宽高等,通常需要当作函数调用）

Public Slots - 这个是控件自己的槽函数（当作普通函数就行）

Signals - 这个是输入框的包含的信号

Public Functions、Reimplemented Public Functions、Static Public Members、Protected Functions、Reimplemented Protected Functions - 这几个都是函数列表

![howtoviewapi1](/images/howtoviewapi1.png)

## 类说明

![howtoviewapi2](/images/howtoviewapi2.png)

这里有两个注意点

1. 红色方框内的表示该控件（输入框）继承于`QWidget`，所以该控件（输入框）拥有父类的所有方法和信号，当当前文档找不到相关资料和函数时，可以去父类找找看。
2. 紫色方框内表示列举所有的方法（包括父类）

## 函数列表

![howtoviewapi3](/images/howtoviewapi3.png)

这里列举的就是该控件（输入框）的函数，同理点击上面的紫色方框是查看所有方法，一般这里主要用来查询你需要的功能函数，Qt的函数名比较容易理解，比如：只读ReadOnly，选择文字：setSelection。

所以再查下这部分资料的时候建议在浏览器中Ctrl + F打开浏览器的搜索框，并输入英文关键词来检索你所需要的函数在哪里。

![howtoviewapi8](/images/howtoviewapi8.png)

## 槽函数

![howtoviewapi4](/images/howtoviewapi4.png)

这部分列举的是槽函数，其实在PyQt中槽函数可以当作普通的函数。普通的函数也可以作为槽函数，直接通过信号连接即可，注意方框所示，还有很多函数是在父类里面。

## 信号

![howtoviewapi5](/images/howtoviewapi5.png)

这部分列举了该控件（输入框）所定义的信号，主要还是看名字，大多都能知道是做什么的，比如：

1. editingFinished - 编辑完成信号
2. returnPressed - 回车键信号
3. textChanged(const QString &text) - 内容改变信号

这里还有个问题就是参数问题，一般&后面的text作为参数传递到槽函数中

## 函数详细说明

当不明确这个函数是做什么的，可以点击该函数跳转到下面的说明，比如回车键信号`returnPressed`

![howtoviewapi6](/images/howtoviewapi6.png)

如图上所示，用翻译插件翻译，大部分就明白了，如下：

![howtoviewapi7](/images/howtoviewapi7.png)

## 关于如何搜索资料

比如当你要搜索输入框内容改变事件，一般建议两种搜索，且搜索的时候用空格把关键词分开搜索，而且直接用控件名

1. 中文搜索引擎：QLineEdit 内容 改变
2. 英文搜索引擎：QLineEdit text change
