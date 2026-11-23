import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext.jsx';
import { useProfile } from '../useProfile.js';
import { updateMyProfile } from '../profileService.js';
import { validateProfile, BIO_MAX } from '../profileContract.js';
import { profilePaths } from '../routes.jsx';
import TagInput from '../../../components/TagInput.jsx';
import Avatar from '../../../components/Avatar.jsx';
import { SCHOOLS, SKILLS } from '../../../shared/taxonomy.js';

export default function EditProfilePage() {
  const { profile, loading, error } = useProfile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);     // the values being edited
  const [errors, setErrors] = useState({});   // field-level messages
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // When the profile loads, copy it into the form.
  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  if (loading || !form) return error ? <p className="error">{error}</p> : <p className="muted">Loading…</p>;

  // Helper: update one field and clear its error.
  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };
  const setVisibility = (key, value) => set('visibility', { ...form.visibility, [key]: value });

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validateProfile(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    setSaveError('');
    try {
      await updateMyProfile(user.id, form);
      navigate(profilePaths.mine);
    } catch (err) {
      setErrors(err.fields ?? {});
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <h1>Edit profile</h1>
      <p className="muted">Your name, schools, majors and skills are visible to everyone on ToreroForge.</p>

      <div className="photo-row">
        <Avatar name={form.name || '?'} photo={form.profilePhoto} size="lg" />
        <div className="field grow">
          <label htmlFor="photo">Photo URL (optional)</label>
          <input
            id="photo"
            type="url"
            value={form.profilePhoto ?? ''}
            placeholder="https://…"
            onChange={(e) => set('profilePhoto', e.target.value || null)}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" value={form.name} onChange={(e) => set('name', e.target.value)} aria-invalid={Boolean(errors.name)} />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>

      <div className="field">
        <label>Role</label>
        <p className="readonly"><span className="role">{form.role}</span> <span className="hint">Set when you registered.</span></p>
      </div>

      <TagInput label="Schools" variant="school" values={form.schools} onChange={(v) => set('schools', v)}
        options={SCHOOLS} placeholder="Choose a school" error={errors.schools} />

      <TagInput label="Majors or departments" variant="school" values={form.majors} onChange={(v) => set('majors', v)}
        allowCustom placeholder="Type a major and press Enter" error={errors.majors} />

      <TagInput label="Skills" values={form.skills} onChange={(v) => set('skills', v)}
        options={SKILLS} placeholder="Choose a skill" error={errors.skills} />

      <TagInput label="Interests (optional)" variant="interest" values={form.interests} onChange={(v) => set('interests', v)}
        allowCustom placeholder="Type an interest and press Enter" />
      <VisibilityToggle label="Who can see your interests?" value={form.visibility.interests}
        onChange={(v) => setVisibility('interests', v)} />

      <div className="field">
        <label htmlFor="bio">Bio (optional)</label>
        <textarea id="bio" rows={4} value={form.bio} maxLength={BIO_MAX}
          placeholder="What are you working on, and what kind of projects interest you?"
          onChange={(e) => set('bio', e.target.value)} aria-invalid={Boolean(errors.bio)} />
        <p className="hint right">{form.bio.length} / {BIO_MAX}</p>
        {errors.bio && <p className="error">{errors.bio}</p>}
      </div>
      <VisibilityToggle label="Who can see your bio?" value={form.visibility.bio}
        onChange={(v) => setVisibility('bio', v)} />

      {saveError && <p className="error">{saveError}</p>}
      <div className="actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate(profilePaths.mine)}>Cancel</button>
      </div>
    </form>
  );
}

function VisibilityToggle({ label, value, onChange }) {
  return (
    <fieldset className="visibility">
      <legend>{label}</legend>
      <label><input type="radio" checked={value === 'public'} onChange={() => onChange('public')} /> Everyone</label>
      <label><input type="radio" checked={value === 'private'} onChange={() => onChange('private')} /> Only me</label>
    </fieldset>
  );
}