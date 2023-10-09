---
author: Irony
title: 三种方式绑定信号槽
date: 2019-05-04 16:07:06
tags: 
 - PyQt
 - 信号
categories: 教程
---
网上关于PyQt5的信号绑定使用的教程比较上，很多还是以前的绑定方式，导致在PyQt5中无法使用，这里归纳总结下已有的几种绑定信号槽的方式，
这几种方式各有各的优点和缺点。
<!-- more -->

## 方式一

这个方式是最开始接触设计师的时候知道的，主要是通过控件的`objectName`和`QtCore.QMetaObject.connectSlotsByName(Form)`提供的连接函数来自动完成注册，
比如带有按钮的界面ui文件转成py文件后会发现如下代码：
```python
self.pushButton = QtWidgets.QPushButton(Form)
self.pushButton.setGeometry(QtCore.QRect(60, 40, 93, 28))
self.pushButton.setObjectName("pushButton")

# 通过这里自动完成连接信号槽
QtCore.QMetaObject.connectSlotsByName(Form)
```

此时只需要继承该UI文件类然后增加如下方法：
```python

@pyqtSlot()
def on_pushButton_clicked(self):
    print('button clicked')
```

这里解释一下，`@pyqtSlot()`装饰器把函数`on_pushButton_clicked`包装为一个槽函数，
而`QtCore.QMetaObject.connectSlotsByName(Form)`这句代码的意思就是自动去寻找满足的槽函数

<font color=red>注意：这里有个规范（on_xxxx_clicked）</font>，这里必须要满足`on_控件的objectName_控件的信号`这样下划线连接起来的函数名才能被识别，
比如按钮的点击：`on_pushButton_clicked`、勾选框的选中：`on_checkbox_toggled(self, checked)`

## 方式二

这种方式则直接通过代码里调用控件的信号的`connect`方法来进行绑定，比如：
```python
# 按钮点击函数
def doClicked(self):
    print(self.sender(), 'clicked')

# 绑定点击信号
self.pushButton.clicked.connect(self.doClicked)
```

<font color=red>注意：`connect`的是函数名字</font>，`self.sender()`这句代码是获取信号发送者（比如这里就是得到这个按钮对象），
用处在于有时候要循环创建一堆按钮

## 方式三

通过参数这种方式其实比较特殊，在PyQt中大部分存在，但是在PySide中则很少，原因是两者的封装方式不同。

同时该方式用于在纯代码中比较常见，而且需要对该控件有那些信号可以用要很熟习，比如：
```python

# 按钮点击函数
def doClicked(self):
    print(self.sender(), 'clicked')

pushButton = QPushButton('按钮', self, clicked=self.doClicked, minimumHeight=40)
```

这里可以通过参数（信号名字） = 函数来绑定信号

同时也可以设置其它参数，比如
`button.setMinimumHeight(40)`也可以像参数里那样设置`minimumHeight=40`
