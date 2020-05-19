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

  git clone -b dev https://${GH_REF} blog_dev

  cd -P blog_dev

  msg=`git show -s --format=%s`

  rm -rf .git

  git config user.name "Irony"
  git config user.email "892768447@qq.com"

  git init
  git add .
  git commit -m "${msg}"

  # Coding Pages
  git push --force --set-upstream "https://pt8jx6hv3i9m:${CO_TOKEN}@${CO_REF}" master
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
