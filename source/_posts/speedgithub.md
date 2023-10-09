---
author: Irony
title: 解决GitHub下载速度缓慢的问题
date: 2019-04-18 08:59:06
tags: 
 - Github
categories: 笔记
---

由于Github的下载走的是AWS - 亚马逊的路线，，so slow，跟乌龟一样慢。。照着一些方法改了hosts文件，偶尔能提提速度。
<!-- more -->

## Windows
Hosts文件的路径是：

C:\Windows\System32\drivers\etc

## Mac
终端内输入：

sudo vim /etc/hosts


## 追加域名的IP地址

利用https://www.ipaddress.com/ 来获得以下两个GitHub域名的IP地址：

(1) github.com

(2) github.global.ssl.fastly.net

打开网页后，利用输入框内分别查询两个域名

将以上两段IP写入Hosts文件中：



```
192.30.253.112               github.com
151.101.185.194              github.global.ssl.fastly.net
```

保存。

刷新 DNS 缓存

在终端或CMD中，执行以下命令：

ipconfig /flushdns