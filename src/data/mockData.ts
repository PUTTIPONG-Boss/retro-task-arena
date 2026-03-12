export interface Quest {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  rewardPoints: number;
  difficulty: number; // 1-5
  estimatedTime: string;
  category: string;
  status: "open" | "in-progress" | "completed";
  providerId: string;
  providerName: string;
  repoUrl?: string;
  branchName?: string;
  contact?: {
    discord?: string;
    line?: string;
    email?: string;
  };
  bids: Bid[];
  assignedTo?: string;
}

export interface Bid {
  id: string;
  oderId: string;
  userId: string;
  username: string;
  githubUrl: string;
  questsCompleted: number;
  rating: number;
  requestedPoints: number;
  estimatedTime: string;
  explanation: string;
  avatarSeed: number;
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: "digital" | "voucher" | "perk";
  icon: string;
  stock: number;
}

export interface UserProfile {
  id: string;
  username: string;
  title: string;
  level: number;
  points: number;
  questsCompleted: number;
  rating: number;
  githubUrl: string;
  joinedDate: string;
  skills: string[];
}

export const mockUser: UserProfile = {
  id: "user-1",
  username: "ShadowBlade_42",
  title: "Veteran Adventurer",
  level: 12,
  points: 8500,
  questsCompleted: 34,
  rating: 4.7,
  githubUrl: "https://github.com/shadowblade42",
  joinedDate: "2025-03-15",
  skills: ["React", "TypeScript", "Node.js", "Python", "Rust"],
};

export const mockQuests: Quest[] = [
  {
    id: "q1",
    title: "Slay the Authentication Dragon",
    description: "Implement JWT authentication with refresh tokens for the kingdom's API gateway.",
    fullDescription: `The kingdom's API gateway lacks proper authentication. Your quest is to implement a complete JWT-based auth system.\n\n**Requirements:**\n- Login/Register endpoints\n- Access + Refresh token flow\n- Middleware for protected routes\n- Rate limiting on auth endpoints\n\nThe codebase is in TypeScript/Express. Tests must pass before the quest is considered complete.`,
    rewardPoints: 2500,
    difficulty: 4,
    estimatedTime: "~8 Cycles",
    category: "Backend",
    status: "open",
    providerId: "provider-1",
    providerName: "GuildMaster_Rex",
    repoUrl: "https://github.com/kingdom-api/auth-module",
    branchName: "quest/auth-dragon",
    contact: { discord: "GuildMaster#1234", email: "rex@kingdom.dev" },
    bids: [
      {
        id: "b1", oderId: "q1", userId: "user-2", username: "PixelKnight_77",
        githubUrl: "https://github.com/pixelknight77", questsCompleted: 18,
        rating: 4.5, requestedPoints: 2800, estimatedTime: "6 Cycles",
        explanation: "I've implemented JWT auth in 5+ projects. I'll add OAuth2 support as a bonus.",
        avatarSeed: 77,
      },
      {
        id: "b2", oderId: "q1", userId: "user-3", username: "RuneCaster_Dev",
        githubUrl: "https://github.com/runecaster", questsCompleted: 42,
        rating: 4.9, requestedPoints: 2500, estimatedTime: "5 Cycles",
        explanation: "Auth specialist. Will deliver with full test coverage and documentation.",
        avatarSeed: 33,
      },
      {
        id: "b3", oderId: "q1", userId: "user-4", username: "CodeGolem_X",
        githubUrl: "https://github.com/codegolem", questsCompleted: 7,
        rating: 3.8, requestedPoints: 2000, estimatedTime: "10 Cycles",
        explanation: "New to auth but eager to learn. Will follow best practices guides closely.",
        avatarSeed: 55,
      },
    ],
  },
  {
    id: "q2",
    title: "Forge the Dashboard of Legends",
    description: "Build a real-time analytics dashboard with charts, filters, and data export.",
    fullDescription: `The guild needs a powerful analytics dashboard to track quest completion rates and adventurer performance.\n\n**Requirements:**\n- Real-time data with WebSocket updates\n- Interactive charts (line, bar, pie)\n- Date range filters\n- CSV/PDF export\n- Responsive layout`,
    rewardPoints: 3000,
    difficulty: 5,
    estimatedTime: "~12 Cycles",
    category: "Frontend",
    status: "open",
    providerId: "provider-2",
    providerName: "ArchMage_Luna",
    contact: { discord: "Luna#5678", line: "archmage_luna" },
    bids: [],
  },
  {
    id: "q3",
    title: "Enchant the Search Scroll",
    description: "Add full-text search with fuzzy matching and auto-suggestions to the quest archive.",
    fullDescription: `The quest archive has grown too large for simple filtering. Implement full-text search.\n\n**Requirements:**\n- Elasticsearch or Meilisearch integration\n- Fuzzy matching for typos\n- Auto-complete suggestions\n- Highlight matched terms\n- Pagination of results`,
    rewardPoints: 1800,
    difficulty: 3,
    estimatedTime: "~5 Cycles",
    category: "Backend",
    status: "open",
    providerId: "provider-1",
    providerName: "GuildMaster_Rex",
    repoUrl: "https://github.com/kingdom-api/search-scroll",
    branchName: "quest/search-enchant",
    contact: { email: "rex@kingdom.dev" },
    bids: [
      {
        id: "b4", oderId: "q3", userId: "user-5", username: "MysticCoder_9",
        githubUrl: "https://github.com/mysticcoder9", questsCompleted: 25,
        rating: 4.6, requestedPoints: 2000, estimatedTime: "4 Cycles",
        explanation: "I've set up Meilisearch for 3 production apps. Quick and reliable.",
        avatarSeed: 99,
      },
    ],
  },
  {
    id: "q4",
    title: "Map the Mobile Realm",
    description: "Convert the existing web app to a responsive mobile-first design with PWA support.",
    fullDescription: `Our platform must reach adventurers on their enchanted pocket scrolls (phones).\n\n**Requirements:**\n- Responsive redesign of all pages\n- PWA with offline support\n- Push notifications\n- Touch-optimized interactions\n- App manifest and icons`,
    rewardPoints: 2200,
    difficulty: 3,
    estimatedTime: "~7 Cycles",
    category: "Frontend",
    status: "in-progress",
    providerId: "provider-3",
    providerName: "ElderScribe_V",
    assignedTo: "user-1",
    repoUrl: "https://github.com/realm-mobile/pwa-quest",
    branchName: "quest/mobile-realm",
    contact: { discord: "ElderScribe#9012" },
    bids: [],
  },
  {
    id: "q5",
    title: "Craft the Payment Potion",
    description: "Integrate Stripe payments with subscription tiers and one-time purchases.",
    fullDescription: `The guild store needs payment processing.\n\n**Requirements:**\n- Stripe checkout integration\n- 3 subscription tiers\n- One-time item purchases\n- Webhook handlers\n- Invoice generation`,
    rewardPoints: 3500,
    difficulty: 5,
    estimatedTime: "~10 Cycles",
    category: "Full Stack",
    status: "open",
    providerId: "provider-2",
    providerName: "ArchMage_Luna",
    contact: { discord: "Luna#5678", email: "luna@archmage.dev" },
    bids: [],
  },
  {
    id: "q6",
    title: "Tame the CI/CD Beast",
    description: "Set up GitHub Actions pipeline with automated testing, linting, and deployment.",
    fullDescription: `The deployment process is chaos. Tame it with automation.\n\n**Requirements:**\n- GitHub Actions workflow\n- Lint + test on PR\n- Auto-deploy to staging on merge\n- Manual promote to production\n- Slack notifications`,
    rewardPoints: 1200,
    difficulty: 2,
    estimatedTime: "~3 Cycles",
    category: "DevOps",
    status: "open",
    providerId: "provider-3",
    providerName: "ElderScribe_V",
    repoUrl: "https://github.com/guild-ops/cicd-beast",
    branchName: "quest/cicd-tame",
    contact: { email: "elder@scribe.dev" },
    bids: [],
  },
];

export const mockRewards: RewardItem[] = [
  { id: "r1", name: "Cloak of Dark Mode", description: "Unlock the legendary dark theme for your profile.", cost: 500, category: "perk", icon: "🧥", stock: 99 },
  { id: "r2", name: "GitHub Pro Scroll", description: "One month of GitHub Pro subscription.", cost: 3000, category: "voucher", icon: "📜", stock: 10 },
  { id: "r3", name: "XP Boost Elixir", description: "Double quest points for your next 3 completed quests.", cost: 1500, category: "perk", icon: "🧪", stock: 25 },
  { id: "r4", name: "AWS Credits Chest", description: "$50 in AWS credits to host your creations.", cost: 5000, category: "voucher", icon: "💎", stock: 5 },
  { id: "r5", name: "Custom Badge Rune", description: "Create a custom pixel badge for your profile.", cost: 800, category: "digital", icon: "🏅", stock: 50 },
  { id: "r6", name: "Priority Queue Pass", description: "Your bids appear first for 7 days.", cost: 2000, category: "perk", icon: "⚡", stock: 15 },
  { id: "r7", name: "Merchant's Voucher", description: "$25 gift card for a store of your choice.", cost: 4000, category: "voucher", icon: "🎫", stock: 8 },
  { id: "r8", name: "Pixel Avatar Pack", description: "Unlock 20 exclusive pixel art avatars.", cost: 1000, category: "digital", icon: "👾", stock: 30 },
];
