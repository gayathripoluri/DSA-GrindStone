import { openDB, DBSchema, IDBPDatabase } from "idb";
import type {
  SessionState,
  ReviewItem,
  InsightCard,
  JourneyState,
} from "./types";

interface GrindstoneDB extends DBSchema {
  sessions: {
    key: string;
    value: SessionState;
  };
  reviews: {
    key: string; // problemId
    value: ReviewItem;
    indexes: { "by-dueDate": string };
  };
  insights: {
    key: string;
    value: InsightCard;
  };
  journey: {
    key: string; // fixed key "state"
    value: JourneyState;
  };
}

const DB_NAME = "grindstone";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<GrindstoneDB>> | null = null;

function getDB() {
  if (typeof window === "undefined") {
    throw new Error("getDB() called on the server");
  }
  if (!dbPromise) {
    dbPromise = openDB<GrindstoneDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("sessions")) {
          db.createObjectStore("sessions", { keyPath: "sessionId" });
        }
        if (!db.objectStoreNames.contains("reviews")) {
          const store = db.createObjectStore("reviews", { keyPath: "problemId" });
          store.createIndex("by-dueDate", "dueDate");
        }
        if (!db.objectStoreNames.contains("insights")) {
          db.createObjectStore("insights", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("journey")) {
          db.createObjectStore("journey");
        }
      },
    });
  }
  return dbPromise;
}

export const DEFAULT_JOURNEY: JourneyState = {
  streak: 0,
  bestStreak: 0,
  lastActiveDate: null,
  totalSolved: 0,
  patternMastery: {},
  solvedProblemIds: [],
};

export async function saveSession(session: SessionState) {
  const db = await getDB();
  await db.put("sessions", session);
}

export async function getSession(sessionId: string) {
  const db = await getDB();
  return db.get("sessions", sessionId);
}

export async function getLatestIncompleteSession() {
  const db = await getDB();
  const all = await db.getAll("sessions");
  return all
    .filter((s) => s.stage !== "complete")
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))[0];
}

export async function getJourney(): Promise<JourneyState> {
  const db = await getDB();
  const state = await db.get("journey", "state");
  // Spread over defaults so a journey record saved before a new field was
  // added (e.g. bestStreak) doesn't come back with that field `undefined`.
  return state ? { ...DEFAULT_JOURNEY, ...state } : DEFAULT_JOURNEY;
}

export async function saveJourney(state: JourneyState) {
  const db = await getDB();
  await db.put("journey", state, "state");
}

export async function addInsight(card: InsightCard) {
  const db = await getDB();
  await db.put("insights", card);
}

export async function getAllInsights() {
  const db = await getDB();
  const all = await db.getAll("insights");
  return all.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function upsertReview(item: ReviewItem) {
  const db = await getDB();
  await db.put("reviews", item);
}

export async function getDueReviews(today = new Date()): Promise<ReviewItem[]> {
  const db = await getDB();
  const all = await db.getAll("reviews");
  const todayStr = today.toISOString().slice(0, 10);
  return all
    .filter((r) => r.dueDate <= todayStr)
    .sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1));
}

export async function getAllReviews() {
  const db = await getDB();
  return db.getAll("reviews");
}

export async function exportJourney() {
  const db = await getDB();
  const [sessions, reviews, insights, journey] = await Promise.all([
    db.getAll("sessions"),
    db.getAll("reviews"),
    db.getAll("insights"),
    db.get("journey", "state"),
  ]);
  return {
    exportedAt: new Date().toISOString(),
    version: DB_VERSION,
    sessions,
    reviews,
    insights,
    journey: journey ?? DEFAULT_JOURNEY,
  };
}

export async function resetAllData() {
  const db = await getDB();
  const tx = db.transaction(["sessions", "reviews", "insights", "journey"], "readwrite");
  await Promise.all([
    tx.objectStore("sessions").clear(),
    tx.objectStore("reviews").clear(),
    tx.objectStore("insights").clear(),
    tx.objectStore("journey").clear(),
    tx.done,
  ]);
}

export async function importJourney(data: {
  sessions: SessionState[];
  reviews: ReviewItem[];
  insights: InsightCard[];
  journey: JourneyState;
}) {
  const db = await getDB();
  const tx = db.transaction(
    ["sessions", "reviews", "insights", "journey"],
    "readwrite"
  );
  await Promise.all([
    ...data.sessions.map((s) => tx.objectStore("sessions").put(s)),
    ...data.reviews.map((r) => tx.objectStore("reviews").put(r)),
    ...data.insights.map((i) => tx.objectStore("insights").put(i)),
    tx.objectStore("journey").put(data.journey, "state"),
    tx.done,
  ]);
}
