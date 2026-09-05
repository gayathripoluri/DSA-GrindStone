"use client";

import { SessionFlow } from "@/components/session/SessionFlow";
import { twoSum } from "@/data/problems/two-sum";

export default function TodayPage() {
  return <SessionFlow problem={twoSum} />;
}
