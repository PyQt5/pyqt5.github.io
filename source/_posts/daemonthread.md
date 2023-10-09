---
author: 丑读书穷加班
title: 多线程之守护线程和阻塞线程
date: 2018-10-24 15:51:15
tags: 
 - Python
 - 线程
categories: 笔记
---

如果你设置一个线程为守护线程，就表示你在说这个线程是不重要的，在进程退出的时候，不用等待这个线程退出。如果你的主线程在退出的时候，不用等待那些子线程完成，那就设置这些线程的daemon属性。
<!-- more -->

即在线程开始（thread.start()）之前，调用setDeamon（）函数，设定线程的daemon标志。

（thread.setDaemon(True)）就表示这个线程“不重要”。

如果你想等待子线程完成再退出，那就什么都不用做，或者显示地调用thread.setDaemon(False)，设置daemon的值为false。新的子线程会继承父线程的daemon标志。

整个Python会在所有的非守护线程退出后才会结束，即进程中没有非守护线程存在的时候才结束。

setDaemon()函数要放在start之前设置才行。

```python
import threading
import time

def func():
    print("子线程开启：", time.localtime())
    time.sleep(2)
    print("子线程结束：", time.localtime())


print("主线程开启：", time.localtime())
t = threading.Thread(target=func, args=())
# t.setDaemon(True)
t.start()
print("主线程关闭：", time.localtime())
```

在 Python 的多线程编程中，在实例代码中经常有 thread1.join()这样的代码。那么今天咱们用实际代码来解释一下 join 函数的作用。

join的原理就是依次检验线程池中的线程是否结束，没有结束就阻塞直到线程结束，如果结束则跳转执行下一个线程的join函数。

先看看这个：

1. 阻塞主进程，专注于执行多线程中的程序。
2. 多线程多join的情况下，依次执行各线程的join方法，前头一个结束了才能执行后面一个。
3. 无参数，则等待到该线程结束，才开始执行下一个线程的join。
4. 参数timeout为线程的阻塞时间，如 timeout=2 就是罩着这个线程2s 以后，就不管他了，继续执行下面的代码。
5. 下面的例子是一次阻塞子线程，每个子线程都会等上个子线程join结束才会执行,如果注释掉t.join则会同时执行5个子线程，多线程在做网络访问的时候可以减少等待时间，那么在一个工作流程中可以将访问网络接口的情况做成多线程。

```python
import threading, time

def func():
    print("hello world!")
    time.sleep(1)

print("hello main start")
for i in range(5):
    t = threading.Thread(target=func, args=())
    print(t.getName())
    t.start()
    t.join()
```