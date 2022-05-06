---
title: Java多线程
date: '2022-05-06 17:50:00'
sidebar: 'auto'
categories:
 - Java
tags:
 - Java
 - Java多线程
---
## Thread中的常用方法

1. start()：启动当前线程，调用当前线程的run()
2. run()：通常需要重写Thread类中的方法，将创建的线程要执行的操作声明在此方法中
3. currentThread()：静态方法，返回执行当前代码的线程
4. getName()：获取当前线程的名字
5. setName()：设置当前线程的名字
6. yield()：释放当前cpu的执行权
7. join()：在线程a中调用线程b的join()，此时线程a就进入阻塞状态，直到线程b完全执行完以后，线程a才结束阻塞状态
8. stop()：已过时。当执行此方法时，强制结束当前线程。
9. sleep(long millitime)：让当前线程“睡眠”指定的millitime毫秒
10. isAlive()：判断当前线程是否存活



## 创建线程的方式

1. 继承Thread类，重写run方法

2. 实现Runnable接口，实现run方法

3. 实现Callable接口

   ~~~java
   //1.创建一个实现Callable的实现类
   class NumThread implements Callable{
       //2.实现call方法，将此线程需要执行的操作声明在call()中
       @Override
       public Object call() throws Exception {
           int sum = 0;
   
           for (int i = 0; i < 100; i++) {
               if(i % 2 == 0){
                   sum += i;
               }
           }
           return sum;
       }
   }
   
   public class ThreadNew {
   
       public static void main(String[] args) {
   
           //3.创建Callable接口实现类的对象
           NumThread numThread = new NumThread();
           //4.将此Callable接口实现类的对象作为参数传递到FutureTask构造器中，创建FutureTask对象
           FutureTask futureTask = new FutureTask(numThread);
           //5.将FutureTask的对象作为参数传递到Thread类的构造器中，创建Thread对象，并调用start()
           new Thread(futureTask).start();
           try {
               //6.获取Callable中call方法的返回值
               //get()返回值即为FutureTask构造器参数Callable实现类重写的call()的返回值
               Object sum = futureTask.get();
               System.out.println(sum);
           } catch (InterruptedException e) {
               e.printStackTrace();
           } catch (ExecutionException e) {
               e.printStackTrace();
           }
   
       }
   
   }
   
   ~~~

4. 使用线程池

   ~~~java
   class NumberThread implements Runnable{
   
       @Override
       public void run() {
           for (int i = 0; i < 100; i++) {
               if (i % 2 == 0) {
                   System.out.println(Thread.currentThread().getName() + ":" + i);
               }
           }
       }
   }
   
   class NumberThread2 implements Callable<Integer>{
   
       @Override
       public Integer call() throws Exception {
           int sum = 0;
           for (int i = 0; i < 100; i++) {
               sum += i;
           }
           return sum;
       }
   }
   
   public class ThreadPool {
   
       public static void main(String[] args) {
           //1.提供指定线程数量的线程池
           ExecutorService service = Executors.newFixedThreadPool(10);
           //设置线程池的属性
           ThreadPoolExecutor service1 = (ThreadPoolExecutor) service;
           service1.setCorePoolSize(2);
           //2.执行指定的线程的操作，需要提供实现Runnable接口或Callable接口实现类的对象
           //service.execute(new NumberThread());//适合用于Runnable
           FutureTask<Integer> integerFutureTask = new FutureTask<>(new NumberThread2());
           service.submit(integerFutureTask);//适合用于Callable
   
           try {
               Integer sum = integerFutureTask.get();
               System.out.println(sum);
           } catch (InterruptedException e) {
               e.printStackTrace();
           } catch (ExecutionException e) {
               e.printStackTrace();
           }
           service.shutdown();
       }
   }
   ~~~

   好处：

   1. 提高响应速度（减少了创建新线程的时间）

   2. 降低资源消耗（重复利用线程池中的线程，不需要每次都创建）

   3. 便于线程的管理

      corePoolSize：核心池的大小

      maximumPoolSize：最大线程数

      keepAliveTime：线程没有任务时最多保持多长时间后会终止



## 如何理解实现Callable接口的方式创建多线程比实现Runnable接口创建多线程方式更强大？

1. call()可以有返回值
2. call()可以抛出异常，被外面的操作捕获，获取异常的信息
3. Callable是支持泛型的

## 线程的优先级

1. MAX_PRIORITY = 10

   MIN_PRIORITY = 1

   NORM_PRIORITY = 5 -->默认优先级

2. 如何获取和设置当前线程的优先级：

   getPriority()：获取线程优先级

   setPriority(int p)：设置线程优先级

   说明：高优先级的线程要抢占低优先级线程cpu的执行权。但是只是从概率上讲，高优先级的线程高概率的情况下被执行。并不意味着只有当高优先级的线程执行完以后，低优先级的线程才执行。

## 线程的生命周期

![image-20220316095718725](/JavaMultithreading.assets/image-20220316095718725.png)



## synchronized锁

- 方法一

  ~~~java
  synchronized(同步监视器){
      //需要被同步的代码
  }
  ~~~

  说明：

  1. 操作共享数据的代码，即为需要被同步的代码
  1. 共享数据：多个线程共同操作的变量。
  1. 同步监视器，俗称：锁。任何一个类的对象，都可以充当锁。要求：多个线程必须要共同一把锁。

  补充：

  1. 在实现Runnable接口创建多线程的方式，我们可以考虑使用this充当同步监视器
  2. 在继承Thread类创建多线程的方式中，慎用this充当同步监视器，考虑使用当前类充当同步监视器。

- 方法二

  ~~~java
  private synchronized void show(){
  
  }
  ~~~

  说明：

  1. 同步方法仍然涉及到同步监视器，只是不需要我们显式的声明

  2. 非静态的同步方法，同步监视器是：this

     静态的同步方法，同步监视器是：当前类本身

## Lock锁

实现

~~~java
class Window1 implements Runnable{

    private int ticket = 100;
    //1.实例化
    private ReentrantLock lock = new ReentrantLock();
    @Override
    public void run() {
        while (true){
            try {
                //2.调用lock方法
                lock.lock();
                if(ticket > 0){
                    try {
                        Thread.sleep(100);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }

                    System.out.println(Thread.currentThread().getName() + "：，当前票号为：" + ticket);
                    ticket--;

                }else{
                    break;
                }
            }finally {
                //3.调用解锁方法
                lock.unlock();
            }

        }
    }
}

public class LockTest {

    public static void main(String[] args) {

        Window1 window1 = new Window1();

        Thread thread0 = new Thread(window1);
        Thread thread1 = new Thread(window1);
        Thread thread2 = new Thread(window1);

        thread0.start();
        thread1.start();
        thread2.start();

    }
}

~~~



## 面试题：synchronized 与 lock 的异同？

- 相同点：两者都可以解决线程安全问题

- 不同点：synchronized 机制在执行完响应的同步代码块以后，自动的释放同步监视器

  ​					Lock 需要手动启动同步（lock()），同时结束同步也需要手动的实现（unlock()）

- 建议使用顺序：Lock > 同步代码块（已经进入了方法体，分配了相应资源） > 同步方法（在方法体之外）



## 线程间通信

- 涉及到的三个方法
  1. wait()：一旦执行此方法，当前线程就进入阻塞状态，并释放同步监视器
  2. notify()：一旦执行此方法，就会唤醒被wait的一个线程。如果有多个线程被wait，就唤醒优先级高的
  3. notifyAll()：一旦执行此方法，就会唤醒所有被wait的线程
- 说明
  1. wait(),notify(),notifyAll()三个方法必须使用在同步代码块或同步方法中
  2. wait(),notify(),notifyAll()三个方法的调用者必须是同步代码块或同步方法中的同步监视器，否则会出现异常
  3. wait(),notify(),notifyAll()三个方法是定义在java.lang.Object类中



## 面试题：sleep() 和 wait() 有什么异同？

- 同

  都可以使线程进入阻塞状态

- 异

  1. 两个方法申明的位置不同，sleep()申明在Thread中，wait()申明在Object中
  2. 调用要求不同，sleep可以在任何需要的场景下调用，wait需要在同步方法或者同步代码块内调用

## 死锁

- 死锁的理解

  不同的线程分别占用对方需要的同步资源不放弃，都在等待对方放弃自己需要的同步资源，就形成了线程的死锁

- 说明

  1. 出现死锁后，不会出现异常，不会出现提示，只是所有的线程都处于阻塞状态，无法继续
  2. 我们使用同步时，要避免死锁

## 线程的状态及其相互转换

- 初始(NEW)：新创建了一个线程对象，但还没有调用start()方法。
- 运行(RUNNABLE):处于可运行状态的线程正在JVM中执行，但它可能正在等待来自操作系统的其他资源，例如处理器。
- 阻塞(BLOCKED)：线程阻塞于synchronized锁，等待获取synchronized锁的状态。
- 等待(WAITING)：Object.wait()、join()、 LockSupport.park(),进入该状态的线程需要等待其他线程做出一些特定动作（通知或中断）。
- 超时等待(TIME_WAITING)：Object.wait(long)、Thread.join()、LockSupport.parkNanos()、LockSupport.parkUntil，该状态不同于WAITING，它可以在指定的时间内自行返回。
- 终止(TERMINATED)：表示该线程已经执行完毕。

## 创建线程的方式

- 继承Thread，并重写父类的run方法

  ~~~java
  public class MyThread extends Thread{
  
      @Override
      public void run() {
          System.out.println(Thread.currentThread().getName());
      }
  
      public static void main(String[] args) {
          MyThread myThread = new MyThread();
          myThread.setName("线程demo");
          myThread.start();
      }
  }
  
  ~~~

- 实现Runable接口，并实现run方法

  ~~~java
  public class MyRunable implements Runnable{
      @Override
      public void run() {
          System.out.println(Thread.currentThread().getName());
      }
  
      public static void main(String[] args) {
          Thread thread = new Thread(new MyRunable());
          thread.setName("run");
          thread.start();
      }
  }
  
  ~~~

- 使用匿名内部类

  ~~~java
  public class MyThread {
  
      public static void main(String[] args) {
  
          Thread thread = new Thread(new Runnable() {
              @Override
              public void run() {
                  System.out.println(Thread.currentThread().getName());
              }
          });
          thread.start();
      }
  
  
  }
  
  ~~~

- Lambda表达式

  ~~~java
  public class Lamda {
  
      public static void main(String[] args) {
  
          new Thread(()->{
              System.out.println(Thread.currentThread().getName());
          }).start();
  
      }
  
  }
  ~~~

- 线程池

  ~~~java
  public class ThreadPool {
  
      public static void main(String[] args) {
  
          ExecutorService executorService = Executors.newSingleThreadExecutor();
          executorService.execute(()->{
              System.out.println(Thread.currentThread().getName());
          });
  
      }
  
  }
  ~~~



## 线程的挂起跟恢复

- 为什么要挂起线程？

  cpu分配的时间片非常短、同时也非常珍贵。避免资源的浪费。

- 被废弃的方法

  1. 被废弃的方法 thread.suspend() 该方法不会释放线程所占用的资源。如果使用该方法将某个线程挂起，则可能会使其他等待资源的线程死锁
  2. thread.resume() 方法本身并无问题，但是不能独立于suspend()方法存在

- 如何挂起线程？

  可以使用的方法 wait() 暂停执行、放弃已经获得的锁、进入等待状态 notify() 随机唤醒一个在等待锁的线程 notifyAll() 唤醒所有在等待锁的线程，自行抢占cpu资源

  ~~~java
  public class WaitDemo implements Runnable{
  
      private static Object object = new Object();
      private static Object waitObj = new Object();
  
      @Override
      public void run() {
          synchronized (waitObj){
              System.out.println(Thread.currentThread().getName() + "占用资源");
  
              try {
                  waitObj.wait();
              } catch (InterruptedException e) {
                  e.printStackTrace();
              }
          }
          System.out.println(Thread.currentThread().getName() + "释放资源");
      }
  
      public static void main(String[] args) throws InterruptedException {
          Thread thread = new Thread(new WaitDemo(),"对比线程");
          thread.start();
  
          Thread thread2 = new Thread(new WaitDemo(),"线程2");
          thread2.start();
          Thread.sleep(3000L);
          synchronized (waitObj){
              waitObj.notifyAll();
          }
      }
  }
  
  ~~~



