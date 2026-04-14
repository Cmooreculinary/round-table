/* ═══════════════════════════════════════════════════════
   ROUND TABLE — Main Application
   macOS-Inspired Collaboration Platform
   ═══════════════════════════════════════════════════════ */

// ─── State ───
const State = {
  currentView: 'portal',
  currentTable: null,
  currentChat: null,
  walkieOpen: false,
  walkieTalking: false,
  walkieTarget: null,
  videoCallActive: false,
  videoCallTarget: null,
  modalOpen: null,
  members: [],
  tables: [],
  messages: [],
  events: [],
  notifications: [],
  currentUser: null,
  calendarMonth: new Date().getMonth(),
  calendarYear: new Date().getFullYear(),
};

// ─── API ───
const API = {
  async get(url) {
    const r = await fetch(url);
    return r.json();
  },
  async post(url, data) {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return r.json();
  },
};

// ─── Initialize ───
async function init() {
  const [me, members, tables, messages, events, notifications] = await Promise.all([
    API.get('/api/me'),
    API.get('/api/members'),
    API.get('/api/tables'),
    API.get('/api/messages'),
    API.get('/api/events'),
    API.get('/api/notifications'),
  ]);
  State.currentUser = me;
  State.members = members;
  State.tables = tables;
  State.messages = messages;
  State.events = events;
  State.notifications = notifications;
  render();
}

// ─── Render ───
function render() {
  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderTitleBar()}
    <div class="main-layout">
      ${renderSidebar()}
      <div class="content-area">
        ${renderContentHeader()}
        <div class="content-body">
          ${renderContent()}
        </div>
      </div>
    </div>
    ${renderDock()}
    ${renderWalkiePanel()}
    ${renderPingNotification()}
    ${renderModal()}
    ${renderVideoCall()}
  `;
  attachEvents();
}

// ─── Title Bar ───
function renderTitleBar() {
  return `
    <div class="title-bar">
      <div class="traffic-lights">
        <div class="traffic-light tl-close"></div>
        <div class="traffic-light tl-minimize"></div>
        <div class="traffic-light tl-maximize"></div>
      </div>
      <h1>Round Table</h1>
      <div style="display:flex;gap:8px;align-items:center;">
        <button class="mac-btn-icon" onclick="showNotifications()" title="Notifications" style="position:relative">
          <i class="fas fa-bell"></i>
          ${State.notifications.filter(n=>!n.read).length > 0 ? `<span style="position:absolute;top:2px;right:2px;width:8px;height:8px;border-radius:50%;background:var(--mac-red);border:2px solid #f0f0f0"></span>` : ''}
        </button>
        <button class="mac-btn-icon" onclick="navigate('portal')" title="Portal">
          <i class="fas fa-th-large"></i>
        </button>
      </div>
    </div>
  `;
}

// ─── Sidebar ───
function renderSidebar() {
  const unreadMsgs = State.messages.filter(m => m.from !== 'user-1' && !m.read).length;
  return `
    <div class="sidebar">
      <div class="sidebar-section">
        <div class="sidebar-label">Navigation</div>
        <div class="sidebar-item ${State.currentView==='portal'?'active':''}" onclick="navigate('portal')">
          <i class="fas fa-home"></i> My Portal
        </div>
        <div class="sidebar-item ${State.currentView==='calendar'?'active':''}" onclick="navigate('calendar')">
          <i class="fas fa-calendar"></i> Calendar
        </div>
        <div class="sidebar-item ${State.currentView==='messages'?'active':''}" onclick="navigate('messages')">
          <i class="fas fa-envelope"></i> Messages
          ${unreadMsgs > 0 ? `<span class="badge">${unreadMsgs}</span>` : ''}
        </div>
        <div class="sidebar-item ${State.currentView==='apps'?'active':''}" onclick="navigate('apps')">
          <i class="fas fa-th"></i> Apps
        </div>
      </div>

      <div class="sidebar-section">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:0 8px;margin-bottom:4px;">
          <span class="sidebar-label" style="padding:0;margin:0">Round Tables</span>
          <button class="mac-btn-icon" onclick="openModal('newTable')" style="width:20px;height:20px;font-size:11px">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>

      <div class="sidebar-tables">
        ${State.tables.map(t => `
          <div class="sidebar-table-item ${State.currentView==='table'&&State.currentTable===t.id?'active':''}" onclick="navigateTable('${t.id}')">
            <div class="table-dot" style="background:${t.color}"></div>
            <span style="flex:1;font-size:13px">${t.name}</span>
            <span class="member-count">${t.members.length}</span>
          </div>
        `).join('')}
      </div>

      <div class="sidebar-profile" onclick="navigate('portal')">
        <div class="profile-avatar" style="background:${State.currentUser?.color || '#007AFF'}">
          ${State.currentUser?.initials || 'YO'}
        </div>
        <div class="profile-info">
          <div class="profile-name">${State.currentUser?.name || 'You'}</div>
          <div class="profile-status"><span class="status-dot"></span>Online</div>
        </div>
      </div>
    </div>
  `;
}

// ─── Content Header ───
function renderContentHeader() {
  const titles = {
    portal: 'My Portal',
    calendar: 'Shared Calendar',
    messages: 'Messages',
    apps: 'App Launcher',
    table: State.tables.find(t => t.id === State.currentTable)?.name || 'Round Table',
    notifications: 'Notifications',
  };
  const t = State.currentView === 'table' ? State.tables.find(t => t.id === State.currentTable) : null;
  return `
    <div class="content-header">
      <h2>${titles[State.currentView] || 'Round Table'}</h2>
      <div style="flex:1"></div>
      ${State.currentView === 'table' && t ? `
        <div style="display:flex;gap:4px;align-items:center;margin-right:12px;">
          ${t.memberDetails?.map(m => `
            <div style="width:28px;height:28px;border-radius:50%;background:${m?.color};display:flex;align-items:center;justify-content:center;font-size:10px;color:white;font-weight:600;border:2px solid white;margin-left:-6px;box-shadow:0 1px 3px rgba(0,0,0,0.15)" title="${m?.name}">${m?.initials}</div>
          `).join('') || ''}
        </div>
        <button class="mac-btn mac-btn-primary" onclick="openModal('shareItem')">
          <i class="fas fa-plus"></i> Share Item
        </button>
      ` : ''}
      ${State.currentView === 'calendar' ? `
        <button class="mac-btn mac-btn-primary" onclick="openModal('newEvent')">
          <i class="fas fa-plus"></i> New Event
        </button>
      ` : ''}
    </div>
  `;
}

// ─── Content Router ───
function renderContent() {
  switch (State.currentView) {
    case 'portal': return renderPortal();
    case 'calendar': return renderCalendar();
    case 'messages': return renderMessages();
    case 'apps': return renderApps();
    case 'table': return renderTable();
    case 'notifications': return renderNotificationsPage();
    default: return renderPortal();
  }
}

// ═══════════════════════════════════════════════════════
// PORTAL VIEW
// ═══════════════════════════════════════════════════════
function renderPortal() {
  const recentItems = State.tables.flatMap(t => t.items.map(i => ({...i, tableName: t.name, tableColor: t.color}))).sort((a,b) => b.timestamp - a.timestamp).slice(0, 5);
  const todayEvents = State.events.filter(e => e.date === new Date().toISOString().split('T')[0]);
  const unreadMsgs = State.messages.filter(m => m.from !== 'user-1' && !m.read);

  return `
    <div class="portal-grid animate-fade">
      <!-- Today's Schedule -->
      <div class="portal-widget">
        <div class="widget-header">
          <i class="fas fa-calendar-day" style="color:var(--mac-accent)"></i>
          <h3>Today</h3>
          <span style="font-size:11px;color:var(--mac-text2)">${new Date().toLocaleDateString('en-US', {weekday:'long', month:'short', day:'numeric'})}</span>
        </div>
        <div class="widget-body">
          ${todayEvents.length > 0 ? todayEvents.map(e => `
            <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #F2F2F7">
              <div style="width:4px;height:28px;border-radius:2px;background:${e.color}"></div>
              <div style="flex:1">
                <div style="font-size:12px;font-weight:500">${e.title}</div>
                <div style="font-size:10px;color:var(--mac-text2)">${e.time} · ${e.tableName || ''}</div>
              </div>
            </div>
          `).join('') : '<p style="font-size:12px;color:var(--mac-text2);text-align:center;padding:12px 0">No events today</p>'}
        </div>
      </div>

      <!-- Recent Shared Items -->
      <div class="portal-widget">
        <div class="widget-header">
          <i class="fas fa-clock-rotate-left" style="color:var(--mac-orange)"></i>
          <h3>Recent on Tables</h3>
        </div>
        <div class="widget-body">
          ${recentItems.map(item => `
            <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #F2F2F7;cursor:pointer" class="hover-highlight">
              <div style="width:32px;height:32px;border-radius:8px;background:${getItemColor(item.type)};display:flex;align-items:center;justify-content:center;font-size:12px;color:white">
                <i class="${getItemIcon(item.type)}"></i>
              </div>
              <div style="flex:1;min-width:0">
                <div style="font-size:12px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${item.name}</div>
                <div style="font-size:10px;color:var(--mac-text2)">${item.tableName} · ${timeAgo(item.timestamp)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Unread Messages -->
      <div class="portal-widget">
        <div class="widget-header">
          <i class="fas fa-envelope" style="color:var(--mac-green)"></i>
          <h3>Messages</h3>
          ${unreadMsgs.length > 0 ? `<span style="background:var(--mac-red);color:white;font-size:10px;font-weight:600;padding:1px 7px;border-radius:10px">${unreadMsgs.length}</span>` : ''}
        </div>
        <div class="widget-body">
          ${unreadMsgs.length > 0 ? unreadMsgs.slice(0,3).map(m => {
            const from = State.members.find(mb => mb.id === m.from);
            return `
              <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #F2F2F7;cursor:pointer" onclick="navigate('messages');setTimeout(()=>openChat('${m.from}'),100)">
                <div style="width:32px;height:32px;border-radius:50%;background:${from?.color};display:flex;align-items:center;justify-content:center;font-size:11px;color:white;font-weight:600">${from?.initials}</div>
                <div style="flex:1;min-width:0">
                  <div style="font-size:12px;font-weight:600">${from?.name}</div>
                  <div style="font-size:11px;color:var(--mac-text2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${m.text}</div>
                </div>
              </div>
            `;
          }).join('') : '<p style="font-size:12px;color:var(--mac-text2);text-align:center;padding:12px 0">All caught up!</p>'}
        </div>
      </div>

      <!-- My Tables Overview -->
      <div class="portal-widget">
        <div class="widget-header">
          <i class="fas fa-users" style="color:var(--mac-purple)"></i>
          <h3>My Tables</h3>
        </div>
        <div class="widget-body">
          ${State.tables.map(t => `
            <div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid #F2F2F7;cursor:pointer" onclick="navigateTable('${t.id}')">
              <div style="width:36px;height:36px;border-radius:10px;background:${t.color};display:flex;align-items:center;justify-content:center">
                <i class="fas fa-circle-nodes" style="color:white;font-size:14px"></i>
              </div>
              <div style="flex:1">
                <div style="font-size:12px;font-weight:500">${t.name}</div>
                <div style="font-size:10px;color:var(--mac-text2)">${t.members.length} members · ${t.items.length} items</div>
              </div>
              <i class="fas fa-chevron-right" style="font-size:10px;color:var(--mac-text2)"></i>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="portal-widget">
        <div class="widget-header">
          <i class="fas fa-bolt" style="color:var(--mac-yellow)"></i>
          <h3>Quick Actions</h3>
        </div>
        <div class="widget-body" style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <button class="mac-btn mac-btn-secondary" style="justify-content:center;padding:10px" onclick="openModal('newTable')">
            <i class="fas fa-plus-circle"></i> New Table
          </button>
          <button class="mac-btn mac-btn-secondary" style="justify-content:center;padding:10px" onclick="openModal('newEvent')">
            <i class="fas fa-calendar-plus"></i> New Event
          </button>
          <button class="mac-btn mac-btn-secondary" style="justify-content:center;padding:10px" onclick="toggleWalkie()">
            <i class="fas fa-walkie-talkie"></i> Walkie Talkie
          </button>
          <button class="mac-btn mac-btn-secondary" style="justify-content:center;padding:10px" onclick="navigate('apps')">
            <i class="fas fa-th"></i> Apps
          </button>
        </div>
      </div>

      <!-- Notifications -->
      <div class="portal-widget">
        <div class="widget-header">
          <i class="fas fa-bell" style="color:var(--mac-red)"></i>
          <h3>Notifications</h3>
        </div>
        <div class="widget-body">
          ${State.notifications.slice(0,4).map(n => {
            const from = State.members.find(m => m.id === n.from);
            const icon = n.type === 'walkie' ? 'fa-walkie-talkie' : n.type === 'share' ? 'fa-share' : 'fa-calendar';
            return `
              <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #F2F2F7;opacity:${n.read?'0.6':'1'}">
                <div style="width:28px;height:28px;border-radius:50%;background:${from?.color || '#8E8E93'};display:flex;align-items:center;justify-content:center;font-size:10px;color:white">
                  <i class="fas ${icon}"></i>
                </div>
                <div style="flex:1">
                  <div style="font-size:11px;${n.read?'':'font-weight:500'}">${n.message}</div>
                  <div style="font-size:9px;color:var(--mac-text2)">${timeAgo(n.timestamp)}</div>
                </div>
                ${!n.read ? '<div style="width:6px;height:6px;border-radius:50%;background:var(--mac-accent)"></div>' : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════
// ROUND TABLE VISUALIZATION
// ═══════════════════════════════════════════════════════
function renderTable() {
  const table = State.tables.find(t => t.id === State.currentTable);
  if (!table) return '<p>Table not found</p>';

  const memberCount = table.members.length;
  const tableSize = Math.max(180, 120 + memberCount * 40);
  const itemCount = table.items.length;

  return `
    <div class="table-scene animate-scale">
      <div class="table-container" style="width:${tableSize + 160}px;height:${tableSize + 160}px;position:relative">
        <!-- The Round Table -->
        <div class="round-table" style="width:${tableSize}px;height:${tableSize}px;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)">
          <!-- Table center label -->
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:6">
            <div style="text-align:center">
              <div style="font-size:11px;color:rgba(255,255,255,0.5);font-weight:500;letter-spacing:1px;text-transform:uppercase">${table.name}</div>
              <div style="font-size:9px;color:rgba(255,255,255,0.3);margin-top:2px">${itemCount} items shared</div>
            </div>
          </div>
          <!-- Items on the table -->
          ${renderTableItems(table.items, tableSize)}
        </div>
        <!-- Member seats around -->
        ${renderMemberSeats(table, tableSize)}
      </div>

      <!-- Table Items List (below) -->
      <div style="width:100%;max-width:600px;margin-top:24px">
        <div class="mac-card">
          <div class="mac-card-header">
            <h3><i class="fas fa-layer-group" style="margin-right:6px;color:${table.color}"></i>Shared Items</h3>
            <button class="mac-btn mac-btn-primary" onclick="openModal('shareItem')"><i class="fas fa-plus"></i> Add</button>
          </div>
          <div class="mac-card-body" style="padding:0">
            ${table.items.length > 0 ? table.items.sort((a,b)=>b.timestamp-a.timestamp).map(item => {
              const sharer = State.members.find(m => m.id === item.sharedBy);
              return `
                <div style="display:flex;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid #F2F2F7;cursor:pointer;transition:background 0.15s" onmouseover="this.style.background='#F8F8FA'" onmouseout="this.style.background='white'">
                  <div style="width:36px;height:36px;border-radius:8px;background:${getItemColor(item.type)};display:flex;align-items:center;justify-content:center;font-size:14px;color:white">
                    <i class="${getItemIcon(item.type)}"></i>
                  </div>
                  <div style="flex:1;min-width:0">
                    <div style="font-size:13px;font-weight:500">${item.name}</div>
                    <div style="font-size:11px;color:var(--mac-text2)">Shared by ${sharer?.name || 'Unknown'} · ${timeAgo(item.timestamp)}</div>
                  </div>
                  <button class="mac-btn-icon" title="Open"><i class="fas fa-external-link-alt"></i></button>
                  <button class="mac-btn-icon" title="Edit"><i class="fas fa-pen"></i></button>
                </div>
              `;
            }).join('') : '<p style="text-align:center;padding:24px;font-size:13px;color:var(--mac-text2)">No items yet. Share something to the table!</p>'}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderTableItems(items, tableSize) {
  const radius = tableSize * 0.28;
  const cx = tableSize / 2;
  const cy = tableSize / 2;
  return items.map((item, i) => {
    const angle = (i / items.length) * Math.PI * 2 - Math.PI / 2;
    const x = cx + radius * Math.cos(angle) - 18;
    const y = cy + radius * Math.sin(angle) - 22;
    return `
      <div class="table-item animate-scale delay-${i % 5 + 1}" style="left:${x}px;top:${y}px" title="${item.name}">
        <div class="table-item-icon" style="background:${getItemColor(item.type)}">
          <i class="${getItemIcon(item.type)}"></i>
        </div>
        <div class="table-item-label">${item.name}</div>
      </div>
    `;
  }).join('');
}

function renderMemberSeats(table, tableSize) {
  const members = table.memberDetails || [];
  const seatRadius = tableSize / 2 + 50;
  const cx = tableSize / 2 + 80;
  const cy = tableSize / 2 + 80;

  return members.map((m, i) => {
    if (!m) return '';
    const angle = (i / members.length) * Math.PI * 2 - Math.PI / 2;
    const x = cx + seatRadius * Math.cos(angle) - 22;
    const y = cy + seatRadius * Math.sin(angle) - 30;
    const statusColor = m.status === 'online' ? '#34C759' : m.status === 'away' ? '#FF9500' : '#8E8E93';
    return `
      <div class="member-seat animate-fade delay-${i % 5 + 1}" style="left:${x}px;top:${y}px" onclick="memberAction('${m.id}')">
        <div class="seat-avatar" style="background:${m.color}">
          ${m.initials}
          <div class="seat-status" style="background:${statusColor}"></div>
        </div>
        <div class="seat-name">${m.name}</div>
      </div>
    `;
  }).join('');
}

// ═══════════════════════════════════════════════════════
// CALENDAR VIEW
// ═══════════════════════════════════════════════════════
function renderCalendar() {
  const month = State.calendarMonth;
  const year = State.calendarYear;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  let cells = '';
  // Previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    cells += `<div class="calendar-cell other-month"><span class="calendar-day">${d}</span></div>`;
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isToday = dateStr === todayStr;
    const dayEvents = State.events.filter(e => e.date === dateStr);
    cells += `
      <div class="calendar-cell ${isToday ? 'today' : ''}" onclick="calendarDayClick('${dateStr}')">
        <span class="calendar-day">${d}</span>
        ${dayEvents.slice(0, 3).map(e => `
          <div class="calendar-event" style="background:${e.color}" title="${e.title} at ${e.time}">${e.time?.slice(0,5)} ${e.title}</div>
        `).join('')}
        ${dayEvents.length > 3 ? `<div style="font-size:9px;color:var(--mac-text2);padding:1px 4px">+${dayEvents.length-3} more</div>` : ''}
      </div>
    `;
  }
  // Next month
  const totalCells = firstDay + daysInMonth;
  const remaining = 7 - (totalCells % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      cells += `<div class="calendar-cell other-month"><span class="calendar-day">${d}</span></div>`;
    }
  }

  // Filter chips for tables
  const tableFilters = State.tables.map(t => `
    <span style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:12px;font-size:11px;font-weight:500;background:${t.color}15;color:${t.color};border:1px solid ${t.color}40;cursor:pointer">${t.name}</span>
  `).join('');

  return `
    <div class="animate-fade">
      <!-- Calendar Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <div style="display:flex;align-items:center;gap:12px">
          <button class="mac-btn-icon" onclick="changeMonth(-1)"><i class="fas fa-chevron-left"></i></button>
          <h3 style="font-size:18px;font-weight:600;min-width:160px;text-align:center">${monthNames[month]} ${year}</h3>
          <button class="mac-btn-icon" onclick="changeMonth(1)"><i class="fas fa-chevron-right"></i></button>
          <button class="mac-btn mac-btn-secondary" onclick="goToday()" style="font-size:11px">Today</button>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">${tableFilters}</div>
      </div>
      <!-- Calendar Grid -->
      <div class="calendar-grid">
        <div class="calendar-header-cell">Sun</div>
        <div class="calendar-header-cell">Mon</div>
        <div class="calendar-header-cell">Tue</div>
        <div class="calendar-header-cell">Wed</div>
        <div class="calendar-header-cell">Thu</div>
        <div class="calendar-header-cell">Fri</div>
        <div class="calendar-header-cell">Sat</div>
        ${cells}
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════
// MESSAGES VIEW
// ═══════════════════════════════════════════════════════
function renderMessages() {
  const otherMembers = State.members.filter(m => m.id !== 'user-1');
  const chatMember = State.currentChat ? State.members.find(m => m.id === State.currentChat) : null;
  const chatMessages = State.currentChat ? State.messages.filter(m =>
    (m.from === 'user-1' && m.to === State.currentChat) ||
    (m.from === State.currentChat && m.to === 'user-1')
  ).sort((a,b) => a.timestamp - b.timestamp) : [];

  return `
    <div style="display:flex;height:calc(100vh - 152px);margin:-20px;background:white;border-radius:12px;overflow:hidden;box-shadow:var(--shadow-sm)" class="animate-fade">
      <!-- Thread List -->
      <div style="width:260px;border-right:1px solid #E5E5EA;display:flex;flex-direction:column">
        <div style="padding:12px;border-bottom:1px solid #E5E5EA">
          <div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:#F2F2F7;border-radius:8px">
            <i class="fas fa-search" style="font-size:11px;color:var(--mac-text2)"></i>
            <input type="text" placeholder="Search messages..." style="border:none;background:none;font-size:12px;outline:none;width:100%;font-family:inherit">
          </div>
        </div>
        <div style="flex:1;overflow-y:auto">
          ${otherMembers.map(m => {
            const lastMsg = State.messages.filter(msg =>
              (msg.from === m.id && msg.to === 'user-1') || (msg.from === 'user-1' && msg.to === m.id)
            ).sort((a,b) => b.timestamp - a.timestamp)[0];
            const unread = State.messages.some(msg => msg.from === m.id && msg.to === 'user-1' && !msg.read);
            return `
              <div class="message-thread ${State.currentChat === m.id ? 'active' : ''} ${unread ? 'unread' : ''}" onclick="openChat('${m.id}')">
                <div class="thread-avatar" style="background:${m.color}">${m.initials}</div>
                <div class="thread-info">
                  <div class="thread-name">${m.name}</div>
                  <div class="thread-preview">${lastMsg?.text || 'No messages yet'}</div>
                </div>
                ${lastMsg ? `<span class="thread-time">${timeAgo(lastMsg.timestamp)}</span>` : ''}
                ${unread ? '<div class="unread-dot"></div>' : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
      <!-- Chat Area -->
      <div class="chat-area">
        ${chatMember ? `
          <div class="chat-header">
            <div style="width:32px;height:32px;border-radius:50%;background:${chatMember.color};display:flex;align-items:center;justify-content:center;font-size:11px;color:white;font-weight:600">${chatMember.initials}</div>
            <div>
              <div style="font-size:13px;font-weight:600">${chatMember.name}</div>
              <div style="font-size:10px;color:var(--mac-text2)">${chatMember.status}</div>
            </div>
            <div style="flex:1"></div>
            <button class="mac-btn-icon" onclick="startWalkieWith('${chatMember.id}')" title="Walkie Talkie"><i class="fas fa-walkie-talkie"></i></button>
            <button class="mac-btn-icon" onclick="startVideoCall('${chatMember.id}')" title="Video Call"><i class="fas fa-video"></i></button>
          </div>
          <div class="chat-messages" id="chatMessages">
            ${chatMessages.map(msg => `
              <div class="chat-bubble ${msg.from === 'user-1' ? 'sent' : 'received'}">
                ${msg.text}
                <div style="font-size:9px;opacity:0.6;margin-top:2px;text-align:${msg.from==='user-1'?'right':'left'}">${new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
              </div>
            `).join('')}
          </div>
          <div class="chat-input-area">
            <button class="mac-btn-icon" title="Attach"><i class="fas fa-paperclip"></i></button>
            <input type="text" class="chat-input" id="chatInput" placeholder="Message ${chatMember.name}..." onkeypress="if(event.key==='Enter')sendMessage()">
            <button class="mac-btn-icon" style="color:var(--mac-accent)" onclick="sendMessage()" title="Send"><i class="fas fa-paper-plane"></i></button>
          </div>
        ` : `
          <div style="flex:1;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;color:var(--mac-text2)">
            <i class="fas fa-comments" style="font-size:48px;opacity:0.2"></i>
            <p style="font-size:14px">Select a conversation</p>
          </div>
        `}
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════
// APPS VIEW
// ═══════════════════════════════════════════════════════
function renderApps() {
  const apps = [
    { name: 'Photos', icon: 'fa-image', color: 'linear-gradient(135deg,#FF2D55,#FF6482)', url: '#' },
    { name: 'Pages', icon: 'fa-file-alt', color: 'linear-gradient(135deg,#FF9500,#FFAA33)', url: '#' },
    { name: 'Numbers', icon: 'fa-table', color: 'linear-gradient(135deg,#34C759,#5AD97A)', url: '#' },
    { name: 'Keynote', icon: 'fa-presentation-screen', color: 'linear-gradient(135deg,#007AFF,#3395FF)', url: '#' },
    { name: 'Google Docs', icon: 'fa-file-lines', color: 'linear-gradient(135deg,#4285F4,#6FA3F7)', url: 'https://docs.google.com' },
    { name: 'Google Sheets', icon: 'fa-grid', color: 'linear-gradient(135deg,#0F9D58,#3AB878)', url: 'https://sheets.google.com' },
    { name: 'Google Slides', icon: 'fa-display', color: 'linear-gradient(135deg,#F4B400,#F7C733)', url: 'https://slides.google.com' },
    { name: 'Google Drive', icon: 'fa-cloud', color: 'linear-gradient(135deg,#4285F4,#34A853)', url: 'https://drive.google.com' },
    { name: 'Google Meet', icon: 'fa-video', color: 'linear-gradient(135deg,#00832D,#34A853)', url: 'https://meet.google.com' },
    { name: 'Google Calendar', icon: 'fa-calendar', color: 'linear-gradient(135deg,#4285F4,#6FA3F7)', url: 'https://calendar.google.com' },
    { name: 'Gmail', icon: 'fa-envelope', color: 'linear-gradient(135deg,#EA4335,#EF6C60)', url: 'https://mail.google.com' },
    { name: 'iCloud', icon: 'fa-cloud', color: 'linear-gradient(135deg,#3693F5,#5AABF7)', url: 'https://www.icloud.com' },
    { name: 'Notes', icon: 'fa-sticky-note', color: 'linear-gradient(135deg,#FFCC00,#FFD633)', url: '#' },
    { name: 'Reminders', icon: 'fa-list-check', color: 'linear-gradient(135deg,#007AFF,#3395FF)', url: '#' },
    { name: 'FaceTime', icon: 'fa-video', color: 'linear-gradient(135deg,#34C759,#5AD97A)', url: '#' },
    { name: 'Files', icon: 'fa-folder', color: 'linear-gradient(135deg,#007AFF,#3395FF)', url: '#' },
    { name: 'Music', icon: 'fa-music', color: 'linear-gradient(135deg,#FC3C44,#FF6B6B)', url: '#' },
    { name: 'Finder', icon: 'fa-face-smile', color: 'linear-gradient(135deg,#4FC3F7,#29B6F6)', url: '#' },
    { name: 'Word', icon: 'fa-file-word', color: 'linear-gradient(135deg,#2B579A,#4180C7)', url: 'https://office.live.com/start/Word.aspx' },
    { name: 'Excel', icon: 'fa-file-excel', color: 'linear-gradient(135deg,#217346,#33A06F)', url: 'https://office.live.com/start/Excel.aspx' },
    { name: 'PowerPoint', icon: 'fa-file-powerpoint', color: 'linear-gradient(135deg,#D24726,#E06B50)', url: 'https://office.live.com/start/PowerPoint.aspx' },
    { name: 'OneDrive', icon: 'fa-cloud', color: 'linear-gradient(135deg,#0078D4,#2B96ED)', url: 'https://onedrive.live.com' },
    { name: 'Teams', icon: 'fa-users', color: 'linear-gradient(135deg,#6264A7,#8183C5)', url: 'https://teams.microsoft.com' },
    { name: 'Outlook', icon: 'fa-envelope', color: 'linear-gradient(135deg,#0078D4,#2B96ED)', url: 'https://outlook.live.com' },
  ];

  return `
    <div class="animate-fade">
      <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
        <button class="mac-btn mac-btn-primary" style="font-size:11px" data-filter="all" onclick="filterApps(this,'all')">All</button>
        <button class="mac-btn mac-btn-secondary" style="font-size:11px" data-filter="apple" onclick="filterApps(this,'apple')"><i class="fab fa-apple"></i> Apple</button>
        <button class="mac-btn mac-btn-secondary" style="font-size:11px" data-filter="google" onclick="filterApps(this,'google')"><i class="fab fa-google"></i> Google</button>
        <button class="mac-btn mac-btn-secondary" style="font-size:11px" data-filter="microsoft" onclick="filterApps(this,'microsoft')"><i class="fab fa-microsoft"></i> Microsoft</button>
      </div>
      <div class="app-grid">
        ${apps.map(a => `
          <div class="app-icon" onclick="window.open('${a.url}','_blank')">
            <div class="app-icon-img" style="background:${a.color}">
              <i class="fas ${a.icon}"></i>
            </div>
            <div class="app-icon-label">${a.name}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════
// DOCK
// ═══════════════════════════════════════════════════════
function renderDock() {
  const unread = State.messages.filter(m => m.from !== 'user-1' && !m.read).length;
  const notifCount = State.notifications.filter(n => !n.read).length;
  return `
    <div class="mac-dock">
      <div class="dock-item ${State.currentView==='portal'?'active':''}" onclick="navigate('portal')" style="background:linear-gradient(135deg,#007AFF,#5AC8FA);border-radius:12px;color:white">
        <i class="fas fa-home"></i>
        <div class="dock-tooltip">Portal</div>
      </div>
      <div class="dock-item ${State.currentView==='table'?'active':''}" onclick="navigateTable(State.tables[0]?.id)" style="background:linear-gradient(135deg,#8B6914,#6B4F0A);border-radius:12px;color:white">
        <i class="fas fa-circle-nodes"></i>
        <div class="dock-tooltip">Round Table</div>
      </div>
      <div class="dock-item ${State.currentView==='calendar'?'active':''}" onclick="navigate('calendar')" style="background:linear-gradient(135deg,#FF3B30,#FF6482);border-radius:12px;color:white">
        <i class="fas fa-calendar"></i>
        <div class="dock-tooltip">Calendar</div>
      </div>
      <div class="dock-item ${State.currentView==='messages'?'active':''}" onclick="navigate('messages')" style="background:linear-gradient(135deg,#34C759,#5AD97A);border-radius:12px;color:white;position:relative">
        <i class="fas fa-envelope"></i>
        ${unread > 0 ? `<div class="dock-badge">${unread}</div>` : ''}
        <div class="dock-tooltip">Messages</div>
      </div>
      <div class="dock-separator"></div>
      <div class="dock-item" onclick="toggleWalkie()" style="background:linear-gradient(135deg,#FF9500,#FFAA33);border-radius:12px;color:white">
        <i class="fas fa-walkie-talkie"></i>
        <div class="dock-tooltip">Walkie Talkie</div>
      </div>
      <div class="dock-item" onclick="navigate('apps')" style="background:linear-gradient(135deg,#AF52DE,#C77EEB);border-radius:12px;color:white">
        <i class="fas fa-th"></i>
        <div class="dock-tooltip">Apps</div>
      </div>
      <div class="dock-item" onclick="showNotifications()" style="background:linear-gradient(135deg,#FF2D55,#FF6482);border-radius:12px;color:white;position:relative">
        <i class="fas fa-bell"></i>
        ${notifCount > 0 ? `<div class="dock-badge">${notifCount}</div>` : ''}
        <div class="dock-tooltip">Notifications</div>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════
// WALKIE TALKIE PANEL
// ═══════════════════════════════════════════════════════
function renderWalkiePanel() {
  const onlineMembers = State.members.filter(m => m.id !== 'user-1' && m.status !== 'offline');
  const target = State.walkieTarget ? State.members.find(m => m.id === State.walkieTarget) : null;

  return `
    <div class="walkie-panel ${State.walkieOpen ? 'active' : ''}">
      <div class="walkie-header">
        <h3><i class="fas fa-walkie-talkie"></i> Walkie Talkie</h3>
        <button class="mac-btn-icon" onclick="toggleWalkie()" style="color:white;margin-left:auto"><i class="fas fa-times"></i></button>
      </div>
      <div class="walkie-body">
        ${!target ? `
          <p style="font-size:11px;color:var(--mac-text2);margin-bottom:10px">Choose someone to talk to:</p>
          ${onlineMembers.map(m => `
            <div class="walkie-member" onclick="selectWalkieTarget('${m.id}')">
              <div style="width:32px;height:32px;border-radius:50%;background:${m.color};display:flex;align-items:center;justify-content:center;font-size:11px;color:white;font-weight:600">${m.initials}</div>
              <div style="flex:1">
                <div style="font-size:12px;font-weight:500">${m.name}</div>
                <div style="font-size:10px;color:${m.status==='online'?'var(--mac-green)':'var(--mac-orange)'}">${m.status}</div>
              </div>
            </div>
          `).join('')}
        ` : `
          <div style="text-align:center;padding:8px 0">
            <div style="width:56px;height:56px;border-radius:50%;background:${target.color};display:flex;align-items:center;justify-content:center;font-size:18px;color:white;font-weight:600;margin:0 auto 8px">${target.initials}</div>
            <div style="font-size:14px;font-weight:600">${target.name}</div>
            <div style="font-size:11px;color:var(--mac-text2);margin-bottom:12px">${State.walkieTalking ? 'Talking...' : 'Hold to talk'}</div>
            <button class="walkie-btn talk ${State.walkieTalking ? 'active' : ''}"
              onmousedown="startTalking()" onmouseup="stopTalking()" ontouchstart="startTalking()" ontouchend="stopTalking()">
              <i class="fas fa-microphone"></i>
            </button>
            <div style="display:flex;justify-content:center;gap:12px;margin-top:8px">
              <button class="walkie-btn video" onclick="startVideoCall('${target.id}')" title="Video Call">
                <i class="fas fa-video"></i>
              </button>
              <button style="width:36px;height:36px;border-radius:50%;border:none;background:#E5E5EA;cursor:pointer;font-size:14px;color:var(--mac-text2)" onclick="pingUser('${target.id}')" title="Ping">
                <i class="fas fa-bell"></i>
              </button>
            </div>
            <button style="margin-top:12px;font-size:11px;color:var(--mac-accent);background:none;border:none;cursor:pointer" onclick="State.walkieTarget=null;render()">← Choose someone else</button>
          </div>
        `}
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════
// PING NOTIFICATION
// ═══════════════════════════════════════════════════════
function renderPingNotification() {
  return `<div class="ping-notification" id="pingNotif"></div>`;
}

// ═══════════════════════════════════════════════════════
// VIDEO CALL OVERLAY
// ═══════════════════════════════════════════════════════
function renderVideoCall() {
  const target = State.videoCallTarget ? State.members.find(m => m.id === State.videoCallTarget) : null;
  return `
    <div class="video-call-overlay ${State.videoCallActive ? 'active' : ''}">
      ${target ? `
        <div class="video-call-avatar" style="background:${target.color}">${target.initials}</div>
        <div class="video-call-name">${target.name}</div>
        <div class="video-call-status">Connecting...</div>
        <div class="video-call-controls">
          <button class="call-control-btn mute" onclick="toggleMute()"><i class="fas fa-microphone"></i></button>
          <button class="call-control-btn hangup" onclick="endVideoCall()"><i class="fas fa-phone-slash"></i></button>
          <button class="call-control-btn video-toggle"><i class="fas fa-video"></i></button>
        </div>
      ` : ''}
    </div>
  `;
}

// ═══════════════════════════════════════════════════════
// MODALS
// ═══════════════════════════════════════════════════════
function renderModal() {
  if (!State.modalOpen) return '<div class="modal-overlay" onclick="if(event.target===this)closeModal()"></div>';

  let content = '';
  if (State.modalOpen === 'newTable') {
    content = `
      <div class="modal-header">
        <h3>Create New Round Table</h3>
        <button class="mac-btn-icon" onclick="closeModal()"><i class="fas fa-times"></i></button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Table Name</label>
          <input type="text" class="form-input" id="newTableName" placeholder="e.g. Family, Project Team, Study Group...">
        </div>
        <div class="form-group">
          <label class="form-label">Color</label>
          <div class="color-options">
            ${['#007AFF','#34C759','#FF9500','#AF52DE','#FF3B30','#FF2D55','#FFCC00','#5AC8FA'].map((c,i) => `
              <div class="color-option ${i===0?'selected':''}" style="background:${c}" data-color="${c}" onclick="selectColor(this)"></div>
            `).join('')}
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Add Members</label>
          <div class="member-chips">
            ${State.members.filter(m=>m.id!=='user-1').map(m => `
              <div class="member-chip" data-member="${m.id}" onclick="toggleMemberChip(this)">
                <span class="member-chip-dot" style="background:${m.color}"></span>
                ${m.name}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="mac-btn mac-btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="mac-btn mac-btn-primary" onclick="createTable()">Create Table</button>
      </div>
    `;
  } else if (State.modalOpen === 'shareItem') {
    content = `
      <div class="modal-header">
        <h3>Share to Table</h3>
        <button class="mac-btn-icon" onclick="closeModal()"><i class="fas fa-times"></i></button>
      </div>
      <div class="modal-body">
        <div class="drop-zone" id="dropZone" onclick="document.getElementById('filePickerHidden').click()"
          ondragover="event.preventDefault();this.classList.add('dragover')"
          ondragleave="this.classList.remove('dragover')"
          ondrop="event.preventDefault();this.classList.remove('dragover');handleFileDrop(event)">
          <i class="fas fa-cloud-arrow-up"></i>
          <p>Drag & drop files here, or click to browse</p>
          <p style="font-size:11px;margin-top:4px">Photos, Videos, Documents, Audio</p>
        </div>
        <input type="file" id="filePickerHidden" style="display:none" onchange="handleFileSelect(this)" multiple>
        <div style="margin-top:14px;text-align:center;color:var(--mac-text2);font-size:12px">— or share a quick item —</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:12px">
          ${[
            {type:'photo',icon:'fa-image',label:'Photo',color:'#FF2D55'},
            {type:'document',icon:'fa-file-alt',label:'Document',color:'#007AFF'},
            {type:'video',icon:'fa-video',label:'Video',color:'#AF52DE'},
            {type:'audio',icon:'fa-music',label:'Audio',color:'#FF9500'},
            {type:'link',icon:'fa-link',label:'Link',color:'#34C759'},
            {type:'note',icon:'fa-sticky-note',label:'Note',color:'#FFCC00'},
            {type:'spreadsheet',icon:'fa-table',label:'Sheet',color:'#34C759'},
            {type:'presentation',icon:'fa-display',label:'Slides',color:'#FF3B30'},
          ].map(t => `
            <button class="mac-btn mac-btn-secondary" style="flex-direction:column;padding:12px 4px;gap:4px;font-size:10px" onclick="quickShareItem('${t.type}','${t.label}')">
              <i class="fas ${t.icon}" style="font-size:18px;color:${t.color}"></i>
              ${t.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  } else if (State.modalOpen === 'newEvent') {
    content = `
      <div class="modal-header">
        <h3>New Calendar Event</h3>
        <button class="mac-btn-icon" onclick="closeModal()"><i class="fas fa-times"></i></button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Event Title</label>
          <input type="text" class="form-input" id="eventTitle" placeholder="What's happening?">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" class="form-input" id="eventDate" value="${new Date().toISOString().split('T')[0]}">
          </div>
          <div class="form-group">
            <label class="form-label">Time</label>
            <input type="time" class="form-input" id="eventTime" value="12:00">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Share with Table</label>
          <select class="form-select" id="eventTable">
            ${State.tables.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="mac-btn mac-btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="mac-btn mac-btn-primary" onclick="createEvent()">Create Event</button>
      </div>
    `;
  } else if (State.modalOpen === 'notifications') {
    content = `
      <div class="modal-header">
        <h3>Notifications</h3>
        <button class="mac-btn-icon" onclick="closeModal()"><i class="fas fa-times"></i></button>
      </div>
      <div class="modal-body" style="max-height:400px;overflow-y:auto">
        ${State.notifications.length > 0 ? State.notifications.map(n => {
          const from = State.members.find(m => m.id === n.from);
          const icon = n.type === 'walkie' ? 'fa-walkie-talkie' : n.type === 'share' ? 'fa-share' : 'fa-calendar';
          return `
            <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #F2F2F7;opacity:${n.read?'0.5':'1'}">
              <div style="width:36px;height:36px;border-radius:50%;background:${from?.color || '#8E8E93'};display:flex;align-items:center;justify-content:center;font-size:13px;color:white">
                <i class="fas ${icon}"></i>
              </div>
              <div style="flex:1">
                <div style="font-size:13px;${n.read?'':'font-weight:500'}">${n.message}</div>
                <div style="font-size:10px;color:var(--mac-text2)">${timeAgo(n.timestamp)}</div>
              </div>
              ${!n.read ? '<div style="width:8px;height:8px;border-radius:50%;background:var(--mac-accent)"></div>' : ''}
            </div>
          `;
        }).join('') : '<p style="text-align:center;color:var(--mac-text2);padding:20px">No notifications</p>'}
      </div>
    `;
  }

  return `
    <div class="modal-overlay ${State.modalOpen ? 'active' : ''}" onclick="if(event.target===this)closeModal()">
      <div class="modal-content">${content}</div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════
// NOTIFICATIONS PAGE
// ═══════════════════════════════════════════════════════
function renderNotificationsPage() {
  return `
    <div class="animate-fade" style="max-width:600px;margin:0 auto">
      <div class="mac-card">
        <div class="mac-card-header">
          <h3>All Notifications</h3>
          <button class="mac-btn mac-btn-secondary" onclick="clearNotifications()" style="font-size:11px">Clear All</button>
        </div>
        <div class="mac-card-body" style="padding:0">
          ${State.notifications.map(n => {
            const from = State.members.find(m => m.id === n.from);
            const icon = n.type === 'walkie' ? 'fa-walkie-talkie' : n.type === 'share' ? 'fa-share' : 'fa-calendar';
            return `
              <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid #F2F2F7;opacity:${n.read?'0.5':'1'}">
                <div style="width:36px;height:36px;border-radius:50%;background:${from?.color || '#8E8E93'};display:flex;align-items:center;justify-content:center;font-size:13px;color:white">
                  <i class="fas ${icon}"></i>
                </div>
                <div style="flex:1">
                  <div style="font-size:13px;${n.read?'':'font-weight:500'}">${n.message}</div>
                  <div style="font-size:10px;color:var(--mac-text2)">${timeAgo(n.timestamp)}</div>
                </div>
                ${n.type === 'walkie' && !n.read ? `
                  <button class="mac-btn mac-btn-primary" style="font-size:10px;padding:4px 10px" onclick="answerWalkie('${n.from}')">
                    <i class="fas fa-phone"></i> Answer
                  </button>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════
// ACTIONS / EVENT HANDLERS
// ═══════════════════════════════════════════════════════

function navigate(view) {
  State.currentView = view;
  if (view !== 'table') State.currentTable = null;
  if (view !== 'messages') State.currentChat = null;
  render();
}

function navigateTable(id) {
  State.currentView = 'table';
  State.currentTable = id;
  render();
}

function openChat(memberId) {
  State.currentChat = memberId;
  // Mark messages as read
  State.messages.forEach(m => {
    if (m.from === memberId && m.to === 'user-1') m.read = true;
  });
  render();
  // Scroll to bottom
  setTimeout(() => {
    const el = document.getElementById('chatMessages');
    if (el) el.scrollTop = el.scrollHeight;
  }, 50);
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  if (!input || !input.value.trim()) return;
  const text = input.value.trim();
  input.value = '';

  const msg = await API.post('/api/messages', {
    to: State.currentChat,
    text: text,
    type: 'text',
  });
  State.messages.push({
    ...msg,
    fromMember: State.currentUser,
    toMember: State.members.find(m => m.id === msg.to),
  });
  render();
  setTimeout(() => {
    const el = document.getElementById('chatMessages');
    if (el) el.scrollTop = el.scrollHeight;
  }, 50);
}

function openModal(type) { State.modalOpen = type; render(); }
function closeModal() { State.modalOpen = null; render(); }

function showNotifications() {
  State.currentView = 'notifications';
  State.notifications.forEach(n => n.read = true);
  render();
}

function clearNotifications() {
  State.notifications = [];
  render();
}

// Calendar
function changeMonth(delta) {
  State.calendarMonth += delta;
  if (State.calendarMonth > 11) { State.calendarMonth = 0; State.calendarYear++; }
  if (State.calendarMonth < 0) { State.calendarMonth = 11; State.calendarYear--; }
  render();
}

function goToday() {
  const today = new Date();
  State.calendarMonth = today.getMonth();
  State.calendarYear = today.getFullYear();
  render();
}

function calendarDayClick(date) {
  State.modalOpen = 'newEvent';
  render();
  setTimeout(() => {
    const el = document.getElementById('eventDate');
    if (el) el.value = date;
  }, 50);
}

async function createEvent() {
  const title = document.getElementById('eventTitle')?.value;
  const date = document.getElementById('eventDate')?.value;
  const time = document.getElementById('eventTime')?.value;
  const table = document.getElementById('eventTable')?.value;
  if (!title || !date) return;

  const ev = await API.post('/api/events', { title, date, time, table });
  State.events.push({
    ...ev,
    tableName: State.tables.find(t => t.id === ev.table)?.name,
  });
  closeModal();
}

// Tables
function selectColor(el) {
  document.querySelectorAll('.color-option').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

function toggleMemberChip(el) {
  el.classList.toggle('selected');
}

async function createTable() {
  const name = document.getElementById('newTableName')?.value;
  if (!name) return;
  const color = document.querySelector('.color-option.selected')?.dataset.color || '#007AFF';
  const selectedMembers = Array.from(document.querySelectorAll('.member-chip.selected')).map(c => c.dataset.member);
  selectedMembers.unshift('user-1');

  const t = await API.post('/api/tables', { name, color, members: selectedMembers });
  t.memberDetails = t.members.map(mid => State.members.find(m => m.id === mid));
  State.tables.push(t);
  closeModal();
  navigateTable(t.id);
}

// Share items
async function quickShareItem(type, label) {
  if (!State.currentTable) return;
  const name = prompt(`Enter ${label.toLowerCase()} name:`, `My ${label}`);
  if (!name) return;

  const item = await API.post(`/api/tables/${State.currentTable}/items`, {
    type,
    name,
    sharedBy: 'user-1',
  });
  const table = State.tables.find(t => t.id === State.currentTable);
  if (table) table.items.push(item);
  closeModal();
  render();
}

function handleFileDrop(event) {
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    handleFiles(files);
  }
}

function handleFileSelect(input) {
  if (input.files.length > 0) {
    handleFiles(input.files);
  }
}

async function handleFiles(files) {
  for (const file of files) {
    let type = 'document';
    if (file.type.startsWith('image/')) type = 'photo';
    else if (file.type.startsWith('video/')) type = 'video';
    else if (file.type.startsWith('audio/')) type = 'audio';

    if (State.currentTable) {
      const item = await API.post(`/api/tables/${State.currentTable}/items`, {
        type,
        name: file.name,
        sharedBy: 'user-1',
      });
      const table = State.tables.find(t => t.id === State.currentTable);
      if (table) table.items.push(item);
    }
  }
  closeModal();
  render();
}

// Walkie Talkie
function toggleWalkie() {
  State.walkieOpen = !State.walkieOpen;
  if (!State.walkieOpen) {
    State.walkieTalking = false;
    State.walkieTarget = null;
  }
  render();
}

function selectWalkieTarget(id) {
  State.walkieTarget = id;
  render();
}

function startWalkieWith(id) {
  State.walkieOpen = true;
  State.walkieTarget = id;
  render();
}

function startTalking() {
  State.walkieTalking = true;
  render();
  // Play beep sound
  playBeep();
}

function stopTalking() {
  State.walkieTalking = false;
  render();
}

async function pingUser(userId) {
  await API.post('/api/walkie/ping', { to: userId });
  const member = State.members.find(m => m.id === userId);
  showPingNotification(member, 'Ping sent!');
}

function showPingNotification(member, subtitle) {
  const el = document.getElementById('pingNotif');
  if (!el) return;
  el.innerHTML = `
    <div class="ping-avatar" style="background:${member?.color || '#8E8E93'}">${member?.initials || '?'}</div>
    <div class="ping-content">
      <div class="ping-title">${member?.name || 'Unknown'}</div>
      <div class="ping-subtitle">${subtitle}</div>
    </div>
    <div class="ping-actions">
      <button class="ping-action-btn" style="background:var(--mac-green)" onclick="answerWalkie('${member?.id}')"><i class="fas fa-phone"></i></button>
      <button class="ping-action-btn" style="background:var(--mac-red)" onclick="dismissPing()"><i class="fas fa-times"></i></button>
    </div>
  `;
  el.classList.add('show');
  playBeep();
  setTimeout(() => el.classList.remove('show'), 5000);
}

function dismissPing() {
  document.getElementById('pingNotif')?.classList.remove('show');
}

function answerWalkie(userId) {
  dismissPing();
  startWalkieWith(userId);
}

// Video Call
function startVideoCall(userId) {
  State.videoCallActive = true;
  State.videoCallTarget = userId;
  render();
}

function endVideoCall() {
  State.videoCallActive = false;
  State.videoCallTarget = null;
  render();
}

function toggleMute() {
  // Toggle mute icon
}

function memberAction(memberId) {
  if (memberId === 'user-1') return;
  // Show a quick action menu
  State.walkieOpen = true;
  State.walkieTarget = memberId;
  render();
}

function filterApps(btn, filter) {
  // Visual only - highlight button
  document.querySelectorAll('[data-filter]').forEach(b => {
    b.classList.remove('mac-btn-primary');
    b.classList.add('mac-btn-secondary');
  });
  btn.classList.remove('mac-btn-secondary');
  btn.classList.add('mac-btn-primary');
}

// ─── Utilities ───
function getItemIcon(type) {
  const icons = {
    photo: 'fa-image', document: 'fa-file-alt', video: 'fa-video',
    audio: 'fa-music', link: 'fa-link', note: 'fa-sticky-note',
    spreadsheet: 'fa-table', presentation: 'fa-display',
  };
  return 'fas ' + (icons[type] || 'fa-file');
}

function getItemColor(type) {
  const colors = {
    photo: '#FF2D55', document: '#007AFF', video: '#AF52DE',
    audio: '#FF9500', link: '#34C759', note: '#FFCC00',
    spreadsheet: '#34C759', presentation: '#FF3B30',
  };
  return colors[type] || '#8E8E93';
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
  return `${Math.floor(diff/86400000)}d ago`;
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.value = 0.15;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.stop(ctx.currentTime + 0.2);
    // Second beep
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.frequency.value = 1100;
      osc2.type = 'sine';
      gain2.gain.value = 0.15;
      osc2.start();
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc2.stop(ctx.currentTime + 0.2);
    }, 150);
  } catch(e) {}
}

function attachEvents() {
  // Keyboard shortcuts
  document.onkeydown = (e) => {
    if (e.key === 'Escape') {
      if (State.videoCallActive) endVideoCall();
      else if (State.modalOpen) closeModal();
      else if (State.walkieOpen) toggleWalkie();
    }
  };
}

// Simulate incoming ping after 8 seconds
setTimeout(() => {
  const sarah = State.members.find(m => m.id === 'user-2');
  if (sarah) showPingNotification(sarah, 'Wants to talk on Walkie Talkie');
}, 8000);

// ─── Boot ───
init();
