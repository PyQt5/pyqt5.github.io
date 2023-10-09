---
author: Irony
title: PyQt学习心得
date: 2019-08-26 09:00:00
sticky: 888
tags: 
 - PyQt
categories: 笔记
---

在学习PyQt的过程中由于资料的缺乏或者没有中文导致大多数人感叹资料太少，学习困难，又或者急于求进，赶鸭子上架的情况，此时有系统的学习方法很重要。每个人都需要有自己的学习方法，别人的学习方法并不一定适合自己但可以采纳一些。笔者在这里列举了一些当初自己自学的一些心得和方法，希望帮助大家建立一套自己的学习PyQt的方法，提高自身的学习能力。
<!-- more -->

## Python基础

在学习和使用PyQt之前需要熟练使用Python，经过对QQ群里经常提问的问题的分析，发现大部分人对Python中的基础知识掌握不牢固导致很多基础问题，如果要想更好的使用Python以及它的扩展必需要进行系统的学习。这里列举一下常用的知识点。

1. 类　　　　　　　 　[参考资料](https://www.runoob.com/python3/python3-class.html)
2. 类的继承
3. 类的多继承
4. 类方法重写　　　　 [参考资料](https://www.runoob.com/w3cnote/python-extends-init.html)
5. 类中的super函数　　[参考资料](https://www.runoob.com/python/python-func-super.html)
6. 函数调用/参数类型
7. 对象调用(参考第1点)

必须熟练掌握上面的知识点后入门PyQt才比较容易，如果初学者对上面的知识点还不是很了解，本文不适合继续往下阅读。

## 设计师

Qt 设计师除了方便快速设计一些简单的界面外，其实笔者觉得更大的作用在于帮助用户熟悉各类控件、属性、信号等

1. 这里建议初学者不要急于求成，打开设计师新建一个`Widget`的窗口，比如

![desiger_create](/images/studynotes/desiger_create.png)

2. 然后把左侧的所有控件挨个拖动到中间的窗口中，比如这里拖动一个**Push Button**按钮

![desiger_drag](/images/studynotes/desiger_drag.png)

3. 在设计师右下角的属性编辑器中列举了该控件的所有父类，意味着可以调用和重写父类的所有方法，建议初学者把这个属性编辑器的所有属性挨个调整看看效果，部分控件可能需要**Ctrl+R**预览界面才能看到，同时像**QListWidget，QTreeWidget，QTableWidget**等某些控件需要在控件上右键增加数据才可以

![desiger_property](/images/studynotes/desiger_property.png)
![desiger_property2](/images/studynotes/desiger_property2.png)

4. 两个控件之间简单的信号槽关联可以通过设计师快速的设置

![desiger_signal](/images/studynotes/desiger_signal.png)
![desiger_signal2](/images/studynotes/desiger_signal2.png)

5. 提高进阶的方法，当你需要手动写代码实现界面的时候，不妨把UI文件转出PY文件，看看是如何构造的（这里涉及到布局等知识见后文）

## 布局

Qt界面提供了方便的4种基本布局，**QVboxLayout，QHboxLayout，QFormLayout，QGridLayout**，初学者需要数量掌握这4种布局外加2种拉伸器（占位挤压）

首先需要知道Qt界面的中控件的层级顺序以及parent，parent的作用既作为子控件的父元素也可以自动管理Qt的对象（具体可以搜索下关于 Qt parent的资料）

1. 在没有布局的情况下，在设计师中拖动摆放的控件是一层一层的叠加覆盖，此时每个添加的子控件的parent都是最外层的控件

![desiger_stack](/images/studynotes/desiger_stack.png)

2. 如果需要界面中的控件自动适应高度宽度，此时则需要使用4种布局来包裹里面的子控件，注意的是：布局不是控件不能设置高度宽度和样式等，是一个抽象的东西，就好比是一根橡皮筋包裹几个矩形的物品；布局也可以设置一些属性（在设计师属性编辑器中），比如设置两者直接的间距，设置距离上下左右的间距，设置比例等

![desiger_layout](/images/studynotes/desiger_layout.png)

3. 在没有布局或者有布局的时候。可以添加容器控件（**QWidget，QFrame，QGroupBox，QScrollArea，QToolBox，QTabWidget，QStackedWidget，QMidArea，QDockWidget**）这些容器可以放置子控件，从而循环嵌套。

## 例子

在PyQt5.5的时候自带了一个例子文件夹（后面的版本没有的话可以下载PyQt5源码，里面有个examples文件夹），想要熟练的掌握PyQt还需要从自带的例子中学习，必须要每个例子都运行一次然后看看这个例子实现了什么，这样才能记忆深刻。
同时很多开发者在[https://github.com/PyQt5/PyQt](https://github.com/PyQt5/PyQt)分享了各类进阶例子，同时也欢迎大家共同完善该项目，提供更多更好的例子。另外也可以下载该项目的客户端[PyQtClient](https://github.com/PyQt5/PyQtClient/releases)软件，支持运行其中的例子

建议在更深入的学习PyQt之前多看看一些例子。

## 文档

接下来要说的就是Qt的api文档，[官网文档](https://doc.qt.io/qt-5/classes.html)，这里其实不要害怕是英文就不想看，觉得看不懂了，其实官网的文档还是比较简洁的，而且函数名也比较直观就能知道意思。也可以用谷歌浏览器打开右键翻译，基本上都能看懂。笔者前期写过一篇[如何查阅Qt文档](/viewapi.html)的文档可以阅读学习一番。

这里就拿[QWebEngineView](https://doc.qt.io/qt-5/qwebengineview.html)举一个例子，首先初学者在使用这个浏览器控件时候，会有诸多的问题比如：Cookie，拦截器等就不知道如何去调用函数来设置

1. 首先打开官网文档 [https://doc.qt.io/qt-5/qwebengineview.html](https://doc.qt.io/qt-5/qwebengineview.html)，可以看到只有少量的函数可以调用，寻找一番并没有发现和Cookie相关的东西，这个时候就需要把重点放在有特俗返回值的函数上，比如：
```c++
QWebEngineHistory *	          history() const
QWebEnginePage *	          page() const
QWebEngineSettings *	      settings() const
```

这三个函数返回了一个类实例，就意味着可以调用其中的方法。

2. 点击**page()**打开 [https://doc.qt.io/qt-5/qwebenginepage.html](https://doc.qt.io/qt-5/qwebenginepage.html)，发现没有cookie相关的东西，只有**QWebEngineProfile *	profile() const**这个函数比较可疑。

3. 点击**profile()**打开 [https://doc.qt.io/qt-5/qwebengineprofile.html](https://doc.qt.io/qt-5/qwebengineprofile.html)，在浏览器中搜索`cookie`发现这个类中包含大量和cookie相关的东西，比如：**QWebEngineCookieStore *	cookieStore()`**从名字上可以猜测大概意思为cookie储存

4. 点击**cookieStore()**打开 [https://doc.qt.io/qt-5/qwebenginecookiestore.html](https://doc.qt.io/qt-5/qwebenginecookiestore.html)，此时就会发现这个类里面包含了删除和设置cookie的方法。

5. 但是找到了这些方法后，面对初学者又一个问题来了，该如何去用？根据上面4点整理一下，把他们当做简单的Python对象，方法和操作方法和class一样的。

```python
self.webview = QWebEngineView()
# 得到page
page = self.webview.page()
# 得到profile
profile = page.profile()
# 得到cookieStore
cookieStore = profile.cookieStore()
# 清空cookie
cookieStore.deleteAllCookies()

# 用简短代码来表达就是
cookieStore = self.webview.page().profile().cookieStore()
cookieStore.deleteAllCookies()
```

## 异常调试

可能有时候由于粗心，或者调用了一些非法函数，参数错误等会导致程序出现一些异常，首先第一步复制最后一行的错误去百度或者谷歌搜索，大多时候能找到问题所在。其次如果搜索不到或者自己的异常可能是由于某个变量的值不对引起的，就需要在编辑器中打断点使用DEBUG模式调试变量值（如果不会可以采用麻烦一点的办法：用`print`打印出变量值）

遇到问题后首先需要自己多调试排查问题，不要一遇到问题就去问，自己多尝试一个一个排查直到找到问题所在并解决，这也是一种提高自身能力的地方。

## 检索资料

作为一个开发人员确实需要具备查阅文档、查询资料等基础技能，会为自己的开发带来很大的帮助，要善于搜索，通过不同的方式去搜索才能找到自己需要的东西。信息检索是每个程序猿必备的能力之一，其好处在于可以更快更准确的在茫茫网络海洋中找到自己所需要的东西，这个过程需要长期不断积累和练习。

1. 中文搜索引擎：采用多个关键词 以空格分开搜索，如：PyQt 拖拽
2. 英文搜索引擎：采用多个关键词 以空格分开搜索，如：PyQt Drag Drop

## 片尾

好了，笔者基本上的学习过程就整理如上，这并不是说每个人都适合这样的方法，但至少笔者是这样一步一步走过来的。当你养成了一个学习、发现和解决问题的好习惯时就会慢慢得心应手。