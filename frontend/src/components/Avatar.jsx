// Shows the profile photo, or the person's initials if there is no photo.
export default function Avatar({ name, photo, size = 'md' }) {
  const initials = name
    .replace(/^Dr\.?\s+/i, '')
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return photo ? (
    <img className={`avatar avatar-${size}`} src={photo} alt={name} />
  ) : (
    <div className={`avatar avatar-${size}`} aria-hidden="true">{initials}</div>
  );
}