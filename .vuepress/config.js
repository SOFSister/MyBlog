module.exports = {
  base: '/',
  locales: {
    '/': {
      lang: 'zh-CN'
    }
  },
  "title": "feedsheep", //这里是博客标题
  "description": "feedsheep's boring life", //博客描述
  //"dest": "public", //博客部署时输出的文件夹
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/logo.png"
      } //favicon图标设置
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  "theme": "reco", //vuepress挂载的主题
  "themeConfig": {
    //导航栏
    "nav": require("./nav.js"),
    //侧边栏设置
    "sidebar": require("./sidebar.js"),
    "type": "blog",
    // 博客设置
    "blogConfig": {
      "category": {
        "location": 2, // 在导航栏菜单中所占的位置，默认2
        "text": "分类" // 默认 “分类”
      },
      "tag": {
        "location": 3, // 在导航栏菜单中所占的位置，默认3
        "text": "标签" // 默认 “标签”
      }
    },
    //友情链接
    "friendLink": [{
        "title": "bilibili",
        "logo": "/img/friendLink/bilibili.png",
        "link": "https://www.bilibili.com/"
      },
      {
        "title": "csdn",
        "logo": "/img/friendLink/csdn.png",
        "link": "https://www.csdn.net/"
      },
      {
        "title": "杭师大教务处",
        "logo": "/img/friendLink/HZNUOffice.png",
        "link": "http://jwxt.hznu.edu.cn"
      },
      {
        "title": "中国知网",
        "logo": "/img/friendLink/ChinaKnowledgeNetwork.png",
        "link": "https://www.cnki.net/"
      },
      {
        "title": "学习强国题库",
        "logo": "/img/friendLink/LearningPowerQuestionBank.png",
        "link": "http://www.syiban.com/"
      },
      {
        "title": "学习通",
        "logo": "/img/friendLink/LearningPass.png",
        "link": "https://i.chaoxing.com"
      },
      {
        "title": "Java全栈知识体系",
        "logo": "/img/friendLink/JavaFullStackKnowledgeSystem.png",
        "link": "https://pdai.tech/"
      }
    ],
    //关闭404腾讯公益
    noFoundPageByTencent: false,
    //博客自定义LOGO
    "logo": "/logo.png",
    // 搜索设置
    "search": true,
    "searchMaxSuggestions": 10,
    // 自动形成侧边导航
    subSidebar: 'auto',
    // 最后更新时间
    "lastUpdated": "Last Updated",
    // 作者
    "author": "feedsheep",
    // 作者头像
    "authorAvatar": "/avatar.jpg",
    // 备案号
    "record": "xxxx",
    // 项目开始时间
    "startYear": "2022",
    /**
     * 密钥 (if your blog is private)
     */

    //私有仓库key和密码
    // keyPage: {
    //   keys: ['your password'],
    //   color: '#42b983',
    //   lineColor: '#42b983'
    // },

    /**
     *评论
     * valine 设置 (if you need valine comment )
     */

    // valineConfig: {
    //   appId: '...',// your appId
    //   appKey: '...', // your appKey
    // }
  },
  "markdown": {
    "lineNumbers": true
  },
  plugins: [
    [
      "@vuepress-reco/vuepress-plugin-bgm-player", {
        audios: [{
            name: '搁浅',
            artist: '周杰伦 / 七里香',
            url: '/audio/RunAground.mp3',
            cover: '/img/music/RunAground.png'
          },
          {
            name: '花海',
            artist: '周杰伦 / 魔杰座',
            url: '/audio/SeaOfFlowers.mp3',
            cover: '/img/music/SeaOfFlowers.png'
          },
          {
            name: '半岛铁盒',
            artist: '周杰伦 / 八度空间',
            url: '/audio/PeninsulaIronBox.mp3',
            cover: '/img/music/PeninsulaIronBox.png'
          },
          {
            name: '蒲公英的约定',
            artist: '周杰伦 / 我很忙',
            url: '/audio/DandelionAgreement.mp3',
            cover: '/img/music/DandelionAgreement.png'
          }
        ]
      }
    ],
    ["ribbon-animation", {
      size: 90, // 默认数据
      opacity: 0.3, //  透明度
      zIndex: -1, //  层级
      opt: {
        // 色带HSL饱和度
        colorSaturation: "80%",
        // 色带HSL亮度量
        colorBrightness: "60%",
        // 带状颜色不透明度
        colorAlpha: 0.65,
        // 在HSL颜色空间中循环显示颜色的速度有多快
        colorCycleSpeed: 6,
        // 从哪一侧开始Y轴 (top|min, middle|center, bottom|max, random)
        verticalPosition: "center",
        // 到达屏幕另一侧的速度有多快
        horizontalSpeed: 200,
        // 在任何给定时间，屏幕上会保留多少条带
        ribbonCount: 2,
        // 添加笔划以及色带填充颜色
        strokeSize: 0,
        // 通过页面滚动上的因子垂直移动色带
        parallaxAmount: -0.5,
        // 随着时间的推移，为每个功能区添加动画效果
        animateSections: true
      },
      ribbonShow: false, //  点击彩带  true显示  false为不显示
      ribbonAnimationShow: true // 滑动彩带
    }],
    ["vuepress-plugin-nuggets-style-copy", {
      copyText: "复制代码", //vuepress复制粘贴提示插件P 先安装在配置 npm install vuepress-plugin-nuggets-style-copy --save
      tip: {
        content: "复制成功!"
      }
    }],
    [
      //图片放大插件 先安装在配置， npm install @vuepress\plugin-medium-zoom --save
      '@vuepress\plugin-medium-zoom', {
        selector: '.page img',
        delay: 1000,
        options: {
          margin: 24,
          background: 'rgba(25,18,25,0.9)',
          scrollOffset: 40
        }
      }
    ],
    [
      'copyright',
      {
        authorName: 'feedsheep', // 选中的文字将无法被复制
        minLength: 30, // 如果长度超过  30 个字符
      }
    ],
    ['@vuepress/active-header-links', {
      sidebarLinkSelector: '.sidebar-link',
      headerAnchorSelector: '.header-anchor'
    }]
  ]
}