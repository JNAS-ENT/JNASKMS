import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  onClick?: () => void;
}

export function MetricCard({ title, value, description, icon: Icon, trend, onClick }: MetricCardProps) {
  return (
    <div
      id={`metric-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
      onClick={onClick}
      className={`p-6 bg-card text-card-foreground border border-border rounded-xl transition-all ${
        onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-muted-foreground tracking-wider uppercase font-display">{title}</span>
        <div className="p-2 rounded-lg bg-secondary text-foreground">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <div className="text-3xl font-bold font-display tracking-tight">{value}</div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            trend.positive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
          }`}>
            {trend.value}
          </span>
        )}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
