---
title: "Git基础命令"
date: 2021-04-02T10:21:37+08:00
lastmod: 2021-04-02T10:21:37+08:00
draft: false
keywords: ["git",]
description: "git基础命令"
tags: ["git",]
categories: [""]
author: "wtnyzhsq"
comment: false
toc: true
autoCollapseToc: false
postMetaInFooter: false
hiddenFromHomePage: false
contentCopyright: false
reward: false
mathjax: false
mathjaxEnableSingleDollar: false
mathjaxEnableAutoNumber: false
hideHeaderAndFooter: false
flowchartDiagrams:
  enable: false
  options: ""
sequenceDiagrams: 
  enable: false
  options: ""

---

  git的一些主要基础实用命令

<!--more-->

[ 推荐一个学习git的网站](https://learngitbranching.js.org/)

------

## 基础篇

### Basic Level 1 branch

* git branch name  新建name分支

### Basic Level 2 checkout

* git checkout  name 切换到 name分支 
* git checkout -b name  新建并切换到name分支

> 创建分支相当于建立另一个索引，指向当前节点，不会增加存储空间开销

### Basic Level 3 merge

* 两个分支，把bugFix合并到main。*以下图片星号均表示当前分支*

<img src="https://cdn.jsdelivr.net/gh/wtnyzhsq/cdnstatic/img/20210402105918.png" alt="image-20210402105910249" style="zoom: 67%;" />

* git merge bugFix 之后

<img src="https://cdn.jsdelivr.net/gh/wtnyzhsq/cdnstatic/img/20210402110019.png" alt="image-20210402110019131" style="zoom:67%;" />

> （分支切换到bugFix后合并main，bugFix即可指向c4）

### Basic Level 4

* git rebase name 

> 这个有点难解释。！看图  （具体作用，因没有实操环境暂未清楚）

git rebase 之前

<img src="https://cdn.jsdelivr.net/gh/wtnyzhsq/cdnstatic/img/20210402113307.png" alt="image-20210402113304926" style="zoom:67%;" />

git rebase main 之后

<img src="https://cdn.jsdelivr.net/gh/wtnyzhsq/cdnstatic/img/20210402113610.png" alt="image-20210402113605144" style="zoom:67%;" />

## 高级篇

### Basic Level 1 分离HEAD

* git checkout 结点记录哈希值    （分离HEAD，分离是为了让HEAD指向某个记录而不是分支）

* HEAD ^ 向上移动

* git branch -f name n  （强制分支name移动到n记录）

* git reset HEAD 撤回当前分支更改指向上一次记录。

* git revert HEAD  相当于添加一次更改，指向新增记录，但新增记录与上一次记录相同

  

## 自由修改提交树

* git cheery-pick

<img src="https://cdn.jsdelivr.net/gh/wtnyzhsq/cdnstatic/img/20210402153619.png" alt="image-20210402153617708" style="zoom:67%;" />







