# [Open Wedding](http://openwedding.org/)
### openwedding.org    
##### 简单、开源、易用的结婚视频生成模版  文件夹－>交互版结婚创意网页
##### 将制作求婚、婚礼所用的视频，改成html5交互版，内容和功能不断更新


## 项目1:地球上的祝福（请用chrome/firefox访问）
###### 曾喜欢[浪迹天涯的旅行](http://bbs.8264.com/thread-1237199-1-1.html)，但当我和mm站在民政局的桌子前的时候，我们还没有一起去过很多地方。
##### 于是我找到了世界各地的各种好基友／网友拍了一组求婚的照片，做了这个html5网页动画。

## 技术和使用
##### 手绘＋webGL+css+canvas
##### 1、手绘板在adobe illustrator中用铅笔工具绘制手绘贴图（双击铅笔工具按钮可以进行设置）
##### 2、用ai插件[drawscript](http://drawscri.pt/)将ai文件转化成记录点信息的json文件
##### 3、js的3d库three .js制作地球，以动态贴图的方式将canvas贴在表面
##### 4、记录7大洲的中心位置经纬度、写视角切换程序
##### 5、把文件按照类似../data/3worldwishes/5Asian/10Nepal/image/2.jpg 的顺序把要展示的图片放在文件夹里
##### 6、 进入bin文件夹，运行node.js程序app.js 根据文件夹目录生成url的列表
##### 待开发：播放器组件、视频播放、全屏切换
##### 如果您能帮助我们拍摄照片，不胜感谢，请发至 [zny918@126.com](zny918@126.com)

## 感谢
##### 阿里巴巴给我熟悉这些前端技术的[机会](http://www.tudou.com/programs/view/Rxg-S-_98K0/)
##### 大隐提供的服务器 技术指导[剪巽](https://github.com/fishbar)、 [大隐](https://github.com/kunhuk)
##### 各种兄弟姐妹基友网友狐朋狗友在天涯海角世界各地拍摄的牛逼哄哄的照片！
##### 照片拍摄者:飞鸟、杨思、登山家罗静、june、格布、三刀、襄爷、鱼姐、刘博等
##### and 父母 老婆作为压轴！！
