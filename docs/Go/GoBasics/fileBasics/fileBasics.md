---
title: 7.文件操作基础知识
date: '2022-06-22'
sidebar: 'auto'
categories:
 - Go
tags:
 - Go
 - 文件操作
---
## 7.文件操作

### 7.1文件的基本介绍

文件在程序中是以流的形式来操作的。

![image-20220611142343589](./fileBasics.assets/image-20220611142343589.png)

- 流:数据在数据源(文件)和程序(内存)之间经历的路径
- 输入流:数据从数据源(文件)到程序(内存)的路径
- 输出流:数据从程序(内存)到数据源(文件)的路径 

### 7.2打开文件和关闭文件

~~~go
package main

import (
	"fmt"
	"os"
)

func main() {
	//打开文件
	//概念说明：file的叫法
	//1.file叫file对象
	//2.file叫file指针
	//3.file叫file文件句柄
	file, err := os.Open("E:\\GoLand\\GolandProjects\\src\\go_code\\project01\\main\\test.txt")
	if err != nil {
		fmt.Println("open file err=", err)
	}
	//输出文件，看看文件是什么-->指针
	fmt.Printf("file=%v", file)
	//关闭文件
	err = file.Close()
	if err != nil {
		fmt.Println("close file err=", err)
	}
}
~~~

### 7.3读文件实例

1. 读取文件的内容并显示在终端（带缓冲区的方式）

   ~~~go
   package main
   
   import (
   	"bufio"
   	"fmt"
   	"io"
   	"os"
   )
   
   func main() {
   	file, err := os.Open("E:\\GoLand\\GolandProjects\\src\\go_code\\project01\\main\\test.txt")
   	if err != nil {
   		fmt.Println("open file err=", err)
   	}
   	//当函数退出时，关闭file
   	defer file.Close()
   	//创建一个带缓冲的 *Reader
   	reader := bufio.NewReader(file)
   	for {
   		str, err := reader.ReadString('\n') //读到一个换行就结束
   		fmt.Printf(str)
   		if err == io.EOF { //io.EOF表示文件的末尾
   			break
   		}
   	}
   	fmt.Println("\n文件读取结束...")
   }
   ~~~

2. 读取文件的内容并显示在终端(使用ioutil一次将整个文件读入到内存中)，这种方式适用于文件不大的情况。相关方法和函数(ioutil.ReadFile)

   ~~~go
   package main
   
   import (
   	"fmt"
   	"io/ioutil"
   )
   
   func main() {
   	//使用ioutil.ReadFile一次性讲文件读取到位
   	file := "E:\\GoLand\\GolandProjects\\src\\go_code\\project01\\main\\test.txt"
   	content, err := ioutil.ReadFile(file)
   	if err != nil {
   		fmt.Printf("read file err=%v", err)
   	}
   	//把读取到的内容显示到终端
   	fmt.Printf("%v", string(content))
   	//我们没有显示Open文件，因此也不需要显式的Close文件
   	//因为文件的Open和Close被封装到ReadFile函数内部
   }
   ~~~

### 7.4写文件实例

1. 创建一个新文件，写入内容5句"hello,Gardon"

   ~~~go
   package main
   
   import (
   	"bufio"
   	"fmt"
   	"os"
   )
   
   func main() {
   	filePath := "E:\\GoLand\\GolandProjects\\src\\go_code\\project01\\main\\abc.txt"
   	file, err := os.OpenFile(filePath, os.O_WRONLY|os.O_CREATE, 0666)
   	if err != nil {
   		fmt.Printf("open file err=%v\n", err)
   		return
   	}
   	//及时关闭file句柄
   	defer file.Close()
   	//准备写入5句"hello,Gardon"
   	str := "hello,Gardon\n"
   	//写入时，使用带缓存的 *Writer
   	writer := bufio.NewWriter(file)
   	for i := 0; i < 5; i++ {
   		writer.WriteString(str)
   	}
   	//因为writer是带缓存，因此在调用WriterString方法时，其实
   	//内容是先写入到缓存的，所以需要调用Flush方法，讲缓冲的数据
   	//真正写入到文件中，否则文件中会没有数据！！！
   	writer.Flush()
   }
   ~~~

2. 打开一个存在的文件中，将原来的内容覆盖成新的内容10句"feedsheep!"

   ~~~go
   package main
   
   import (
   	"bufio"
   	"fmt"
   	"os"
   )
   
   func main() {
   	filePath := "E:\\GoLand\\GolandProjects\\src\\go_code\\project01\\main\\abc.txt"
   	file, err := os.OpenFile(filePath, os.O_WRONLY|os.O_TRUNC, 0666)
   	if err != nil {
   		fmt.Printf("open file err=%v\n", err)
   		return
   	}
   	//及时关闭file句柄
   	defer file.Close()
   	//准备写入10句"feedsheep!"
   	str := "feedsheep!\n"
   	//写入时，使用带缓存的 *Writer
   	writer := bufio.NewWriter(file)
   	for i := 0; i < 10; i++ {
   		writer.WriteString(str)
   	}
   	//因为writer是带缓存，因此在调用WriterString方法时，其实
   	//内容是先写入到缓存的，所以需要调用Flush方法，讲缓冲的数据
   	//真正写入到文件中，否则文件中会没有数据！！！
   	writer.Flush()
   }
   ~~~

3. 打开一个存在的文件，在原来的内容追加内容 "ABC! ENGLISH!"

   ~~~go
   package main
   
   import (
   	"bufio"
   	"fmt"
   	"os"
   )
   
   func main() {
   	filePath := "E:\\GoLand\\GolandProjects\\src\\go_code\\project01\\main\\abc.txt"
   	file, err := os.OpenFile(filePath, os.O_WRONLY|os.O_APPEND, 0666)
   	if err != nil {
   		fmt.Printf("open file err=%v\n", err)
   		return
   	}
   	//及时关闭file句柄
   	defer file.Close()
   	//准备追加"ABC! ENGLISH!"
   	str := "ABC! ENGLISH!\r\n"
   	//写入时，使用带缓存的 *Writer
   	writer := bufio.NewWriter(file)
   	writer.WriteString(str)
   	writer.Flush()
   }
   ~~~

4. 编程一个程序，将一个文件的内容，写入到另外一个文件。注:这两个文件已经存在了

   ~~~go
   package main
   
   import (
   	"fmt"
   	"io/ioutil"
   )
   
   func main() {
   	//将abc.txt文件内容导入到kkk.txt
   	file1Path := "E:\\GoLand\\GolandProjects\\src\\go_code\\project01\\main\\abc.txt"
   	file2Path := "E:\\GoLand\\GolandProjects\\src\\go_code\\project01\\main\\kkk.txt"
   	data, err := ioutil.ReadFile(file1Path)
   	if err != nil {
   		fmt.Printf("read file err=%v\n", err)
   		return
   	}
   	err = ioutil.WriteFile(file2Path, data, 0666)
   	if err != nil {
   		fmt.Printf("write file error=%v\n", err)
   	}
   
   }
   ~~~

### 7.5判断文件是否存在

golang判断文件或文件夹是否存在的方法为使用os.Stat()函数返回的错误值进行判断:

1. 如果返回的错误为nil,说明文件或文件夹存在
2. 如果返回的错误类型使用os.lsNotExist()判断为true,说明文件或文件夹不存在
3. 如果返回的错误为其它类型,则不确定是否在存在

~~~go
func PathExists(path string)(bool,error)  {
	_,err := os.Stat(path)
	if err != nil {
		return true,nil
	}
	if os.IsNotExist(err){
		return false,nil
	}
	return false,err
}
~~~

### 7.6拷贝文件

将一张图片/电影/mp3拷贝到另外一个文件

~~~go
package main

import (
	"bufio"
	"fmt"
	"io"
	"os"
)

func CopyFile(distFileName string, srcFileName string) (written int64, err error) {
	srcFile, err := os.Open(srcFileName)
	if err != nil {
		fmt.Printf("open file err=%v", err)
	}
	defer srcFile.Close()
	//通过srcfile，获取到Reader
	reader := bufio.NewReader(srcFile)
	//打开distFileName
	distFile, err := os.OpenFile(distFileName, os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		fmt.Printf("open file err=%v", err)
		return
	}
	//通过distFile，获取到Writer
	writer := bufio.NewWriter(distFile)
	defer distFile.Close()

	return io.Copy(writer, reader)
}

func main() {
	//将bilibili.jpg文件拷贝到abc.jpg

	//调用CopyFile完成文件拷贝
	srcFile := "E:\\GoLand\\GolandProjects\\src\\go_code\\project01\\main\\bilibili.png"
	distFile := "E:\\GoLand\\GolandProjects\\src\\go_code\\project01\\main\\abc.png"
	_, err := CopyFile(distFile, srcFile)
	if err == nil {
		fmt.Printf("拷贝完成\n")
	} else {
		fmt.Printf("拷贝错误 err=%v\n", err)
	}

}
~~~

### 7.7 json序列化与反序列化

~~~go
package main

import (
	"encoding/json"
	"fmt"
)

type Student struct {
	Name string
	Age  int
	Sex  string
}

func main() {

	student := Student{
		Name: "feedsheep",
		Age:  22,
		Sex:  "男",
	}
	//序列化
	data, err := json.Marshal(&student)
	if err != nil {
		fmt.Printf("序列化错误 err=%v\n", err)
	}
	fmt.Printf("序列化后=%v\n", string(data))

	//反序列化
	var stu Student
	err = json.Unmarshal(data, &stu)
	if err != nil {
		fmt.Printf("反序列化错误 err=%v\n", err)
	} else {
		fmt.Printf("反序列化的结果%v\n", stu)
	}
}
~~~

