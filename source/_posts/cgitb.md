---
author: Irony
title: 异常捕获之cgitb模块
date: 2018-09-17 23:17:06
top: 1
tags: 
 - Python
 - 异常
categories: 笔记
---

`cgitb`模块为`Python`脚本提供了一个特殊的异常管理器。名字有点误导人，它最初设计是为了以HTML格式展示cgi脚本的大量异常信息。后来，他扩展为也可以展示纯文本信息。该模块激活后，如果发生了未捕获的异常，将会展示格式化的输出报告。该报告包括源代码每一层的回溯，以及当前执行程序的参数和局部变量。以及，你可以选择将这些信息存到一个文件里，而不是发送到浏览器。
<!-- more -->

## 用途

当编辑器中无法显示错误信息时，尤其是`PyQt`，可以尝试在cmd中运行代码，或者使用此模块来得到错误信息。

## 介绍

### cgitb.enable

```python
cgitb.enable(display=1, logdir=None, context=5, format="html")
```

参数说明

1. display 1，发送至浏览器；0， 不发送
2. logdir 如果有的话，写到该目录下
3. context 显示错误代码周围的代码行数
4. format 是否显示为HTML，除了'html'之外的所有值，都会显示为纯文本

### cgitb.handle

```python
cgitb.handle(info=None)
```

参数说明

1. 如果你想用cgitb处理异常，你可以调用这个函数。
2. info 应当是含有异常类型、异常值和traceback对象的三元组
3. 如同sys.exc_info()返回的那样。如果不提供info，则从sys.exc_info中获取。

## 如何使用

以下代码放在最开始执行

```python
import cgitb
import sys
sys.excepthook = cgitb.Hook(1, None, 5, sys.stderr, 'text')
```
