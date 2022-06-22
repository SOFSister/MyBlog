---
title: 11.tcp编程基础知识
date: '2022-06-22'
sidebar: 'auto'
categories:
 - Go
tags:
 - Go
 - tcp
---
## 11. tcp编程

### 11.1服务端的处理流程

1. 监听端口8888
2. 接收客户端的 tcp链接，建立客户端和服务器端的链接.
3. 创建goroutine，处理该链接的请求(通常客户端会通过链接发送请求包)

### 11.2客户端的处理流程

1. 建立与服务端的链接
2. 发送请求数据[终端]，接收服务器端返回的结果数据
3. 关闭链接

### 11.3例子

> **服务器端功能:**
>
> 1. 编写一个服务器端程序，在8888端口监听
> 2. 可以和多个客户端创建链接
> 3. 链接成功后，客户端可以发送数据，服务器端接受数据，并显示在终端上
> 4. 先使用telnet来测试，然后编写客户端程序来测试
>
> **客户端功能:**
>
> 1. 编写一个客户端端程序，能链接到服务器端的8888端口
> 2. 客户端可以发送单行数据，然后就退出
> 3. 能通过终端输入数据(输入一行发送一行)，并发送给服务器端[]
> 4. 在终端输入exit,表示退出程序

1. 服务器端

   ~~~go
   package main
   
   import (
   	"fmt"
   	"net"
   )
   
   func process(conn net.Conn) {
   	//循环接收客户端发送的数据
   	defer conn.Close() //关闭 conn
   	for {
   		//创建一个新的切片
   		buf := make([]byte, 1024)
   		//1.等待客户端通过conn发送信息
   		//2.如果客户端没有发送，那么协程就阻塞在这里
   		fmt.Printf("服务器在等待客户端%s 发送信息\n", conn.RemoteAddr().String())
   		n, err := conn.Read(buf) //从conn读取
   		if err != nil {
   			fmt.Printf("客户端退出 err=%v\n", err)
   			return
   		}
   		//3.显示客户端发送的内容到服务器的终端
   		fmt.Println(string(buf[:n]))
   	}
   }
   
   func main() {
   	fmt.Println("服务器开始监听...")
   
   	listen, err := net.Listen("tcp", "0.0.0.0:8888")
   	if err != nil {
   		fmt.Println("listen err =", err)
   		return
   	}
   	defer listen.Close() //延时关闭
   
   	//循环等待客户来连接我
   	for {
   		//等待客户端连接
   		fmt.Println("等待客户端连接...")
   		conn, err := listen.Accept()
   		if err != nil {
   			fmt.Println("Accept() err =", err)
   		} else {
   			fmt.Printf("Accept() suc con=%v 客户端ip=%v\n", conn, conn.RemoteAddr().String())
   		}
   		//这里准备一个协程，为客户端服务
   		go process(conn)
   	}
   }
   ~~~

2. 客户端

   ~~~go
   package main
   
   import (
   	"bufio"
   	"fmt"
   	"net"
   	"os"
   	"strings"
   )
   
   func main() {
   	conn, err := net.Dial("tcp", "127.0.0.1:8888")
   	if err != nil {
   		fmt.Println("client dial err =", err)
   		return
   	}
   	//功能一：客户端可以发送单行数据，然后就退出
   	reader := bufio.NewReader(os.Stdin) //os.Stdin代表标准输入[终端]
   
   	for {
   		//从终端读取一行用户输入，并准备发送给服务器
   		line, err := reader.ReadString('\n')
   		if err != nil {
   			fmt.Println("readString err =", err)
   			return
   		}
   
   		//如果用户输入的是exit就退出
   		line = strings.Trim(line, " \r\n")
   		if line == "exit" {
   			fmt.Println("客户端退出..")
   			break
   		}
   
   		//将line发送给服务器
   		n, err := conn.Write([]byte(line))
   		if err != nil {
   			fmt.Println("conn.Write err =", err)
   			return
   		}
   		fmt.Printf("客户端发送了%v字节的数据\n", n)
   	}
   }
   ~~~
