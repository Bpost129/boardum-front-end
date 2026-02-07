import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

import * as profileService from '../../services/profileService'

import styles from './Profile.module.css'


const Profile = ({ user }) => {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const profileData = await profileService.getProfile(user.profile)
      setProfile(profileData)
    }
    fetchProfile()
  }, [])

  if (!profile) {
    return <main className={styles.container}><h1>Loading...</h1></main>
  }
  
  return (
    <main className={styles.container}>
      <h1>Profile here!</h1>
      <img src={profile.photo} alt="profile photo" className={styles.photo} />
      <p>{user.name}</p>
      <p>{user.email}</p>
      <button><NavLink to="/auth/change-password">Change Password</NavLink></button>
    </main>
  )
}

export default Profile