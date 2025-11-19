
# 🥚 Brgy Tamago GameHub

**Brgy Tamago GameHub** is a gamified social engagement platform designed as a Telegram Mini App. It incentivizes user interaction through a robust quest system, allowing users to earn points, climb leaderboards, and redeem rewards for completing social media tasks and challenges.

## 🌟 Key Features

### 🗺️ Quest System
- **Diverse Quest Types**: Supports YouTube (Subscribe, Watch), Twitter/X (Follow, Like, Retweet), Telegram (Join), Discord, TikTok, and custom URL visits.
- **Smart Filtering**: Users can easily filter quests by **Daily**, **Socials**, or **Sponsors**.
- **Verification Modes**:
  - **Automatic**: Instant verification for API-supported tasks (simulated).
  - **Manual**: User submits proof (screenshots/links) for admin review.
  - **Timed**: Countdown timers for "Watch" and "Visit" tasks to ensure engagement.
- **Status Tracking**: Visual indicators for **New**, **Completed**, and **Pending** quests.

### 🏆 Gamification & Economy
- **XP & Leveling**: Users earn XP to level up, unlocking prestige and potentially new quests.
- **Points System**: A virtual currency earned by completing quests.
- **Leaderboard**: Real-time ranking system (Overall, Weekly, Daily) to foster competition.
- **Reward Store**: Users can spend points on digital or physical rewards (Gift cards, Badges, etc.).

### 👤 User Profile
- **Activity Log**: A transparent history of all actions (Completions, Claims, Failed submissions).
- **Social Linking**: Profile management for linking social media handles for verification.
- **Stats Overview**: Quick view of current level, XP progress, and total points.

### 🛡️ Admin Capabilities
The codebase includes dedicated admin components (`/pages/Admin*.tsx`) designed to manage the platform:
- **Quest Management**: Create, edit, and delete quests.
- **Verification Hub**: Interface for approving or rejecting manual user submissions with proof review.

## 📱 UI Wireframes

The application follows a dark-themed, mobile-first design optimized for Telegram Mini Apps. Below are the structural wireframes for the core user flows.

| **Home / Quest List** | **Quest Detail** | **Leaderboard** |
|:---:|:---:|:---:|
| ![Home](https://placehold.co/350x700/111827/facc15?text=Header+Stats%0A+%0AFilter+Tabs%0A+%0AQuest+Cards%0A(List+View)) | ![Detail](https://placehold.co/350x700/111827/facc15?text=Quest+Info%0A+%0AReward+Details%0A+%0ASubmission+Form%0A(Upload/Input)) | ![Leaderboard](https://placehold.co/350x700/111827/facc15?text=Top+3+Podium%0A+%0ARanked+List%0A+%0AUser+Rank%0A(Sticky+Footer)) |

| **Rewards Store** | **User Profile** | **Admin Panel** |
|:---:|:---:|:---:|
| ![Rewards](https://placehold.co/350x700/111827/facc15?text=User+Balance%0A+%0AReward+Grid%0A(Cards)%0A+%0AClaim+Modal) | ![Profile](https://placehold.co/350x700/111827/facc15?text=Avatar+&+XP%0A+%0ASocial+Links%0A+%0AActivity+Log) | ![Admin](https://placehold.co/350x700/1f2937/ef4444?text=Quest+Mgmt%0A+%0AVerification+Hub%0A(Approve/Reject)) |

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 (Hooks, Functional Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Utility-first design)
- **Icons**: Lucide React & Custom SVG Icons
- **Architecture**: Component-based, Mobile-first design suitable for Telegram Mini Apps.
- **Data Management**: Mock API service pattern (`useMockData`, `mockApi`) ready for backend integration.

## 📂 Project Structure

```
/
├── components/         # Reusable UI components
│   ├── icons/          # Platform and UI icons
│   ├── QuestList.tsx   # Main quest feed
│   ├── QuestCard.tsx   # Individual quest display
│   ├── QuestDetail.tsx # Quest interaction & verification view
│   ├── Leaderboard.tsx # Ranking display
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useMockData.ts  # Initial state hydration
│   └── useCountdown.ts # Timer logic
├── pages/              # Admin & Page-level components
│   ├── AdminDashboard.tsx
│   ├── AdminVerificationHub.tsx
│   └── ...
├── services/           # API simulation
│   └── mockApi.ts      # Mock backend methods
├── types.ts            # TypeScript definitions
├── App.tsx             # Main application entry & routing logic
└── index.html          # Entry HTML with Import Map
```

## 🚀 Getting Started

This project uses ES Modules via `importmap` in `index.html`, allowing it to run in modern browsers without a complex build step for development, provided the environment supports TypeScript on-the-fly or you have a build process in place.

### Running the Project

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/brgy-tamago-gamehub.git
   ```

2. **Serve the directory**
   Use any static file server (e.g., VS Code Live Server, `http-server`, or `python -m http.server`).

3. **Open in Browser**
   Navigate to `http://localhost:8080` (or your server's port).

## ⚙️ Configuration

- **Metadata**: Update `metadata.json` for Telegram Mini App settings.
- **Mock Data**: Edit `services/mockApi.ts` or `hooks/useMockData.ts` to change initial quests, users, and rewards for testing.
- **Styles**: Global styles and Tailwind imports are managed via `index.html` CDN.

## 🎨 Customization

### Adding a New Quest Platform
1. Add the platform enum in `types.ts`.
2. Create a corresponding icon in `components/icons/PlatformIcons.tsx`.
3. Update the `platformIcons` map in `components/QuestCard.tsx` and `components/QuestDetail.tsx`.

### Changing Theme
The app uses a dark mode theme by default (`bg-gray-900`, `text-gray-50`). Modify `index.html` styles or Tailwind classes to adjust the color palette.

---

Developed for the Brgy Tamago Community. 🥚
