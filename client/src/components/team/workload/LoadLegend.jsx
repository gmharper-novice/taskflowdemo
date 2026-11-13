import { PRIORITIES, priorityColor } from './load';

const legendStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 'var(--space-2) var(--space-6)',
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
  marginBottom: 'var(--space-6)',
};

const swatchStyle = (color) => ({
  display: 'inline-block',
  width: '10px',
  height: '10px',
  borderRadius: 'var(--border-radius-full)',
  background: color,
  marginRight: 'var(--space-2)',
  verticalAlign: 'middle',
});

export default function LoadLegend({ thresholds }) {
  return (
    <div style={legendStyle}>
      <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text)' }}>
        Load = open high + urgent tasks (to do + in progress)
      </span>
      <span><span style={swatchStyle('var(--color-error)')} />Overloaded: {thresholds.overloaded}+</span>
      <span><span style={swatchStyle('var(--color-warning)')} />At risk: {thresholds.at_risk}–{thresholds.overloaded - 1}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)', marginLeft: 'auto' }}>
        Bar:
        {PRIORITIES.map((p) => (
          <span key={p} style={{ textTransform: 'capitalize' }}>
            <span style={{ ...swatchStyle(priorityColor[p]), width: '8px', height: '8px', marginRight: 'var(--space-1)' }} />
            {p}
          </span>
        ))}
      </span>
    </div>
  );
}
