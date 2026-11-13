import { useState } from 'react';
import { PRIORITIES, priorityColor, levelStyle, levelTooltip, initials, avatarStyle } from './load';

const cardStyle = {
  position: 'relative',
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--border-radius-lg)',
  padding: 'var(--space-5)',
  paddingLeft: 'var(--space-6)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-4)',
  cursor: 'pointer',
  overflow: 'hidden',
  textAlign: 'left',
  transition: 'box-shadow var(--transition-fast), border-color var(--transition-fast), transform var(--transition-fast)',
  animation: 'wl-rise 320ms ease both',
};

const railStyle = (color) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: '4px',
  background: color,
});

const topRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-4)',
};

const metricStyle = {
  marginLeft: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: 'var(--space-1)',
};

const bigNumberStyle = (color) => ({
  fontSize: 'var(--font-size-3xl)',
  fontWeight: 'var(--font-weight-bold)',
  lineHeight: 1,
  color,
  fontVariantNumeric: 'tabular-nums',
});

const microLabelStyle = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  fontWeight: 'var(--font-weight-medium)',
};

const flagStyle = (level) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--space-2)',
  padding: '2px 10px',
  borderRadius: 'var(--border-radius-full)',
  fontSize: 'var(--font-size-xs)',
  fontWeight: 'var(--font-weight-semibold)',
  color: levelStyle[level].color,
  background: level === 'normal' ? 'var(--color-border-light)' : 'var(--color-surface)',
  border: `1px solid ${levelStyle[level].color}`,
  whiteSpace: 'nowrap',
});

const dotStyle = (color, beacon) => ({
  width: '8px',
  height: '8px',
  borderRadius: 'var(--border-radius-full)',
  background: color,
  animation: beacon ? 'wl-beacon 1.8s ease-out infinite' : undefined,
});

const gaugeTrackStyle = {
  display: 'flex',
  height: '8px',
  borderRadius: 'var(--border-radius-full)',
  background: 'var(--color-border-light)',
  overflow: 'hidden',
};

const breakdownStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 'var(--space-2) var(--space-4)',
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
};

export function LoadFlag({ member, thresholds }) {
  const { load_level: level } = member;
  return (
    <span style={flagStyle(level)} title={levelTooltip(member, thresholds)}>
      {level !== 'normal' && <span data-wl-motion style={dotStyle(levelStyle[level].color, level === 'overloaded')} />}
      {levelStyle[level].label}
    </span>
  );
}

// Stacked priority bar. Width is relative to the busiest member so lengths compare across cards.
export function PriorityGauge({ member, scaleMax, height }) {
  const scale = Math.max(scaleMax, 1);
  return (
    <div style={{ ...gaugeTrackStyle, ...(height ? { height } : {}) }} aria-hidden="true">
      {PRIORITIES.map((p) => member[p] > 0 && (
        <span
          key={p}
          style={{ width: `${(member[p] / scale) * 100}%`, background: priorityColor[p], transition: 'width var(--transition-base)' }}
        />
      ))}
    </div>
  );
}

export function PriorityBreakdown({ member }) {
  if (member.open_count === 0) {
    return (
      <div style={{ ...breakdownStyle, color: 'var(--color-success)', fontWeight: 'var(--font-weight-medium)' }}>
        <span style={dotStyle('var(--color-success)')} />
        Has capacity: no open tasks
      </div>
    );
  }
  return (
    <div style={breakdownStyle}>
      {PRIORITIES.map((p) => member[p] > 0 && (
        <span key={p} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)' }}>
          <span style={{ ...dotStyle(priorityColor[p]), width: '6px', height: '6px' }} />
          <strong style={{ color: 'var(--color-text)', fontWeight: 'var(--font-weight-semibold)' }}>{member[p]}</strong>
          {p}
        </span>
      ))}
      <span style={{ marginLeft: 'auto', color: 'var(--color-text-muted)' }}>
        {member.open_count} open · {member.open_hours}h est.
      </span>
    </div>
  );
}

export default function WorkloadCard({ member, thresholds, scaleMax, index = 0, selected, expanded, onClick, children }) {
  const [hovered, setHovered] = useState(false);
  const level = levelStyle[member.load_level];
  const flagged = member.load_level !== 'normal';
  const active = selected || expanded;

  return (
    <div
      data-wl-motion
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      aria-pressed={selected}
      onClick={onClick}
      onKeyDown={(e) => {
        // Ignore keys from buttons nested in the card (Retry, Show all)
        if (e.target !== e.currentTarget) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...cardStyle,
        animationDelay: `${index * 45}ms`,
        background: flagged
          ? `linear-gradient(100deg, ${level.bg} 0%, var(--color-surface) 65%)`
          : 'var(--color-surface)',
        borderColor: active ? 'var(--color-primary)' : flagged ? level.color : 'var(--color-border)',
        boxShadow: active
          ? '0 0 0 3px var(--color-primary-light), var(--shadow-md)'
          : hovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        transform: hovered && !active ? 'translateY(-1px)' : 'none',
      }}
    >
      {(flagged || active) && <span style={railStyle(active ? 'var(--color-primary)' : level.color)} />}

      <div style={topRowStyle}>
        <div style={avatarStyle(member.avatar_color)}>{initials(member.name)}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-1)' }}>{member.name}</div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>{member.role}</div>
          <LoadFlag member={member} thresholds={thresholds} />
        </div>
        <div style={metricStyle} title={levelTooltip(member, thresholds)}>
          <span style={bigNumberStyle(flagged ? level.color : 'var(--color-text)')}>{member.high_urgent}</span>
          <span style={microLabelStyle}>high + urgent</span>
        </div>
      </div>

      <PriorityGauge member={member} scaleMax={scaleMax} />
      <PriorityBreakdown member={member} />

      {children}
    </div>
  );
}
