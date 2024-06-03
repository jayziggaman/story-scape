import { collection, onSnapshot } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { FaAngleLeft } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import { appContext } from '../App'
import IsOffline from '../COMPONENTS/IsOffline'
import Loading from '../COMPONENTS/Loading'
import NoMedia from '../COMPONENTS/NoMedia'
import ProfileArticle from '../COMPONENTS/ProfileArticle'
import { db } from '../firebase/config'

const SearchCollectionPage = () => {
  const { profileUserName, collectionId } = useParams()
  const { isOnline, users, feed } = useContext(appContext)

  const [loading, setLoading] = useState(true)
  const [thisUser, setThisUser] = useState()
  const [thisCollection, setThisCollection] = useState()

  useEffect(() => {
    if (users) {
      setThisUser(users.find(user => user.userName === profileUserName))
    }
  }, [users])


  useEffect(() => {
    let collectionSnap

    if (thisUser) {
      const collectionRef = collection(db, 'users', thisUser.id, 'collections')
      collectionSnap = onSnapshot(collectionRef, snap => {
        let tempCollections = []
        snap.docs.forEach(doc => {
          tempCollections.push({...doc.data(), id: doc.id})
        })
        const thisCollection = tempCollections.find(collection => collection.id === collectionId)
        
        const collectionObj = {
          id: thisCollection.id,
          name: thisCollection.name,
          articles: []
        }
  
        thisCollection.items.value.map(item => {

          feed.map(article => {

            if (item.id === article.id) {
              collectionObj.articles.push(article)
            }
          })
        })

        setThisCollection(collectionObj)
      })

    return () => {
      if (thisUser) {
        collectionSnap()
      }
    }
    }
  }, [thisUser])

  
  
  useEffect(() => {
    if (thisCollection) {
      setLoading(false)
    }
  }, [thisCollection])
  

  return (
    <main className="collection-page-main">
      <header>
        <Link to={`/${thisUser?.userName}`}>
          <FaAngleLeft /> 
        </Link>

        <h3>
          {isOnline ?
            <>{thisCollection?.name}</>
            :
            <>Collection</>
          }
        </h3>
      </header>

      {loading ?
        <Loading />
        :
        <>
          {isOnline ?
            <section className="collection-page-section media"
              style={{
                gridTemplateColumns: thisCollection?.articles.length === 0 && '1fr'
              }}
            >
              {thisCollection?.articles.length === 0 ?
                <NoMedia
                  message='When you add an article to this collection it will show here.'
                />
                :
                <>
                  {thisCollection?.articles.map((article, i) => {
                    return (
                      <ProfileArticle key={i} article={article}
                        collectionArticles={thisCollection?.articles}
                        type='search' collectionId={collectionId}
                      />
                    )
                  })}
                </>
              }
            </section>
            :
            <IsOffline />
          }
        </>
      }
    </main>
  )
}

export default SearchCollectionPage