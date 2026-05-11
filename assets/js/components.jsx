/* global React */
// ============== Icons ==============
const I = {
  search: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={"icon "+(p?.cls||"")}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
  ),
  plus: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={"icon "+(p?.cls||"")}><path d="M12 5v14M5 12h14"/></svg>
  ),
  close: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={"icon "+(p?.cls||"")}><path d="M6 6l12 12M18 6 6 18"/></svg>
  ),
  share: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={"icon "+(p?.cls||"")}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>
  ),
  sun: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={"icon "+(p?.cls||"")}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
  ),
  moon: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={"icon "+(p?.cls||"")}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
  ),
  cloud: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={"icon "+(p?.cls||"")}><path d="M6 18a4 4 0 0 1 .9-7.9 5 5 0 0 1 9.7 1.1A4 4 0 0 1 17 18H6Z"/></svg>
  ),
  rain: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={"icon "+(p?.cls||"")}><path d="M6 14a4 4 0 0 1 .9-7.9 5 5 0 0 1 9.7 1.1A4 4 0 0 1 17 14H6Z"/><path d="M8 18l-1 3M12 18l-1 3M16 18l-1 3"/></svg>
  ),
  pin: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={"icon "+(p?.cls||"")}><path d="M12 21s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg>
  ),
  drag: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={"icon "+(p?.cls||"")}><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>
  ),
  clock: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={"icon "+(p?.cls||"")}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
  ),
  walk: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={"icon "+(p?.cls||"")}><circle cx="13" cy="4" r="2"/><path d="M9 22l3-7-3-3 2-5 3 4 3 1M9 14l-1 4"/></svg>
  ),
  check: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={"icon "+(p?.cls||"")}><path d="m5 12 4 4 10-10"/></svg>
  ),
  edit: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={"icon "+(p?.cls||"")}><path d="M4 20h4l11-11-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/></svg>
  ),
  trash: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={"icon "+(p?.cls||"")}><path d="M4 7h16M10 7V4h4v3M6 7l1 13h10l1-13"/></svg>
  ),
  external: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={"icon "+(p?.cls||"")}><path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>
  ),
  download: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={"icon "+(p?.cls||"")}><path d="M12 4v12M6 12l6 6 6-6M4 20h16"/></svg>
  ),
  upload: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={"icon "+(p?.cls||"")}><path d="M12 18V6M6 10l6-6 6 6M4 20h16"/></svg>
  ),
  sliders: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={"icon "+(p?.cls||"")}><path d="M4 7h11M4 12h6M4 17h13"/><circle cx="18" cy="7" r="2"/><circle cx="13" cy="12" r="2"/><circle cx="20" cy="17" r="2"/></svg>
  ),
  thermo: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={"icon "+(p?.cls||"")}><path d="M12 14V5a2 2 0 1 1 4 0v9a4 4 0 1 1-4 0Z"/></svg>
  ),
  wallet: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={"icon "+(p?.cls||"")}><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M16 14h2"/></svg>
  ),
  users: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={"icon "+(p?.cls||"")}><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5M14 20c0-2 2.5-3.5 5-3.5"/></svg>
  ),
};

// ============== Photo Placeholder ==============
function PhotoPlaceholder({ tag, hint }) {
  return (
    <div className="photo-ph">
      <span>{hint || tag || "photo"}</span>
    </div>
  );
}

// ============== 類別 chip ==============
function CategoryChip({ category, size }) {
  const meta = (window.CATEGORY_META && window.CATEGORY_META[category]) || { token: "muted" };
  return <span className={"tcard-cat cat-"+meta.token}>{category}</span>;
}

// ============== 天氣圖示 ==============
function WeatherIcon({ icon, cls }) {
  if (icon === "sun")        return <I.sun cls={cls} />;
  if (icon === "cloud-rain") return <I.rain cls={cls} />;
  if (icon === "cloud")      return <I.cloud cls={cls} />;
  return <I.sun cls={cls} />;
}

// ============== Helpers ==============
function fmtTime(t) { return t; }
function fmtDur(mins) {
  if (mins < 60) return mins + " 分鐘";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h} 小時 ${m} 分` : `${h} 小時`;
}
function fmtCost(n) {
  if (!n) return "—";
  return "NT$ " + n.toLocaleString();
}
function fmtDate(d) {
  // 2026-05-16 -> 5 月 16 日（六）
  if (!d) return "";
  const [y, mo, da] = d.split("-").map(Number);
  const dt = new Date(y, mo - 1, da);
  const wk = ["日","一","二","三","四","五","六"][dt.getDay()];
  return `${mo} 月 ${da} 日（${wk}）`;
}

// 由 lat/lng 投影到 minimap 0~100%
function projectToMap(spots) {
  if (!spots.length) return [];
  const lats = spots.map(s => s.lat).filter(Boolean);
  const lngs = spots.map(s => s.lng).filter(Boolean);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const padX = 14, padY = 14;
  const rangeLat = (maxLat - minLat) || 0.01;
  const rangeLng = (maxLng - minLng) || 0.01;
  return spots.map((s) => ({
    ...s,
    mx: padX + ((s.lng - minLng) / rangeLng) * (100 - padX*2),
    my: padY + (1 - (s.lat - minLat) / rangeLat) * (100 - padY*2),
  }));
}

Object.assign(window, { I, PhotoPlaceholder, CategoryChip, WeatherIcon, fmtTime, fmtDur, fmtCost, fmtDate, projectToMap });
