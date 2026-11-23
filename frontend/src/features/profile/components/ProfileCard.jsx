import { Link } from 'react-router-dom';
import { profilePaths } from '../routes.jsx';
import Avatar from '../../../components/Avatar.jsx';
import Tag from '../../../components/Tag.jsx';

// Summary card: the public basics only (name, role, school, major, skills).
// Reusable in the feed, team lists and applicant lists:
//   import { ProfileCard } from '../profile';
//   <ProfileCard profile={p} />
export default function ProfileCard({ profile }) {
  return (
    <Link to={profile.isOwner ? profilePaths.mine : profilePaths.person(profile.id)} className="card profile-card">
      <Avatar name={profile.name} photo={profile.profilePhoto} size="sm" />
      <div>
        <h3>{profile.name}</h3>
        <p className="muted">
          <span className="role">{profile.role}</span> · {profile.schools[0]}
        </p>
        <p className="muted">{profile.majors.join(', ')}</p>
        <div className="tag-list">
          {profile.skills.slice(0, 4).map((s) => <Tag key={s}>{s}</Tag>)}
          {profile.skills.length > 4 && <span className="muted">+{profile.skills.length - 4}</span>}
        </div>
      </div>
    </Link>
  );
}