# Round Table

A beautifully crafted collaboration platform designed to bring groups of people together — for family, faith, projects, and more. Built with a macOS-inspired UI for simplicity and elegance.

## Features

### The Round Table (Core)
- **Dynamic table visualization** — When 2 people join, a small table appears with their icons. More people = larger table. Shared items appear on the table surface.
- **Create unlimited tables** — Family Circle, Project Teams, Faith Groups, Study Groups, etc.
- **Share items to the table** — Photos, videos, audio, documents, links, notes — all visible on the table surface for group editing

### Personal Portal
- **Dashboard widgets** — Today's schedule, recent shared items, unread messages, quick actions
- **macOS-style dock** — Quick access to all features from anywhere

### Shared Calendar
- **Interactive monthly view** — Click any day to add events
- **Color-coded by table** — Each table has its own color for easy visual identification
- **Table filter chips** — Filter events by table group

### Messaging
- **iMessage-style chat** — Text conversations with any member
- **Thread view** — See all conversations at a glance with unread indicators
- **Quick actions** — Jump to walkie-talkie or video call from any conversation

### Walkie Talkie
- **Push-to-talk** — Hold the button to talk live with any online member
- **Audio beep notification** — Two-tone beep when someone pings you
- **Ping notifications** — Toast-style notification with answer/dismiss buttons
- **Slide-up panel** — Accessible from dock or any conversation

### Video Calling
- **Full-screen call UI** — Professional call interface with mute, video, and hangup controls
- **Accessible everywhere** — Start calls from messages, walkie talkie, or member profiles

### App Launcher
- **Apple ecosystem** — Photos, Pages, Numbers, Keynote, Notes, Reminders, FaceTime, Finder, Music, iCloud
- **Google family** — Docs, Sheets, Slides, Drive, Meet, Calendar, Gmail
- **Microsoft Office** — Word, Excel, PowerPoint, OneDrive, Teams, Outlook
- **Filter by platform** — Quick filter buttons for All, Apple, Google, Microsoft

### File Sharing
- **Drag & drop** — Drag files directly onto the share modal
- **Quick share buttons** — One-click sharing for photos, documents, videos, audio, links, notes, sheets, presentations
- **Type detection** — Automatic file type detection with appropriate icons and colors

## URLs
- **Sandbox**: [Live Preview](https://3000-iwvsgsrstz8hjhpi7s3t2-8f57ffe2.sandbox.novita.ai)

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/me` | Current user info |
| GET | `/api/members` | All members |
| GET | `/api/tables` | All tables with member details |
| GET | `/api/tables/:id` | Single table |
| POST | `/api/tables` | Create new table |
| POST | `/api/tables/:id/items` | Add item to table |
| GET | `/api/messages` | All messages (filter with `?with=userId`) |
| POST | `/api/messages` | Send message |
| GET | `/api/events` | Calendar events |
| POST | `/api/events` | Create event |
| GET | `/api/notifications` | Notifications |
| POST | `/api/walkie/ping` | Ping a user |

## Tech Stack
- **Backend**: Hono framework on Cloudflare Pages
- **Frontend**: Vanilla JS with Tailwind CSS (CDN)
- **Icons**: Font Awesome 6.5
- **Audio**: Web Audio API (walkie-talkie beeps)
- **Design**: macOS-inspired UI with system font stack

## Deployment
- **Platform**: Cloudflare Pages
- **Status**: ✅ Active (Development)
- **Last Updated**: 2026-04-14
