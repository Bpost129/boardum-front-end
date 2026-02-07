import { NavLink } from 'react-router-dom'

import styles from './Profile.module.css'

const Profile = ({ user, profile }) => {
  if (!profile) {
    return <main className={styles.container}> <></> </main>
  }
  
  return (
    <main className={styles.container}>
      <h1>Profile here!</h1>
      <img src={profile.photo} alt="profile photo" className={styles.photo} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button><NavLink to="/auth/change-password">Change Password</NavLink></button>
    </main>
  )
}

export default Profile