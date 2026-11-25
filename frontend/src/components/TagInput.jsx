import { useId, useState } from 'react';
import Tag from './Tag.jsx';

// Lets the user build a list of tags.
// - options: if given, the user picks from this list (schools, skills)
// - allowCustom: if true, the user can type any value and press Enter (majors, interests)
export default function TagInput({ label, values, onChange, options, allowCustom = false, placeholder, error, variant }) {
  const [draft, setDraft] = useState('');
  const id = useId();
  const listId = `${id}-options`;

  const remaining = options ? options.filter((o) => !values.includes(o)) : [];

  function add(value) {
    const clean = value.trim();
    if (!clean || values.includes(clean)) return;
    if (options && !allowCustom && !options.includes(clean)) return;
    onChange([...values, clean]);
    setDraft('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault(); // don't submit the whole form
      add(draft);
    }
  }

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="tag-list">
        {values.map((v) => (
          <Tag key={v} variant={variant} onRemove={() => onChange(values.filter((x) => x !== v))}>
            {v}
          </Tag>
        ))}
      </div>
      <div className="tag-add">
        <input
          id={id}
          list={options ? listId : undefined}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => {
            setDraft(e.target.value);
            // Picking from the dropdown adds the tag right away.
            if (options?.includes(e.target.value)) add(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          aria-invalid={Boolean(error)}
        />
        {options && (
          <datalist id={listId}>
            {remaining.map((o) => <option key={o} value={o} />)}
          </datalist>
        )}
        <button type="button" className="btn btn-secondary" onClick={() => add(draft)}>Add</button>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}