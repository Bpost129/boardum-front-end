// npm modules
import { NavLink } from 'react-router-dom'

import styles from './NavBar.module.css'

const NavBar = ({ user, handleLogout }) => {
  return (
    <nav className={styles.nav}>
      {user ?
        <ul className={styles.list}>
          <li><NavLink to="/">Home</NavLink></li>
          <section>
            <li className={styles.greeting}>Hello, {user.name.split(' ')[0]}!</li>
            <li><NavLink to="/profile">Profile{}</NavLink></li>
            {/* <li><NavLink to="/profiles">Profiles</NavLink></li> */}
            <li><NavLink to="" onClick={handleLogout}>LOG OUT</NavLink></li>
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
