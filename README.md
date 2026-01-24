# 🚢 Battleship Game

A modern, real-time multiplayer implementation of the classic Battleship game built with Next.js and Supabase. Challenge your friends or battle against an AI opponent in this tactical naval warfare game.

## ✨ Features

- **Real-time Multiplayer** - Play against friends with live game updates
- **AI Opponent** - Practice against a bot player
- **Drag & Drop Ship Placement** - Intuitive ship positioning interface
- **Live Turn System** - Real-time turn-based gameplay with automatic updates
- **Game Lobby** - Create or join games with shareable game codes
- **Responsive Design** - Beautiful UI that works on desktop and mobile

## 🛠️ Technologies Used

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/)** - UI component library
- **[dnd-kit](https://dndkit.com/)** - Drag and drop functionality
- **[Lucide Icons](https://lucide.dev/)** - Icon library

### Backend
- **[Supabase](https://supabase.com/)** - Backend as a Service
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)

### Fonts
- **[Be Vietnam Pro](https://fonts.google.com/specimen/Be+Vietnam+Pro)** - Google Fonts

## 🎮 Game Rules

1. **Setup Phase**
   - Place 5 ships on your 10x10 grid:
     - Carrier (5 cells)
     - Battleship (4 cells)
     - Cruiser (3 cells)
     - Submarine (3 cells)
     - Destroyer (2 cells)
   - Ships must be placed horizontally with at least 1 cell spacing between them

2. **Battle Phase**
   - Take turns attacking opponent's grid
   - Hit all cells of an enemy ship to sink it
   - First player to sink all opponent ships wins!

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)

---

Built with ❤️ using Next.js and Supabase