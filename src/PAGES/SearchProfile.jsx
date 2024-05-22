import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { FaCog } from 'react-icons/fa'
import { appContext } from '../App'
import Loading from '../COMPONENTS/Loading'
import NoMedia from '../COMPONENTS/NoMedia'
import ProfileArticle from '../COMPONENTS/ProfileArticle'
import Collection from '../COMPONENTS/Collection'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
import IsOffline from '../COMPONENTS/IsOffline'

const SearchProfile = () => {
  const { profileUserName } = useParams()
  const { currUser, setCurrUser, users, userAuth, loading, darkMode, dmUserIcon, lmUserIcon, feed, subscribeToUser, unSubscribeToUser, isOnline } = useContext(appContext)

  const [searchParams, setSearchParams] = useSearchParams()
  const [pageLoading, setPageLoading] = useState(true)

  const [contentType, setContentType] = useState('articles')
  const [currUserArticles, setCurrUserArticles] = useState()
  const [currUserCollections, setCurrUserCollections] = useState()
  const [viewPfp, setViewPfp] = useState(false)

  const [isMe, setIsMe] = useState(false)

  const refs = useRef([])
  const ref = el => refs.current.push(el)


  useEffect(() => {
    if (currUser) {
      if (currUser.id === userAuth) {
        setIsMe(true)

      } else {
        setIsMe(false)
      }
    }
  }, [currUser])


  useEffect(() => {
    if (!searchParams.get('content-type')) {
      setSearchParams(prev => {
        prev.set('content-type', 'articles')
      })
    }
  }, [])


  useEffect(() => {
    if (searchParams.get('content-type')) {
      setContentType(searchParams.get('content-type'))
    }
  }, [searchParams])

  
  useEffect(() => {
    if (users) {
      setCurrUser(users.find(user => user.userName.trim() === profileUserName.trim()))
    }
  }, [users, profileUserName])


  useEffect(() => {
    let collectionSnap
    if (currUser) {

      const arr = []
      feed.map(item => {
        currUser.articles.value.map(article => {
          if (article === item.id) {
            arr.push(item)
          }
        })
      })
      setCurrUserArticles([...arr])

      const collectionRef = collection(db, 'users', currUser.id, 'collections')
      collectionSnap = onSnapshot(collectionRef, snap => {
        let tempCollections = []
        snap.docs.forEach(doc => {
          tempCollections.push({...doc.data(), id: doc.id})
        })

        const col = tempCollections.filter(col => col.deleted === false)
        setCurrUserCollections(col)
      })
    }

    return () => {
      if (currUser) {
        collectionSnap()
      }
    }
  }, [currUser])


  useEffect(() => {
    if (isOnline) {
      if (currUserCollections) {
        setPageLoading(false)
      }

    } else {
      setPageLoading(false)
    }
  }, [currUserCollections])



  useEffect(() => {
    refs.current.forEach(opt => {
      if (opt) {
        if (opt.dataset.type === contentType) {
          opt.classList.add('active-a-type')
        } else {
          opt.classList.remove('active-a-type')
        }
      }
    })
  }, [contentType, pageLoading])


  
  return (
    <main className="profile">
      {isOnline ?
        <>
          {pageLoading || loading ?
            <Loading />
            : currUser ?
            <>
              <section className='profile-pfp-followers-bio'>
                <div className="profile-pfp-followers">
                  <p>
                    @{currUser?.userName || 'username'}
                  </p>
                  
                  <div className={viewPfp ? 'active' : ''}
                    onClick={() => currUser?.avatar && setViewPfp(!viewPfp)}
                  >
                    {darkMode ?
                      <img src={currUser?.avatar || dmUserIcon} alt='User pfp' 
                      />
                    :
                      <img src={currUser?.avatar || lmUserIcon} alt='User pfp' 
                      />
                    }
                  </div>

                  <div>
                    <b>
                      {currUserArticles?.length === 0 ? 0 :
                        currUserArticles?.length < 10 ? `0${currUserArticles.length}` :
                        currUserArticles.length
                      }
                    </b>
                    <p>Articles</p>
                  </div>

                  <div>
                    <b>
                      {currUserCollections?.length === 0 ? 0 :
                        currUserCollections?.length < 10 ? `0${currUserCollections.length}` :
                        currUserCollections.length
                      }
                    </b>
                    <p>Collections</p>
                  </div>

                  <div>
                    <b>
                      {currUser?.subscribers.value?.length === 0 ? 0 :
                        currUser?.subscribers.value?.length < 10 ? `0${currUser?.subscribers.value.length}` :
                        currUser?.subscribers.value.length
                      }
                    </b>
                    <p>Subscribers</p>
                  </div>

                </div>

                <div className="profile-bio">
                  {currUser?.bio || 'User Bio'}
                </div>

                {currUser.id !== userAuth &&
                  <>
                    {currUser.subscribers.value.find(subscriber => subscriber === userAuth) ?
                      <button className='follow-btn'
                        onClick={() => unSubscribeToUser(currUser)}
                        style={{
                          color: 'white',
                          backgroundColor: darkMode ? 'rgb(174, 33, 33)' : '#91C7BA',
                          border: 'none'
                        }}
                      >
                        Unsubscribe
                      </button>
                      :
                      <button className='follow-btn'
                        onClick={() => subscribeToUser(currUser)}
                      >
                        Subscribe
                      </button>
                    }
                  </>
                }
                
              </section>

              <section>
                <Link data-type='articles' ref={ref}
                  to={'?content-type=articles'}
                >
                  <span>
                    Articles
                  </span>
                </Link>

                <Link data-type='collections' ref={ref}
                  to={'?content-type=collections'}
                >
                  <span>
                    Collections
                  </span>
                </Link>
              </section>

              <section
                className={
                  contentType && !currUser ? contentType :
                  currUser && currUserArticles.length > 0 ? `media ${contentType}` :
                  `no-articles ${contentType} media`
                }

                style={{
                  gridTemplateColumns: currUserArticles?.length === 0 && contentType === 'articles' && '1fr'
                }}
              >
                {contentType === 'articles' &&
                  <>
                    {currUserArticles.length === 0 ?
                      <NoMedia 
                        message={
                          isMe ?
                          'You have not written any article yet. When you share an article it will show here.'
                          :
                          `${currUser.userName} has not written any article yet. When ${currUser.userName} shares an article it will show here.`
                        }
                      />
                      :
                      <>
                        {currUserArticles.sort((a, b) => b.createdAt - a.createdAt)
                          .map((article, i) =>
                          <ProfileArticle key={i}
                            article={article}
                          />)
                        }
                      </>
                      }
                  </>
                }

                {contentType === 'collections' &&
                  <>
                    {currUserCollections.length === 0 ?
                      <NoMedia message='No collection to show.'/>
                      :
                      <>
                        {currUserCollections.sort((a, b) => b.createdAt - a.createdAt)
                          .map((collection, i) =>
                          <Collection key={i} collection={collection} collections={currUserCollections}
                          />
                        )}
                      </>
                    }
                  </>
                }
              </section>
            </>
              :
            <>
              <section className='profile-pfp-followers-bio'>
                <div className="profile-pfp-followers">
                  <p>
                    @{currUser?.userName || 'username'}
                  </p>
                  
                  <div>
                    {darkMode ?
                      <img src={dmUserIcon} alt='User pfp' />
                    :
                      <img src={lmUserIcon} alt='User pfp' />
                    }
                  </div>

                  <div>
                    <b>{currUserArticles?.length || 0}</b>
                    <p>Articles</p>
                  </div>

                  <div>
                    <b>{currUserCollections?.length || 0}</b>
                    <p>Collections</p>
                  </div>

                  <div>
                    <b>{currUser?.subscribers.value.length || 0}</b>
                    <p>Subscribers</p>
                  </div>

                </div>

                <div className="profile-bio">
                  {currUser?.bio || 'User Bio'}
                </div>

                <Link className='settings-cog' to='/settings'>
                  <FaCog />
                </Link>
              </section>

              <section>
                <Link data-type='articles' ref={ref}
                  to={'?content-type=articles'}
                >
                  <span>
                    Articles
                  </span>
                </Link>

                <Link data-type='collections' ref={ref}
                  to={'?content-type=collections'}
                >
                  <span>
                    Collections
                  </span>
                </Link>
              </section>

              <section className={`media`}>
                {contentType === 'articles' &&
                  <NoMedia 
                    message='You have not written any article yet. When you share an article it will show here.'
                  />
                }

                {contentType === 'collections' &&
                  <>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((collection, i) =>
                      <Collection key={i} collection={collection} collections={currUserCollections}
                      />
                    )}
                  </>
                }
              </section>
            </>
          }
        </>
        :
        <IsOffline />
      }
    </main>
  )
}

export default SearchProfile