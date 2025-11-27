const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3005;

// 中间件配置
app.use(cors()); // 允许跨域请求
app.use(bodyParser.json()); // 解析 JSON 请求体
app.use(bodyParser.urlencoded({ extended: true }));

// 日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  next();
});

// ============ API 路由 ============

// AI 聊天接口示例
app.post("/api/chat", (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  const chunks1 = [
    '{"role": "ai", "delta": "# 岳阳楼记\\n\\n"}',
    '{"role": "ai", "delta": "**庆历四年春**，滕子京谪守巴陵郡。"}',
    '{"role": "ai", "delta": "越明年，政通人和，百废具兴。"}',
    '{"role": "ai", "delta": "乃重修岳阳楼，增其旧制，刻唐贤今人诗赋于其上，属予作文以记之。\\n\\n"}',

    '{"role": "ai", "delta": "## 洞庭湖之景\\n\\n"}',
    '{"role": "ai", "delta": "大江东去，浩浩汤汤，横无际涯；"}',
    '{"role": "ai", "delta": "朝晖夕阴，气象万千。"}',
    '{"role": "ai", "delta": "此则岳阳楼之大观也，前人之述备矣。\\n\\n"}',

    '{"role": "ai", "delta": "然则北通巫峡，南极潇湘，"}',
    '{"role": "ai", "delta": "迁客骚人，多会于此。览物之情，得无异乎？\\n\\n"}',

    '{"role": "ai", "delta": "### 阴雨之景\\n\\n"}',
    '{"role": "ai", "delta": "若夫淫雨霏霏，连月不开，"}',
    '{"role": "ai", "delta": "阴风怒号，浊浪排空；"}',
    '{"role": "ai", "delta": "日星隐曜，山岳潜形；"}',
    '{"role": "ai", "delta": "商旅不行，樯倾楫摧；"}',
    '{"role": "ai", "delta": "薄暮冥冥，虎啸猿啼。\\n\\n"}',
    '{"role": "ai", "delta": "登斯楼也，则有去国怀乡，"}',
    '{"role": "ai", "delta": "忧谗畏讥，满目萧然，感极而悲者矣。\\n\\n"}',

    '{"role": "ai", "delta": "### 晴朗之景\\n\\n"}',
    '{"role": "ai", "delta": "至若春和景明，波澜不惊，"}',
    '{"role": "ai", "delta": "上下天光，一碧万顷；"}',
    '{"role": "ai", "delta": "沙鸥翔集，锦鳞游泳；"}',
    '{"role": "ai", "delta": "岸芷汀兰，郁郁青青。\\n\\n"}',
    '{"role": "ai", "delta": "而或长烟一空，皓月千里，"}',
    '{"role": "ai", "delta": "浮光跃金，静影沉璧，"}',
    '{"role": "ai", "delta": "渔歌互答，此乐何极！\\n\\n"}',
    '{"role": "ai", "delta": "登斯楼也，则有心旷神怡，"}',
    '{"role": "ai", "delta": "宠辱偕忘，把酒临风，其喜洋洋者矣。\\n\\n"}',

    '{"role": "ai", "delta": "## 古仁人之心\\n\\n"}',
    '{"role": "ai", "delta": "嗟夫！予尝求古仁人之心，"}',
    '{"role": "ai", "delta": "或异二者之为，何哉？"}',
    '{"role": "ai", "delta": "**不以物喜，不以己悲**；"}',
    '{"role": "ai", "delta": "居庙堂之高则忧其民；"}',
    '{"role": "ai", "delta": "处江湖之远则忧其君。\\n\\n"}',
    '{"role": "ai", "delta": "是进亦忧，退亦忧。"}',
    '{"role": "ai", "delta": "然则何时而乐耶？\\n\\n"}',
    '{"role": "ai", "delta": "> 其必曰"**先天下之忧而忧，后天下之乐而乐**"乎！\\n\\n"}',
    '{"role": "ai", "delta": "噫！微斯人，吾谁与归？\\n\\n"}',
    '{"role": "ai", "delta": "*时六年九月十五日*"}',
  ];
  const chunks2 = [
    '{"role": "ai", "delta": "# 滕王阁序\\n\\n"}',
    '{"role": "ai", "delta": "## 地理位置\\n\\n"}',
    '{"role": "ai", "delta": "**豫章故郡，洪都新府**。"}',
    '{"role": "ai", "delta": "星分翼轸，地接衡庐。\\n\\n"}',

    '{"role": "ai", "delta": "襟三江而带五湖，"}',
    '{"role": "ai", "delta": "控蛮荆而引瓯越。\\n\\n"}',

    '{"role": "ai", "delta": "## 物华人杰\\n\\n"}',
    '{"role": "ai", "delta": "- **物华天宝**，龙光射牛斗之墟\\n"}',
    '{"role": "ai", "delta": "- **人杰地灵**，徐孺下陈蕃之榻\\n\\n"}',

    '{"role": "ai", "delta": "雄州雾列，俊采星驰。"}',
    '{"role": "ai", "delta": "台隍枕夷夏之交，宾主尽东南之美。\\n\\n"}',

    '{"role": "ai", "delta": "## 宾客盛会\\n\\n"}',
    '{"role": "ai", "delta": "都督阎公之雅望，宇文新州之懿范，"}',
    '{"role": "ai", "delta": "十旬休假，**胜友如云**；"}',
    '{"role": "ai", "delta": "千里逢迎，**高朋满座**。\\n\\n"}',
    '{"role": "ai", "delta": "腾蛟起凤，孟学士之词宗；"}',
    '{"role": "ai", "delta": "紫电青霜，王将军之武库。"}',
    '{"role": "ai", "delta": "家君作宰，路出名区；"}',
    '{"role": "ai", "delta": "童子何知，躬逢胜饯。"}',
  ];
  const chunks3 = [
    '{"role": "ai", "delta": "# 将进酒\\n\\n"}',
    '{"role": "ai", "delta": "> 作者：李白\\n\\n"}',
    '{"role": "ai", "delta": "## 人生苦短\\n\\n"}',
    '{"role": "ai", "delta": "君不见**黄河之水天上来**，奔流到海不复回。"}',
    '{"role": "ai", "delta": "君不见**高堂明镜悲白发**，朝如青丝暮成雪。\\n\\n"}',

    '{"role": "ai", "delta": "## 及时行乐\\n\\n"}',
    '{"role": "ai", "delta": "人生得意须尽欢，莫使金樽空对月。"}',
    '{"role": "ai", "delta": "**天生我材必有用，千金散尽还复来。**\\n\\n"}',

    '{"role": "ai", "delta": "烹羊宰牛且为乐，会须一饮三百杯。\\n\\n"}',

    '{"role": "ai", "delta": "## 劝君饮酒\\n\\n"}',
    '{"role": "ai", "delta": "岑夫子，丹丘生，**将进酒，君莫停**。"}',
    '{"role": "ai", "delta": "与君歌一曲，请君为我倾耳听。\\n\\n"}',

    '{"role": "ai", "delta": "钟鼓馔玉不足贵，但愿长醉不愿醒。"}',
    '{"role": "ai", "delta": "古来圣贤皆寂寞，**惟有饮者留其名**。\\n\\n"}',

    '{"role": "ai", "delta": "### 历史典故\\n\\n"}',
    '{"role": "ai", "delta": "陈王昔时宴平乐，斗酒十千恣欢谑。"}',
    '{"role": "ai", "delta": "主人何为言少钱，径须沽取对君酌。\\n\\n"}',

    '{"role": "ai", "delta": "## 豪情万丈\\n\\n"}',
    '{"role": "ai", "delta": "- 五花马\\n"}',
    '{"role": "ai", "delta": "- 千金裘\\n\\n"}',
    '{"role": "ai", "delta": "**呼儿将出换美酒，与尔同销万古愁！**"}',
  ];

  let chunks = [
    '{"role": "ai", "delta": "### 核心要点: \\n"}',
    '{"role": "ai", "delta": "对于这个"}',
    '{"role": "ai", "delta": "级别的模特"}',
    '{"role": "ai", "delta": ","}',
    '{"role": "ai", "delta": "**最低报价**"}',
    '{"role": "ai", "delta": "是一个"}',
    '{"role": "ai", "delta": "浮动的"}',
    '{"role": "ai", "delta": "概念。"}',
    '{"role": "ai", "delta": "它取决于：\\n"}',
    '{"role": "ai", "delta": "- **合作形式:**"}',
    '{"role": "ai", "delta": " （拍摄、"}',
    '{"role": "ai", "delta": "视频） \\n"}',
    '{"role": "ai", "delta": "- **版权范围:** "}',
    '{"role": "ai", "delta": "（地区"}',
    '{"role": "ai", "delta": "性使用还"}',
    '{"role": "ai", "delta": "是全球性、"}',
    '{"role": "ai", "delta": "永久性"}',
    '{"role": "ai", "delta": "使用）。\\n"}',
  ];
  const { message, userId } = req.body;

  console.log("message", message);

  if (!message) {
    return res.json({
      code: 400,
      message: "消息不能为空",
      data: null,
    });
  }
  if (message.includes("岳阳楼记")) {
    chunks = [...chunks1];
  } else if (message.includes("滕王阁序")) {
    chunks = [...chunks2];
  } else if (message.includes("将进酒")) {
    chunks = [...chunks3];
  }

  // 延迟 1000ms 后才开始发送消息
  setTimeout(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i >= chunks.length) {
        // res.write("EOF"); // 自己约定的结束标记
        res.end();
        clearInterval(timer);
        return;
      }

      res.write(chunks[i]); // 单次发送一段
      i++;
    }, 100);
  }, 1000);
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: "接口不存在",
    data: null,
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error("服务器错误:", err);
  res.status(500).json({
    code: 500,
    message: "服务器内部错误",
    data: null,
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log("=================================");
  console.log(`✓ 服务器启动成功！`);
  console.log(`✓ 运行地址: http://localhost:${PORT}`);
});
