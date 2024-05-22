import React, { useContext, useEffect, useRef, useState } from 'react'
import { appContext } from '../App'
import RecentSearch from '../COMPONENTS/RecentSearch'
import searchInactive from '../img-icons/search-inactive.JPG'
import dmSearchInactive from '../img-icons/dm-search-inactive.JPG'
import SearchArticle from '../COMPONENTS/SearchArticle'
import { Link, useSearchParams } from 'react-router-dom'
import ProfileSearch from '../COMPONENTS/ProfileSearch'
import IsOffline from '../COMPONENTS/IsOffline'

const Discover = () => {
  const { recentSearches, darkMode, feed, profileRecentSearches, users, isOnline } = useContext(appContext)
  const [searchParams, setSearchParams] = useSearchParams()

  const [search, setSearch] = useState('')
  const [showRecents, setShowRecents] = useState(false)
  const [searchArticles, setSearchArticles] = useState([])
  const [searchProfiles, setSearchProfiles] = useState([])
  const [noSearchResult, setNoSearchResult] = useState(false)
  const [setTo, setSetTo] = useState('articles')

  useEffect(() => {
    if (search === '' && feed) {
      setSearchArticles([...feed])
    }
  }, [feed])


  useEffect(() => {
    if (searchParams.get('set-to')) {
      setSetTo(searchParams.get('set-to'))

    } else {
      setSetTo('articles')
    }
  }, [searchParams])


  const searchRender = useRef(true)
  useEffect(() => {
    if (searchRender.current) {
      searchRender.current = false

      if (search === '') {
        setShowRecents(false)
      } else {
        setShowRecents(true)
      }

    } else {
      const arr = []
      feed?.map(article => {
        if (article.title.toLowerCase().includes(search.toLowerCase()) ||
          article.body.toLowerCase().includes(search.toLowerCase())) {
          arr.push(article)
        }
      })
      setSearchArticles([...arr])

      const arrII = []
      users?.map(user => {
        if (user.userName.toLowerCase().includes(search.toLowerCase()) ||
          user.firstName.toLowerCase().includes(search.toLowerCase()) ||
          user.lastName.toLowerCase().includes(search.toLowerCase())) {
            arrII.push(user)
        }
      })
      setSearchProfiles([...arrII])
    }
    
    if (setTo === 'articles') {
      if (recentSearches.length < 1) {
        setShowRecents(false)
      }
    }

    if (setTo === 'users') {
      if (profileRecentSearches.length < 1) {
        setShowRecents(false)
      }
    }
  }, [search, feed, recentSearches, profileRecentSearches, showRecents, setTo])


  useEffect(() => {
    if (setTo === 'articles') {
      if (searchArticles.length === 0 && search !== '') {
        setNoSearchResult(true)
      } else {
        setNoSearchResult(false)
      }
    }

    if (setTo === 'users') {
      if (searchProfiles.length === 0 && search !== '') {
        setNoSearchResult(true)
      } else {
        setNoSearchResult(false)
      }
    }
  }, [searchArticles, search])

  

  
  return (
    <main className="discover-main">
      {isOnline ?
        <>
          <header>
            {setTo === 'articles' ?
              <Link to='/discover?set-to=users'>
                users
              </Link>
              : setTo === 'users' &&
              <Link to='/discover?set-to=articles'>
                articles
              </Link>
            }
            <div className='discover-input-div' role={'button'}
              onClick={() => setShowRecents(true)}
            >
              <img src={darkMode ? dmSearchInactive : searchInactive} alt="" />
              <input type="text" placeholder={feed ? `Discover ${setTo}` : 'Loading...'}
                onChange={e => setSearch(e.target.value)} value={search}
              />

              {search !== '' &&
                <button className='cancel'
                  onClick={() => setSearch('')}
                >
                  <span></span>
                  <span></span>
                </button>
              }
            </div>
          </header>

          <section className="recent-searches"
            style={{
              opacity: showRecents ? `1` : `0`,
              zIndex: showRecents ? '10' : "-10",
            }}
          >
            <p>
              Recent Searches
            </p>
            {setTo === 'articles' ?
              <div
                style={{
                  display: (recentSearches.length > 0) ? 'flex' : 'none'
                }}
              >
                <>
                  {recentSearches.map((search, i) => {
                    return (
                      <RecentSearch search={search} key={i}
                        setSearch={setSearch} setTo={setTo}
                      />
                    )
                  })}
                </>
              </div>

            : setTo === 'users' &&
              <div
                style={{
                  display: (profileRecentSearches.length > 0) ? 'flex' : 'none'
                }}
              >
                <>
                  {profileRecentSearches.map((search, i) => {
                    return (
                      <RecentSearch search={search} key={i}
                        setSearch={setSearch} setTo={setTo}
                      />
                    )
                  })}
                </>
              </div>
            }
          </section>

          <section className="search-articles"
            style={{
              marginTop: showRecents ? '100px' : '30px'
            }}
          >
            {setTo === 'articles' || search === '' ?
              <>
                {searchArticles.map(article => {
                  return (
                    <SearchArticle key={article.id} article={article}
                      search={search}
                    />
                  )
                })}
              </>
              : setTo === 'users' &&
              <>
                {searchProfiles.map((profile, i) => {
                  if (profile.userName) {
                    return (
                      <ProfileSearch key={i} profile={profile}
                      search={search}
                      />
                    )
                  }
                  })}
              </>
            }
          </section>
        </>
        :
        <IsOffline />
      }
    </main>
  )
}

export default Discover