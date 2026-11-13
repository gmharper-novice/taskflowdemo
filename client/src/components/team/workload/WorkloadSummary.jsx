const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 'var(--space-4)',
  marginBottom: 'var(--space-4)',
};

const statCardStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--border-radius-lg)',
  padding: 'var(--space-6)',
  boxShadow: 'var(--shadow-sm)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-3)',
};

const labelStyle = {
  fontSize: 'var(--font-size-sm)',
  color: 'var(--color-text-secondary)',
  fontWeight: 'var(--font-weight-medium)',
};

const valueStyle = {
  fontSize: 'var(--font-size-3xl)',
  fontWeight: 'var(--font-weight-bold)',
  lineHeight: 1,
  fontVariantNumeric: 'tabular-nums',
};

const captionStyle = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-muted)',
};

export default function WorkloadSummary({ summary, memberCount }) {
  // First card counts tasks, the other two count people: say so on each card
  const stats = [
    { label: 'Open tasks', value: summary.total_open, caption: `across ${memberCount} people`, color: 'var(--color-text)', accent: 'var(--color-border)' },
    { label: 'People overloaded', value: summary.overloaded, caption: `of ${memberCount} team members`, color: 'var(--color-error)', accent: 'var(--color-error)', bg: 'var(--color-error-light)' },
    { label: 'People at risk', value: summary.at_risk, caption: `of ${memberCount} team members`, color: 'var(--color-warning)', accent: 'var(--color-warning)', bg: 'var(--color-warning-light)' },
  ];

  return (
    <div style={gridStyle}>
      {stats.map((s) => {
        const lit = s.bg && s.value > 0;
        return (
          <div
            key={s.label}
            style={{
              ...statCardStyle,
              ...(lit ? { background: s.bg, borderColor: s.accent } : {}),
            }}
          >
            <span style={labelStyle}>{s.label}</span>
            <span style={{ ...valueStyle, color: s.value > 0 ? s.color : 'var(--color-text-muted)' }}>{s.value}</span>
            <span style={captionStyle}>{s.caption}</span>
          </div>
        );
      })}
    </div>
  );
}
