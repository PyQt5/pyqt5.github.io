---
author: 不许人间见白头
title: QRunnable线程池发信号
date: 2019-04-30 15:58:09
top: 1
tags: 
 - PyQt
 - 信号
 - 线程
categories: 教程
---

因为只有继承`QObject`的类才能有信号和自定义信号，而`QRunnable`并不是继承自`QObject`，也不能用多继承的方式，这里考虑定义个全局的QObject变量用来存放一些定义好的可复用的信号。
<!-- more -->

pools 是 `QThreadPool` 实例

## 看图说话

1. ![runnablesignal1](/images/runnablesignal1.png)
2. 定义一个全局信号类
![runnablesignal2](/images/runnablesignal2.png)
3. 在QRunnable 中发送
![runnablesignal3](/images/runnablesignal3.png)
