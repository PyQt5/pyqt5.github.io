---
author: 不许人间见白头
title: python 在类里使用进程池
date: 2018-11-16 21:37:31
top: 1
tags: 
 - 进程
categories: 笔记
---

1. 首先， 进程池的作用就是减少进程的创建和释放 开销的， 所以在类中作为局部变量是不合适的; 
2. 其次， 进程池必须在`if __name__ == "__main__" `里 ，否则会报 frozen_ 什么什么的错误;（这一点可能解释有误）;
<!-- more -->

3. 然后， 线程池的`apply_async`中如果传入`self.xxx`方法，会报`multiprocessing.Pool pickling error`什么的错误， 具体解释见https://blog.csdn.net/dutsoft/article/details/70336462， 里面有解决方法，但是我没有成功（最开始测试没有现在理解的透彻， 不过应该是可以的）; 由于第1点 不合理， 所以有什么办法在类 函数中获取 进程池对象po的地址： 

![processinclass1](/images/processinclass1.png)

我的解决思路和方法是: 
1. 通过globals() 取得全局变量 ， 测试证明 ：不同文件的`globals()`是不同的： 如`Tab2.py `的 `globals()` 和` main_extra_func_file.py`中的 `globals() `是不同的 ， 所以 这样在`Tab2.py`中取不到po对象； 
2. 通过`__main__.po` 来获取 （为什么会想到这个呢， 因为有时候导包 import .xxx 和import xxx 会报 `__main__` 没有什么属性什么的）：

```python
def getPoolObject():
# po 的名字在main函数中定义
# __main__ 模块在sys.modules 的键是"__mp_main__"
    return sys.modules["__mp_main__"].po
```

ps : (图没截好 ， `rglob_worker` 是外部函数 ， 非类内函数 ，po = getPoolBojcet() 这一行是类内函数 ，红色箭头 2. 在的那条白色分割线 是2个函数。 ) 

![processinclass2](/images/processinclass2.png)

`len(po._cache) == 1` : po._cache 是当前有任务的进程数， ==1表示所有任务结束; 利用回调 ， 可以更轻松地进行进程通信。