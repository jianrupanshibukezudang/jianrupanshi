/**
 * 本地模拟帖子数据源
 *
 * 字段规范：
 *   id       帖子唯一标识，固定格式 post_001 ~ post_010
 *   title    帖子标题
 *   content  帖子文案内容
 *   author   作者昵称
 *   imageUrl 配图地址，统一使用 https://picsum.photos/400/500?random=xxx，xxx 取 1~10
 *   likes    初始点赞数（页面展示用扩展字段）
 *
 * 通过普通 <script> 标签引入，数据导出到全局变量 window.POSTS，
 * 供 js/app.js 读取（避免 file:// 直接打开页面时 ES Module 的跨域限制）。
 */
window.POSTS = [
  {
    id: 'post_001',
    title: '藏在巷子里的宝藏咖啡馆☕️去了还想再去',
    content: '周末瞎逛偶然发现的小店，手冲耶加雪菲花香超明显，提拉米苏一点也不甜腻。坐窗边晒了一下午太阳，临走还被老板塞了两块手工饼干，这种不期而遇的小确幸真的太治愈了！',
    author: '咖啡续命中的鹿',
    imageUrl: 'https://picsum.photos/400/500?random=1',
    likes: 3256
  },
  {
    id: 'post_002',
    title: '大理旅居一个月，我好像悟了一些事',
    content: '在洱海边租了个带院子的小房间，每天骑车去看日落，听风穿过稻田的声音。没有早晚高峰也没有无效会议，才发现生活原来可以这么慢，慢到能看清自己真正想要什么。',
    author: '阿瑶去远方',
    imageUrl: 'https://picsum.photos/400/500?random=2',
    likes: 12089
  },
  {
    id: 'post_003',
    title: '懒人减脂餐合集｜一周不重样，好吃到哭',
    content: '亲测一个月瘦了八斤！全部都是一锅出的快手菜：鸡胸肉时蔬焖饭、番茄龙利鱼、凉拌荞麦面……低卡高蛋白，做法简单零失败，减脂期的姐妹赶紧码住照着吃。',
    author: '瘦瘦不瘦瘦',
    imageUrl: 'https://picsum.photos/400/500?random=3',
    likes: 876
  },
  {
    id: 'post_004',
    title: '重庆三天两夜保姆级攻略🔥照着走不踩雷',
    content: '洪崖洞夜景、李子坝穿楼轻轨、长江索道、九宫格老火锅……路线、住宿、避坑点全部整理好了。友情提示：导航显示的十分钟可能要爬四十分钟楼梯，一定穿舒服的鞋！',
    author: '山城小辣椒',
    imageUrl: 'https://picsum.photos/400/500?random=4',
    likes: 45210
  },
  {
    id: 'post_005',
    title: '出租屋大改造｜1500元爆改ins风小窝',
    content: '刷白墙、铺地毯、换暖色灯串，再淘一些原木色收纳和仿真绿植，整个房间瞬间温柔起来。房子是租来的但生活不是，下班后窝在自己布置的小角落里真的幸福感爆棚。',
    author: '田螺姑娘',
    imageUrl: 'https://picsum.photos/400/500?random=5',
    likes: 2304
  },
  {
    id: 'post_006',
    title: '新手也能养好的6种绿植🪴养死算我输',
    content: '绿萝、龟背竹、虎皮兰、橡皮树、琴叶榕、金钱树，个个都是耐阴耐旱的懒人植物。少浇水多通风，散射光就能活得很好，叶子油亮蹭蹭长，家里瞬间有了生机。',
    author: '植物园园长',
    imageUrl: 'https://picsum.photos/400/500?random=6',
    likes: 567
  },
  {
    id: 'post_007',
    title: '人生第一次露营！山里的星空也太美了吧',
    content: '帐篷搭在溪边的草地上，傍晚烤棉花糖喝热红酒，等天完全黑下来一抬头，整条银河就挂在头顶。手机没有信号的十二个小时，却是最近最放松的一天，已经在期待下次了。',
    author: '野孩子阿灿',
    imageUrl: 'https://picsum.photos/400/500?random=7',
    likes: 15678
  },
  {
    id: 'post_008',
    title: '这款平价粉底液我能回购十次，持妆绝了',
    content: '混油皮夏天带妆八小时，T区微微出油反而更自然，鼻翼居然一点都没卡粉。妆效是那种妈生好皮的柔光感，色号也不发灰，百元价位能做成这样真的很良心。',
    author: '美妆蛋小姐',
    imageUrl: 'https://picsum.photos/400/500?random=8',
    likes: 8932
  },
  {
    id: 'post_009',
    title: '夜跑五公里打卡｜坚持跑步三个月的变化',
    content: '从跑八百米都喘到现在轻松五公里，睡眠变好了，肩颈不酸了，连情绪都稳定了很多。其实最难的永远是出门那一步，换上跑鞋走出去，你就已经赢过昨天的自己。',
    author: '跑步的阿凯',
    imageUrl: 'https://picsum.photos/400/500?random=9',
    likes: 423
  },
  {
    id: 'post_010',
    title: '在家复刻芝士排骨🧀零失败教程快收好',
    content: '排骨腌足一小时再煎到微焦，倒入灵魂酱汁焖到浓稠，最后铺上满满一层马苏里拉，盖上锅盖等芝士融化拉丝。配一碗白米饭，好吃到连锅底的酱汁都想舔干净！',
    author: '厨房历险记',
    imageUrl: 'https://picsum.photos/400/500?random=10',
    likes: 6789
  }
];
