---
title: 常见问题
date: 2019-06-20 10:58:20
share: false
---

# 常见问题整理

这里会收集和整理各种常见问题，包括但不限于编辑器问题、编译打包问题、常见犯错。希望大家可以共同来完善此文档，编辑地址：[https://github.com/PyQt5/blog/blob/dev/source/faq/index.md](https://github.com/PyQt5/blog/blob/dev/source/faq/index.md)

## 案例库和提问

有专门的项目收集例子、提交例子、和回答问题，同时也建议大家都在上面多多提问和提交例子，这样可以留下记录方便遇到同样问题的人快速找到答案。

项目地址：[https://github.com/PyQt5/PyQt/issues](https://github.com/PyQt5/PyQt/issues)

如果你想写一写文章来帮助其他人少走弯路，也可以到 [https://github.com/PyQt5/blog/tree/dev](https://github.com/PyQt5/blog/tree/dev) 去提交博客文章，访问地址是：[https://pyqt5.com](https://pyqt5.com)

## 文档查阅

 - Qt 官方文档 [http://doc.qt.io/qt-5/classes.html](http://doc.qt.io/qt-5/classes.html)
 - PySide2 文档 [https://doc.qt.io/qtforpython/index.html](https://doc.qt.io/qtforpython/index.html)
 - 如何查阅Qt文档 [https://pyqt5.com/viewapi.html](https://pyqt5.com/viewapi.html)

## 界面美化

 - Qt 官网样式参考 [https://doc.qt.io/qt-5/stylesheet-examples.html](https://doc.qt.io/qt-5/stylesheet-examples.html)
 - QSS语法参考 [https://www.cnblogs.com/wangqiguo/p/4960776.html](https://www.cnblogs.com/wangqiguo/p/4960776.html)
 - CSS语法参考 [http://www.w3school.com.cn/css/index.asp](http://www.w3school.com.cn/css/index.asp)
 - 使用字体图标 [https://github.com/PyQt5/PyQt/tree/master/QFont](https://github.com/PyQt5/PyQt/tree/master/QFont)
 - 阿里云字体图标 [http://iconfont.cn/](http://iconfont.cn/)

 ## Pyinstaller

1. 如果安装anaconda, 请别用这个环境的python
2. 设置pyqt5的环境变量
3. 如果在pycharm中把文件夹设置为了根路径 , 请在终端(cmd)中 使用命令 python xxx.py 运行脚本来确认 模块导入无错误后在打包
4. 这点很重要!! 如果需要打包成单文件,  先别用-w 命令, 最后打包无错误后再加上-w
5. 如果打包后的窗体一闪而过, 请在cmd中运行你的exe文件

错误处理: 

6. module PyQt5.sip not found: 确保在cmd模式下可以import这个模块后, 再在程序中手动import PyQt5.sip , 然后再打包尝试运行
7. Failed to load platform plugin “windows”...: 百度有解决方法 , 拷贝 python目录下的\\PyQt5\\Qt\\plugins\\platforms到exe目录
8. QPixmap处理/样式 问题 都是同5.一样都是dll丢失 , 到目录下找对应的文件件拷贝到exe目录
9. --add-data 打包非python模块文件 , 可能出现的问题及办法: [https://github.com/pyinstaller/pyinstaller/issues/3749](https://github.com/pyinstaller/pyinstaller/issues/3749)
   - 还是失败的话检查 电脑用户名是否是中文, 如果是中文
   - 对那个路径名进行编码
   - 则改变spec中 exe= EXE(.....)里的runtime_tmpdir指定为英文路径
10. 如果需要打包成单文件 , 先别用-w 命令, 最后打包无错误后再加上-w

## Pycharm

1. PyQt5环境配置 [https://blog.csdn.net/px41834/article/details/79383985](https://blog.csdn.net/px41834/article/details/79383985)
2. 调试PyQt没有错误信息提示,原因以及解决办法: [https://www.jianshu.com/p/47b6e7ce4639](https://www.jianshu.com/p/47b6e7ce4639)
3. 不识别PyQt5模块:
   - 新建的项目使用了新建的虚拟环境的python.exe解释器，更换已经安装过pyqt5的解释器再更新索引即可,设置python解释器路径在pycharm的菜单File->Settings->Project:->Project Interpreter
   - 在尝试网上搜索的办法都没解决的情况下 ,一般就是pycharm的配置出问题了,找到C:\\Users\\XXX\\.PyCharm2018.1 路径, 删除之后重启pycharm ,重新配置

## Eric6

1. 环境配置 请参考 第一讲 [https://space.bilibili.com/1863103/#/](https://space.bilibili.com/1863103/#/)
2. 汉化:eric6汉化包只到17.12版本，但是可以兼容高版本，自行百度或群文件下载
3. 双击无法打开设计师//pyuic5|pyrcc5无法编译ui|qrc文件
   - 检查是否安装pyqt-tools或者PyQt5Designer
   - 检查是否加入环境变量
   - eric6 菜单栏 设置(settings) - 首选项(preference) - Qt
   - Qt -> Tools -> Tools Directory: 配置designer.exe路径
   - PyQt -> Tools -> Tools Directory: 配置pyuic5.exe/pyrcc5.exe路径
   - !! 检查qrc路径中是否含有中文 !! 如果有则重命名

## 设计师

1. 通过pip install pyqt5-tools 或者 pip install PyQt5Designer 安装
2. PyQt5Designer自带汉化包，执行在site-packages\PyQt5\Qt\bin\designer.exe

## Matplotlib

1. PyQt5 结合 matplotlib 时，如何显示其 NavigationToolbar：[http://www.cnblogs.com/hhh5460/p/5189843.html](http://www.cnblogs.com/hhh5460/p/5189843.html)
2. matplotlib绑定到PyQt5：[http://www.cnblogs.com/hhh5460/p/4322652.html](http://www.cnblogs.com/hhh5460/p/4322652.html)