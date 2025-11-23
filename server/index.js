const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

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
    '{"role": "ai", "delta": "庆历四年春，"}',
    '{"role": "ai", "delta": "滕子京谪守巴陵郡。"}',
    '{"role": "ai", "delta": "越明年，政通人和，百废具兴。"}',
    '{"role": "ai", "delta": "乃重修岳阳楼，增其旧制，"}',
    '{"role": "ai", "delta": "刻唐贤今人诗赋于其上，"}',
    '{"role": "ai", "delta": "属予作文以记之。"}',

    '{"role": "ai", "delta": "大江东去，"}',
    '{"role": "ai", "delta": "浩浩汤汤，"}',
    '{"role": "ai", "delta": "横无际涯；"}',
    '{"role": "ai", "delta": "朝晖夕阴，"}',
    '{"role": "ai", "delta": "气象万千。"}',

    '{"role": "ai", "delta": "此则岳阳楼之大观也，"}',
    '{"role": "ai", "delta": "前人之述备矣。"}',

    '{"role": "ai", "delta": "然则北通巫峡，"}',
    '{"role": "ai", "delta": "南极潇湘，"}',
    '{"role": "ai", "delta": "迁客骚人，多会于此。"}',

    '{"role": "ai", "delta": "览物之情，"}',
    '{"role": "ai", "delta": "得无异乎？"}',
    '{"role": "ai", "delta": "若夫淫雨霏霏，"}',
    '{"role": "ai", "delta": "连月不开，"}',
    '{"role": "ai", "delta": "阴风怒号，"}',
    '{"role": "ai", "delta": "浊浪排空；"}',
    '{"role": "ai", "delta": "日星隐曜，"}',
    '{"role": "ai", "delta": "山岳潜形；"}',
    '{"role": "ai", "delta": "商旅不行，"}',
    '{"role": "ai", "delta": "樯倾楫摧；"}',
    '{"role": "ai", "delta": "薄暮冥冥，"}',
    '{"role": "ai", "delta": "虎啸猿啼。"}',
    '{"role": "ai", "delta": "登斯楼也，"}',
    '{"role": "ai", "delta": "则有去国怀乡，"}',
    '{"role": "ai", "delta": "忧谗畏讥，"}',
    '{"role": "ai", "delta": "满目萧然，"}',
    '{"role": "ai", "delta": "感极而悲者矣。"}',
    '{"role": "ai", "delta": "至若春和景明，"}',
    '{"role": "ai", "delta": "波澜不惊，"}',
    '{"role": "ai", "delta": "上下天光，"}',
    '{"role": "ai", "delta": "一碧万顷；"}',
    '{"role": "ai", "delta": "沙鸥翔集，"}',
    '{"role": "ai", "delta": "锦鳞游泳；"}',
    '{"role": "ai", "delta": "岸芷汀兰，"}',
    '{"role": "ai", "delta": "郁郁青青。"}',
  ];
  const chunks2 = [
    '{"role": "ai", "delta": "豫章故郡，"}',
    '{"role": "ai", "delta": "洪都新府。"}',
    '{"role": "ai", "delta": "星分翼轸，"}',
    '{"role": "ai", "delta": "地接衡庐。"}',

    '{"role": "ai", "delta": "襟三江而带五湖，"}',
    '{"role": "ai", "delta": "控蛮荆而引瓯越。"}',

    '{"role": "ai", "delta": "物华天宝，"}',
    '{"role": "ai", "delta": "龙光射牛斗之墟；"}',

    '{"role": "ai", "delta": "人杰地灵，"}',
    '{"role": "ai", "delta": "徐孺下陈蕃之榻。"}',

    '{"role": "ai", "delta": "雄州雾列，"}',
    '{"role": "ai", "delta": "俊采星驰。"}',

    '{"role": "ai", "delta": "台隍枕夷夏之交，"}',
    '{"role": "ai", "delta": "宾主尽东南之美。"}',
    '{"role": "ai", "delta": "都督阎公之雅望,"}',
    '{"role": "ai", "delta": "宇文新州之懿范,"}',
    '{"role": "ai", "delta": "十旬休假，"}',
    '{"role": "ai", "delta": "胜友如云；"}',
    '{"role": "ai", "delta": "千里逢迎，"}',
    '{"role": "ai", "delta": "高朋满座。"}',
    '{"role": "ai", "delta": "腾蛟起凤，"}',
    '{"role": "ai", "delta": "孟学士之词宗；"}',
    '{"role": "ai", "delta": "紫电青霜，"}',
    '{"role": "ai", "delta": "王将军之武库。"}',
    '{"role": "ai", "delta": "家君作宰，"}',
    '{"role": "ai", "delta": "路出名区；"}',
    '{"role": "ai", "delta": "童子何知，"}',
    '{"role": "ai", "delta": "躬逢胜饯。"}',
  ];

  let chunks = [
    '{"role": "ai", "delta": "你好，"}',
    '{"role": "ai", "delta": "这是模拟的"}',
    '{"role": "ai", "delta": "流式返回"}',
    '{"role": "ai", "delta": "数据。"}',
  ];
  const { message, userId } = req.body;

  if (!message) {
    return res.json({
      code: 400,
      message: "消息不能为空",
      data: null,
    });
  }
  if (message === "岳阳楼记") {
    chunks = chunks1;
  } else if (message === "滕王阁序") {
    chunks = chunks2;
  }

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
