---
author: 不许人间见白头
title: QDataWidgetMapper 数据库绑定 QLineEdit控件
date: 2018-10-29 16:17:59
top: 1
tags: 
 - PyQt
 - Model
categories: 例子
---

qt为操作数据库提供了一个model+view的模式 , 这样简单的出入库逻辑就不需要自己编写。

`QDataWidgetMapper` 可以 将数据库的数据 映射到其他控件 。

注意: 表格里的数据修改 还没有提交到数据库 , 需要点击提交按钮才生效。
<!-- more -->

https://github.com/PyQt5/PyQt/tree/master/Test/partner_625781186/16_sqlModel/01_mapper

## 代码

```python
#-*- coding: utf-8 -*-

from PyQt5 import  QtWidgets, QtGui, QtCore
from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *
from PyQt5.QtSql import *

import sys

sys.path.append('./ui')
from Ui_MainWindow import Ui_MainWindow


class MainWindow(QMainWindow, Ui_MainWindow):
    def __init__(self, parent=None, *args):

        super(MainWindow, self).__init__(parent,  *args)
        self.setupUi(self)
        self.resize(800,600)
        
        #===============================   db   ======================================#
        # self.db = QSqlDatabase.addDatabase('QMYSQL')
        # self.db.setHostName("127.0.0.1")  # set address
        # self.db.setUserName("root")  # set user name
        # self.db.setPassword('123456')  # set user pwd   
        # self.db.setDatabaseName("database")
        
        self.db = QSqlDatabase.addDatabase('QSQLITE')
        self.db.setDatabaseName('./db/database.db')

        #================================= codemodel =====================================#
        # 实例化model
        self.codeModel = QSqlRelationalTableModel()
        # model设置表
        self.initializeModel(self.codeModel, 'Mongo')
        # 设置编辑策略
        # self.codeModel.setEditStrategy(QSqlTableModel.OnFieldChange)
        # !!! 这里要注意 , 只能用这个策略 , 才可以实现自动提交
        self.codeModel.setEditStrategy(QSqlTableModel.OnManualSubmit)

        self.codeView = self.createView("code_View", self.codeModel)
        self.verticalLayout.addWidget(self.codeView)  

        #================================ initData ==================================#
        # 数据映射
        self.mapper = QDataWidgetMapper()
        # 提交策略
        self.mapper.setSubmitPolicy(QDataWidgetMapper.AutoSubmit)
        # 映射的模型源
        self.mapper.setModel(self.codeModel)
        self.mapper.addMapping(self.l1,0)
        self.mapper.addMapping(self.l2,1)
        self.mapper.addMapping(self.l3,2)
        self.mapper.addMapping(self.l4,3)
        self.mapper.addMapping(self.l5,4)

        self.mapper.toFirst()
        
        #================================ pushButton ==================================#
        self.sub_btn.clicked.connect(self.mapper.submit)
        self.sub_btn.clicked.connect(self.codeModel.submitAll)
        self.pre_btn.clicked.connect(self.mapper.toPrevious)
        self.next_btn.clicked.connect(self.mapper.toNext)
        
    def initializeModel(self, model, tablename):
        '''重关联。'''
        model.setTable(tablename)
#        model.setEditStrategy(QSqlTableModel.OnRowChange)
        model.select()
        
    def createView(self, title, model):
        '''创建TableView视图'''
        view =  QTableView()
        view.setModel(model)
        view.setWindowTitle(title)
        #列宽设置
        view.horizontalHeader().setSectionResizeMode(3)
        #行高设置
        view.verticalHeader().setSectionResizeMode(1)
        #充满列宽
        view.horizontalHeader().setStretchLastSection(True) 
#        view.verticalHeader().setVisible(False)#隐藏行标题
        #标题左对齐
        view.horizontalHeader().setDefaultAlignment(Qt.AlignLeft)
        #标题左对齐
        view.verticalHeader().setDefaultAlignment(Qt.AlignLeft)
        
        return view  
    

if __name__ == "__main__":
    import sys
    
    app = QApplication(sys.argv)
    app.setStyle(QStyleFactory.create("Fusion"))
    ui = MainWindow()
    ui.show()
    sys.exit(app.exec_())
```

## 效果图

![datawidgetmapper](/images/datawidgetmapper.gif)

