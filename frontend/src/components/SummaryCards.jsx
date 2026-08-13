import { ListChecks, Flame, Trophy, TrendingUp } from "lucide-react";

const Card = ({ icon: Icon, label, value, iconFg }) => (
  <div
    className="card p-4 flex flex-col gap-0.5 relative overflow-hidden border-l-[3px]"
    style={{ borderLeftColor: iconFg }}
  >
    <div className="text-xs font-medium" style={{ color: iconFg }}>
      {label}
    </div>
    <div className="text-2xl font-semibold tracking-tight">{value}</div>
    <div className="absolute bottom-3 right-3 opacity-[0.13]" style={{ color: iconFg }}>
      <Icon size={26} />
    </div>
  </div>
);

export default function SummaryCards({ totalHabits, activeStreaks, bestStreak, weekRate }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card icon={ListChecks} label="Total habits"    value={totalHabits}       iconFg="#6366f1" />
      <Card icon={Flame}       label="Active streaks" value={activeStreaks}      iconFg="#f97316" />
      <Card icon={Trophy}      label="Best streak"    value={bestStreak}         iconFg="#f59e0b" />
      <Card icon={TrendingUp}  label="This week"      value={`${weekRate}%`}    iconFg="#10b981" />
    </div>
  );
}
