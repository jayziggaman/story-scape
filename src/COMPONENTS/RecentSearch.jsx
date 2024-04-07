import React, { useContext, useEffect } from 'react'
import { appContext } from '../App'

const RecentSearch = ({ search, setSearch, setTo }) => {
  const {recentSearches, setRecentSearches, profileRecentSearches, setProfileRecentSearches} = useContext(appContext)
  const { id, searchItem } = search


  useEffect(() => {
    localStorage.setItem('story-scape-recent-searches', JSON.stringify(recentSearches))
  }, [recentSearches])


  useEffect(() => {
    localStorage.setItem('story-scape-profile-recent-searches', JSON.stringify(profileRecentSearches))
  }, [profileRecentSearches])


  function searchFilter(e) {
    const id = e.currentTarget.id

    if (setTo === 'articles') {
      const arr = recentSearches.filter(search => search.id !== id)
      setRecentSearches([...arr])
    }


    if (setTo === 'users') {
      const arr = profileRecentSearches.filter(search => search.id !== id)
      setProfileRecentSearches([...arr])
    }
  }
  

  return (
    <div className='recent-search'>
      <span role={'button'} onClick={e => {
        setSearch(e.target.innerText)
      }}>
        {searchItem}
      </span>

      <button className='cancel' id={id}
        onClick={(e) => searchFilter(e)}
      >
        <span></span>
        <span></span>
      </button>
    </div>
  )
}

export default RecentSearch

