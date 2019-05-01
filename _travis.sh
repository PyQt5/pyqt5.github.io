#!/bin/bash

#定义时间
time=`date +%Y-%m-%d\ %H:%M:%S`

#执行成功
function success(){
   echo "success"
}

#执行失败
function failure(){
   echo "failure"
}

#默认执行
function default(){

  git clone -b master https://${GH_REF} blog_master

  cd blog_master

  cd ../

  mv ./public/ ./blog_master/
  cd ./blog_master

  git config user.name "Irony"
  git config user.email "892768447@qq.com"
  git add .
  git commit -m "Update Blog By TravisCI With Build $TRAVIS_BUILD_NUMBER"
  # Github Pages
  git push "https://${GH_TOKEN}@${GH_REF}" master:master
}

case $1 in
    "success")
	     success
       ;;
    "failure")
	     failure
	     ;;
	         *)
       default
esac
