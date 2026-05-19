// NFFL War Room — single-file React app

const { useState, useEffect, useRef, useMemo } = React;

// ─────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────
const Icon = {
  Arrow: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14m-5-5l5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Back: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  CheckCircle: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  Thumb: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 21V11l4-7c1.5 0 2.5 1 2.5 2.5L14 10h5a2 2 0 012 2l-1.5 7a2 2 0 01-2 1.6L9 21z"
            stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" fill="none"/>
      <path d="M3 11h4v10H3z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  Help: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M9.4 9.5a2.6 2.6 0 015.2.3c0 1.6-2.6 1.9-2.6 3.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="12" cy="17.2" r="1.2" fill="currentColor"/>
    </svg>
  ),
  XCircle: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
    </svg>
  ),
  Dash: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 12h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  ),
  SoundOn: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/>
      <path d="M17 8a5 5 0 010 8M19.5 5.5a9 9 0 010 13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  SoundOff: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/>
      <path d="M17 9l5 6M22 9l-5 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  ),
  Shield: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3l8 3v5c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-3z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" fill="none"/>
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Star: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.9 6.4 7 .7-5.3 4.7 1.6 6.8L12 17.3 5.8 20.6l1.6-6.8L2.1 9.1l7-.7L12 2z"/>
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────────
// RESPONSE STATES
// ─────────────────────────────────────────────────────────────
const CYCLE = [null, 'yes', 'ok', 'maybe', 'no'];
const RMAP = {
  yes:   { label: 'Yes, preferred',   bg: 'rgba(91, 200, 127, 0.16)',  bdr: 'rgba(91, 200, 127, 0.55)',  fg: '#5BC87F', Ico: Icon.CheckCircle },
  ok:    { label: 'Yes, not ideal',   bg: 'rgba(122, 174, 232, 0.16)', bdr: 'rgba(122, 174, 232, 0.55)', fg: '#7AAEE8', Ico: Icon.Thumb },
  maybe: { label: 'Looking into it',  bg: 'rgba(198, 163, 48, 0.18)',  bdr: 'rgba(198, 163, 48, 0.55)',  fg: '#E8C84A', Ico: Icon.Help },
  no:    { label: "Can't make it",    bg: 'rgba(240, 112, 112, 0.14)', bdr: 'rgba(240, 112, 112, 0.55)', fg: '#F07070', Ico: Icon.XCircle },
};
const NULLR = { label: 'No response yet', bg: 'rgba(255,255,255,0.025)', bdr: 'rgba(255,255,255,0.10)', fg: 'rgba(242,242,240,0.30)', Ico: Icon.Dash };

const nextResp = (cur) => CYCLE[(CYCLE.indexOf(cur) + 1) % CYCLE.length];

function initials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// ─────────────────────────────────────────────────────────────
// AUDIO
// ─────────────────────────────────────────────────────────────
function useNflAudio() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    const a = new Audio('audio/mnf.mp3');
    a.preload = 'auto';
    a.volume = 0.7;
    audioRef.current = a;

    const onPlay  = () => { setPlaying(true);  setNeedsTap(false); };
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onPause);
    a.addEventListener('ended', onEnded);

    const p = a.play();
    if (p && p.catch) {
      p.catch(() => {
        setNeedsTap(true);
        const onTap = () => { a.play().catch(() => {}); };
        window.addEventListener('pointerdown', onTap, { once: true });
        window.addEventListener('keydown',     onTap, { once: true });
      });
    }
    return () => {
      a.pause();
      a.removeEventListener('play', onPlay);
      a.removeEventListener('pause', onPause);
      a.removeEventListener('ended', onEnded);
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.currentTime = 0;
      a.play().catch(() => {});
    } else {
      a.pause();
    }
  };
  return { playing, needsTap, toggle };
}

function AudioButton({ audio }) {
  return (
    <button
      className={'audio-btn' + (audio.needsTap ? ' pulsing' : '')}
      onClick={audio.toggle}
      aria-label={audio.playing ? 'Mute' : 'Play sound'}
      title={audio.playing ? 'Mute Monday Night Football theme' : 'Play Monday Night Football theme'}
    >
      {audio.playing ? <Icon.SoundOn /> : <Icon.SoundOff />}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// PERSISTENCE
// ─────────────────────────────────────────────────────────────
const LS_KEY = (leagueId) => `nffl.warroom.${leagueId}.v2`;

function loadResponses(leagueId) {
  try {
    const raw = localStorage.getItem(LS_KEY(leagueId));
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return JSON.parse(JSON.stringify(window.SEED_RESPONSES[leagueId]));
}
function saveResponses(leagueId, data) {
  try { localStorage.setItem(LS_KEY(leagueId), JSON.stringify(data)); } catch (e) {}
}

// ─────────────────────────────────────────────────────────────
// LANDING — two NFFL logo cards
// ─────────────────────────────────────────────────────────────
function LeagueLogoCard({ league, onClick }) {
  return (
    <button className="logo-card" onClick={onClick} aria-label={league.name}>
      <div className="logo-art">
        <img src={league.logo} alt={league.name} draggable="false" />
        {league.logoPlaceholder && (
          <div className="fex-overlay">
            <span className="fex-overlay-text">{league.badge}</span>
          </div>
        )}
      </div>
      <div className="logo-est">{league.est}</div>
    </button>
  );
}

function Landing({ onPick }) {
  // Order: Wags on left, Fex on right (per user request)
  return (
    <div className="landing">
      <div className="landing-eyebrow">Choose Your League</div>
      <div className="logo-row">
        <LeagueLogoCard league={window.LEAGUES.wags} onClick={() => onPick('wags')} />
        <LeagueLogoCard league={window.LEAGUES.fex}  onClick={() => onPick('fex')} />
      </div>
      <div className="logo-tag-bottom">Draft Night · Where the brains are</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HEADER (shared)
// ─────────────────────────────────────────────────────────────
function LeagueMiniLogo({ league }) {
  return (
    <div className="league-mini-logo">
      <img src={league.logo} alt="" draggable="false" />
      {league.logoPlaceholder && (
        <div className="fex-mini-overlay">
          <span>{league.badge}</span>
        </div>
      )}
    </div>
  );
}

function PageHeader({ league, title, sub, right }) {
  return (
    <div className="page-header">
      <LeagueMiniLogo league={league} />
      <div className="page-header-meta">
        <div className="page-header-eyebrow">{league.name} · Draft Night</div>
        <div className="page-header-title">{title}</div>
        {sub && <div className="page-header-sub">{sub}</div>}
      </div>
      <div className="page-header-right">{right}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// NAME PICKER
// ─────────────────────────────────────────────────────────────
function NamePicker({ league, onBack, onPick }) {
  return (
    <div className="page-wrap">
      <PageHeader league={league}
                  title="Who Are You?"
                  sub="Pick your manager to start voting"
                  right={
                    <button className="btn-pill" onClick={onBack}>
                      <Icon.Back size={14} /> Change League
                    </button>
                  } />

      <div className="name-picker-grid">
        {league.managers.map((m) => (
          <button key={m.name}
                  className="name-tile"
                  onClick={() => onPick(m.name)}>
            <div className="avatar-lg">{initials(m.name)}</div>
            <div className="tile-name">{m.name}</div>
            <div className="tile-team">{m.team}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// RESPONSE CELL
// ─────────────────────────────────────────────────────────────
function ResponseCell({ value, onClick, clickable, isBest }) {
  const r = value ? RMAP[value] : NULLR;
  const Ico = r.Ico;
  return (
    <td className={'cell-date' + (isBest ? ' best' : '')}>
      <div
        className={'resp-chip' + (clickable ? ' clickable' : '')}
        style={{ '--resp-bg': r.bg, '--resp-bdr': r.bdr, '--resp-fg': r.fg }}
        onClick={clickable ? onClick : undefined}
        title={clickable ? `${r.label} · click to change` : r.label}
        role={clickable ? 'button' : undefined}
        aria-label={r.label}
      >
        <Ico size={24} />
      </div>
    </td>
  );
}

// ─────────────────────────────────────────────────────────────
// SUMMARY CARD
// ─────────────────────────────────────────────────────────────
function SummaryCard({ date, counts, total, isBest }) {
  const totalVotes = (counts.yes||0) + (counts.ok||0) + (counts.maybe||0) + (counts.no||0);
  return (
    <div className={'summary-card' + (isBest ? ' best' : '')}>
      <div className="summary-card-top">
        <div>
          <div className="summary-day">{date.day}</div>
          <div className="summary-date">{date.short}</div>
        </div>
        {isBest ? (
          <span className="summary-best-tag"><Icon.Star size={11} /> Best</span>
        ) : (
          <span className="summary-vote-count">{totalVotes > 0 ? `${totalVotes} in` : '—'}</span>
        )}
      </div>
      <div className="summary-rows">
        {Object.entries(RMAP).map(([key, meta]) => {
          const n = counts[key] || 0;
          const Ico = meta.Ico;
          return (
            <div key={key} className="summary-row">
              <div className="summary-row-icon" style={{ color: meta.fg }}>
                <Ico size={16} />
              </div>
              <div className="summary-row-bar">
                <div className="summary-row-bar-fill"
                     style={{ width: total > 0 ? (n / total * 100) + '%' : '0%',
                              background: meta.fg }} />
              </div>
              <div className="summary-row-count"
                   style={{ color: n > 0 ? meta.fg : 'rgba(242,242,240,0.18)' }}>
                {n}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BUSY MODAL
// ─────────────────────────────────────────────────────────────
function BusyModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-eyebrow">Whoa, whoa, whoa</div>
        <h2 className="modal-title">Are you really that busy?!?</h2>
        <p className="modal-body">
          You've marked yourself unavailable for more than five draft nights. Either your calendar
          is roasted or you're trying to dodge the draft. <b>The commissioner is watching.</b>
        </p>
        <div className="modal-btn-row">
          <button className="modal-btn" onClick={onClose}>Yeah, I'm Cooked</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN GRID
// ─────────────────────────────────────────────────────────────
function PollGrid({ league, me, isAdmin, onBack, onSwitchUser }) {
  const [responses, setResponses] = useState(() => loadResponses(league.id));
  const [savedAt, setSavedAt] = useState(null);
  const [showBusy, setShowBusy] = useState(false);
  const prevNoCount = useRef(0);

  useEffect(() => {
    saveResponses(league.id, responses);
    setSavedAt(Date.now());
  }, [responses, league.id]);

  // Track my "no" count and pop modal when crossing >5
  const myNoCount = useMemo(
    () => league.dates.filter(d => responses[me]?.[d.id] === 'no').length,
    [responses, me, league.dates]
  );
  useEffect(() => {
    if (myNoCount > 5 && prevNoCount.current <= 5) setShowBusy(true);
    prevNoCount.current = myNoCount;
  }, [myNoCount]);

  const setResp = (person, dateId, val) => {
    setResponses(prev => ({
      ...prev,
      [person]: { ...(prev[person] || {}), [dateId]: val },
    }));
  };

  const setNote = (person, val) => {
    setResponses(prev => ({
      ...prev,
      [person]: { ...(prev[person] || {}), note: val },
    }));
  };

  // Summary calc per date
  const summary = useMemo(() => {
    return league.dates.map(d => {
      const c = { yes: 0, ok: 0, maybe: 0, no: 0 };
      league.managers.forEach(p => {
        const r = responses[p.name]?.[d.id];
        if (r && c[r] !== undefined) c[r]++;
      });
      return { date: d, c };
    });
  }, [responses, league]);

  // Best = max(yes*2 + ok)
  const bestIds = useMemo(() => {
    const scored = summary.map(s => ({ id: s.date.id, score: s.c.yes * 2 + s.c.ok }));
    const max = Math.max(...scored.map(s => s.score));
    if (max <= 0) return [];
    return scored.filter(s => s.score === max).map(s => s.id);
  }, [summary]);

  // Sort managers: me first, then keep the input order (matches the leagues' real draft order vibe)
  const sortedManagers = useMemo(() => {
    const meEntry = league.managers.find(m => m.name === me);
    const rest = league.managers.filter(m => m.name !== me);
    return meEntry ? [meEntry, ...rest] : league.managers;
  }, [league.managers, me]);

  return (
    <div className="page-wrap">
      <PageHeader
        league={league}
        title="Pick The Draft Night"
        sub={isAdmin
          ? `Commish mode — ${me} · click any cell on any row`
          : `Voting as ${me} · click a cell to cycle yes / not ideal / maybe / no / clear`}
        right={
          <>
            <button className="btn-pill" onClick={onSwitchUser}>Switch User</button>
            <button className="btn-pill" onClick={onBack}>Change League</button>
          </>
        }
      />

      {isAdmin && (
        <div className="admin-banner">
          <div className="banner-icon"><Icon.Shield size={22} /></div>
          <div>
            <div className="admin-banner-title">Commish Mode · {me}</div>
            <div className="admin-banner-sub">You can update any manager's row and notes.</div>
          </div>
        </div>
      )}

      <div className="legend-row">
        <span className="legend-instructions">
          Tap a cell to cycle: <b>yes → not ideal → maybe → no → clear</b>
        </span>
        {Object.entries(RMAP).map(([key, r]) => {
          const Ico = r.Ico;
          return (
            <div key={key} className="legend-item">
              <span className="legend-swatch"
                    style={{ background: r.bg, border: `1.5px solid ${r.bdr}`, color: r.fg }}>
                <Ico size={15} />
              </span>
              <span className="legend-label">{r.label}</span>
            </div>
          );
        })}
      </div>

      <div className="grid-card">
        <div className="grid-scroll">
          <table className="poll-table">
            <thead>
              <tr>
                <th className="col-name">Manager</th>
                {league.dates.map(d => {
                  const isBest = bestIds.includes(d.id);
                  return (
                    <th key={d.id} className={'col-date' + (isBest ? ' best' : '')}>
                      <div className="date-day">{d.day}</div>
                      <div className="date-num">{d.short}</div>
                      {isBest && <div className="best-tag"><Icon.Star size={10} /> Best</div>}
                    </th>
                  );
                })}
                <th className="col-done">Filled</th>
                <th className="col-note">Note</th>
              </tr>
            </thead>
            <tbody>
              {sortedManagers.map((m) => {
                const isMe = m.name === me;
                const canEdit = isAdmin || isMe;
                const row = responses[m.name] || {};
                const filled = league.dates.filter(d => row[d.id]).length;
                const filledClass = filled === league.dates.length
                  ? ' full' : filled > 0 ? ' partial' : '';

                return (
                  <tr key={m.name} className={(isMe ? 'me' : '') + (isMe && isAdmin ? ' admin' : '')}>
                    <td className="cell-name">
                      <div className="name-cell-inner">
                        <div className="avatar">{initials(m.name)}</div>
                        <div className="name-cell-text">
                          <span className="name-cell-name">
                            {m.name}
                            {isMe && (
                              <span className="name-cell-flag">
                                {isAdmin ? '★ Commish' : '● You'}
                              </span>
                            )}
                          </span>
                          <span className="name-cell-team">{m.team}</span>
                        </div>
                      </div>
                    </td>
                    {league.dates.map(d => (
                      <ResponseCell
                        key={d.id}
                        value={row[d.id]}
                        clickable={canEdit}
                        isBest={bestIds.includes(d.id)}
                        onClick={() => setResp(m.name, d.id, nextResp(row[d.id]))}
                      />
                    ))}
                    <td className="cell-date">
                      <span className={'done-pill' + filledClass}>
                        {filled}/{league.dates.length}
                      </span>
                    </td>
                    <td>
                      {canEdit ? (
                        <input
                          type="text"
                          className="note-input"
                          placeholder="Add a note…"
                          value={row.note || ''}
                          onChange={(e) => setNote(m.name, e.target.value)}
                        />
                      ) : (
                        <div className={'note-input readonly' + (row.note ? '' : ' empty')}>
                          {row.note || '—'}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <h3 className="summary-title">Date Summary</h3>
      <div className="summary-grid">
        {summary.map(s => (
          <SummaryCard key={s.date.id}
                       date={s.date}
                       counts={s.c}
                       total={league.managers.length}
                       isBest={bestIds.includes(s.date.id)} />
        ))}
      </div>

      <div className="foot-note">
        <span className="dot-flash" />
        Changes saved locally · {savedAt ? `last write ${new Date(savedAt).toLocaleTimeString()}` : 'autosaving'}
      </div>

      {showBusy && <BusyModal onClose={() => setShowBusy(false)} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────
function App() {
  const audio = useNflAudio();
  const [route, setRoute] = useState({ name: 'landing' });

  useEffect(() => { window.scrollTo(0, 0); }, [route.name, route.leagueId]);

  const pickLeague = (leagueId) => setRoute({ name: 'picker', leagueId });
  const pickName = (name) => {
    const isAdmin = name === window.ADMIN_NAME;
    setRoute(r => ({ name: 'grid', leagueId: r.leagueId, me: name, isAdmin }));
  };
  const backToLanding = () => setRoute({ name: 'landing' });
  const backToPicker  = () => setRoute(r => ({ name: 'picker', leagueId: r.leagueId }));

  return (
    <>
      <AudioButton audio={audio} />
      {route.name === 'landing' && <Landing onPick={pickLeague} />}
      {route.name === 'picker' && (
        <NamePicker league={window.LEAGUES[route.leagueId]}
                    onBack={backToLanding}
                    onPick={pickName} />
      )}
      {route.name === 'grid' && (
        <PollGrid league={window.LEAGUES[route.leagueId]}
                  me={route.me}
                  isAdmin={route.isAdmin}
                  onBack={backToLanding}
                  onSwitchUser={backToPicker} />
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
