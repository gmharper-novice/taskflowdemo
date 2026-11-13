import Button from '../../common/Button';

const errorStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-4)',
  padding: 'var(--space-4) var(--space-5)',
  background: 'var(--color-error-light)',
  border: '1px solid var(--color-error)',
  borderRadius: 'var(--border-radius-lg)',
  fontSize: 'var(--font-size-sm)',
};

export default function InlineError({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div role="alert" style={errorStyle}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-error)' }}>{title}</div>
        {message && <div style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>{message}</div>}
      </div>
      {onRetry && (
        <Button
          variant="secondary"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onRetry();
          }}
        >
          Retry
        </Button>
      )}
    </div>
  );
}
