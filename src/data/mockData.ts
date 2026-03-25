export interface Quest {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  rewardPoints: number;
  difficulty: number; // 1-5
  estimatedTime: string;
  category: string;
  status: "open" | "bidding" | "in-progress" | "review" | "completed";
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

import { UserProfile } from "@/features/users/types";

export const mockUser: UserProfile = {
  id: "f81d4fae-7dec-11d0-a765-00a0c91e6bf6", // Valid UUID format required by Go Backend
  username: "ShadowBlade_42",
  title: "Veteran Adventurer",
  level: 12,
  points: 8500,
  questsCompleted: 34,
  rating: 4.7,
  totalRatings: 32,
  githubUrl: "https://github.com/shadowblade42",
  joinedDate: "2025-03-15",
  role: "adventurer",
  skills: ["React", "TypeScript", "Node.js", "Python", "Rust"],
};
export const mockJunior: UserProfile = {
  id: "e52b3c9c-8f1a-4d2e-b123-11c0f82d7ae1",
  username: "ElderScribe_V",
  title: "Junior",
  level: 45,
  points: 42500,
  questsCompleted: 128,
  rating: 4.9,
  totalRatings: 215,
  githubUrl: "https://github.com/elderscribe",
  joinedDate: "2023-01-10",
  role: "junior",
  skills: ["React", "TypeScript", "Node.js", "Python", "Rust"],
};
export const mockSenior: UserProfile = {
  id: "e52b3c9c-8f1a-4d2e-b123-11c0f82d7ae1",
  username: "ElderScribe_V",
  title: "Senior Quest Master",
  level: 45,
  points: 42500,
  questsCompleted: 128,
  rating: 4.9,
  totalRatings: 215,
  githubUrl: "https://github.com/elderscribe",
  joinedDate: "2023-01-10",
  role: "senior",
  skills: ["System Architecture", "Go", "AWS", "Kubernetes", "PostgreSQL"],
};
export const mockAdmin: UserProfile = {
  id: "a11b22c3-44d5-55e6-f778-99a0b11c22d3",
  username: "Guild_Overlord",
  title: "Grandmaster Admin",
  level: 99,
  points: 999999,
  questsCompleted: 999,
  rating: 5.0,
  totalRatings: 1000,
  githubUrl: "https://github.com/inet-guild-admin",
  joinedDate: "2022-05-01",
  role: "admin",
  skills: ["System Administration", "Security", "Moderation", "Infrastructure"],
};

export const mockQuests: Quest[] = [
  {
    id: "q2",
    title: "Forge the Dashboard of Legends",
    description:
      "Build a real-time analytics dashboard with charts, filters, and data export.",
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
    description:
      "Add full-text search with fuzzy matching and auto-suggestions to the quest archive.",
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
        id: "b4",
        oderId: "q3",
        userId: "user-5",
        username: "MysticCoder_9",
        githubUrl: "https://github.com/mysticcoder9",
        questsCompleted: 25,
        rating: 4.6,
        requestedPoints: 2000,
        estimatedTime: "4 Cycles",
        explanation:
          "I've set up Meilisearch for 3 production apps. Quick and reliable.",
        avatarSeed: 99,
      },
    ],
  },
  {
    id: "q4",
    title: "Map the Mobile Realm",
    description:
      "Convert the existing web app to a responsive mobile-first design with PWA support.",
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
    description:
      "Integrate Stripe payments with subscription tiers and one-time purchases.",
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
    description:
      "Set up GitHub Actions pipeline with automated testing, linting, and deployment.",
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
  {
    id: "r1",
    name: "Cloak of Dark Mode",
    description: "Unlock the legendary dark theme for your profile.",
    cost: 50,
    category: "perk",
    icon: "🧥",
    stock: 99,
  },
  {
    id: "r2",
    name: "GitHub Pro Scroll",
    description: "One month of GitHub Pro subscription.",
    cost: 30,
    category: "voucher",
    icon: "📜",
    stock: 10,
  },
  {
    id: "r3",
    name: "XP Boost Elixir",
    description: "Double quest points for your next 3 completed quests.",
    cost: 15,
    category: "perk",
    icon: "🧪",
    stock: 25,
  },
  {
    id: "r4",
    name: "AWS Credits Chest",
    description: "$50 in AWS credits to host your creations.",
    cost: 50,
    category: "voucher",
    icon: "💎",
    stock: 5,
  },
  {
    id: "r5",
    name: "Custom Badge Rune",
    description: "Create a custom pixel badge for your profile.",
    cost: 80,
    category: "digital",
    icon: "🏅",
    stock: 50,
  },
  {
    id: "r6",
    name: "Priority Queue Pass",
    description: "Your bids appear first for 7 days.",
    cost: 200,
    category: "perk",
    icon: "⚡",
    stock: 15,
  },
  {
    id: "r7",
    name: "Merchant's Voucher",
    description: "$25 gift card for a store of your choice.",
    cost: 400,
    category: "voucher",
    icon: "🎫",
    stock: 8,
  },
  {
    id: "r8",
    name: "Pixel Avatar Pack",
    description: "Unlock 20 exclusive pixel art avatars.",
    cost: 100,
    category: "digital",
    icon: "👾",
    stock: 30,
  },
];
