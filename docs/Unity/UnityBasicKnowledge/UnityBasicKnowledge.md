---
title: Unity基础知识
date: '2022-05-05 12:25:00'
sidebar: 'auto'
categories:
 - Unity
tags:
 - Unity
---

## 1切换场景

### 1.1同步加载场景

**同步加载的过程会阻塞线程**

~~~c#
SceneManager.LoadScene(1);//跳转到场景1
SceneManager.LoadScene("Sence/scene1");//跳转到场景Sence/scene1
~~~

若想保留原来的场景

~~~c#
SceneManager.LoadScene(1,LoadSceneMode.Additive);//跳转到场景1,并保留原场景
~~~

### 1.2异步加载场景

**异步不会阻塞线程，可以在加载时执行一些代码，例如同步每个玩家的加载进度**

使用异步加载通常使用**携程**

~~~c#
SceneManager.LoadSceneAsync(1);//跳转到场景1
SceneManager.LoadSceneAsync("Sence/scene1");//跳转到场景Sence/scene1
~~~

返回值会返回一个*AsyncOperation*类

**Q1**：*AsyncOperation*类有什么用？

- AsyncOperation.isDone用来判断是否加载完成，实际上用到较少，因为当加载完毕且开启跳转，跳转成功了才会变为完成
- AsyncOperation.allowSceneActivation加载完成后是否允许跳转。若我们不允许，即便加载完成了也不能跳转
- AsyncOperation. progress表示加载进度，实际上到0.9就已经加载完了，如果需要按这个进度实现加载进度条，需要做一些处理

~~~c#
private IEnumerator Load()
{
    AsyncOperation asyncOperation = SceneManager.LoadSceneAsync("Sence/scene1");
    asyncOperation.allowSceneActivation = false;//不允许跳转
    while (asyncOperation.progress < 0.9f)//判断场景是否加载完成
    {
        Debug.Log("当前的加载进度是:" + asyncOperation.progress);
        yield return null;//等待一帧
    }
    asyncOperation.allowSceneActivation = true;//加载完成允许跳转
    if (asyncOperation.isDone)//判断是否跳转成功
    {
        Debug.Log("加载跳转完毕");
    }
    else
    {
        Debug.Log("还没加载跳转完毕");
    }
}
~~~

### 1.3加载场景时保留物体

~~~c#
GameObject cube = GameObject.Find("Cube");
DontDestroyOnLoad(cube);
~~~

## 2游戏物体

### 2.1加载Resource内的物体

~~~c#
GameObject gameObject = Resource.Load<GameObject>("hero");//加载hero
GameObject.Instantiate(gameObject);//克隆物体
~~~

### 2.2通过脚本控制物体

**增加**

~~~c#
GameObject newObject = GameObject.Instantiate(gameObject);
//把物体放到某个物体下
newObject.transform.parent = gameObjectParent;
~~~

**删除**

~~~c#
Destroy(gameObject);
Destroy(gameObject,5);//5秒后销毁
~~~

**查找**

~~~ c#
GameObject gameObject1 = GameObject.Find("cube");//按照路径查找
GameObject gameObject2 = GameObject.FindGameObjectWithTag("player");//按照标签查找
~~~

**显示/隐藏**

~~~c#
gameObject.SetActive(false);//隐藏
gameObject.SetActive(true);//显示
~~~

**修改名称**

~~~ c#
gameObject.name = "Cube";
~~~

**修改位置**

~~~ c#
//修改世界坐标
gameObject.transform.position = Vector3.zero;//Vector3.zero表示世界坐标的原点，相当于0,0,0
//修改局部坐标
gameObject.transform.localPosition = new Vector3(0,0,0);
~~~

**缩放**

~~~c#
gameObject.transform.localScale = new Vector3(5,5,5);
~~~

**旋转**

~~~c#
gameObject.transform.rotation = Quaternion.Euler(0,90,90);
gameObject.transform.eulerAngles = new Vector3(0,90,90);
~~~

## 3组件管理

### 3.1添加组件

~~~c#
gameObject.AddComponent<AudioSource>();//添加音频源组件
~~~

### 3.2查找组件

#### 3.2.1单个查找

**查找自身**

~~~c#
gameObject.GetComponent<Text>();//查找Text组件
~~~

**查找自身及子物体**

先找自身，若找不到组件，再找子物体

~~~c#
gameObject.GetComponentInChildren<Text>();
~~~

**查找自身及父物体**

先找自身，若找不到组件，再找父物体

~~~c#
gameObject.GetComponentInParent<Text>();
~~~

#### 3.2.2查找多个同类型组件

返回存放组件的数组

**查找自身**

~~~c#
AudioSource[] audioSource = gameObject.GetComponents<AudioSource>();//查找AudioSource组件
~~~

**查找自身及子物体**

~~~c#
AudioSource[] audioSource = gameObject.GetComponentsInChildren<AudioSource>();
~~~

**查找自身及父物体**

~~~c#
AudioSource[] audioSource = gameObject.GetComponentsInParent<AudioSource>();
~~~

### 3.3激活/关闭组件

~~~c#
gameObject.GetComponents<AudioSource>().enabled = false;//关闭组件
gameObject.GetComponents<AudioSource>().enabled = true;//激活组件
//关闭自身代码组件
this.enabled=false;
~~~

### 3.4删除组件

~~~c#
AudioSource audioSource = gameObject.GetComponents<AudioSource>();
Destroy(audioSource);
~~~



## 4UGUI图形交互系统

### 4.1输入框 InputField

~~~c#
InputField inputField = transform.Find("UserInputField").GetComponent<InputField>();//获取组件
string str = inputField.text;//获取输入框的值
~~~

### 4.2按钮 Button

~~~c#
Button button = transform.Find("LoginBtn").GetComponent<Button>();//获取组件
//添加点击事件
button.onClick.AddListener(LoginBtnOnClick);//目标函数需要无返回值
void LoginBtnOnClick()
{
	//打开网站
    Application.OpenURL("https://lol.qq.com/main.shtml");
}
~~~

### 4.3图片 Image

~~~c#
public Sprite bg;
transform.Find("BG").GetComponent<Image>().sprite = bg;//将图片的精灵修改为bg
//获取Image的宽高
float width = transform.Find("BG").GetComponent<Image>().sizeDelta.x;//宽
float height = transform.Find("BG").GetComponent<Image>().sizeDelta.y;//高
~~~

- Outline组件可以加描边
- Shadow组件可以加投影

### 4.4文本 Text

~~~c#
transform.Find("Text").GetComponent<Text>().text = "...";//修改文本框的文本
~~~

### 4.5开关 Toggle

~~~c#
Toggle toggle = transform.Find("Toggle").GetComponent<Toggle>();
//勾选框是否勾选
if(toggle.isOn){
    //...
}
~~~

可以使用开关组组件Toggle Group实现单选

### 4.6滑动条 Slider

~~~c#
Slider slider = transform.Find("Slider").GetComponent<Slider>();
//滑动条值改变事件
slider.onValueChanged.AddListener(OnValueChanged);
void OnValueChanged(float value)//必须要有float形参
{
	Debug.Log(slider.value);//打印滑动条的值 range(0,1)
}
~~~

**通过两个Image实现滑动条效果**

![image-20220207210732582](/UnityBasicKnowledge.assets/image-20220207210732582.png)

~~~c#
Image image = ...;
image.fillAmount = 0.38f;//进度条调整到38%的位置处
~~~



### 4.7滚动窗口

- Grid Layout Group网格布局组件
- Horizontal Layout Group水平布局组件
- Vertical Layout Group垂直布局组件
- Layout Element布局元素
- Content Size Fitter内容尺寸适配器

## 5用户输入管理

### 5.1虚拟轴

**较多应用在对角色的控制上**

可以在Edit/Project Settings/Input Manager内查看、编辑轴

~~~c#
//通过wasd控制物体
void Update()
{
    float horizontal = Input.GetAxis("Horizontal");//得到水平轴
    float vertical = Input.GetAxis("Vertical");//得到垂直轴
    if(horizontal != 0)//如果水平轴有变化，即按下AD或者←→
    {
        //旋转
        //transform.position = new Vector3(transform.position.x + horizontal * 0.1f, transform.position.y, transform.position.z);
        //位移
        transform.eulerAngles = new Vector3(transform.eulerAngles.x, transform.eulerAngles.y + horizontal * 0.1f, transform.eulerAngles.z);
    }
    if(vertical != 0)//如果垂直轴有变化，即按下WS或者↑↓
    {
        //位移
        transform.position = new Vector3(transform.position.x, transform.position.y, transform.position.z + vertical * 0.1f);
    }
}
~~~

### 5.2获取键盘事件

**某个键是否被持续按下**

按下时为true

~~~c#
if (Input.GetKey("a"))//按住a时
{
    //...
}
if (Input.GetKey(KeyCode.A))//按住a时
{
	//...
}
~~~

**某个键是否被按下**

按下的那一瞬间为true

~~~c#
if (Input.GetKeyDown("a"))//按下a时
{
    //...
}
if (Input.GetKeyDown(KeyCode.A))//按下a时
{
	//...
}
~~~

**某个键是否被弹起**

弹起的那一瞬间为true

~~~c#
if (Input.GetKeyUp("a"))//松开a时
{
    //...
}
if (Input.GetKeyUp(KeyCode.A))//松开a时
{
	//...
}
~~~

### 5.3获取鼠标事件

参数0是左键/1是右键/2是中键

**当按钮按下**

~~~c#
if (Input.GetMouseButtonDown(0))//按下左键
{
	//...
}
~~~

**当按钮抬起**

~~~c#
if (Input.GetMouseButtonUp(0))//松开左键
{
	//...
}
~~~

**当按钮持续按下**

~~~c#
if (Input.GetMouseButton(0))//按住左键
{
	//...
}
~~~

**鼠标位置获取**

~~~c#
//鼠标左键按下时，图片跟随鼠标移动
bool isDown = false;
void Update()
{
	if (Input.GetMouseButtonDown(0))//左键按下时
    {
		isDown = true;
	}
	if (Input.GetMouseButtonUp(0))//左键松开时
	{
		isDown = false;
	}
	if (isDown)
	{
		GameObject gameObject = GameObject.Find("Canvas/Image");//得到需要跟随的图片
		gameObject.transform.position = Input.mousePosition;//得到鼠标的位置
	}
}

~~~

### 5.4移动设备输入

**Input.touchCount**

最后一帧有多少根手指触碰到了，不同设备能追踪到的数量不同，苹果一般最多能支持五根手指。

~~~c#
Debug.Log("当前有:" + Input.touchCount + "根手指触碰到了屏幕");
~~~

**Input.touches**

存储每根手指状态的数组，可以通过索引来访问每根手指的一些信息

- finggerid 触摸的唯一索引
- position 手指所在的位置
- deltaPosition 自上一帧到当前帧的位置变化，返回二维向量

~~~c#
if(Input.touchCount > 0)
{
    Debug.Log("当前手指信息为" + Input.touches[0].finggerid);
    Debug.Log("当前手指位置为" + Input.touches[0].position);
    Debug.Log("当前手指位置变化为" + Input.touches[0].deltaPosition);  
}
~~~

## 6 3D物理系统

### 6.1刚体Rigidbody

**常用属性**

- Mass 质量：不同物体间的质量最好不要超过一百倍
- Drag 阻力：空气阻力，影响直线移动效果
- Angular Drag 角阻力：影响旋转效果
- Use Gravity 使用重力
- Is Kinematic 是否符合运动学：若勾选会导致物体不受物理引擎的驱动，仅拥有碰撞模型，可与其他物理发生碰撞
- Collision Detection 碰撞检测
- Constraints 约束条件：冻结某个轴的位置或旋转不受物理效果影响

**刚体休眠和唤醒**

~~~c#
Rigidbody rig = transform.GetComponent<Rigidbody>();
rig.Sleep();//强制刚体休眠
rig.WakeUp();//唤醒休眠中的刚体
~~~



### 6.2恒力Constant Force

**常用属性**

- Force 绝对力：施加在世界坐标的力，按照世界坐标来移动
- Relative Force 相对力：施加在本地坐标的力，按照本地坐标来移动
- Torque 绝对扭矩力：施加在世界坐标的扭矩力，按照世界坐标来旋转
- Relative Torque 相对扭矩力：施加在本地坐标的扭矩力，按照本地坐标来旋转

**常用api**

![image-20220214192632921](/UnityBasicKnowledge.assets/image-20220214192632921.png)

~~~ c#
Rigidbody rig = transform.GetComponent<Rigidbody>();
//刚体速度
rig.velocity = new Vector3(0, 0, 5);
//添加绝对力
rig.AddForce(new Vector3(0, 0, 10f));
//添加相对力
rig.AddRelativeForce(new Vector3(0, 0, 10f));
//添加绝对扭矩力
rig.AddTorque(new Vector3(0, 0, 10f));
//添加相对扭矩力
rig.AddRelativeTorque(new Vector3(0, 0, 10f));
//添加爆炸力(爆炸力度，爆炸位置，爆炸范围)
rig.AddExplosionForce(500f, transform.position, 10f);
~~~

### 6.3碰撞器Collider和触发器Trigger

**常用api**

碰撞器

碰撞检测条件

- 都需要有碰撞器组件且都不能勾选为触发器
- 挂脚本的物体上有刚体组件

~~~c#
//当进入碰撞器时
private void OnCollisionEnter(Collision collision)
{
    //...
}
//当退出碰撞器时
private void OnCollisionExit(Collision collision)
{
    //...
}
//当停留在碰撞器时被调用
private void OnCollisionStay(Collision collision)
{
    //...
}
~~~

触发器

触发检测条件

- 都需要有碰撞器组件，至少有一个勾选为触发器
- 挂脚本的物体上有刚体组件

~~~c#
//当进入触发器时
private void OnTriggerEnter(Collider other)
{
    //...
}
//当退出触发器时
private void OnTriggerExit(Collider other)
{
    //...
}
//当停留在触发器时被调用
private void OnTriggerStay(Collider other)
{
    //...
}
~~~

### 6.4力的常用函数

~~~c#
Rigidbody rig = transform.GetComponent<Rigidbody>();
/*在指定位置添加力*/
//在指定位置上给物体添加力(力的向量，指定位置)
Vector3 direction = transform.position + new Vector3(0, 10, 0) - transform.position;
rig.AddForceAtPosition(direction, transform.position);

/*在物体重心上添加力*/
//添加绝对力
rig.AddForce(new Vector3(0, 0, 10f));
//添加相对力
rig.AddRelativeForce(new Vector3(0, 0, 10f));
//添加绝对扭矩力
rig.AddTorque(new Vector3(0, 0, 10f));
//添加相对扭矩力
rig.AddRelativeTorque(new Vector3(0, 0, 10f));
//添加爆炸力(爆炸力度，爆炸位置，爆炸范围)
rig.AddExplosionForce(500f, transform.position, 10f);
~~~

### 6.5物理材质

用来模拟摩擦力和弹力

### 6.6关节组件

- 弹簧关节
- 铰链关节
- 固定关节
- 角色关节
- 可配置关节

~~~c#
//当铰链断开时
private void OnJointBreak(float breakForce)//参数表示用了多大力断开的
{
    
}
~~~

### 6.7射线

**绘制射线**

~~~c#
/*在身前绘制长度为一米的可被遮挡的持续十秒的红色射线*/
Debug.DrawLine(transform.position, transform.position + transform.forward, Color.red, 10, true);//(开始位置，结束位置，射线颜色，持续时间，能否被遮挡)
Debug.DrawRay(transform.position, transform.forward, Color.red, 10, true);//(开始位置，射线向量，射线颜色，持续时间，能否被遮挡)
~~~

**从相机发出的射线**

重载1

~~~c#
Camera camera = GameObject.Find("Camera").GetComponent<Camera>();
if (Input.GetMouseButtonDown(0))//如果鼠标按下左键
{
    Ray ray = camera.ScreenPointToRay(Input.mousePosition);
    if (Physics.Raycast(ray,100f))//(射线,射线射出距离)
    {
        Debug.Log("命中了碰撞");
    }
    else
    {
        Debug.Log("没有命中");
    }
}
~~~

重载2

~~~c#
Camera camera = GameObject.Find("Camera").GetComponent<Camera>();
if (Input.GetMouseButtonDown(0))//如果鼠标按下左键
{
    Ray ray = camera.ScreenPointToRay(Input.mousePosition);
    RaycastHit hit;
    if (Physics.Raycast(ray,out hit,100f))//(射线,光线碰撞到的物体,射线射出距离)
    {
        Debug.Log("命中了碰撞，位置是：" + hit.point + " 物体名称是：" + hit.collider.gameObject.name);
    }
    else
    {
        Debug.Log("没有命中");
    }
}
~~~

重载3

~~~c#
if (Input.GetMouseButtonDown(0))//如果鼠标按下左键
{
    RaycastHit hit;
    if (Physics.Raycast(transform.position,transform.forward,out hit,100f,layerMask))//(射线起点,射线方向,光线碰撞到的物体,射线射出距离,遮罩过滤层级（可选）)
    {
        Debug.Log("命中了碰撞，位置是：" + hit.point + " 物体名称是：" + hit.collider.gameObject.name);
    }
    else
    {
        Debug.Log("没有命中");
    }
}
~~~

**得到被射线命中的物体信息**

~~~c#
Camera camera = GameObject.Find("Camera").GetComponent<Camera>();
if (Input.GetMouseButtonDown(0))//如果鼠标按下左键
{
    Ray ray = camera.ScreenPointToRay(Input.mousePosition);
    RaycastHit[] hit = Physics.RaycastAll(ray, 100f);//(射线,射线射出距离)
    for(int i = 0; i < hit.Length; i++)
    {
    	Debug.Log("第" + i + "个碰撞，位置是：" + hit[i].point + " 物体名称是：" + hit[i].collider.gameObject.name);
    }
}
~~~

**球形射线得到命中物体的信息**

~~~c#
Collider[] hitColliders = Physics.OverlapSphere(transform.position, 3f);//(球心位置,射线距离)
for (int i = 0; i < hitColliders.Length; i++)
{
    Debug.Log("第" + i + "个碰撞的物体名称是：" + hitColliders[i].gameObject.name);
}
~~~

## 7 2D物理系统

### 7.1 2D刚体 Rigidbody 2D

**常用属性**

- Mass 质量
- Linear Drag 线性阻尼
- Angular Drag 角阻力
- Gravity Scale 重力大小
- Collision Detection 碰撞检测
- Sleeping Mode 休眠模式
- Interpolate 插值
- Constraints 约束条件：冻结某个轴的位置或旋转不受物理效果影响

## 8动画系统

~~~c#
Animator animator = transform.GetComponent<Animator>();
if (Input.GetKeyDown(KeyCode.Alpha0))
{
	animator.SetInteger("id", 0);
}
~~~

## 9寻路系统

**基本寻路**

1、打开Window/AI/Navigation

2、Bake导航场景

3、给要导航的物体添加导航网格代理Nav Mesh Agent

~~~c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;
/// <summary>
/// 按下左键，移动到目标位置
/// </summary>
public class NavigationTest : MonoBehaviour
{
    NavMeshAgent navMeshAgent;
    void Start()
    {
        navMeshAgent = transform.GetComponent<NavMeshAgent>();
    }

    void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            RaycastHit hit;
            bool isCollider = Physics.Raycast(ray, out hit);
            if (isCollider)
            {
                navMeshAgent.SetDestination(hit.point);
            }
        }
    }
}
~~~



**动态障碍物**

Nav Mesh Obstacle组件

勾选Carve后，在移动障碍物后会重新Bake

**分离导航连接线**

Off Mesh Link组件

更优：Nav Mesh Link（需要导入NavMeshComponents文件）

**运行时动态烘焙网格**

需要导入NavMeshComponents文件

~~~c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;
/// <summary>
/// 按下右键，在目标位置添加障碍物并重新烘焙
/// </summary>
public class NavigationTest2 : MonoBehaviour
{
    public GameObject buildPrefab;
    private NavMeshSurface navMeshSurface;
    void Start()
    {
        navMeshSurface = GetComponent<NavMeshSurface>();
    }

    void Update()
    {
        if (Input.GetMouseButtonDown(1))
        {
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            RaycastHit hit;
            bool isCollider = Physics.Raycast(ray, out hit);
            if (isCollider)
            {
                GameObject go = Instantiate(buildPrefab, hit.point, Quaternion.identity);//创建障碍物
                go.transform.SetParent(this.transform);
                navMeshSurface.BuildNavMesh();//重新烘焙
            }
        }
    }
}

~~~

## 10音效系统

**常用组件**

- AudioClip 音频剪辑：设置要播放的音频
- Mute 静音
- Bypass Effects 绕过效果：可以快速“绕过”应用于音频远的滤波效果
- Play On Awake 唤醒时播放
- Loop 循环
- Priority 优先级：确定场景中所有并存的音频源的优先权，range(0,256)，0代表最高优先权
- Volume 音量
- Pitch 音调：影响音频的播放速度
- Spatial Blend 空间混合：设置3D引擎对音频源的影响程度
- 3D Sound Settings 3D声音设置：Min Distance最小距离，超过该距离声音就会减小；Max Distance最大距离，声音衰减的最大距离

~~~c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AudioTest : MonoBehaviour
{
    AudioSource audioSource;
    void Start()
    {
        audioSource = GetComponent<AudioSource>();//得到音频源
        audioSource.clip = Resources.Load<AudioClip>("bj4");//设置播放音频
    }

    void Update()
    {
        if (Input.GetKeyDown("a"))
        {
            if (!audioSource.isPlaying)
            {
                audioSource.Play();//播放
            }
            else
            {
                Debug.Log("音频已经在播放中了");
            }
        }
        if (Input.GetKeyDown("b"))
        {
            audioSource.Pause();//暂停
        }
        if (Input.GetKeyDown("c"))
        {
            audioSource.Stop();//停止
        }
    }
}

~~~

**音频过滤器**

用于对声音进行过滤的组件

- Audio Low Pass Filter 音频低通过滤器：抑制高频音，通行低频音（如雷声滚滚）
- Audio High Pass Filter 音频高通过滤器：抑制低频音，通行高频音（如尖锐刺耳的声音片段）
- Audio Chorus Filter 音频合音过滤器：合成由多个音频相同但略有不同的声音（如大合唱效果）
- Audio Distortion Filter 音频失真过滤器：对音频的失真处理（如模拟破收音机、对讲机的声音）
- Audio Echo Filter 音频回声过滤器：延迟重复一个声音（如模拟在峡谷中、雷声）
- Audio Reverb Filter 音频混响过滤器：对音频剪辑并失真，创建个性化的混响效果

**音频混响区Audio Reverb Zone**

获取音频剪辑并根据音频侦听器所在的混响区进行失真处理，用来模拟声音在不同区域的衰减及衍射效果

- MinDistance 最小距离
- MaxDistance 最大距离

**音频管理器**

Edit/Project Settings/Audio

设置一些全局的声音效果，如全局的声音大小，衰减因子等

- Global Volume 全局音量
- Volume Rolloff Scale音量衰减因子
- DSP Buffer Size DSP缓冲大小：调节缓冲区大小可以优化性能

## 11特效系统

### 11.1粒子系统

~~~c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ParticleTest : MonoBehaviour
{
    GameObject gameObject;
    ParticleSystem particleSystem;
    void Start()
    {
        gameObject = Instantiate(Resources.Load<GameObject>("22_RFX_Fire_Campfire1"),this.transform);
        gameObject.transform.position = transform.position;
        particleSystem = gameObject.GetComponent<ParticleSystem>();
        ParticleSystem.MainModule mainModule = particleSystem.main;
        mainModule.loop = true;
    }
    void Update()
    {
        if (Input.GetKeyDown("a"))
        {
            particleSystem.Play();
        }
        if (Input.GetKeyDown("b"))
        {
            particleSystem.Pause();
        }
        if (Input.GetKeyDown("c"))
        {
            particleSystem.Stop();
        }
        if (Input.GetKeyDown("d"))
        {
            Destroy(gameObject);
        }
    }
}

~~~

若要使用OnParticleCollision(GameObject other)API，需要如下设置

~~~c#
private void OnParticleCollision(GameObject other)
{
    Debug.Log("粒子发生了碰撞，碰撞到的物体名称为：" + other.name);
}
~~~



![image-20220211194043816](/UnityBasicKnowledge.assets/image-20220211194043816.png)

**粒子系统触发回调**

![image-20220211201152153](/UnityBasicKnowledge.assets/image-20220211201152153.png)

~~~c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ParticleTest : MonoBehaviour
{
    ParticleSystem particle;
    void Start()
    {
        particle = transform.GetComponent<ParticleSystem>();
    }

    private void OnParticleTrigger()
    {
        
        //用来缓存这一帧触发的粒子
        List<ParticleSystem.Particle> particles = new List<ParticleSystem.Particle>();
        //获取每一帧发生触发的粒子
        int numEnter = particle.GetTriggerParticles(ParticleSystemTriggerEventType.Enter, particles);
        if(numEnter!=0)
            print(numEnter);
        for(int i = 0; i < numEnter; ++i)
        {
            ParticleSystem.Particle pt = particles[i];
            pt.startColor = Color.red;
            particles[i] = pt;
        }
        //写回
        particle.SetTriggerParticles(ParticleSystemTriggerEventType.Enter, particles);
    }
}

~~~

### 11.2拖尾系统

~~~c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TrailTest : MonoBehaviour
{
    GameObject trail;
    void Start()
    {
        //克隆
        trail = GameObject.Instantiate(Resources.Load<GameObject>("Accelerate"));
        trail.transform.SetParent(this.transform);
        //调整局部坐标位置
        trail.transform.localPosition = new Vector3(0, 0.5f, 0);
    }

    void Update()
    {
        if (Input.GetKeyDown("a"))
        {
            trail.GetComponent<TrailRenderer>().emitting = true;//开启拖尾
        }
    }
}
~~~

## 12视频播放管理

Video Player组件

## 13DoTween补件动画插件

### 13.1空间物体位置旋转大小动画

~~~c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using DG.Tweening;

public class DotweenTest : MonoBehaviour
{
    void Start()
    {
        //世界坐标系位置位移
        transform.DOMove(new Vector3(-33, 244, 400), 2f);
        transform.DOMoveX(-33, 2f);
        transform.DOMoveY(244, 2f);
        transform.DOMoveZ(400, 2f);

        //本地坐标系位置位移
        transform.DOLocalMove(new Vector3(20, 20, 20), 2f);
        transform.DOLocalMoveX(20, 2f);
        transform.DOLocalMoveY(20, 2f);
        transform.DOLocalMoveZ(20, 2f);

        //世界坐标系角度旋转
        transform.DORotate(new Vector3(0, 20, 0), 2f);

        //本地坐标系角度旋转
        transform.DOLocalRotate(new Vector3(0, 20, 0), 2f);

        //物体大小的缩放
        transform.DOScale(new Vector3(2, 2, 2), 2f);
        transform.DOScaleX(2, 2f);
        transform.DOScaleY(2, 2f);
        transform.DOScaleZ(2, 2f);

        //世界坐标系位置跳跃
        transform.DOJump(new Vector3(-30, 250, 410), 1, 5, 5f);//(位置,力度,步数,时间)

        //本地坐标系位置跳跃
        transform.DOLocalJump(new Vector3(-30, 250, 410), 1, 5, 5f);//(位置,力度,步数,时间)

        //物体弹簧位置冲击
        transform.DOPunchPosition(new Vector3(10, 0, 0), 3f, 10, 1);//(位置,时间,振幅,弹性)

        //物体弹簧角度冲击
        transform.DOPunchRotation(new Vector3(10, 0, 0), 3f, 10, 1);//(位置,时间,振幅,弹性)

        //物体弹簧位置冲击
        transform.DOPunchScale(new Vector3(10, 0, 0), 3f, 10, 1);//(位置,时间,振幅,弹性)

        //旋转目标,使其朝向某个指定的位置方向
        transform.DOLookAt(new Vector3(1, 1, 1), 2f);//(位置,时间)

        //位置增量
        transform.DOBlendableMoveBy(new Vector3(20, 0, 0), 2f);

        //旋转增量
        transform.DOBlendableRotateBy(new Vector3(20, 0, 0), 2f);

        //缩放增量
        transform.DOBlendableScaleBy(new Vector3(20, 0, 0), 2f);
    }
}
~~~

### 13.2颜色、透明度的控制

~~~c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using DG.Tweening;

public class DotweenTest : MonoBehaviour
{
    public Gradient gradient;
    void Start()
    {
        //更改颜色
        Material material = GetComponent<MeshRenderer>().material;
        material.DOColor(Color.green, 2f);

        //更改透明度
        material.DOFade(0, 2f);

        //颜色渐变
        material.DOGradientColor(gradient, 2f);
    }
}
~~~

### 13.4震动效果表现

~~~c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using DG.Tweening;

public class DotweenTest : MonoBehaviour
{
    void Start()
    {
        //随机震动效果
        //位置震动
        transform.DOShakePosition(2f);
        
        //角度震动
        transform.DOShakeRotation(2f);

        //缩放震动
        transform.DOShakeScale(2f);
    }
}
~~~

### 13.5物体路径动画

![image-20220212155719338](/UnityBasicKnowledge.assets/image-20220212155719338.png)

~~~c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using DG.Tweening;

public class DotweenTest : MonoBehaviour
{
    void Start()
    {
        Vector3[] path = new Vector3[] { new Vector3(0, 0, 0), new Vector3(3, 32, 1), new Vector3(7, 59, 37) };
        transform.DOPath(path, 5f, PathType.CatmullRom, PathMode.Full3D, 10, Color.red);
    }
}
~~~

或者添加DoTween Path组件

### 13.6动画序列

![image-20220212160800800](/UnityBasicKnowledge.assets/image-20220212160800800.png)

~~~c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using DG.Tweening;

public class DotweenTest : MonoBehaviour
{
    void Start()
    {
        //队列动画
        Sequence sequence = DOTween.Sequence();
        sequence.Append(transform.DOBlendableMoveBy(new Vector3(0, 10, 0), 2f));
        sequence.Insert(0f, transform.DOBlendableMoveBy(new Vector3(0, 0, 10), 2f));
        sequence.AppendCallback(() =>
        {
            Debug.Log("AppendCallback1");
        });
        sequence.AppendInterval(2f);//等待两秒
        sequence.Append(transform.DOBlendableMoveBy(new Vector3(10, 0, 0), 2f));
        sequence.AppendCallback(() =>
        {
            Debug.Log("AppendCallback2");
        });
    }
}
~~~

### 13.7动画常用设置及动画控制

![image-20220212204514231](/UnityBasicKnowledge.assets/image-20220212204514231.png)

~~~c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using DG.Tweening;

public class DotweenTest : MonoBehaviour
{
    Tweener tweener;
    void Start()
    {
        //常用设置
        tweener = transform.DOLocalMoveX(10, 2f).SetEase(Ease.Linear).SetLoops(-1, LoopType.Restart);
    }
}
~~~

### 13.8动画的回调

![image-20220212211937364](/UnityBasicKnowledge.assets/image-20220212211937364.png)

~~~c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using DG.Tweening;

public class DotweenTest : MonoBehaviour
{
    Tweener tweener;
    void Start()
    {
        //常用设置
        tweener = transform.DOLocalMoveX(10, 2f).SetEase(Ease.Linear);
        tweener.OnComplete(()=> 
        {
            Debug.Log("OnComplete");
        });
    }
}
~~~

## 14EasyTouch手势插件

### 14.1基本用法

需要添加EasyTouch物体

~~~c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HedgehogTeam.EasyTouch;
using System;

public class EasytouchTest : MonoBehaviour
{
    void Start()
    {
        
    }

    void Update()
    {
        //使用Easytouch.current 记录玩家输入的手势
        Gesture gesture = EasyTouch.current;
        if (gesture != null)
        {
            if (EasyTouch.EvtType.On_TouchStart == gesture.type)//触摸开始时
            {
                OnTouchStart(gesture);
            }
            else if(EasyTouch.EvtType.On_Drag == gesture.type)//拖拽时
            {
                OnDrag(gesture);
            }
        }
    }

    private void OnDrag(Gesture gesture)
    {
        Debug.Log(gesture.type);
    }

    private void OnTouchStart(Gesture gesture)
    {
        Debug.Log(gesture.type);
    }
}
~~~

### 14.2使用可视化组件QuickGesture检测常用手势及Trigger

![image-20220213002925705](/UnityBasicKnowledge.assets/image-20220213002925705.png)

Trigger组件

### 14.3Easytouch组件核心参数

![image-20220213004954823](/UnityBasicKnowledge.assets/image-20220213004954823.png)

### 14.4Joystick虚拟摇杆

ETC Joystick组件

![image-20220213005508461](/UnityBasicKnowledge.assets/image-20220213005508461.png)

~~~c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PacmanMove : MonoBehaviour {
    //移动速度
    public float moveSpeed;

    private Rigidbody2D rb;
    private SelfAnim animator;
	// Use this for initialization
	void Start () {
        rb = GetComponent<Rigidbody2D>();
        animator = GetComponent<SelfAnim>();
    }
	
	// Update is called once per frame
	void Update () {
        if (GameMgr.Instance.isStartGame)
        {
            if (Input.GetKey(KeyCode.D) || ETCInput.GetAxisPressedRight("Horizontal"))
            {
                Vector2 dest = rb.position + Vector2.right * moveSpeed;
                rb.MovePosition(dest);
                animator.ChangeDir(SelfAnim.Anim_Dir.Right);
            }
            else if (Input.GetKey(KeyCode.A) || ETCInput.GetAxisPressedLeft("Horizontal"))
            {
                Vector2 dest = rb.position + Vector2.left * moveSpeed;
                rb.MovePosition(dest);
                animator.ChangeDir(SelfAnim.Anim_Dir.Left);
            }
            else if (Input.GetKey(KeyCode.W) || ETCInput.GetAxisPressedUp("Vertical"))
            {
                Vector2 dest = rb.position + Vector2.up * moveSpeed;
                rb.MovePosition(dest);
                animator.ChangeDir(SelfAnim.Anim_Dir.Up);
            }
            else if (Input.GetKey(KeyCode.S) || ETCInput.GetAxisPressedDown("Vertical"))
            {
                Vector2 dest = rb.position + Vector2.down * moveSpeed;
                rb.MovePosition(dest);
                animator.ChangeDir(SelfAnim.Anim_Dir.Down);
            }
        }
    }
}
~~~

## 15平台打包操作

### 15.1Windows平台

![image-20220213013031091](/UnityBasicKnowledge.assets/image-20220213013031091.png)
