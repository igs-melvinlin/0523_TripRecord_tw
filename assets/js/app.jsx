/* global React, ReactDOM, Topbar, Sidebar, MainTimeline, Aside, Drawer, TweaksPanel, ImportDialog, I */
const { useState, useEffect, useMemo } = React;

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSdq_qfgHNm2-k3igjPclYdGAxpFBV4k30UJ_otCq9Q5HriJfI3nr0K2rBm1yYEZL3gN9ARt5xfX52S/pub?output=csv";

function App() {
  // 主資料：先用預設，啟動後自動從 Google Sheets 更新
  const [trip, setTrip] = useState(() => window.DEFAULT_TRIP);
  // 動態算出的 days
  const days = useMemo(() => window.buildDays(trip), [trip]);
  const tripWithDays = useMemo(() => ({ ...trip, days, startDate: days[0]?.date, endDate: days[days.length-1]?.date }), [trip, days]);
  const [packing, setPacking] = useState(() => {
    try {
      const raw = localStorage.getItem("tripbook.packing");
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return window.DEFAULT_TRIP.packing;
  });

  // UI 狀態
  const [currentDay, setCurrentDay] = useState(0);

  // 接收行動裝置 Day 切換事件
  useEffect(() => {
    const handler = (e) => setCurrentDay(e.detail);
    window.addEventListener("tripbook:setDay", handler);
    return () => window.removeEventListener("tripbook:setDay", handler);
  }, []);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState([]);
  const [activeSpot, setActiveSpot] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const [tweaksOpen, setTweaksOpen] = useState(false);

  // 視覺方向（Tweaks）
  const [theme, setTheme] = useState(() => localStorage.getItem("tripbook.theme") || "sunrise");
  const [mode,  setMode]  = useState(() => localStorage.getItem("tripbook.mode")  || "light");
  const [density, setDensity] = useState(() => localStorage.getItem("tripbook.density") || "cozy");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-mode", mode);
    document.documentElement.setAttribute("data-density", density);
    localStorage.setItem("tripbook.theme", theme);
    localStorage.setItem("tripbook.mode", mode);
    localStorage.setItem("tripbook.density", density);
  }, [theme, mode, density]);

  // 啟動時自動從 Google Sheets 載入最新資料
  useEffect(() => {
    window.loadFromSheetCSV(SHEET_CSV_URL)
      .then(spots => {
        console.log("[TripBook] 載入成功，共", spots.length, "筆：", spots.map(s => s.title));
        setTrip(t => ({ ...t, spots }));
        setCurrentDay(0);
      })
      .catch(err => console.warn("[TripBook] 自動載入失敗：", err.message));
  }, []);

  useEffect(() => {
    localStorage.setItem("tripbook.packing", JSON.stringify(packing));
  }, [packing]);

  // 對外 Tweaks 協議
  useEffect(() => {
    function onMsg(e) {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "__activate_edit_mode")   setTweaksOpen(true);
      if (e.data.type === "__deactivate_edit_mode") setTweaksOpen(false);
    }
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);
  function closeTweaks() {
    setTweaksOpen(false);
    window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*");
  }

  function reorder(fromId, overId) {
    setTrip((t) => {
      const spots = [...t.spots];
      const fi = spots.findIndex(s => s.id === fromId);
      const oi = spots.findIndex(s => s.id === overId);
      if (fi < 0 || oi < 0) return t;
      const [moved] = spots.splice(fi, 1);
      const newOver = spots.findIndex(s => s.id === overId);
      spots.splice(newOver, 0, moved);
      // 同步 time 由前一個 + duration 計算（簡化：只更新被移動的兩個之間的 time）
      return { ...t, spots };
    });
  }

  function addSpot() {
    const newId = "n" + Date.now();
    const newSpot = {
      id: newId,
      date: days[currentDay]?.date || new Date().toISOString().slice(0,10),
      time: "12:00", duration: 60,
      title: "新景點", category: "景點", address: "點擊編輯地址",
      mapUrl: "",
      notes: "", cost: 0, photo: "", transport: "",
    };
    setTrip((t) => ({ ...t, spots: [...t.spots, newSpot] }));
    setActiveSpot(newSpot);
  }
  function deleteSpot(id) {
    setTrip((t) => ({ ...t, spots: t.spots.filter(s => s.id !== id) }));
    setActiveSpot(null);
  }

  function onShare() {
    window.open("share.html", "_blank");
  }

  function onLoadFromSheet(spots) {
    // 重新分配天數（依 date 欄）
    setTrip((t) => ({ ...t, spots }));
    setCurrentDay(0);
  }

  return (
    <React.Fragment>
      <div className="app">
        <Topbar
          trip={tripWithDays}
          query={query} setQuery={setQuery}
          onShare={onShare}
          onImport={() => setImportOpen(true)}
          onToggleMode={() => setMode(mode === "dark" ? "light" : "dark")}
          mode={mode}
          onAdd={addSpot}
        />
        <Sidebar
          trip={tripWithDays}
          currentDay={currentDay} setCurrentDay={setCurrentDay}
          filters={filters} setFilters={setFilters}
          packing={packing} setPacking={setPacking}
        />
        <MainTimeline
          trip={tripWithDays}
          currentDay={currentDay}
          query={query}
          filters={filters}
          onOpen={setActiveSpot}
          onReorder={reorder}
          onAdd={addSpot}
        />
        <Aside
          trip={tripWithDays}
          currentDay={currentDay}
          activeSpotId={activeSpot?.id}
          onOpen={setActiveSpot}
        />
      </div>

      <Drawer
        spot={activeSpot}
        onClose={() => setActiveSpot(null)}
        onEdit={() => alert("編輯介面可在這裡延伸，目前點抽屜開始即可調整。")}
        onDelete={() => activeSpot && deleteSpot(activeSpot.id)}
      />

      <ImportDialog open={importOpen} onClose={()=>setImportOpen(false)} onLoad={onLoadFromSheet} />

      <button className="tweaks-fab" title="調整視覺方向" onClick={() => setTweaksOpen((v) => !v)}>
        <I.sliders />
      </button>
      <TweaksPanel
        open={tweaksOpen}
        onClose={closeTweaks}
        theme={theme} setTheme={setTheme}
        mode={mode}  setMode={setMode}
        density={density} setDensity={setDensity}
      />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
