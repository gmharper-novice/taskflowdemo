import { LoadFlag, PriorityGauge } from './WorkloadCard';
import { PRIORITIES, priorityColor, levelStyle, initials, avatarStyle } from './load';

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-4)',
};

const statsRowStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 'var(--space-3)',
};

const statStyle = {
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--border-radius-md)',
  padding: 'var(--space-3) var(--space-4)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-1)',
};

const statLabelStyle = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  fontWeight: 'var(--font-weight-medium)',
};

const statValueStyle = {
  fontSize: 'var(--font-size-2xl)',
  fontWeight: 'var(--font-weight-bold)',
  lineHeight: 1.1,
  fontVariantNumeric: 'tabular-nums',
};

export function MemberHeader({ member, thresholds, size = 56 }) {
  return (
    <div style={headerStyle}>
      <div style={avatarStyle(member.avatar_color, size)}>{initials(member.name)}</div>
      <div>
        <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-semibold)' }}>{member.name}</div>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>{member.role}</div>
        <LoadFlag member={member} thresholds={thresholds} />
      </div>
    </div>
  );
}

export function MemberStats({ member }) {
  const level = levelStyle[member.load_level];
  const flagged = member.load_level !== 'normal';
  const stats = [
    { label: 'High + urgent', value: member.high_urgent, color: flagged ? level.color : 'var(--color-text)', bg: flagged ? level.bg : undefined },
    { label: 'Open tasks', value: member.open_count },
    { label: 'Est. hours', value: `${member.open_hours}h` },
  ];
  return (
    <div style={statsRowStyle}>
      {stats.map((s) => (
        <div key={s.label} style={{ ...statStyle, ...(s.bg ? { background: s.bg, borderColor: s.color } : {}) }}>
          <span style={statLabelStyle}>{s.label}</span>
          <span style={{ ...statValueStyle, color: s.color || 'var(--color-text)' }}>{s.value}</span>
        </div>
      ))}
    </div>
  );
}

// Priority mix scaled to this person's own load, with counts under each segment
export function PriorityMix({ member }) {
  if (member.open_count === 0) return null;
  return (
    <div>
      <PriorityGauge member={member} scaleMax={member.open_count} height="12px" />
      <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
        {PRIORITIES.map((p) => (
          <span key={p} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', textTransform: 'capitalize', opacity: member[p] ? 1 : 0.45 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: 'var(--border-radius-full)', background: priorityColor[p] }} />
            {member[p]} {p}
          </span>
        ))}
      </div>
    </div>
  );
}

export const sectionLabelStyle = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  fontWeight: 'var(--font-weight-semibold)',
  marginBottom: 'var(--space-1)',
};
