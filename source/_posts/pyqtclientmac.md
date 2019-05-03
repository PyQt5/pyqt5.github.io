---
author: myphper
title: 在Mac上以正确的姿势使用PyQtClient看Demo
date: 2019-04-02 17:18:43
top: 1
tags: 
 - PyQt
categories: 教程
---

由于PyQtClient只提供了Windows的版本，这里记录下编译后在Mac上运行。
<!-- more -->

## 下载项目

安装git略。没有的东西可以都先去试试brew install xxx。没安装homebrew的建议使用搜索引擎

```git clone https://github.com/PyQt5/PyQtClient.git```

## 配置环境

1. 打开IDE配置python环境，使用anaconda比较方便
2. 推荐用pycharm，我是习惯了用idea。anaconda安装可以去官网下载。
3. 环境原因，选择新建一个 python 3.6 p.s. 我取的环境名字就是 3.6 所以后面的3.6其实是这个原因

## conda源

最好是加环境变量，不加也可以，就是以后用到的都需要指定路径，不太常用，我就没加

```
~/anaconda3/bin/conda config --add channels conda-forge
~/anaconda3/bin/conda config --add channels defaults
~/anaconda3/bin/conda config --add channels r
~/anaconda3/bin/conda config --add channels bioconda
~/anaconda3/bin/conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/ 
```

## pip源

```
mkdir ~/.pip && vim ~/.pip/pip.conf
```

```
[global]
index-url = http://mirrors.aliyun.com/pypi/simple/
[install]
trusted-host = mirrors.aliyun.com
```

## 安装编译依赖

```
~/.conda/envs/3.6/bin/pip install -r PyQtClient/requirements.txt
```

运行提示没有webkit，开始手动编译

1. `wget http://download.qt.io/archive/qt/5.9/5.9.0/qt-opensource-mac-x64-5.9.0.dmg`
2. `wget https://github.com/annulen/webkit/releases/download/qtwebkit-5.212.0-alpha2/qtwebkit-5.212.0_alpha2-qt59-darwin-x64.tar.xz`
3. `wget https://www.riverbankcomputing.com/static/Downloads/PyQt5/5.10.1/PyQt5_gpl-5.10.1.zip`
4. `wget https://www.riverbankcomputing.com/static/Downloads/sip/4.19.8/sip-4.19.8.tar.gz`
5. 编译sip：`~/.conda/envs/3.6/bin/python configure.py --platform macx-g++ && make && sudo make install`
6. 编译Webkit.so 没有qmake 和 sip的环境变量， 所以后面都是手动指定的
```
~/.conda/envs/3.6/bin/python configure.py --confirm-license --no-designer-plugin --no-qml-plugin --disable=dbus --disable=QAxContainer --disable=QtAndroidExtras --disable=QtBluetooth --disable=QtDBus --disable=QtDesigner --disable=Enginio --disable=QtLocation --disable=QtMacExtras --disable=QtMultimedia --disable=QtMultimediaWidgets --disable=QtNfc --disable=QtSerialPort --disable=QtSql --disable=QtSvg --disable=QtTest --disable=QtWinExtras --disable=QtX11Extras --disable=QtXml --disable=QtXmlPatterns --disable=pylupdate --disable=pyrcc --qmake=~/Qt5.9.0/5.9/clang_64/bin/qmake --sip=~/.conda/3.6/bin/sip && make && sudo make install
```

## 插曲

1. libcurl版本要求10.0，而我的是9.0，原因是前面我自己摸索，乱装依赖，所以遇到了
```
~/anaconda3/bin/conda install -n 3.6 -c conda-forge libcurl
```
2. 结果这个libcurl 10.0.0 是装上了，可是pygit2版本不对了，conda给升级了，PyQtClient里requirements.txt要求这个包的版本（pygit2==0.27.2）几乎决定了其他的环境版本。后来还是老实的用conda去装了。这个连python版本什么的都会跟着变的。最后降级的结果是python 3.6.7
```
~/anaconda3/bin/conda install -n 3.6 -c conda-forge libgit2==0.27.2
```

至此总算是启动正常了。