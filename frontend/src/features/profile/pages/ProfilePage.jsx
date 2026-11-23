import { Link, useParams } from 'react-router-dom';
import { useProfile } from '../useProfile.js';
import { profilePaths } from '../routes.jsx';
import Avatar from '../../../components/Avatar.jsx';
import Tag from '../../../components/Tag.jsx';

// Used for both /profile (your own) and /people/:id (someone else's).
export default function ProfilePage() {
  const { id } = useParams();
  const { profile, loading, error } = useProfile(id);

  if (loading) return <p className="muted">Loading profile…</p>;
  if (error) return <p className="error">{error}</p>;

  const isEmpty = (list) => !list || list.length === 0;

  return (
    <div className="profile">
      <section className="card profile-header">
        <Avatar name={profile.name} photo={profile.profilePhoto} size="lg" />
        <div className="profile-heading">
          <h1>{profile.name}</h1>
          <p className="muted">
            <span className="role">{profile.role}</span>
            {profile.isOwner && <> · {profile.email}</>}
          </p>
        </div>
        {profile.isOwner && (
          <Link to={profilePaths.edit} className="btn btn-primary">Edit profile</Link>
        )}
      </section>

      <section className="card">
        <h2>About</h2>
        {profile.bio ? <p>{profile.bio}</p> : <p className="muted">No bio yet.</p>}
        {profile.isOwner && profile.visibility.bio === 'private' && (
          <p className="hint">Only you can see your bio.</p>
        )}
      </section>

      <div className="profile-grid">
        <section className="card">
          <h2>Schools</h2>
          <div className="tag-list">
            {profile.schools.map((s) => <Tag key={s} variant="school">{s}</Tag>)}
          </div>
          <h2>Majors</h2>
          <div className="tag-list">
            {profile.majors.map((m) => <Tag key={m} variant="school">{m}</Tag>)}
          </div>
        </section>

        <section className="card">
          <h2>Skills</h2>
          <div className="tag-list">
            {profile.skills.map((s) => <Tag key={s}>{s}</Tag>)}
          </div>
          <h2>Interests</h2>
          {isEmpty(profile.interests) ? (
            <p className="muted">None listed.</p>
          ) : (
            <div className="tag-list">
              {profile.interests.map((i) => <Tag key={i} variant="interest">{i}</Tag>)}
            </div>
          )}
          {profile.isOwner && profile.visibility.interests === 'private' && (
            <p className="hint">Only you can see your interests.</p>
          )}
        </section>
      </div>
    </div>
  );
}