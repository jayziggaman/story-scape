import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FaCog } from 'react-icons/fa'
import Collection from '../COMPONENTS/Collection'
import ProfileArticle from '../COMPONENTS/ProfileArticle'
import { appContext } from '../App'
import Loading from '../COMPONENTS/Loading'
import NoMedia from '../COMPONENTS/NoMedia'

const Profile = () => {
  const { user, userArticles, setUserArticles, userCollections, articles, setCreateCollection, userAuth, loading, darkMode, dmUserIcon, lmUserIcon } = useContext(appContext)
  
  const [pageLoading, setPageLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [contentType, setContentType] = useState('articles')
  const [viewPfp, setViewPfp] = useState(false)

  const refs = useRef([])
  const ref = el => refs.current.push(el)


  useEffect(() => {
    if (user) {
      const tempArticles = []
      articles.map(article => {
        user.articles.value.map(articleId => {
          if (articleId === article.id) {
            tempArticles.push(article)
          }
        })
      })
      setUserArticles(tempArticles)
    }
  }, [user, articles])



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


  useEffect(() => {
    if (userCollections && userArticles) {
      setPageLoading(false)

    } else if (!userAuth) {
      setPageLoading(false)
    }
  }, [userArticles, userCollections, userAuth])

  

  return (
    <main className="profile">
      {pageLoading || loading ?
        <Loading />
        : user ?
        <>
          <section className='profile-pfp-followers-bio'>
            <div className="profile-pfp-followers">
              <p>
                @{user?.userName || 'username'}
              </p>
              
              <div className={viewPfp ? 'active' : ''}
                onClick={() => user?.avatar && setViewPfp(!viewPfp)}
              >
                {darkMode ?
                  <img src={user?.avatar || dmUserIcon} alt='User pfp' />
                :
                  <img src={user?.avatar || lmUserIcon} alt='User pfp' />
                }
              </div>

              <div>
                <b>
                  {userArticles?.length === 0 ? 0 :
                    userArticles?.length < 10 ? `0${userArticles.length}` :
                    userArticles.length
                  }
                </b>
                <p>Articles</p>
              </div>

              <div>
                <b>
                  {userCollections?.length === 0 ? 0 :
                    userCollections?.length < 10 ? `0${userCollections.length}` :
                    userCollections.length
                  }
                </b>
                <p>Collections</p>
              </div>

              <div>
                <b>
                  {user?.subscribers.value?.length === 0 ? 0 :
                    user?.subscribers.value?.length < 10 ? `0${user?.subscribers.value.length}` :
                    user?.subscribers.value.length
                  }
                </b>
                <p>Subscribers</p>
              </div>

            </div>

            <div className="profile-bio">
              {user?.bio || 'User Bio'}
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

          <section
            className={
              contentType && !user ? contentType :
              user && userArticles.length > 0 ? `media ${contentType}` :
              `no-articles ${contentType} media`
            }

            style={{
              gridTemplateColumns: userArticles?.length === 0 && contentType === 'articles' && '1fr'
            }}
          >
            {contentType === 'articles' &&
              <>
                {userArticles.length === 0 ?
                  <NoMedia 
                    message='You have not written any article yet. When you share an article it will show here.'
                  />
                  :
                  <>
                    {userArticles.sort((a, b) => b.createdAt - a.createdAt)
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
              <div role={'button'}
                onClick={() => user && setCreateCollection(true)}
              >
                  <span></span>
                  <span></span>
                  <p>
                    Add collection
                  </p>
                </div>
              {userCollections.sort((a, b) => b.createdAt - a.createdAt)
                .map((collection, i) =>
                <Collection key={i} collection={collection} collections={userCollections}
                />
              )}
              </>
            }
          </section>
        </>
          :
        <>
          <section className='profile-pfp-followers-bio'>
            <div className="profile-pfp-followers">
              <p>
                @{user?.userName || 'username'}
              </p>
              
              <div>
                {darkMode ?
                  <img src={dmUserIcon} alt='User pfp' />
                :
                  <img src={lmUserIcon} alt='User pfp' />
                }
              </div>

              <div>
                <b>{userArticles?.length || 0}</b>
                <p>Articles</p>
              </div>

              <div>
                <b>{userCollections?.length || 0}</b>
                <p>Collections</p>
              </div>

              <div>
                <b>{user?.subscribers.value.length || 0}</b>
                <p>Subscribers</p>
              </div>

            </div>

            <div className="profile-bio">
              {user?.bio || 'User Bio'}
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
                <div role={'button'}
                  onClick={() => user && setCreateCollection(true)}
                >
                  <span></span>
                  <span></span>
                  <p>
                    Add collection
                  </p>
                </div>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((collection, i) =>
                  <Collection key={i} collection={collection} collections={userCollections}
                  />
                )}
              </>
            }
          </section>
        </>
      }
    </main>
  )
}

export default Profile