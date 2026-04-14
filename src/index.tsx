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
  ],
  emails: [
    { id: 'email-1', from: 'user-2', to: 'user-1', subject: 'Vacation Planning', body: 'Hey! I found some great deals for the family trip. Check out the attached links when you get a chance. The resort in Maui looks perfect for the kids!', timestamp: Date.now() - 1800000, read: false, starred: true, folder: 'inbox' },
    { id: 'email-2', from: 'user-4', to: 'user-1', subject: 'Sprint Review Agenda', body: 'Here is the agenda for tomorrow\'s sprint review:\n1. Demo walkthrough (Emma)\n2. Proposal review (You)\n3. Timeline discussion\n4. Next sprint planning\n\nPlease add any items you want to discuss.', timestamp: Date.now() - 3600000, read: false, starred: false, folder: 'inbox' },
    { id: 'email-3', from: 'user-5', to: 'user-1', subject: 'Sunday Sermon Notes', body: 'Hi everyone, I\'ve attached the notes from last Sunday\'s sermon on Philippians 4:6-7. Feel free to share with the group. Looking forward to our Bible study this week!', timestamp: Date.now() - 7200000, read: true, starred: false, folder: 'inbox' },
    { id: 'email-4', from: 'user-1', to: 'user-2', subject: 'Re: Vacation Planning', body: 'Love the Maui idea! Let me check with the family and get back to you. Can you send me the booking link?', timestamp: Date.now() - 900000, read: true, starred: false, folder: 'sent' },
    { id: 'email-5', from: 'user-3', to: 'user-1', subject: 'Game Night This Saturday', body: 'Hey! Are we still on for game night? I can bring Catan and some snacks. Let me know who\'s coming so I can plan accordingly.', timestamp: Date.now() - 10800000, read: true, starred: true, folder: 'inbox' },
    { id: 'email-6', from: 'user-1', to: 'user-4', subject: 'Proposal Draft v2', body: 'Attached is the updated proposal with the changes we discussed. Key updates:\n- Revised timeline\n- Updated budget figures\n- New risk assessment section\n\nLet me know your thoughts.', timestamp: Date.now() - 5400000, read: true, starred: false, folder: 'sent' },
  ],
  texts: [
    { id: 'sms-1', from: 'user-2', to: 'user-1', text: 'Running 5 min late!', timestamp: Date.now() - 300000, read: false },
    { id: 'sms-2', from: 'user-1', to: 'user-2', text: 'No worries, see you soon', timestamp: Date.now() - 240000, read: true },
    { id: 'sms-3', from: 'user-3', to: 'user-1', text: 'Can you grab milk on the way home?', timestamp: Date.now() - 180000, read: false },
    { id: 'sms-4', from: 'user-4', to: 'user-1', text: 'Great work on the presentation today!', timestamp: Date.now() - 600000, read: true },
    { id: 'sms-5', from: 'user-1', to: 'user-3', text: 'Sure, 2% or whole?', timestamp: Date.now() - 120000, read: true },
    { id: 'sms-6', from: 'user-3', to: 'user-1', text: 'Whole please. And eggs if they have them', timestamp: Date.now() - 60000, read: false },
    { id: 'sms-7', from: 'user-5', to: 'user-1', text: 'Are you coming to worship Sunday?', timestamp: Date.now() - 900000, read: true },
  ],
  invites: [
    { id: 'inv-1', tableId: 'table-1', code: 'FAMILY2026', createdBy: 'user-1', createdAt: Date.now() - 86400000, uses: 2, maxUses: 10, expiresAt: Date.now() + 604800000 },
    { id: 'inv-2', tableId: 'table-3', code: 'FAITH4ALL', createdBy: 'user-2', createdAt: Date.now() - 172800000, uses: 4, maxUses: 50, expiresAt: Date.now() + 2592000000 },
  ],
  contacts: [
    { id: 'contact-1', name: 'Mom', phone: '+1 (555) 123-4567', email: 'mom@email.com', isMember: false },
    { id: 'contact-2', name: 'Dad', phone: '+1 (555) 234-5678', email: 'dad@email.com', isMember: false },
    { id: 'contact-3', name: 'Sarah Chen', phone: '+1 (555) 345-6789', email: 'sarah@email.com', isMember: true, memberId: 'user-2' },
    { id: 'contact-4', name: 'Mike Rivera', phone: '+1 (555) 456-7890', email: 'mike@email.com', isMember: true, memberId: 'user-3' },
    { id: 'contact-5', name: 'Emma Wilson', phone: '+1 (555) 567-8901', email: 'emma@email.com', isMember: true, memberId: 'user-4' },
    { id: 'contact-6', name: 'James Park', phone: '+1 (555) 678-9012', email: 'james@email.com', isMember: true, memberId: 'user-5' },
    { id: 'contact-7', name: 'Pastor David', phone: '+1 (555) 789-0123', email: 'pastor.david@church.org', isMember: false },
    { id: 'contact-8', name: 'Coach Thompson', phone: '+1 (555) 890-1234', email: 'coach.t@school.edu', isMember: false },
    { id: 'contact-9', name: 'Aunt Lisa', phone: '+1 (555) 901-2345', email: 'lisa.m@email.com', isMember: false },
    { id: 'contact-10', name: 'Dr. Patel', phone: '+1 (555) 012-3456', email: 'dr.patel@clinic.com', isMember: false },
  ],
  referrals: {
    'user-1': { invited: 5, joined: 3, badge: 'Connector' },
    'user-2': { invited: 8, joined: 6, badge: 'Ambassador' },
    'user-4': { invited: 3, joined: 2, badge: 'Starter' },
  } as Record<string, any>,
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

// ─── Email Routes ───
app.get('/api/emails', (c) => {
  const folder = c.req.query('folder') || 'inbox'
  let emails = store.emails
  if (folder !== 'all') {
    emails = emails.filter(e => e.folder === folder)
  }
  return c.json(emails.map(e => ({
    ...e,
    fromMember: store.members.find(m => m.id === e.from),
    toMember: store.members.find(m => m.id === e.to),
  })).sort((a, b) => b.timestamp - a.timestamp))
})

app.post('/api/emails', async (c) => {
  const body = await c.req.json()
  const email = {
    id: `email-${Date.now()}`,
    from: 'user-1',
    to: body.to,
    subject: body.subject,
    body: body.body,
    timestamp: Date.now(),
    read: true,
    starred: false,
    folder: 'sent',
  }
  store.emails.push(email)
  return c.json(email)
})

app.post('/api/emails/:id/read', (c) => {
  const email = store.emails.find(e => e.id === c.req.param('id'))
  if (email) email.read = true
  return c.json({ success: true })
})

app.post('/api/emails/:id/star', (c) => {
  const email = store.emails.find(e => e.id === c.req.param('id'))
  if (email) email.starred = !email.starred
  return c.json({ success: true, starred: email?.starred })
})

// ─── Text/SMS Routes ───
app.get('/api/texts', (c) => {
  const withUser = c.req.query('with')
  let texts = store.texts
  if (withUser) {
    texts = texts.filter(t =>
      (t.from === 'user-1' && t.to === withUser) ||
      (t.from === withUser && t.to === 'user-1')
    )
  }
  return c.json(texts.map(t => ({
    ...t,
    fromMember: store.members.find(m => m.id === t.from),
    toMember: store.members.find(m => m.id === t.to),
  })).sort((a, b) => a.timestamp - b.timestamp))
})

app.post('/api/texts', async (c) => {
  const body = await c.req.json()
  const text = {
    id: `sms-${Date.now()}`,
    from: 'user-1',
    to: body.to,
    text: body.text,
    timestamp: Date.now(),
    read: true,
  }
  store.texts.push(text)
  return c.json(text)
})

// ─── Invite Routes ───
app.get('/api/invites', (c) => {
  return c.json(store.invites.map(inv => ({
    ...inv,
    table: store.tables.find(t => t.id === inv.tableId),
    creator: store.members.find(m => m.id === inv.createdBy),
  })))
})

app.post('/api/invites', async (c) => {
  const body = await c.req.json()
  const code = body.code || Math.random().toString(36).substring(2, 8).toUpperCase()
  const invite = {
    id: `inv-${Date.now()}`,
    tableId: body.tableId,
    code,
    createdBy: 'user-1',
    createdAt: Date.now(),
    uses: 0,
    maxUses: body.maxUses || 50,
    expiresAt: Date.now() + (body.expiryDays || 30) * 86400000,
  }
  store.invites.push(invite)
  return c.json(invite)
})

app.post('/api/invites/join', async (c) => {
  const body = await c.req.json()
  const invite = store.invites.find(i => i.code === body.code)
  if (!invite) return c.json({ error: 'Invalid invite code' }, 404)
  if (invite.uses >= invite.maxUses) return c.json({ error: 'Invite link expired' }, 410)
  if (Date.now() > invite.expiresAt) return c.json({ error: 'Invite link expired' }, 410)
  invite.uses++
  const table = store.tables.find(t => t.id === invite.tableId)
  return c.json({ success: true, table: table?.name, code: invite.code })
})

// ─── Contacts Routes ───
app.get('/api/contacts', (c) => {
  return c.json(store.contacts)
})

app.post('/api/contacts', async (c) => {
  const body = await c.req.json()
  const contact = {
    id: `contact-${Date.now()}`,
    name: body.name,
    phone: body.phone || '',
    email: body.email || '',
    isMember: false,
  }
  store.contacts.push(contact)
  return c.json(contact)
})

app.post('/api/contacts/:id/invite', async (c) => {
  const contact = store.contacts.find(ct => ct.id === c.req.param('id'))
  if (!contact) return c.json({ error: 'Contact not found' }, 404)
  return c.json({ success: true, invited: contact.name, via: contact.phone || contact.email })
})

// ─── Referral Routes ───
app.get('/api/referrals', (c) => {
  const userId = c.req.query('userId') || 'user-1'
  const ref = store.referrals[userId] || { invited: 0, joined: 0, badge: 'Newcomer' }
  return c.json(ref)
})

app.get('/api/referrals/leaderboard', (c) => {
  const board = Object.entries(store.referrals).map(([uid, data]) => ({
    member: store.members.find(m => m.id === uid),
    ...data,
  })).sort((a, b) => b.joined - a.joined)
  return c.json(board)
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
