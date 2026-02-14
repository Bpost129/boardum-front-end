// npm modules
import { NavLink } from 'react-router-dom'

import styles from './NavBar.module.css'

const NavBar = ({ user, handleLogout }) => {
  return (
    <nav className={styles.nav}>
      {user ?
        <ul className={styles.list}>
          <li>
            <NavLink to="/" className={styles.homeList}>
              <span className={styles.homeLogo}><i className="fa-solid fa-house"></i></span>
              <span className={styles.homeText}>HOME</span>
            </NavLink>
          </li>
          <section>
            <li>
              <NavLink to="/profile" className={styles.profileList}>
                <span className={styles.profileLogo}><i className="fa-solid fa-circle-user"></i></span>
                <span className={styles.profileText}>PROFILE</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="" onClick={handleLogout} className={styles.logoutList}>
                <span className={styles.logoutLogo}><i className="fa-solid fa-right-from-bracket"></i></span> 
                <span className={styles.logoutText}>LOG OUT</span>
              </NavLink>
            </li>
          </section>
        </ul>
      :
        <ul className={styles.list}>
          <section>
            <li><NavLink to="/auth/login">Log In</NavLink></li>
            <li><NavLink to="/auth/signup">Sign Up</NavLink></li>
          </section>
        </ul>
      }
    </nav>
  )
}

export default NavBar
