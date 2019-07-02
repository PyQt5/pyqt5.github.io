# 博客项目

https://pyqt5.com

## 微信博客小程序

<img src="source/images/wxblog.jpg" height="250" width="250">

## 提交文章说明

1. 先 fork 本项目 或者 作为协作者加入本项目
2. 在 [source/_posts](source/_posts) 目录中编写文章
3. 图片文件放到[source/images](source/images)，在文章中使用的时候 `![xx](/images/xx.png)`
4. 其它文件放到[source/files](source/files)，在文章中使用的时候 `[xx](/files/xx.zip)`
5. 文章格式见下面
6. 提交代码

## 文章格式

1. 文件名必须为英文，且小于50字符
2. 内容开头格式如下
```
---
author: Irony
title: PyQtClient例子客户端
date: 2019-02-02 15:15:06
top: 1
tags: 
 - Example
categories: 随笔
---

文章内容简介,注意！！！下面的`<!-- more -->`一定要加上
<!-- more -->

这里是正文内容
```

<font color=red><b>直接复制上面内容到新建的文档中，修改编辑</b></font>

## 字段说明

| 字段 | 说明 |
| :------:| :------: |
| author | 作者名字 |
| title | 中文标题 |
| date | 文章日期 |
| top  | 排序 （默认为1）|
| tags | 文章标签（可以多个） |
| categories | 文章分类（只能一个） |

## 注意

tags可以是多个，yaml语法要注意格式对齐，比如：
```
tags:
 - PyQt
 - 动画
```

目前常用的categories有：随笔，教程，例子，笔记
