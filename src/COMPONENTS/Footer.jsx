import React, { useContext } from 'react'

import homeInactive from '../img-icons/home-inactive.jpeg'
import dmHomeInactive from '../img-icons/dm-home-inactive.jpeg'

import searchInactive from '../img-icons/search-inactive.JPG'
import dmSearchInactive from '../img-icons/dm-search-inactive.JPG'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { appContext } from '../App'

const Footer = () => {
  const { setShowNewForm, darkMode, footerRef, user, dmUserIcon, lmUserIcon, dmSettingsIcon, lmSettingsIcon, loggedIn, isOnline, userAuth } = useContext(appContext)
  
  const navigate = useNavigate()
  const location = useLocation()
  
  
  return (
    <footer ref={footerRef}>
      <NavLink to='/'
        className={({ isActive }) => isActive ? 'active-link ' : ''}
      >
        <img src={darkMode ? dmHomeInactive : homeInactive} alt='' />
        <p>Home</p>
      </NavLink>

      <NavLink to='/discover'
        className={({ isActive }) => isActive ? 'active-link ' : ''}
      >
        <img src={darkMode ? dmSearchInactive : searchInactive} alt='' />
        <p>Discover</p>
      </NavLink>

      <button role={'button'} onClick={() => {
        if (userAuth) {
          loggedIn ? setShowNewForm(true) : navigate(`/login?type=sign-in&from=${location.pathname}`)
        }
      }}>
        <span></span>
        <span></span>
      </button>

      <NavLink className={({ isActive }) => isActive ? 'active-link ' : ''}
        to={isOnline ?
          `${loggedIn ? '/profile?content-type=articles' :
            `/login?type=sign-in&from=${location.pathname}`
          }`
          : `${userAuth && '/profile?content-type=articles'}`
        }
      >
        {darkMode ?
          <img src={user?.avatar ? user?.avatar : dmUserIcon} alt='' />
          :
          <img src={user?.avatar ? user?.avatar : lmUserIcon} alt='' />
        }
        <p>You</p>
      </NavLink>

      <NavLink to='/settings'
        className={({ isActive }) => isActive ? 'active-link ' : ''}
      >
        <img src={darkMode ? dmSettingsIcon : lmSettingsIcon} alt='' />
        <p>Settings</p>
      </NavLink>
    </footer>
  )
}

export default Footer