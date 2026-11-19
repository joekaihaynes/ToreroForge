// A small pill. Pass onRemove to show an × button (used in edit forms).
export default function Tag({ children, variant = 'skill', onRemove }) {
  return (
    <span className={`tag tag-${variant}`}>
      {children}
      {onRemove && (
        <button type="button" className="tag-remove" onClick={onRemove} aria-label={`Remove ${children}`}>
          ×
        </button>
      )}
    </span>
  );
}