// Shared visual vocabulary for the workload views

export const PRIORITIES = ['urgent', 'high', 'medium', 'low'];

export const priorityColor = {
  urgent: 'var(--color-priority-urgent)',
  high: 'var(--color-priority-high)',
  medium: 'var(--color-priority-medium)',
  low: 'var(--color-priority-low)',
};

export const levelStyle = {
  overloaded: {
    label: 'Overloaded',
    color: 'var(--color-error)',
    bg: 'var(--color-error-light)',
  },
  'at-risk': {
    label: 'At risk',
    color: 'var(--color-warning)',
    bg: 'var(--color-warning-light)',
  },
  normal: {
    label: 'On track',
    color: 'var(--color-text-muted)',
    bg: 'var(--color-surface)',
  },
};

export function levelTooltip(member, thresholds) {
  const n = member.high_urgent;
  if (member.load_level === 'overloaded') {
    return `${n} open high/urgent tasks (overloaded at ${thresholds.overloaded}+)`;
  }
  if (member.load_level === 'at-risk') {
    return `${n} open high/urgent tasks (at risk at ${thresholds.at_risk}–${thresholds.overloaded - 1})`;
  }
  return `${n} open high/urgent tasks (under ${thresholds.at_risk})`;
}

export function initials(name) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

// Matches MemberCard's avatar so the workload cards read as the same people
export const avatarStyle = (color, size = 48) => ({
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: 'var(--border-radius-full)',
  background: color || 'var(--color-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--color-surface)',
  fontWeight: 'var(--font-weight-semibold)',
  fontSize: size > 40 ? 'var(--font-size-lg)' : 'var(--font-size-sm)',
  flexShrink: 0,
});
