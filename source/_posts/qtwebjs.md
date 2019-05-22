---
author: Irony
title: QtWebkit和QWebEngineView与Javascript交互
date: 2019-05-22 11:30:36
top: 1
tags: 
 - PyQt
 - QWebView
 - QWebEngineView
 - 浏览器
categories: 例子
---

以前还是`QWebView`的时候和`Javascript`交互起来很方便，但是到了Qt5.6以后改用了`QWebEngineView`，并通过其提供的`qwebchannel.js`来进行交互。可能是由于刚出来的原因，这玩意儿有个bug就是必须在每次加载页面的时候手动注入，跳转页面后就失效了，需要手动注入，目前有没有修复具体未测试。这里对`QWebView`和`QWebEngineView`与Js交互都做了一个示例。
<!-- more -->

## 说明

1. 针对`QWebView`通过`QWebFrame`的`addToJavaScriptWindowObject`把对象传递到`Javascript`中
2. 针对`QWebEngineView`通过`QWebChannel.registerObject('Bridge', QObject)`把对象传递到`Javascript`中
3. 可以通过`@pyqtSlot`装饰器来申明该方法可以暴露给`Javascript`调用

```python
@pyqtSlot(str)
def callFromJs(self, text):
    QMessageBox.information(self, "提示", "来自js调用：{}".format(text))
```

4. 针对`QWebView`在`Javascript`中获取该对象，可以通过该对象对窗口属性以及信号和暴露出的方法进行调用

```javascript
// 这里绑定窗口的标题变化信号（这个信号是由QWidget内部的）
Bridge.windowTitleChanged.connect({fun: function(title) {
    showLog("标题被修改为：" + title);
}}, "fun");

// 绑定自定义的信号customSignal
Bridge.customSignal.connect({fun: function(text) {
    showLog("收到自定义信号内容：" + text);
}}, "fun");
```

5. 针对`QWebEngineView`在`Javascript`中获取该对象，可以通过该对象对窗口属性以及信号和暴露出的方法进行调用

```javascript
new QWebChannel(qt.webChannelTransport,
    function(channel) {
        window.Bridge = channel.objects.Bridge;
        
        // 这里绑定窗口的标题变化信号（这个信号是由QWidget内部的）
        Bridge.windowTitleChanged.connect(function(title) {
            showLog("标题被修改为：" + title);
        });
        
        // 绑定自定义的信号customSignal
        Bridge.customSignal.connect(function(text) {
           showLog("收到自定义信号内容：" + text);
        });
    }
);
```

## 代码

`QWebView`： https://github.com/PyQt5/PyQt/blob/master/QWebView/JsSignals.py

`QWebEngineView`： https://github.com/PyQt5/PyQt/blob/master/QWebEngineView/JsSignals.py

1. 针对`QWebView`的核心实现

```python
class WebView(QWebView):

    customSignal = pyqtSignal(str)

    def __init__(self, *args, **kwargs):
        super(WebView, self).__init__(*args, **kwargs)
        self.initSettings()
        # 暴露接口对象
        self.page().mainFrame().javaScriptWindowObjectCleared.connect(self._exposeInterface)

    def _exposeInterface(self):
        """向Js暴露调用本地方法接口
        """
        self.page().mainFrame().addToJavaScriptWindowObject('Bridge', self)

    # 注意pyqtSlot用于把该函数暴露给js可以调用
    @pyqtSlot(str)
    def callFromJs(self, text):
        QMessageBox.information(self, "提示", "来自js调用：{}".format(text))

    def sendCustomSignal(self):
        # 发送自定义信号
        self.customSignal.emit('当前时间: ' + str(time()))
```

2. 针对`QWebEngineView`的核心实现

```python
class WebEngineView(QWebEngineView):

    customSignal = pyqtSignal(str)

    def __init__(self, *args, **kwargs):
        super(WebEngineView, self).__init__(*args, **kwargs)
        self.channel = QWebChannel(self)
        # 把自身对象传递进去
        self.channel.registerObject('Bridge', self)
        # 设置交互接口
        self.page().setWebChannel(self.channel)

    # 注意pyqtSlot用于把该函数暴露给js可以调用
    @pyqtSlot(str)
    def callFromJs(self, text):
        QMessageBox.information(self, "提示", "来自js调用：{}".format(text))

    def sendCustomSignal(self):
        # 发送自定义信号
        self.customSignal.emit('当前时间: ' + str(time()))
```


## 效果图

![JsSignals](https://github.com/PyQt5/PyQt/raw/master/QWebEngineView/ScreenShot/JsSignals.gif)