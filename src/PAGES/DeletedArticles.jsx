import React, { useContext, useEffect, useState } from 'react'
import { appContext } from '../App'
import { FaAngleLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import ProfileArticle from '../COMPONENTS/ProfileArticle'
import Loading from '../COMPONENTS/Loading'
import NoMedia from '../COMPONENTS/NoMedia'
import IsOffline from '../COMPONENTS/IsOffline'


const DeletedArticles = () => {
  const { deletedArticles, userAuth, myDeletedArticles, setMyDeletedArticles, user, isOnline } = useContext(appContext)

  const [pageLoading, setPageLoading] = useState(true)


  useEffect(() => {
    if (deletedArticles) {
      const arr = deletedArticles.filter(article => article.creator === userAuth)

      setMyDeletedArticles([...arr])
    }
  }, [deletedArticles])

  
  useEffect(() => {
    if (isOnline) {
      if (user) {
        if (deletedArticles) {
          const cond = deletedArticles.find(article => article.creator === userAuth)
  
          if (cond) {
            if (myDeletedArticles) {
              setPageLoading(false)
            }
  
          } else {
            setPageLoading(false)
          }
        }
      }

    } else {
      setPageLoading(false)
    }
  }, [myDeletedArticles, user, deletedArticles, userAuth, isOnline])


  
  return (
    <main className="deleted-articles-main">
      <header>
        <Link to='/settings'>
          <FaAngleLeft />
        </Link>
        <h3>Deleted articles</h3>
      </header>

      {isOnline ?
        <>
          {pageLoading ?
            <Loading />
            :
            <section className="deleted-articles media"
              style={{
                gridTemplateColumns: myDeletedArticles?.length === 0 && '1fr'
              }}
            >
              {myDeletedArticles.length > 0 ?
                <>
                  {myDeletedArticles.map(article => {
                    return (
                      <ProfileArticle key={article.id} article={article}
                        link='blocking' type='deleted'
                      />
                    )
                  })}
                </>
                :
                <NoMedia
                  message='When you delete an article it will show here.'
                />
              }
            </section>
          }
        </>
        :
        <IsOffline />
      }
    </main>
  )
}

export default DeletedArticles