# Round Table — Complete Explainer Document

---

## What Is Round Table?

**Round Table** is a collaboration platform that brings groups of people together — families, faith communities, project teams, or any circle of people who share life together — around a single, beautiful interface inspired by macOS.

The central metaphor is a **round table**: a visual, interactive graphic that represents your group. Each member appears as an avatar seat around the table. Everything you share — photos, documents, audio, video, links — appears *on the table surface* where everyone can see it and work on it together. The more people who join, the bigger the table grows.

It replaces the chaos of scattered group chats, shared drives, calendar apps, and video calls with **one unified space** that feels natural, intuitive, and personal.

---

## The Vision

Most collaboration tools are built for corporations. They're complex, impersonal, and designed around workflows — not relationships.

Round Table is built for **real groups**:
- A family managing their household calendar, sharing vacation photos, and keeping a shared budget
- A faith group coordinating Bible study, sharing sermon links, and praying together in real-time
- A project team reviewing documents, demo videos, and coordinating deadlines
- A neighborhood circle sharing local events, emergency contacts, and community photos

The design philosophy is simple: **if you can sit at a table together, you should be able to collaborate together** — without learning enterprise software.

---

## Core Concepts

### 1. The Round Table (Central Metaphor)

Every group has its own **Round Table**. This is not an abstract list or feed — it's a literal circular table rendered on screen.

**How it works:**
- When you create a table, you give it a name (e.g., "Family Circle," "Faith Group," "Project Alpha") and invite members
- Each member gets a **seat** — a colored avatar with their initials, positioned around the circumference of the table
- Items that members share appear as **icons on the table surface**, arranged in a circle, each with a type-specific icon (camera for photos, document icon for files, music note for audio, etc.)
- The table **dynamically resizes** based on member count: 2 members = small intimate table; 5 members = larger table; 10+ members = full conference-size table
- You can create **unlimited tables** — one for family, one for your church group, one for your project team, one for your book club

**Live vs. Dormant states:**
- A table is **Live** when members are actively using it — the table glows with warm golden light, a shimmer sweeps across the wood surface, a pulsing green ring surrounds it, member avatars glow, and items gently float
- A table is **Dormant** when no one is active — the wood desaturates to gray-brown, the glow disappears, items and seats fade, and a dashed gray border replaces the ring
- This gives you an instant visual sense of where the activity is across all your groups

### 2. Personal Portal (Your Dashboard)

When you open Round Table, you land on **My Portal** — a widget-based dashboard that gives you a bird's-eye view of everything happening across all your tables:

- **Today widget** — Your schedule for the day, pulled from all shared calendars across every table, color-coded by group
- **Recent on Tables** — The latest items shared to any of your tables (photos, docs, audio), with the table name and time
- **Messages widget** — Unread messages from any member, with quick click to reply
- **My Tables overview** — All your tables with Live/Idle status, member count, item count, and active member avatars for live tables
- **Quick Actions** — One-click buttons: New Table, New Event, Walkie Talkie, Apps
- **Notifications** — Walkie-talkie pings, share alerts, event alerts — all in one stream

### 3. Shared Calendar

A full interactive calendar that aggregates events from **all your tables**:

- **Monthly grid view** — Clean, spacious calendar with days showing event pills color-coded by their source table
- **Click any day to add** — Tap a date and a modal opens pre-filled with that date, where you pick a title, time, and which table to share it with
- **Navigation** — Left/right arrows to change months, "Today" button to snap back
- **Table filter chips** — Color-coded pills at the top let you filter events by table (show only "Family Circle" events, or only "Project Alpha" events)
- Events are visible to all members of the associated table

### 4. Messaging System

Built-in iMessage-style messaging between all Round Table members:

- **Thread list** — Left panel shows every member with their avatar, last message preview, timestamp, and unread dot
- **Chat view** — Right panel shows the conversation in blue (sent) and gray (received) bubbles, with timestamps
- **Real-time feel** — Messages appear instantly after sending; scroll auto-jumps to newest message
- **Quick actions from chat** — Every conversation has walkie-talkie and video call buttons in the header
- **Search bar** — Find conversations quickly (search placeholder present)
- **Supports text and email types** — The data model distinguishes between text messages and email-style messages

### 5. Walkie Talkie

A push-to-talk communication feature — like a modern digital walkie-talkie:

- **Slide-up panel** — Opens from the dock or any conversation, showing all online/away members
- **Select a member** — Pick who you want to talk to from the member list
- **Push to talk** — Hold the large green microphone button; it turns red with a pulse animation while you're talking; release to stop
- **Audio beep** — A distinctive two-tone beep (880Hz + 1100Hz, using Web Audio API) plays when you start talking or receive a ping
- **Ping notification** — When someone pings you, a toast slides in from the top-right with their avatar, name, and Answer/Dismiss buttons
- **Video call shortcut** — A blue video button below the talk button lets you escalate to video
- **Bell ping** — A bell button sends a silent ping notification to the other person
- **Simulated incoming call** — The app demonstrates the ping feature by auto-sending a ping from Sarah Chen after 8 seconds

### 6. Video Calling

Full-screen video call interface:

- **Dark overlay** — When a call starts, the screen fills with a dark backdrop
- **Avatar display** — The called member's avatar appears large and centered with their name
- **Controls** — Three circular buttons: Mute (microphone toggle), Hangup (red, ends call), Video toggle (camera on/off)
- **Accessible from anywhere** — Start calls from the messages chat header, walkie-talkie panel, or by clicking a member's seat on the table
- **Escape to exit** — Press Escape to end the call instantly

### 7. App Launcher

A macOS Launchpad-style grid of 24 productivity apps across three ecosystems:

**Apple (11 apps):** Photos, Pages, Numbers, Keynote, Notes, Reminders, FaceTime, Files, Music, Finder, iCloud

**Google (7 apps):** Docs, Sheets, Slides, Drive, Meet, Calendar, Gmail

**Microsoft (6 apps):** Word, Excel, PowerPoint, OneDrive, Teams, Outlook

- Each app icon has a **gradient background** matching its brand, with a Font Awesome icon
- **Platform filter buttons** — "All," "Apple," "Google," "Microsoft" — let you narrow the grid
- Clicking an app opens it in a new browser tab
- The grid is responsive and fills available space with auto-sizing columns

### 8. File Sharing & Collaboration

When you're viewing a table, you can share any type of content:

- **"Share Item" button** — Opens a modal with two sharing methods:
  1. **Drag & drop zone** — Drag files from your desktop directly into the drop zone, or click to open a native file picker. File types are auto-detected (image/ = photo, video/ = video, audio/ = audio, everything else = document)
  2. **Quick share buttons** — 8 category buttons (Photo, Document, Video, Audio, Link, Note, Sheet, Slides) that prompt for a name and instantly add the item to the table
- **Items on the table** — Every shared item appears as a visual icon on the round table surface and in a scrollable list below the table
- **Item list** — Shows icon, name, who shared it, time ago, with Open and Edit buttons

---

## Design Language

Round Table is designed to feel like **a native macOS application**, not a web page:

- **Title bar** — Includes the classic red/yellow/green traffic light buttons
- **Sidebar navigation** — Persistent left sidebar with sections for Navigation (Portal, Calendar, Messages, Apps) and Round Tables (list of all tables with live/dormant indicators)
- **macOS Dock** — A floating glass-effect dock at the bottom of the screen with icons for Portal, Round Table, Calendar, Messages, Walkie Talkie, Apps, and Notifications — with hover animations that lift and scale icons, tooltips that slide up, and red badge counts for unread messages/notifications
- **System font stack** — Uses -apple-system, BlinkMacSystemFont, SF Pro Display for authentic Apple typography
- **macOS color palette** — Blue (#007AFF), Green (#34C759), Orange (#FF9500), Red (#FF3B30), Purple (#AF52DE), Pink (#FF2D55), Yellow (#FFCC00)
- **Glass effect** — Backdrop-filter blur on the dock and title bar for depth
- **Smooth animations** — Fade-in, scale-in, and slide-in transitions with cubic-bezier easing throughout; staggered delays on list items
- **Custom scrollbars** — Thin, rounded, translucent scrollbar thumbs
- **Card-based widgets** — White cards with subtle shadow and rounded corners
- **Modal system** — Modals animate with scale + blur backdrop
- **Keyboard shortcuts** — Escape closes any open modal, video call, or walkie-talkie panel

---

## Technical Architecture

### Backend (Hono on Cloudflare Pages)
- **Framework**: Hono — lightweight, fast edge-first web framework
- **Runtime**: Cloudflare Workers / Pages (edge deployment)
- **Data store**: In-memory JavaScript objects (prototype; production would use Cloudflare D1 or KV)
- **API**: RESTful JSON endpoints for all data operations (tables, messages, events, notifications, walkie-talkie)
- **CORS**: Enabled on all `/api/*` routes

### Frontend (Vanilla JS + Tailwind CSS)
- **Rendering**: Pure client-side JavaScript with a central `State` object and a `render()` function that rebuilds the entire DOM on state changes
- **Styling**: Tailwind CSS via CDN for utility classes, plus a comprehensive custom stylesheet (~1800 lines) for the macOS design system
- **Icons**: Font Awesome 6.5 via CDN
- **Audio**: Web Audio API for walkie-talkie beep sounds
- **No framework**: No React, Vue, or Svelte — just vanilla JS for maximum simplicity and zero build dependencies on the frontend

### API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/me` | Get current user profile |
| `GET` | `/api/members` | List all members |
| `GET` | `/api/tables` | List all tables (with member details) |
| `GET` | `/api/tables/:id` | Get a single table |
| `POST` | `/api/tables` | Create a new table |
| `POST` | `/api/tables/:id/items` | Share an item to a table |
| `GET` | `/api/messages` | Get messages (filter with `?with=userId`) |
| `POST` | `/api/messages` | Send a message |
| `GET` | `/api/events` | Get calendar events |
| `POST` | `/api/events` | Create a calendar event |
| `GET` | `/api/notifications` | Get notifications |
| `POST` | `/api/walkie/ping` | Ping a user via walkie-talkie |

---

## Data Model

### Members
Each member has: id, name, initials, color (avatar background), and status (online/away/offline).

### Tables
Each table has: id, name, member list, shared items, theme color, active flag, list of currently active member IDs, and last activity timestamp.

### Shared Items
Each item has: id, type (photo/document/video/audio/link/note/spreadsheet/presentation), name, who shared it, and timestamp.

### Messages
Each message has: id, from/to user IDs, text content, timestamp, type (text/email), and read flag.

### Events
Each event has: id, title, date, time, associated table, color (inherited from table), and who created it.

### Notifications
Each notification has: id, type (walkie/share/event), from user, message text, timestamp, and read flag.

---

## User Flows

### Flow 1: Sharing a Photo with Your Family
1. Open Round Table
2. Click "Family Circle" in the sidebar (it's Live with a green glow)
3. See the round table with family members seated around it
4. Click "Share Item" in the header
5. Drag a photo from your desktop into the drop zone — or click the "Photo" quick share button
6. The photo icon appears on the table surface and in the shared items list
7. Family members see it immediately on their table

### Flow 2: Setting Up a Bible Study Event
1. From the Portal dashboard, click "New Event" in Quick Actions
2. Fill in: "Bible Study", date April 16, time 7:00 PM, share with "Faith Group"
3. The event appears on the shared calendar, color-coded purple for the Faith Group
4. All 5 members of the Faith Group can see it on their calendar view

### Flow 3: Walkie-Talkie a Team Member
1. Click the walkie-talkie icon in the dock
2. The walkie panel slides up showing online members
3. Select Emma Wilson
4. Hold the green microphone button — a beep plays, the button turns red and pulses
5. Speak your message, release the button
6. Emma gets a ping notification with Answer/Dismiss buttons
7. She taps Answer and her walkie panel opens to your channel

### Flow 4: Reviewing a Project Deliverable
1. Navigate to "Project Alpha" table
2. See Demo.mp4 and Proposal.docx on the table surface
3. Click a member's seat to open walkie talkie and discuss
4. Click the "Edit" button on Proposal.docx to collaborate
5. Share your updated version by drag-dropping the new file

---

## What Makes Round Table Different

| Feature | Round Table | Slack/Teams | Google Workspace | WhatsApp Groups |
|---------|-------------|-------------|------------------|-----------------|
| Visual group metaphor | Round table with seats | Channel list | Folder/file view | Chat list |
| Designed for families | Yes | No | No | Somewhat |
| Faith group support | Yes | No | No | Somewhat |
| Integrated calendar | Shared, color-coded | Add-on | Separate app | No |
| Walkie-talkie | Built-in push-to-talk | No | No | No |
| App launcher (Apple+Google+MS) | 24 apps, one click | App directory | Google only | No |
| macOS native feel | Yes | Electron wrapper | Web app | Mobile-first |
| File sharing on a visual surface | Items appear on table | File upload in chat | Drive folders | Media gallery |
| Live/Dormant group status | Visual glow + animation | Green dot per user | No | Last seen per user |
| No learning curve | Sit at a table, share stuff | Channels, threads, apps | Docs, Drive, Meet, Chat | Simple but limited |

---

## Roadmap (Not Yet Implemented)

The following features are designed but not yet built:

1. **Persistent storage** — Migrate from in-memory store to Cloudflare D1 (SQLite) for permanent data
2. **User authentication** — Login/signup flow with per-member private portals
3. **Real-time sync** — WebSocket or SSE-based live updates so all members see changes instantly
4. **Actual file upload** — Store files in Cloudflare R2 object storage (currently items are metadata-only)
5. **Real walkie-talkie audio** — WebRTC peer-to-peer audio streaming
6. **Real video calls** — WebRTC video with screen sharing
7. **Push notifications** — Browser/mobile push for pings, messages, and events
8. **Mobile responsive layout** — Full mobile-first experience (sidebar already hides on small screens)
9. **Offline support** — Service worker for offline access to cached data
10. **Invite system** — Share a link to invite new members to a table
11. **Roles & permissions** — Admin/member/viewer roles per table
12. **Activity feed** — Chronological stream of all actions across all tables

---

*Round Table: One table. Every group. Everything shared.*
