import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/api/*', cors())

// ─── In-memory data store (simulating database) ───
const store = {
  currentUser: {
    id: 'user-1',
    name: 'You',
    initials: 'YO',
    avatar: '',
    color: '#007AFF',
    status: 'online'
  },
  members: [
    { id: 'user-1', name: 'You', initials: 'YO', color: '#007AFF', status: 'online' },
    { id: 'user-2', name: 'Sarah Chen', initials: 'SC', color: '#FF9500', status: 'online' },
    { id: 'user-3', name: 'Mike Rivera', initials: 'MR', color: '#34C759', status: 'away' },
    { id: 'user-4', name: 'Emma Wilson', initials: 'EW', color: '#AF52DE', status: 'online' },
    { id: 'user-5', name: 'James Park', initials: 'JP', color: '#FF3B30', status: 'offline' },
  ],
  tables: [
    {
      id: 'table-1',
      name: 'Family Circle',
      members: ['user-1', 'user-2', 'user-3'],
      items: [
        { id: 'item-1', type: 'photo', name: 'Vacation.jpg', sharedBy: 'user-2', timestamp: Date.now() - 3600000 },
        { id: 'item-2', type: 'document', name: 'Budget 2026.xlsx', sharedBy: 'user-1', timestamp: Date.now() - 7200000 },
        { id: 'item-3', type: 'audio', name: 'Voice Note.m4a', sharedBy: 'user-3', timestamp: Date.now() - 1800000 },
      ],
      color: '#007AFF',
      active: true,
      activeMembers: ['user-1', 'user-2'],
      lastActivity: Date.now() - 120000
    },
    {
      id: 'table-2',
      name: 'Project Alpha',
      members: ['user-1', 'user-4', 'user-5'],
      items: [
        { id: 'item-4', type: 'video', name: 'Demo.mp4', sharedBy: 'user-4', timestamp: Date.now() - 900000 },
        { id: 'item-5', type: 'document', name: 'Proposal.docx', sharedBy: 'user-1', timestamp: Date.now() - 5400000 },
      ],
      color: '#34C759',
      active: false,
      activeMembers: [],
      lastActivity: Date.now() - 86400000
    },
    {
      id: 'table-3',
      name: 'Faith Group',
      members: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5'],
      items: [
        { id: 'item-6', type: 'document', name: 'Study Notes.pdf', sharedBy: 'user-2', timestamp: Date.now() - 600000 },
        { id: 'item-7', type: 'photo', name: 'Group Photo.png', sharedBy: 'user-3', timestamp: Date.now() - 2400000 },
        { id: 'item-8', type: 'link', name: 'Sermon Video', sharedBy: 'user-5', timestamp: Date.now() - 4800000 },
        { id: 'item-9', type: 'audio', name: 'Hymn.mp3', sharedBy: 'user-4', timestamp: Date.now() - 3000000 },
      ],
      color: '#AF52DE',
      active: true,
      activeMembers: ['user-1', 'user-3', 'user-4'],
      lastActivity: Date.now() - 30000
    },
  ],
  messages: [
    { id: 'msg-1', from: 'user-2', to: 'user-1', text: 'Hey! Did you see the vacation photos?', timestamp: Date.now() - 120000, type: 'text', read: false },
    { id: 'msg-2', from: 'user-1', to: 'user-2', text: 'Yes! They look amazing 🌴', timestamp: Date.now() - 60000, type: 'text', read: true },
    { id: 'msg-3', from: 'user-4', to: 'user-1', text: 'Can we review the proposal today?', timestamp: Date.now() - 300000, type: 'text', read: false },
    { id: 'msg-4', from: 'user-3', to: 'user-1', text: 'Meeting moved to 3pm', timestamp: Date.now() - 600000, type: 'email', read: true },
  ],
  events: [
    { id: 'ev-1', title: 'Family Dinner', date: '2026-04-14', time: '18:00', table: 'table-1', color: '#007AFF', sharedBy: 'user-2' },
    { id: 'ev-2', title: 'Sprint Review', date: '2026-04-15', time: '10:00', table: 'table-2', color: '#34C759', sharedBy: 'user-4' },
    { id: 'ev-3', title: 'Bible Study', date: '2026-04-16', time: '19:00', table: 'table-3', color: '#AF52DE', sharedBy: 'user-2' },
    { id: 'ev-4', title: 'Project Deadline', date: '2026-04-18', time: '17:00', table: 'table-2', color: '#34C759', sharedBy: 'user-1' },
    { id: 'ev-5', title: 'Game Night', date: '2026-04-19', time: '20:00', table: 'table-1', color: '#007AFF', sharedBy: 'user-3' },
    { id: 'ev-6', title: 'Worship Service', date: '2026-04-20', time: '09:00', table: 'table-3', color: '#AF52DE', sharedBy: 'user-5' },
    { id: 'ev-7', title: 'Team Standup', date: '2026-04-14', time: '09:30', table: 'table-2', color: '#34C759', sharedBy: 'user-1' },
    { id: 'ev-8', title: 'Lunch w/ Sarah', date: '2026-04-14', time: '12:00', table: 'table-1', color: '#007AFF', sharedBy: 'user-1' },
  ],
  walkieTalkie: [] as any[],
  notifications: [
    { id: 'n-1', type: 'walkie', from: 'user-2', message: 'Sarah wants to talk', timestamp: Date.now() - 30000, read: false },
    { id: 'n-2', type: 'share', from: 'user-4', message: 'Emma shared Demo.mp4', timestamp: Date.now() - 90000, read: false },
    { id: 'n-3', type: 'event', from: 'user-3', message: 'Mike added Game Night', timestamp: Date.now() - 180000, read: true },
  ]
}

// ─── API Routes ───

// Get current user
app.get('/api/me', (c) => c.json(store.currentUser))

// Get all members
app.get('/api/members', (c) => c.json(store.members))

// Get all tables
app.get('/api/tables', (c) => {
  const tables = store.tables.map(t => ({
    ...t,
    memberDetails: t.members.map(mid => store.members.find(m => m.id === mid))
  }))
  return c.json(tables)
})

// Get single table
app.get('/api/tables/:id', (c) => {
  const table = store.tables.find(t => t.id === c.req.param('id'))
  if (!table) return c.json({ error: 'Not found' }, 404)
  return c.json({
    ...table,
    memberDetails: table.members.map(mid => store.members.find(m => m.id === mid))
  })
})

// Add item to table
app.post('/api/tables/:id/items', async (c) => {
  const table = store.tables.find(t => t.id === c.req.param('id'))
  if (!table) return c.json({ error: 'Not found' }, 404)
  const body = await c.req.json()
  const newItem = {
    id: `item-${Date.now()}`,
    type: body.type || 'document',
    name: body.name || 'Untitled',
    sharedBy: body.sharedBy || 'user-1',
    timestamp: Date.now()
  }
  table.items.push(newItem)
  return c.json(newItem)
})

// Get messages
app.get('/api/messages', (c) => {
  const withUser = c.req.query('with')
  let msgs = store.messages
  if (withUser) {
    msgs = msgs.filter(m =>
      (m.from === 'user-1' && m.to === withUser) ||
      (m.from === withUser && m.to === 'user-1')
    )
  }
  return c.json(msgs.map(m => ({
    ...m,
    fromMember: store.members.find(mb => mb.id === m.from),
    toMember: store.members.find(mb => mb.id === m.to),
  })))
})

// Send message
app.post('/api/messages', async (c) => {
  const body = await c.req.json()
  const msg = {
    id: `msg-${Date.now()}`,
    from: 'user-1',
    to: body.to,
    text: body.text,
    timestamp: Date.now(),
    type: body.type || 'text',
    read: false,
  }
  store.messages.push(msg)
  return c.json(msg)
})

// Get events
app.get('/api/events', (c) => {
  return c.json(store.events.map(e => ({
    ...e,
    tableName: store.tables.find(t => t.id === e.table)?.name,
    sharedByMember: store.members.find(m => m.id === e.sharedBy)
  })))
})

// Create event
app.post('/api/events', async (c) => {
  const body = await c.req.json()
  const ev = {
    id: `ev-${Date.now()}`,
    title: body.title,
    date: body.date,
    time: body.time || '12:00',
    table: body.table,
    color: store.tables.find(t => t.id === body.table)?.color || '#007AFF',
    sharedBy: 'user-1'
  }
  store.events.push(ev)
  return c.json(ev)
})

// Get notifications
app.get('/api/notifications', (c) => {
  return c.json(store.notifications.map(n => ({
    ...n,
    fromMember: store.members.find(m => m.id === n.from)
  })))
})

// Walkie talkie ping
app.post('/api/walkie/ping', async (c) => {
  const body = await c.req.json()
  const notification = {
    id: `n-${Date.now()}`,
    type: 'walkie',
    from: 'user-1',
    message: `You pinged ${store.members.find(m => m.id === body.to)?.name}`,
    timestamp: Date.now(),
    read: false
  }
  store.notifications.unshift(notification)
  return c.json({ status: 'sent', to: body.to })
})

// Create table
app.post('/api/tables', async (c) => {
  const body = await c.req.json()
  const newTable = {
    id: `table-${Date.now()}`,
    name: body.name,
    members: body.members || ['user-1'],
    items: [],
    color: body.color || '#007AFF'
  }
  store.tables.push(newTable)
  return c.json(newTable)
})

// ─── Main HTML Page ───
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Round Table</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" rel="stylesheet">
  <link href="/static/style.css" rel="stylesheet">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            'sf': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
          },
          colors: {
            'mac': {
              'bg': '#F5F5F7',
              'sidebar': '#E8E8ED',
              'card': '#FFFFFF',
              'accent': '#007AFF',
              'green': '#34C759',
              'orange': '#FF9500',
              'red': '#FF3B30',
              'purple': '#AF52DE',
              'pink': '#FF2D55',
              'yellow': '#FFCC00',
              'gray': '#8E8E93',
              'border': '#D1D1D6',
              'text': '#1D1D1F',
              'text2': '#86868B',
            }
          }
        }
      }
    }
  </script>
</head>
<body class="font-sf bg-mac-bg text-mac-text overflow-hidden select-none">
  <div id="app"></div>
  <script src="/static/app.js"></script>
</body>
</html>`)
})

export default app
