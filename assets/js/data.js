// 宜蘭兩天一夜
// 每個景點的「date」欄位直接決定它屬於哪一天，App 會自動依此分組
window.DEFAULT_TRIP = {
  title: "宜蘭兩天一夜",
  subtitle: "兩天一夜・宜蘭・蘇澳・羅東",
  members: [],
  cover: "yilan",

  // 選填：依「日期」附加標籤／天氣；沒列到的日期會自動產生
  dayMeta: {
    "2026-05-23": { label: "Day 1", weather: { icon: "sun",   temp: "—", desc: "" } },
    "2026-05-24": { label: "Day 2", weather: { icon: "cloud", temp: "—", desc: "" } },
  },

  spots: [
    { id: "s01", date: "2026-05-23", time: "09:26", duration: 74,
      title: "搭乘自強號 418 次", category: "交通",
      address: "台北車站 → 宜蘭車站（抵達 10:40）",
      mapUrl: "",
      notes: "早餐會買蛋餅給大家（上車前購買）",
      cost: 0, photo: "train", transport: "火車" },
    { id: "s02", date: "2026-05-23", time: "10:50", duration: 30,
      title: "中租租車取車", category: "交通",
      address: "宜蘭車站附近",
      mapUrl: "",
      notes: "宜蘭車站步行約 7 分鐘",
      cost: 0, photo: "car", transport: "步行 7 分" },
    { id: "s03", date: "2026-05-23", time: "11:30", duration: 60,
      title: "正常小籠包・綠豆沙牛奶", category: "美食",
      address: "宜蘭市",
      mapUrl: "",
      notes: "",
      cost: 0, photo: "dumpling", transport: "開車" },
    { id: "s04", date: "2026-05-23", time: "13:30", duration: 90,
      title: "喬伊吹吹風・蘇澳小吃", category: "美食",
      address: "蘇澳",
      mapUrl: "",
      notes: "炸蝦餅推薦",
      cost: 0, photo: "snack", transport: "開車約 30 分" },
    { id: "s05", date: "2026-05-23", time: "17:30", duration: 120,
      title: "羅東夜市", category: "美食",
      address: "宜蘭縣羅東鎮",
      mapUrl: "",
      notes: "財記臭豆腐要先預訂",
      cost: 0, photo: "nightmarket", transport: "開車約 20 分" },
    { id: "s06", date: "2026-05-23", time: "21:00", duration: 30,
      title: "宜蘭東旅 Check-in", category: "住宿",
      address: "宜蘭市",
      mapUrl: "",
      notes: "隔天早上有早餐",
      cost: 0, photo: "hotel", transport: "開車" },
    { id: "s07", date: "2026-05-24", time: "08:00", duration: 60,
      title: "東旅早餐", category: "美食",
      address: "宜蘭東旅",
      mapUrl: "",
      notes: "飯店含早餐",
      cost: 0, photo: "breakfast", transport: "—" },
    { id: "s08", date: "2026-05-24", time: "11:10", duration: 120,
      title: "農場", category: "景點",
      address: "宜蘭縣",
      mapUrl: "",
      notes: "開車約 20 分鐘",
      cost: 0, photo: "farm", transport: "開車約 20 分" },
  ],
  packing: [
    { id: "p1", text: "悠遊卡、身分證、火車票", done: false },
    { id: "p2", text: "充電線與行動電源", done: false },
    { id: "p3", text: "防曬乳 SPF50+", done: false },
    { id: "p4", text: "輕便雨具", done: false },
    { id: "p5", text: "好走的健走鞋", done: false },
    { id: "p6", text: "暈車藥", done: false },
  ],
};

window.CATEGORY_META = {
  "景點":  { token: "sage",   icon: "mountain" },
  "美食":  { token: "coral",  icon: "fork" },
  "交通":  { token: "sky",    icon: "train" },
  "住宿":  { token: "ink",    icon: "bed" },
  "購物":  { token: "warm",   icon: "bag" },
  "其他":  { token: "muted",  icon: "dot" },
};

// 由 spots 動態組出 days 陣列（依 date 分組、排序）
window.buildDays = function (trip) {
  const dates = Array.from(new Set((trip.spots || []).map(s => s.date).filter(Boolean))).sort();
  const meta = trip.dayMeta || {};
  return dates.map((date, i) => {
    const m = meta[date] || {};
    return {
      date,
      label: m.label || `Day ${i+1}`,
      weather: m.weather || { icon: "sun", temp: "—", desc: "" },
    };
  });
};

// 從 Google Sheets CSV 連結讀取
window.loadFromSheetCSV = async function (url) {
  if (!url) throw new Error("請輸入 Google Sheets 發佈後的 CSV 連結");
  const res = await fetch(url);
  if (!res.ok) throw new Error("讀取失敗：" + res.status);
  const text = await res.text();
  const rows = parseCSV(text);
  if (rows.length < 2) throw new Error("資料列太少");
  const header = rows[0].map((s) => s.trim().toLowerCase());
  const idx = (k) => header.indexOf(k);
  const spots = rows.slice(1).filter((r) => r.length > 1 && r[idx("title")]).map((r, i) => ({
    id: "imp-" + i,
    date: (r[idx("date")] || "").trim(),
    time: (r[idx("time")] || "09:00").trim(),
    duration: parseInt(r[idx("duration")] || "60", 10),
    title: (r[idx("title")] || "未命名").trim(),
    category: (r[idx("category")] || "其他").trim(),
    address: (r[idx("address")] || "").trim(),
    mapUrl: (r[idx("mapurl")] || r[idx("map_url")] || r[idx("map")] || "").trim(),
    notes: (r[idx("notes")] || "").trim(),
    cost: parseFloat(r[idx("cost")] || "0"),
    photo: (r[idx("photo")] || "").trim(),
    transport: (r[idx("transport")] || "").trim(),
  }));
  return spots;
};

function parseCSV(text) {
  const rows = [];
  let cur = [""];
  let inQuote = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuote) {
      if (c === '"' && text[i + 1] === '"') { cur[cur.length - 1] += '"'; i++; }
      else if (c === '"') inQuote = false;
      else cur[cur.length - 1] += c;
    } else {
      if (c === '"') inQuote = true;
      else if (c === ",") cur.push("");
      else if (c === "\n") { rows.push(cur); cur = [""]; }
      else if (c === "\r") {}
      else cur[cur.length - 1] += c;
    }
  }
  if (cur.length > 1 || cur[0]) rows.push(cur);
  return rows;
}
