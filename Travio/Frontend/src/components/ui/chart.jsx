import { Tooltip } from 'recharts';

export function ChartContainer({ children, className = '' }) {
  return (
    <div className={`w-full [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-gray-200 ${className}`}>
      {children}
    </div>
  );
}

export function ChartTooltip(props) {
  return <Tooltip {...props} />;
}

export function ChartTooltipContent({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0];
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-900">
        {item.value} pengunjung
      </p>
    </div>
  );
}
