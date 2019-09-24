---
author: 人间白头　
title: 像读文章一样读源码
date: 2019-07-07 01:37:22
top: 1
tags:
 - Python
 - debug
 - snoop
categories: 随笔
---

使用snoop, 像读文章一样读源码。

<!-- more -->

不得不说 开源项目没有一个提纲 ， 看起来太操蛋了。问了作者， 作者说 ， 你运行下主函数， 然后慢慢跟 。。。
![image.png](https://upload-images.jianshu.io/upload_images/10769157-b274b7acaecf49bc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

没有目的地概览 ， 不知不觉就追究到细节里面去了。

![image.png](https://upload-images.jianshu.io/upload_images/10769157-1304cc87fcd42cae.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

所以这一篇文章的目地就是 ， 如何在没有提纲的情况下 ， 能更好的只关注流程 ， 而不是细节 。 

开始 ： 
1. python DEBUG 模块介绍 : 
　前段时间看过挺多文章提到pysoonper这个调试模块 , 有兴趣的可以百度一下.
个人尝试了一下 , 篇幅过大的DEBUG不适合用 pysoonper , 因为没有缩进 !
　这几天偶然遇到一个二次封装的模块[snoop]([https://github.com/alexmojaki/snoop](https://github.com/alexmojaki/snoop)
), 完美地解决了这个问题.
2. 操作步骤 : 

- 1 .  在`eric6.py`的`main()`函数上加snoop装饰器;
![image.png](https://upload-images.jianshu.io/upload_images/10769157-74129f6a6c303b25.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
- 2 . 用vscode 打开 `eric6start_.log`  文件 (8层深度log文件34W行, pycharm对大文件支持很差);
![log文件](https://upload-images.jianshu.io/upload_images/10769157-ae946c117a082c24.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

发现可以折叠 ， 但是最大可折叠等级只到5级 ， 而且无法对对应等级折叠 ， 有点遗憾 。也许是.log格式选得不太好， 不知道是否有更好的后缀格式。
- 3 . vscode配置log文件关键字高亮；
安装高亮插件
![image.png](https://upload-images.jianshu.io/upload_images/10769157-8f6fee2356d7071d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
配置高亮关键字 
![image.png](https://upload-images.jianshu.io/upload_images/10769157-a135fd015409b3da.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

将`call` 和`return` 给加进去.

- 4 .增加阶段关键字；

![eric6启动阶段](https://upload-images.jianshu.io/upload_images/10769157-c39d01a02149e808.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![image.png](https://upload-images.jianshu.io/upload_images/10769157-aef5704c36824dcc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

加`#000` 是为了方便搜索 。
需要自己手动折叠 。
可以发现 每个`splash.showMessage()` 都是一个阶段 ， 展开折叠之后就是每个阶段具体执行细节 。 

---

### ps: vscode 阅读log文件还是有一些不方便的地方 , 除了在2.中提到的, 还有包括关闭文件再打开, 折叠状态不会保留 , 有其他更好的方式 请留言告诉我 , 谢谢.
