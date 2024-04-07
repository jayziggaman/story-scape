import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { appContext } from '../App'

const ProfileSearch = ({ profile, search }) => {
  const { viewOptions, setViewOptions, setOptions, users, profileOptionsInfo, profileRecentSearches, darkMode, dmUserIcon, lmUserIcon, userAuth } = useContext(appContext)
  const { id, firstName, lastName, userName, avatar, subscribers } = profile

  const time = new Date()

  
  function accessOptions(e) {
    const id = e.currentTarget.id

    setViewOptions(!viewOptions)
    setOptions({
      x : e.target.getBoundingClientRect().x,
      y : e.target.getBoundingClientRect().y
    })
    const user = users.find(user => user.id === id)
    profileOptionsInfo.current = {user: user, type: 'profile'}
  }
  
  
  useEffect(() => {
    return () => {
      if (search !== '') {
        const condition = profileRecentSearches.find(item => item.searchItem === search)
        if (!condition) {
          localStorage.setItem('story-scape-profile-recent-searches', JSON.stringify([...profileRecentSearches, {
            id: time,
            searchItem: search
          }]))
        }
        
      }
    }
  }, [])


  return (
    <div className='profile-search'>
      <Link to={`/${userName}`}>
        {darkMode ?
          <img src={avatar || dmUserIcon} alt="" />
          :
          <img src={avatar || lmUserIcon} alt="" />
        }
      </Link>

      <Link to={`/${userName}`}>
        <div>
          <b>@{userName}</b> . <p>{firstName} {lastName}</p>
        </div>
        <p>
          {id === userAuth ? 'You' :
            `${subscribers.value.length} Subscribers`
          }
        </p>
      </Link>

      <button id={id} onClick={e => {
        accessOptions(e)
      }}>
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  )
}

export default ProfileSearch