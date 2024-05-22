import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { appContext } from '../App'
import { FaAngleLeft } from 'react-icons/fa'
import ProfileArticle from '../COMPONENTS/ProfileArticle'
import NoMedia from '../COMPONENTS/NoMedia'
import IsOffline from '../COMPONENTS/IsOffline'


const CollectionPage = () => {
  const { collectionId } = useParams()
  const { hideFeatures, undoHide, windowWidth, userCollections, feed, collectionArticles, setCollectionArticles, isOnline } = useContext(appContext)

  const [collection, setCollection] = useState()
  const location = useLocation()

  useEffect( () => {
    const arr = []
    if (userCollections) {
      userCollections.map(collection => {

        const collectionObj = {
          id: collection.id,
          name: collection.name,
          articles: []
        }
  
        collection.items.value.map(item => {
          feed.map(article => {
            if (item.id === article.id) {
              collectionObj.articles.push(article)
            }
          })
        })
  
        arr.push(collectionObj)
      })
    }
    setCollectionArticles(arr)
  }, [feed, userCollections])


  useEffect(() => {
    if (collectionArticles) {
      setCollection(collectionArticles.find(collection => collection.id === collectionId))
    }
  }, [collectionArticles])


  useEffect(() => {
    hideFeatures()
    
    return () => {
      undoHide()
    }
  }, [windowWidth, location])



  return (
    <main className="collection-page-main">
      <header>
        <Link to='/profile?content-type=collections'>
          <FaAngleLeft />
        </Link>

        <h3>
          {isOnline ?
            <>{collection?.name}</>
            :
            <>Collection</>
          }
        </h3>
      </header>

      {isOnline ?
        <section className="collection-page-section media"
          style={{
            gridTemplateColumns: collection?.articles.length === 0 && '1fr'
          }}
        >
          {collection?.articles.length === 0 ?
            <NoMedia
              message='When you add an article to this collection it will show here.'
            />
            :
            <>
              {collection?.articles.map((article, i) => {
                return (
                  <ProfileArticle key={i} article={article}
                    collectionArticles={collectionArticles}
                    type='in-collection' collectionId={collectionId}
                  />
                )
              })}
            </>
          }
        </section>
        :
        <IsOffline />
      }
    </main>
  )
}

export default CollectionPage