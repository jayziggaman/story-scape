import React, { useContext } from 'react'
import { Navigate, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { appContext } from '../App'

import homeInactive from '../img-icons/home-inactive.jpeg'
import dmHomeActive from '../img-icons/dm-home-active.jpeg'

import searchActive from '../img-icons/search-active.JPG'
import dmSearchActive from '../img-icons/dm-search-active.JPG'

import storyScapeLogo from '../images/story-scape-logo.jpg'

const Nav = () => {
  const { userAuth, setShowNewForm, darkMode, windowWidth, navRef, user, lmUserIcon, dmUserIcon, dmSettingsIcon, lmSettingsIcon, loggedIn } = useContext(appContext)
  
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav ref={navRef}
      style={{
        marginTop: userAuth ? '0px' : '50px',
        height: userAuth ? `${window.innerHeight}px` :
          `${window.innerHeight - 50}px`
      }}
    >

      <div className='logo-div'
        style={{
          top: userAuth && loggedIn ? '0px' : '50px'
        }}
      >
        <img src={storyScapeLogo} alt="" />
        {windowWidth > 799 && <p>Story Scape</p>}
      </div>
      

      <div className='nav'
        style={{
          top: userAuth ? '100px' : '150px',
          height: userAuth ? `${window.innerHeight - 100}px` :
            `${window.innerHeight - 150}px`
        }}
      >


        <NavLink to='/'
          className={({ isActive }) => isActive ? 'active-link ' : ''}
        >
          <img
            src={darkMode ? dmHomeActive : homeInactive} alt=''
          />
          <p>Home</p>
        </NavLink>

        <NavLink to='/discover'
          className={({ isActive }) => isActive ? 'active-link ' : ''}
        >
          <img
            src={darkMode ? dmSearchActive : searchActive} alt=''
          />
          <p>Discover</p>
        </NavLink>

        <button role={'button'} onClick={() => {
          loggedIn ? setShowNewForm(true) : navigate(`/login?type=sign-in&from=${location.pathname}`)
        }}>
          <span>
            <span></span>
            <span></span>
          </span>
          {
            windowWidth > 799 &&
            <span>
              Create
            </span>
          }
        </button>

        <NavLink className={({ isActive }) => isActive ? 'active-link ' : ''}
          to={loggedIn ? '/profile?content-type=articles' :
          `/login?type=sign-in&from=${location.pathname}`}
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
          <img
            src={darkMode ? dmSettingsIcon : lmSettingsIcon} alt=''
          />
          <p>Settings</p>
        </NavLink>
      </div>
    </nav>
  )
}

export default Nav