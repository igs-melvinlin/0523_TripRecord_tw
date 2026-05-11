/* global React, projectToMap, I, PhotoPlaceholder, CategoryChip, WeatherIcon, fmtDur, fmtCost, fmtDate */
const { useState, useEffect, useMemo, useRef, useCallback } = React;

// ============== Topbar ==============
function Topbar({ trip, query, setQuery, onShare, onImport, onToggleMode, mode, onAdd }) {
  return (
    <div className="topbar">
      <div className="topbar-l">
        <div className="brand">
          <div className="brand-mark serif">旅</div>
          <span>TripBook</span>
        </div>
        <div className="crumb" style={{marginLeft: 16}}>
          <span>我的行程</span>
          <span className="sep">/</span>
          <span className="crumb-trip">{trip.title}</span>
        </div>
      </div>
      <div className="topbar-r">
        <div className="search">
          <I.search />
          <input placeholder="搜尋景點、地址、筆記…" value={query} onChange={(e)=>setQuery(e.target.value)} />
        </div>
        <button className="ctl icon" title="切換深淺色" onClick={onToggleMode}>
          {mode === "dark" ? <I.sun /> : <I.moon />}
        </button>
        <button className="ctl" onClick={onImport}>
          <I.upload /><span className="lbl">資料來源</span>
        </button>
        <button className="ctl" onClick={onShare}>
          <I.share /><span className="lbl">分享</span>
        </button>
        <button className="ctl primary" onClick={onAdd}>
          <I.plus /><span className="lbl">新增景點</span>
        </button>
      </div>
    </div>
  );
}

// ============== Sidebar ==============
function Sidebar({ trip, currentDay, setCurrentDay, filters, setFilters, packing, setPacking }) {
  const cats = Object.keys(window.CATEGORY_META);
  const totalCost = trip.spots.reduce((s, x) => s + (x.cost || 0), 0);
  const totalMins = trip.spots.reduce((s, x) => s + (x.duration || 0), 0);
  return (
    <aside className="sidebar">
      <div className="trip-hero">
        <div className="ph"><PhotoPlaceholder hint="cover · hualien · pacific coast" /></div>
        <div className="meta">
          <h1>{trip.title}</h1>
          <div className="sub">{fmtDate(trip.startDate)} — {fmtDate(trip.endDate)}</div>
        </div>
      </div>

      <div className="stat-row" style={{gridTemplateColumns: "1fr 1fr"}}>
        <div className="stat"><div className="v serif">{trip.spots.length}</div><div className="k">景點</div></div>
        <div className="stat"><div className="v serif">{trip.days.length}<span style={{fontSize:13, color:"var(--muted)"}}>天</span></div><div className="k">天數</div></div>
      </div>

      <div>
        <div className="section-title"><span>日程</span><span className="act">{trip.days.length} 天</span></div>
        {trip.days.map((d, i) => (
          <div key={i} className={"day-pill "+(currentDay===i?"active":"")} onClick={()=>setCurrentDay(i)}>
            <div className="l">
              <div className="dot" />
              <div>
                <div className="ttl">{d.label}</div>
                <div className="sub">{fmtDate(d.date)}</div>
              </div>
            </div>
            <div className="w"><WeatherIcon icon={d.weather.icon} /><span className="mono">{d.weather.temp}</span></div>
          </div>
        ))}
      </div>

      <div>
        <div className="section-title"><span>類別篩選</span>
          {filters.length>0 && <button className="act" onClick={()=>setFilters([])}>清除</button>}
        </div>
        <div className="chips">
          {cats.map((c) => {
            const meta = window.CATEGORY_META[c];
            const on = filters.includes(c);
            return (
              <button key={c} className={"chip "+(on?"active":"")} onClick={()=>{
                setFilters(on ? filters.filter(x=>x!==c) : [...filters, c]);
              }}>
                <span className="swatch" style={{background: `var(--${meta.token})`}} />
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="section-title"><span>打包清單</span>
          <span className="act mono">{packing.filter(p=>p.done).length}/{packing.length}</span>
        </div>
        <div className="pack-list">
          {packing.map((p) => (
            <div key={p.id} className={"pack-item "+(p.done?"done":"")}
              onClick={()=>setPacking(packing.map(x=>x.id===p.id?{...x,done:!x.done}:x))}>
              <div className="pack-check">{p.done && <I.check cls="icon-sm" />}</div>
              <div className="pack-text">{p.text}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ============== Timeline Card ==============
function TimelineCard({ spot, onOpen, onDragStart, onDragOver, onDrop, dragging, dragOver }) {
  const meta = window.CATEGORY_META[spot.category] || { token: "muted" };
  return (
    <div
      className={"tcard "+(dragging?"dragging":"")+(dragOver?" drag-over":"")}
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => { e.preventDefault(); onDragOver(); }}
      onDrop={onDrop}
      onClick={() => onOpen(spot)}
    >
      <div className="time mono">
        {spot.time}
        <div className="dur">{fmtDur(spot.duration)}</div>
      </div>
      <div className="tcard-row">
        <div className="tcard-photo"><PhotoPlaceholder hint={spot.photo || "photo"} /></div>
        <div className="tcard-body">
          <div className="tcard-meta">
            <CategoryChip category={spot.category} />
            {spot.transport && <span>· {spot.transport}</span>}
            {spot.mapUrl && (
              <a
                className="tcard-map"
                href={spot.mapUrl}
                target="_blank"
                rel="noreferrer"
                title="在 Google Maps 開啟"
                onClick={(e) => e.stopPropagation()}
              >
                <I.pin cls="icon-sm" />
                <span>Maps</span>
              </a>
            )}
          </div>
          <h3>{spot.title}</h3>
          <div className="addr"><I.pin cls="icon-sm" /><span>{spot.address}</span></div>
          <div className="row-foot">
            <div className="l">
              <span><I.clock cls="icon-sm" /> {spot.time}</span>
              {spot.cost ? <span className="cost mono">{fmtCost(spot.cost)}</span> : <span className="muted">免費</span>}
            </div>
            <span className="muted" style={{fontSize:11}}>點擊查看詳細 →</span>
          </div>
        </div>
      </div>
      <div className="drag-handle"><I.drag /></div>
    </div>
  );
}

// ============== 中欄：當日時間軸 ==============
function MainTimeline({ trip, currentDay, query, filters, onOpen, onReorder, onAdd }) {
  const day = trip.days[currentDay];
  const [dragId, setDragId] = useState(null);
  const [overId, setOverId] = useState(null);

  if (!day) {
    return (
      <div className="main">
        <div className="day-header">
          <div>
            <h2 className="serif">沒有行程</h2>
            <div className="date">點右上「＋ 新增景點」開始規劃</div>
          </div>
        </div>
        <div className="timeline">
          <div className="empty" onClick={onAdd} style={{cursor:"pointer"}}>＋ 新增第一個景點</div>
        </div>
      </div>
    );
  }

  const visible = trip.spots
    .filter((s) => s.date === day.date)
    .filter((s) => filters.length === 0 || filters.includes(s.category))
    .filter((s) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return s.title.toLowerCase().includes(q) || s.address.toLowerCase().includes(q) || (s.notes||"").toLowerCase().includes(q);
    });

  return (
    <div className="main">
      <div className="day-header">
        <div>
          <h2 className="serif">{day.label}<span style={{color:"var(--muted)", marginLeft: 14}}>·</span> <span style={{color:"var(--ink-2)", fontSize: 26}}>{fmtDate(day.date)}</span></h2>
          <div className="date">{visible.length} 個行程 · 共 {Math.round(visible.reduce((s,x)=>s+x.duration,0)/60)} 小時</div>
        </div>
        <div className="weather">
          {day.weather && <WeatherIcon icon={day.weather.icon} cls="icon-sm" />}
          {day.weather?.temp && <span className="t">{day.weather.temp}</span>}
          {day.weather?.desc && <span style={{color:"var(--muted)"}}>{day.weather.desc}</span>}
        </div>
      </div>

      <div className="timeline">
        {visible.map((s) => (
          <TimelineCard
            key={s.id}
            spot={s}
            onOpen={onOpen}
            dragging={dragId === s.id}
            dragOver={overId === s.id && dragId && dragId !== s.id}
            onDragStart={() => setDragId(s.id)}
            onDragOver={() => setOverId(s.id)}
            onDrop={() => {
              if (dragId && overId && dragId !== overId) onReorder(dragId, overId);
              setDragId(null); setOverId(null);
            }}
          />
        ))}
        {visible.length === 0 && (
          <div style={{padding: "40px 20px", textAlign: "center", color: "var(--muted)", border: "1px dashed var(--line)", borderRadius: 14}}>
            這一天還沒有行程，點下方新增一個吧！
          </div>
        )}
        <div className="add-row">
          <button className="add-btn" onClick={onAdd}><I.plus cls="icon-sm" /> 新增景點</button>
        </div>
      </div>
    </div>
  );
}

// ============== 右欄：當日概覽（地圖移除，改為每景點外連）==============
function Aside({ trip, currentDay, activeSpotId, onOpen }) {
  const day = trip.days[currentDay];
  const spots = useMemo(() => trip.spots.filter(s => s.date === day?.date), [trip, currentDay, day]);
  const totalCost = spots.reduce((s, x) => s + (x.cost || 0), 0);
  const byCat = {};
  spots.forEach((s) => { byCat[s.category] = (byCat[s.category]||0) + (s.cost||0); });
  const next = spots[0];

  return (
    <aside className="aside">

      <div className="aside-content">
        {next && (
          <div className="next-up">
            <div className="k">下一站</div>
            <h4 className="serif">{next.title}</h4>
            <div className="meta mono">{next.time} · {fmtDur(next.duration)}</div>
          </div>
        )}

        <div>
          <div className="section-title"><span>預算分佈</span><span className="act mono">{fmtCost(totalCost)}</span></div>
          <div className="budget-bar">
            {Object.entries(byCat).map(([cat, c]) => {
              const meta = window.CATEGORY_META[cat] || { token: "muted" };
              const w = totalCost ? (c/totalCost*100) : 0;
              return <span key={cat} style={{width: w+"%", background: `var(--${meta.token})`}} title={cat} />;
            })}
          </div>
          <div className="legend">
            {Object.entries(byCat).map(([cat, c]) => {
              const meta = window.CATEGORY_META[cat] || { token: "muted" };
              return (<span key={cat}><span className="dot" style={{background: `var(--${meta.token})`}} />{cat} {fmtCost(c)}</span>);
            })}
          </div>
        </div>

        <div>
          <div className="section-title"><span>本日順序</span></div>
          <div style={{display:"flex", flexDirection:"column", gap:6}}>
            {spots.map((s, i) => {
              const meta = window.CATEGORY_META[s.category] || { token: "muted" };
              return (
                <button key={s.id}
                  onClick={()=>onOpen(s)}
                  style={{display:"flex", alignItems:"center", gap:10, padding:"8px 10px", borderRadius:10, textAlign:"left", background: activeSpotId===s.id?"var(--surface-2)":"transparent"}}>
                  <span className="mono" style={{width:18, fontSize:12, color:"var(--muted)"}}>{String(i+1).padStart(2,"0")}</span>
                  <span style={{width:6, height:6, borderRadius:"50%", background:`var(--${meta.token})`}} />
                  <span style={{flex:1, fontSize:13}}>{s.title}</span>
                  <span className="mono muted" style={{fontSize:11}}>{s.time}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

// ============== 抽屜：景點詳細 ==============
function Drawer({ spot, onClose, onEdit, onDelete }) {
  const open = !!spot;
  return (
    <React.Fragment>
      <div className={"scrim "+(open?"open":"")} onClick={onClose} />
      <div className={"drawer "+(open?"open":"")}>
        {spot && (
          <React.Fragment>
            <div className="drawer-hero">
              <PhotoPlaceholder hint={spot.photo} />
              <button className="drawer-close" onClick={onClose}><I.close /></button>
            </div>
            <div className="drawer-body">
              <div className="drawer-cat"><CategoryChip category={spot.category} /></div>
              <h2>{spot.title}</h2>
              <div className="drawer-addr"><I.pin cls="icon-sm" /> {spot.address}</div>

              <div className="info-grid">
                <div className="info-cell"><div className="k">時間</div><div className="v">{spot.time}</div></div>
                <div className="info-cell"><div className="k">停留</div><div className="v">{fmtDur(spot.duration)}</div></div>
                <div className="info-cell"><div className="k">花費</div><div className="v">{fmtCost(spot.cost)}</div></div>
                <div className="info-cell"><div className="k">交通</div><div className="v txt">{spot.transport || "—"}</div></div>
              </div>

              <div className="section-title" style={{marginTop:0, marginBottom:10}}><span>筆記</span></div>
              <div className="notes">{spot.notes || "暫無筆記，點下方編輯加入備註。"}</div>

              <div className="drawer-actions">
                <a className="ctl" href={`detail.html?id=${encodeURIComponent(spot.id)}`} target="_blank" rel="noreferrer">
                  <I.external cls="icon-sm" /> 打開景點頁
                </a>
                {spot.mapUrl && (
                  <a className="ctl" href={spot.mapUrl} target="_blank" rel="noreferrer">
                    <I.pin cls="icon-sm" /> Google Maps
                  </a>
                )}
                <button className="ctl" onClick={onEdit}><I.edit cls="icon-sm" /> 編輯</button>
                <button className="ctl" onClick={onDelete}><I.trash cls="icon-sm" /> 刪除</button>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
}

// ============== Tweaks 面板 ==============
function TweaksPanel({ open, onClose, theme, setTheme, mode, setMode, density, setDensity }) {
  if (!open) return null;
  return (
    <div className="tweaks-panel">
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8}}>
        <h5>Tweaks</h5>
        <button className="ctl icon" onClick={onClose} style={{height:28, width:28}}><I.close cls="icon-sm" /></button>
      </div>

      <div className="tk-row">
        <div className="tk-label">視覺方向</div>
        <div className="seg">
          {[["sunrise","晨光"],["coastal","海岸"],["editorial","編輯"]].map(([k,l]) => (
            <button key={k} className={theme===k?"on":""} onClick={()=>setTheme(k)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="tk-row">
        <div className="tk-label">明暗模式</div>
        <div className="seg">
          <button className={mode==="light"?"on":""} onClick={()=>setMode("light")}>淺色</button>
          <button className={mode==="dark"?"on":""} onClick={()=>setMode("dark")}>深色</button>
        </div>
      </div>

      <div className="tk-row">
        <div className="tk-label">密度</div>
        <div className="seg">
          <button className={density==="cozy"?"on":""} onClick={()=>setDensity("cozy")}>舒適</button>
          <button className={density==="compact"?"on":""} onClick={()=>setDensity("compact")}>緊湊</button>
        </div>
      </div>

      <div style={{marginTop:14, paddingTop:14, borderTop:"1px solid var(--line)", fontSize:11, color:"var(--muted)", lineHeight:1.6}}>
        提示：右上「資料來源」可貼入 Google Sheets 發佈後的 CSV 連結。
      </div>
    </div>
  );
}

// ============== Import 對話 ==============
function ImportDialog({ open, onClose, onLoad }) {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  if (!open) return null;
  return (
    <React.Fragment>
      <div className="scrim open" onClick={onClose} />
      <div style={{position:"fixed", left:"50%", top:"50%", transform:"translate(-50%, -50%)", width:"min(540px, 92vw)", background:"var(--surface)", border:"1px solid var(--line)", borderRadius:16, padding:28, zIndex:60, boxShadow:"var(--shadow-3)"}}>
        <h3 className="serif" style={{fontSize:26, marginBottom:6}}>從 Google Sheets 載入</h3>
        <p style={{color:"var(--muted)", fontSize:13, marginBottom:16, lineHeight:1.6}}>
          將 Google Sheets 發佈為 CSV 並貼上連結。欄位需含：day, time, duration, title, category, address, lat, lng, notes, cost, photo, transport。
        </p>
        <input value={url} onChange={(e)=>setUrl(e.target.value)} placeholder="https://docs.google.com/spreadsheets/.../pub?output=csv"
          style={{width:"100%", padding:"12px 14px", border:"1px solid var(--line-2)", borderRadius:10, background:"var(--surface-2)", marginBottom:12, fontSize:13}} />
        {err && <div style={{color:"var(--coral)", fontSize:12, marginBottom:10}}>{err}</div>}
        <div style={{display:"flex", gap:10, justifyContent:"flex-end"}}>
          <button className="ctl" onClick={onClose}>取消</button>
          <button className="ctl primary" disabled={busy} onClick={async ()=>{
            setBusy(true); setErr("");
            try { const spots = await window.loadFromSheetCSV(url); onLoad(spots); onClose(); }
            catch (e) { setErr(e.message); }
            finally { setBusy(false); }
          }}>{busy?"載入中…":"載入"}</button>
        </div>
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { Topbar, Sidebar, MainTimeline, Aside, Drawer, TweaksPanel, ImportDialog });
