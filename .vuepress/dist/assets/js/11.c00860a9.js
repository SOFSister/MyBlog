(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{750:function(s,a,e){"use strict";e.r(a);var t=e(12),i=Object(t.a)({},(function(){var s=this,a=s.$createElement,e=s._self._c||a;return e("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[e("h2",{attrs:{id:"两种版本控制工具"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#两种版本控制工具"}},[s._v("#")]),s._v(" "),e("strong",[s._v("两种版本控制工具")])]),s._v(" "),e("ul",[e("li",[e("p",[s._v("集中式版本控制工具")]),s._v(" "),e("ul",[e("li",[e("p",[s._v("SVN")]),s._v(" "),e("ul",[e("li",[e("p",[s._v("定义")]),s._v(" "),e("p",[s._v("版本库是集中放在中央服务器的，而开发的时候，用的都是自己的电脑，所以首先要从中央服务器哪里得到最新的版本，然后更改，完成后，需要把自己做的更改推送到中央服务器。集中式版本控制系统是必须联网才能工作，如果在局域网还可以，带宽够大，速度够快，如果在互联网下，网速慢的话，传输非常慢")])]),s._v(" "),e("li",[e("p",[s._v("缺点")]),s._v(" "),e("ul",[e("li",[s._v("服务器单点故障时无法更新版本")]),s._v(" "),e("li",[s._v("容错性差（中央服务器磁盘损坏时全部数据将丢失，只剩各个电脑上的单独快照也就是更改记录）")])])])])])])]),s._v(" "),e("li",[e("p",[s._v("分布式版本控制工具")]),s._v(" "),e("ul",[e("li",[e("p",[s._v("git")]),s._v(" "),e("ul",[e("li",[e("p",[s._v("定义")]),s._v(" "),e("p",[s._v("没有中央服务器，每个人的电脑就是一个完整的版本库，这样开发的时候就不需要联网了，因为版本都是在自己的电脑上。既然每个人的电脑都有一个完整的版本库，那多个人如何协作呢？比如说自己在电脑上改了文件A，其他人也在电脑上改了文件A，这时，你们两之间只需把各自的修改推送到代码托管中心gitee（国内）、github、gitlab，就可以互相看到对方的修改了")])]),s._v(" "),e("li",[e("p",[s._v("优点")]),s._v(" "),e("ul",[e("li",[s._v("断网情况下，也可以进行版本控制（本地仓库）")]),s._v(" "),e("li",[s._v("每个客户端保存的都是完整的项目（包含历史记录，更加安全）")])])])])])])])]),s._v(" "),e("h2",{attrs:{id:"git工作机制"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#git工作机制"}},[s._v("#")]),s._v(" "),e("strong",[s._v("Git工作机制")])]),s._v(" "),e("p",[e("img",{attrs:{src:"/GitGrammar.assets/image-20220225235755596.png",alt:"image-20220225235755596"}})]),s._v(" "),e("h2",{attrs:{id:"git安装"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#git安装"}},[s._v("#")]),s._v(" Git安装")]),s._v(" "),e("ul",[e("li",[e("p",[s._v("window")]),s._v(" "),e("p",[s._v("安装教程：https://www.yuque.com/u1106272/cai80g/skawco")])])]),s._v(" "),e("h2",{attrs:{id:"git初始化设置"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#git初始化设置"}},[s._v("#")]),s._v(" Git初始化设置")]),s._v(" "),e("ul",[e("li",[e("p",[s._v("设置用户签名（初始化时设置）")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v('git config --global user.name "dazhao"\ngit config --global user.email "1021199182@qq.com"\n')])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br"),e("span",{staticClass:"line-number"},[s._v("2")]),e("br")])])]),s._v(" "),e("li",[e("p",[s._v("查看")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("git config user.name\ngit config user.email\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br"),e("span",{staticClass:"line-number"},[s._v("2")]),e("br")])])]),s._v(" "),e("li",[e("p",[s._v("注意")]),s._v(" "),e("ul",[e("li",[s._v("在每一个版本的提交信息上显示，本次提交的作者是谁")]),s._v(" "),e("li",[s._v("首次安装必须设置，否则无法提交代码")]),s._v(" "),e("li",[s._v("跟之后设置gitee账号没关系")])])]),s._v(" "),e("li",[e("p",[s._v("初始化本地仓库")]),s._v(" "),e("ul",[e("li",[e("p",[s._v("创建一个文件夹")])]),s._v(" "),e("li",[e("p",[s._v("在终端中进入这个文件夹")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("git init\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])])]),s._v(" "),e("li",[e("p",[s._v("查看本地仓库状态")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("git status\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])])])])]),s._v(" "),e("li",[e("p",[s._v("查看修改的作者")]),s._v(" "),e("ul",[e("li",[e("p",[s._v("安装插件GitLens")])]),s._v(" "),e("li",[e("p",[s._v("在settings.json添加设置")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v('"git.path": "D:/Program Files/Git/mingw64/bin/git.exe",\n')])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])]),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v('"editor.renameOnType": true,\n')])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])])]),s._v(" "),e("li",[e("p",[s._v("重启vscode")])])])])]),s._v(" "),e("h2",{attrs:{id:"添加暂存区"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#添加暂存区"}},[s._v("#")]),s._v(" 添加暂存区")]),s._v(" "),e("ul",[e("li",[e("p",[s._v("添加暂存区")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("git add .\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])])]),s._v(" "),e("li",[e("p",[s._v("从暂存区中删除文件（在工作区还是保存着这个文件）")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("git rm --cached xxx\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])])])]),s._v(" "),e("h2",{attrs:{id:"提交本地仓库"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#提交本地仓库"}},[s._v("#")]),s._v(" 提交本地仓库")]),s._v(" "),e("ul",[e("li",[e("p",[s._v("提交本地仓库")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v('git commit -m "本次修改的信息"\n')])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])])]),s._v(" "),e("li",[e("p",[s._v("查看版本提交历史信息")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("git reflog\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])])]),s._v(" "),e("li",[e("p",[s._v("查看详细的日志信息")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("git log\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])]),e("p",[s._v("按下q退出")])])]),s._v(" "),e("h2",{attrs:{id:"版本历史回滚"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#版本历史回滚"}},[s._v("#")]),s._v(" 版本历史回滚")]),s._v(" "),e("ul",[e("li",[e("p",[s._v("查看历史版本信息")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("git reflog\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])])]),s._v(" "),e("li",[e("p",[s._v("选择要回滚的版本号")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("git reset --hard  xxxxxxx\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])])])]),s._v(" "),e("h2",{attrs:{id:"分支的基本操作"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#分支的基本操作"}},[s._v("#")]),s._v(" "),e("strong",[s._v("分支的基本操作")])]),s._v(" "),e("ul",[e("li",[e("p",[s._v("创建分支")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("git branch 分支名 \n\n注意：此时新分支是复制当前所在的分支\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br"),e("span",{staticClass:"line-number"},[s._v("2")]),e("br"),e("span",{staticClass:"line-number"},[s._v("3")]),e("br")])])]),s._v(" "),e("li",[e("p",[s._v("查看分支")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("git branch \n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])])]),s._v(" "),e("li",[e("p",[s._v("切换分支")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("git checkout 目标分支\n\n注意：切换分支前需将当前分支的修改提交仓库\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br"),e("span",{staticClass:"line-number"},[s._v("2")]),e("br"),e("span",{staticClass:"line-number"},[s._v("3")]),e("br")])])]),s._v(" "),e("li",[e("p",[s._v("删除分支")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("git branch -d 分支名\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])]),e("p",[s._v("强制删除")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("git branch -D 分支名 \n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])])])]),s._v(" "),e("h2",{attrs:{id:"分支合并"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#分支合并"}},[s._v("#")]),s._v(" "),e("strong",[s._v("分支合并")])]),s._v(" "),e("ul",[e("li",[e("p",[s._v("合并分支")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("git merge 源分支\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])])]),s._v(" "),e("li",[e("p",[s._v("合并冲突")]),s._v(" "),e("ul",[e("li",[s._v("当两个分支修改同一文件代码时合并会发生冲突")]),s._v(" "),e("li",[s._v("选择要保存下来的修改重新提交")])])])]),s._v(" "),e("h2",{attrs:{id:"本地连接远程仓库"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#本地连接远程仓库"}},[s._v("#")]),s._v(" 本地连接远程仓库")]),s._v(" "),e("ul",[e("li",[e("p",[s._v("本地连接远程仓库")]),s._v(" "),e("ul",[e("li",[e("p",[s._v("确保当前分支代码已经干净")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("git remote add origin https://gitee.com/wen_zhao/xdclass.git\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])])]),s._v(" "),e("li",[e("p",[s._v("验证账户密码(gitee账号密码)")])]),s._v(" "),e("li",[e("p",[s._v("将本地仓库push远程仓库")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("git pull origin master --allow-unrelated-histories\n\ngit push -u origin master\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br"),e("span",{staticClass:"line-number"},[s._v("2")]),e("br"),e("span",{staticClass:"line-number"},[s._v("3")]),e("br")])])]),s._v(" "),e("li",[e("p",[s._v("本地覆盖线上仓库")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("git push -f origin master   \n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])])])])]),s._v(" "),e("li",[e("p",[s._v("无本地仓库直接拉取")]),s._v(" "),e("ul",[e("li",[e("p",[s._v("https方式")]),s._v(" "),e("ul",[e("li",[e("p",[s._v("没有验证账号密码时，需要验证")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("git clone https://gitee.com/wen_zhao/xdclass.git\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])])])])]),s._v(" "),e("li",[e("p",[s._v("ssh方式")]),s._v(" "),e("ul",[e("li",[e("p",[s._v("生成本地电脑公钥")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v('ssh-keygen -t ed25519 -C "xxx" \n')])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])])]),s._v(" "),e("li",[e("p",[s._v("查看公钥")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("cat ~/.ssh/id_ed25519.pub \n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])])]),s._v(" "),e("li",[e("p",[s._v("在远程仓库中添加")]),s._v(" "),e("p",[e("img",{attrs:{src:"/GitGrammar.assets/image-20220505000555620.png",alt:"image-20220505000555620"}})])]),s._v(" "),e("li",[e("p",[s._v("克隆仓库到本地")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("git clone git@gitee.com:wen_zhao/xdclass.git\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])])])])])])])]),s._v(" "),e("h2",{attrs:{id:"连接远程仓库后的操作"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#连接远程仓库后的操作"}},[s._v("#")]),s._v(" "),e("strong",[s._v("连接远程仓库后的操作")])]),s._v(" "),e("ul",[e("li",[e("p",[s._v("拉取代码")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("git pull \n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])])]),s._v(" "),e("li",[e("p",[s._v("推送新分支/代码")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("git push\n当远程仓库没有daily/0.0.2分支时\ngit push origin daily/0.0.2\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br"),e("span",{staticClass:"line-number"},[s._v("2")]),e("br"),e("span",{staticClass:"line-number"},[s._v("3")]),e("br")])])]),s._v(" "),e("li",[e("p",[s._v("指定远程分支复制新分支并切换到此新分支")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("新建分支daily/0.0.3 来源于远程仓库daily/0.0.2\ngit checkout -b daily/0.0.3 origin/daily/0.0.2\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br"),e("span",{staticClass:"line-number"},[s._v("2")]),e("br")])])])])])}),[],!1,null,null,null);a.default=i.exports}}]);