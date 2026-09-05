import { ACHIEVEMENTS, type AchievementContext } from "@/data/achievements";

export function BadgeCase({ ctx }: { ctx: AchievementContext }) {
  return (
    <div className="mt-10">
      <div className="text-xs font-semibold uppercase tracking-wide text-text-dim">
        Achievements
      </div>
      <h2 className="mt-1 text-lg font-semibold text-text">Badge case</h2>

      <div className="mt-4 grid grid-cols-2 gap-4">
        {ACHIEVEMENTS.map((achievement) => {
          const unlocked = achievement.isUnlocked(ctx);
          return (
            <div
              key={achievement.id}
              className={`rounded-2xl border p-6 text-center transition-colors ${
                unlocked
                  ? "border-accent/40 bg-surface"
                  : "border-border/50 bg-surface/40"
              }`}
            >
              <div className={`text-3xl ${unlocked ? "" : "opacity-25 grayscale"}`}>
                {achievement.icon}
              </div>
              <div
                className={`mt-3 font-semibold ${unlocked ? "text-text" : "text-text-dim"}`}
              >
                {achievement.title}
              </div>
              <p className="mt-1 text-sm text-text-dim">{achievement.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
