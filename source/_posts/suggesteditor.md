---
author: Irony
title: 推荐编辑器LiClipse
date: 2019-05-04 18:04:08
tags: 
 - 编辑器
categories: 随笔
---

关于Python的开发编辑器有很多，每个人有每个人的喜好，经常看到很多在问什么编辑器好用，有人推荐Sublime，有人推荐Pycharm等等，这里就不去比较其它编辑器的优缺点了，只谈谈关于LiClipse这个编辑器在初级使用阶段的智能提示功能等。开箱即用，支持多种语言，RST，Markdown和HTML编辑器的HTML预览。
<!-- more -->

其实LiClipse这个编辑器就是以前的PyDev插件的独立版本，基于Eclipse编辑器开发，去掉了Java的相关开发功能，关于软件的详细说明可以去官网查看： http://www.liclipse.com/

编辑器只需要少量的配置，打开即可使用，快速自动import，也可以根据需要安装自己所需的插件，比如json、svn、主题插件等。个人推荐：适合刚入门的新手使用

由于新版的PyQt和PyDev去掉了详细的函数提示，所以PyQt的智能提示只有函数和返回值，并没有英文注释，但是以前的比如PyQt4的智能提示应该是有详细的英文注释提示。

## 界面预览

1. 主界面
![editor1](/images/editor1.png)
2. 鼠标悬停提示
![editor2](/images/editor2.png)
3. 输入提示
![editor3](/images/editor3.png)
4. Git面板
![editor4](/images/editor4.png)
5. 全局搜索（Ctrl + H）
![editor5](/images/editor5.png)
![editor6](/images/editor6.png)

## 自动导包

其实这个功能我是非常喜欢的，通过按下快捷键即可自动寻找包名导入，快捷键 Ctrl + Shift + O

![editor_import](/images/editor_import.png)

也可以在标红的代码上按下 Ctrl + F1进行导入

![editor_import2](/images/editor_import2.png)

## 配置

打开编辑器后首先要配置【Window -> Preferences】的就是Python的环境变量，可以同时添加多个Python版本

![editor_env](/images/editor_env.png)

## Tab等设置

1. Insert spaces for tabs        tab转空格
2. Show line numbers             显示行号

![editor_tab](/images/editor_tab.png)

## 模版

这个功能可以快速插入自己定义好的模版代码，比如 `if __name__ == '__main__':`等等，比如我这里配置的创建文件的模版

![editor_tpl](/images/editor_tpl.png)

## 常用快捷键

|            |                  |
|:----------:|:----------------:|
| 格式化对齐  | Ctrl + Shift + F |
| 自动导包    | Ctrl + Shift + O |
| 快捷提示    | Alt + /          |