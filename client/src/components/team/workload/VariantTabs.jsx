export const VARIANTS = [
  { id: 'expandable', label: 'Expandable Rows', hint: 'Open several people in place to compare' },
  { id: 'slideout', label: 'Slide-Out Panel', hint: 'Detail beside the overview' },
  { id: 'modal', label: 'Modal Deep-Dive', hint: 'Full breakdown for one person' },
];

const barStyle = {
  display: 'flex',
  gap: 'var(--space-6)',
  borderBottom: '1px solid var(--color-border)',
  marginBottom: 'var(--space-6)',
};

const tabStyle = (active) => ({
  background: 'none',
  border: 'none',
  borderBottom: `2px solid ${active ? 'var(--color-primary)' : 'transparent'}`,
  marginBottom: '-1px',
  padding: 'var(--space-3) 0',
  cursor: 'pointer',
  fontSize: 'var(--font-size-sm)',
  fontWeight: active ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
  color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
  transition: 'color var(--transition-fast), border-color var(--transition-fast)',
});

export default function VariantTabs({ value, onChange }) {
  return (
    <div role="tablist" style={barStyle}>
      {VARIANTS.map((v) => (
        <button
          key={v.id}
          role="tab"
          aria-selected={value === v.id}
          title={v.hint}
          style={tabStyle(value === v.id)}
          onClick={() => onChange(v.id)}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}
