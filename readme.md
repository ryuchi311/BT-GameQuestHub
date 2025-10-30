
# 🎮 Brgy Tamago GameHub

A gamified social media quest platform designed as a Telegram Mini App. It allows users to complete various online tasks for points and rewards, featuring a comprehensive admin dashboard for management and manual verification.

## ✨ Core Features

- **Dynamic Quest System**: Engage users with a variety of quests across multiple platforms.
  - **Quest Types**: YouTube (Subscribe, Watch), Twitter/X (Follow, Like, Comment), Telegram (Join), Discord (Join), Referral links, and custom URL visits.
  - **Categorized Filtering**: Easily filter quests by `All`, `Daily`, `Socials`, and `Sponsors`.
  - **Visual Indicators**: New quests are highlighted with badges, and completed/pending quests are visually distinct.

- **Advanced Verification Flows**:
  - **Automatic (API-based)**: For tasks like Twitter follows or Telegram joins.
  - **Manual Submission**: Users can submit proof (e.g., a Facebook link to a screenshot) for tasks requiring manual review.
  - **Timed Verification**: Quests like "Watch a video" or "Visit a URL" feature countdown timers to ensure engagement before rewards can be claimed.
  - **Status Tracking**: Quests can be in a `pending`, `approved`, or `rejected` state, with the UI updating accordingly.

- **Gamification & Rewards**:
  - **Leaderboard**: A competitive leaderboard ranking users by points.
  - **Points & XP System**: Users earn points and experience for completing quests, displayed prominently in the user header.
  - **Reward Store**: A dedicated "Rewards" tab where users can spend their points to claim items, featuring an animated confirmation modal.

- **User-Centric Interface**:
  - **Profile Management**: Users can view their social media usernames and edit them.
  - **Activity Log**: A detailed history of all successful quests, failed submissions, and claimed rewards.
  - **Responsive Design**: Built with Tailwind CSS for a clean, modern, and mobile-first experience suitable for a Telegram Mini App.

## 🛠️ Tech Stack

- **Frontend**: React 18+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Module System**: ESM (via import maps)
- **API (Conceptual)**: Google Gemini API for potential future AI-assisted features.

## 📂 Project Structure

The project is organized into a clean and maintainable structure:

```
/
├── components/
│   ├── icons/
│   │   ├── ... (SVG icon components)
│   ├── ActivityLogRow.tsx
│   ├── BottomNav.tsx
│   ├── ClaimRewardModal.tsx
│   ├── Header.tsx
│   ├── Leaderboard.tsx
│   ├── LeaderboardRow.tsx
│   ├── Profile.tsx
│   ├── QuestCard.tsx
│   ├── QuestDetail.tsx
│   ├── QuestList.tsx
│   ├── RewardCard.tsx
│   └── Rewards.tsx
├── hooks/
│   └── useMockData.ts
├── App.tsx
├── index.html
├── index.tsx
├── metadata.json
├── readme.md
└── types.ts
```

- **`App.tsx`**: The main application component that manages global state and routing between different views.
- **`components/`**: Contains all reusable React components, from small UI elements like icons to major page views like `QuestDetail`.
- **`hooks/`**: Holds custom React hooks. `useMockData.ts` currently serves as a mock backend, providing all necessary data for the app.
- **`types.ts`**: Defines all shared TypeScript interfaces and types, ensuring type safety across the application.
- **`index.html`**: The main HTML entry point, which includes the import map for ESM modules and Tailwind CSS.

## 🚀 How to Run (Conceptual)

1.  **Prerequisites**: Ensure you have Node.js and a package manager like `npm` or `yarn` installed.
2.  **Installation**: Run `npm install` in the root directory to install dependencies.
3.  **Environment**: Create a `.env` file and add your `API_KEY` for the Google Gemini SDK (if implementing AI features).
4.  **Start**: Run `npm start` to launch the development server.

## 🧩 Key Components Explained

- **`QuestList.tsx`**: The main dashboard for users. It displays a filterable list of all available quests. It dynamically shows notification badges for categories with new quests.
- **`QuestCard.tsx`**: A summary card for a single quest. It shows the title, platform, reward, and status (New, Completed, Pending).
- **`QuestDetail.tsx`**: A detailed view that opens when a user starts a quest. It contains specific instructions and the appropriate verification UI (e.g., code input, screenshot link submission, API verification button).
- **`ClaimRewardModal.tsx`**: An animated modal that provides a final confirmation step before a user spends points on a reward, complete with loading and success states.
- **`Profile.tsx`**: Allows users to manage their social media usernames and view a complete history of their in-app activities.
