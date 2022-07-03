---
title: docker基础知识
date: '2022-07-03'
sidebar: 'auto'
categories:
 - docker
tags:
 - docker
 - 软件安装
---
## 1.docker安装(Linux环境)

https://docs.docker.com/engine/install/centos/

1. `yum`安装`gcc`相关

   ~~~shell
   yum -y install gcc
   
   yum -y install gcc-c++
   ~~~

2. 安装`yum-utils`包（提供`yum-config-manager` 实用程序）并设置镜像仓库

   ~~~shell
   yum install -y yum-utils
   
   yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
   ~~~

3. 更新yum软件包索引

   ~~~shell
   yum makecache fast
   ~~~

4. 安装 Docker 引擎

   ~~~shell
   yum install docker-ce docker-ce-cli containerd.io docker-compose-plugin
   ~~~

5. 启动Docker

   ~~~shell
   systemctl start docker
   
   ps -ef|grep docker
   ~~~

6. 测试

   ~~~shell
   docker version
   
   docker run hello-world
   ~~~

## 2.docker常用命令

### 2.1帮助启动类命令

- 启动docker

  ~~~shell
  systemctl start docker
  ~~~

- 停止docker

  ~~~shell
  systemctl stop docker
  ~~~

- 重启docker

  ~~~shell
  systemctl restart docker
  ~~~

- 查看docker状态

  ~~~shell
  systemctl status docker
  ~~~

- 开机启动

  ~~~shell
  systemctl enable docker
  ~~~

- 查看docker概要信息

  ~~~shell
  docker info
  ~~~

- 查看docker总体帮助文档

  ~~~shell
  docker --help
  ~~~

- 查看docker命令帮助文档

  ~~~shell
  docker 具体命令 --help
  ~~~


### 2.2 镜像命令

- 列出本地主机上的镜像

  ~~~shell
  docker images
  ~~~

  > | 参数       | 说明             |
  > | ---------- | ---------------- |
  > | REPOSITORY | 表示镜像的仓库源 |
  > | TAG        | 镜像的标签版本号 |
  > | IMAGE ID   | 镜像ID           |
  > | CREATED    | 镜像创建时间     |
  > | SIZE       | 镜像大小         |
  >
  > 同一仓库源可以有多个TAG版本，代表这个仓库源的不同个版本，我们使用`REPOSITORY:TAG`来定义不同的镜像。如果你不指定一个镜像的版本标签，例如你只使用ubuntu，docker将默认使用ubuntu:latest镜像

- 搜索镜像

  ~~~shell
  docker search hello-world(镜像名)
  ~~~

  > | 参数        | 说明             |
  > | ----------- | ---------------- |
  > | NAME        | 镜像名称         |
  > | DESCRIPTION | 镜像说明         |
  > | STARS       | 点赞数量         |
  > | OFFICIAL    | 是否是官方的     |
  > | AUTOMATED   | 是否是自动构建的 |

- 拉取镜像

  ~~~shell
  docker pull hello-world(镜像名)
  ~~~

- 查看镜像/容器/数据卷所占的空间

  ~~~shell
  docker system df
  ~~~

- 删除镜像

  ~~~shell
  删除单个
  docker rmi -f hello-world
  
  删除多个
  docker rmi -f 镜像名1:TAG 镜像名2:TAG
  
  删除全部
  docker rmi -f $(docker images -qa)
  ~~~


### 2.3容器命令

- 新建+启动容器

  ~~~shell
  docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
  例如：
  docker run -it ubuntu /bin/bash
  ~~~

  > **OPTIONS说明**
  >
  > - `--name="容器新名字"`:为容器指定一个名称
  > - `-d`:后台运行容器并返回容器ID，也即启动守护式容器(后台运行)
  > - `-i`:以交互模式运行容器，通常与-t同时使用
  > - `-t`:为容器重新分配一个伪输入终端，通常与-i同时使用;也即启动交互式容器(前台有伪终端，等待交互)
  > - `-P`:随机端口映射，大写P
  > - `-p`:指定端口映射，小写p
  >
  > | 参数                          | 说明                              |
  > | ----------------------------- | --------------------------------- |
  > | -p hostPort:containerPort     | 端口映射 -p 8080:80               |
  > | -p ip:hostPort:containerPort  | 配置监听地址-p 10.0.0.100:8080:80 |
  > | -p ip::containerPort          | 随机分配端口-p 10.0.0.100::80     |
  > | -p hostPort:containerPort:udp | 指定协议-p 8080:80:tcp            |
  > | -p 81:80-p 443:443            | 指定多个                          |

- 列出当前所有正在运行的容器

  ~~~shell
  docker ps [OPTIONS]
  ~~~

  > **OPTIONS说明**
  >
  > - `-a` :列出当前所有正在运行的容器+历史上运行过的
  > - `-l`:显示最近创建的容器
  > - `-n`:显示最近n个创建的容器
  > - `-q` :静默模式，只显示容器编号

- 退出容器

  1. run进去容器，exit退出，容器停止

     ~~~shell
     exit
     ~~~

  2. run进去容器，ctrl+p+q退出，容器不停止

     ~~~shell
     ctrl+p+q
     ~~~

- 启动已停止运行的容器

  ~~~shell
  docker start 容器ID或者容器名
  ~~~

- 重启容器

  ~~~she
  docker restart 容器ID或者容器名
  ~~~

- 停止容器

  ~~~shell
  docker stop 容器ID或者容器名
  ~~~

- 强制停止容器

  ~~~shell
  docker kill 容器ID或容器名
  ~~~

- 删除已停止的容器

  ~~~shell
  docker rm 容器ID
  
  一次性删除多个容器实例
  docker rm -f $(docker ps -a -q)
  docker ps -a -q | xargs docker rm
  ~~~

- 前台交互式启动

  ~~~shell
  docker run -it redis:6.0.8
  ~~~

- 后台守护式启动

  ~~~shell
  docker run -d redis:6.0.8
  ~~~

- 查看容器日志

  ~~~shell
  docker logs 容器ID
  ~~~

- 查看容器内运行的进程

  ~~~shell
  docker top 容器ID
  ~~~

- 查看容器内部细节

  ~~~she
  docker inspect 容器ID
  ~~~

- 进入正在运行的容器并以命令行交互

  1. ~~~shell
     docker exec -it 容器ID bashShell
     例如：
     docker exec -it a2b057419fif /bin/bash
     ~~~

  2. ~~~shell
     docker attach 容器ID
     ~~~

  > **上述两个区别**
  >
  > - attach 直接进入容器启动命令的终端，不会启动新的进程 用exit退出，会导致容器的停止
  > - exec(推荐使用) 是在容器中打开新的终端，并且可以启动新的进程 用exit退出，不会导致容器的停止
