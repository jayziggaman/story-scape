import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { appContext } from '../App'
import ThreeDots from './ThreeDots'

const Collection = ({collection, link}) => {
  const { user, feed } = useContext(appContext)

  const [displayArticles, setDisplayArticles] = useState([])

  useEffect(() => {
    const arr = []
    collection.items.value.map(item => {
      feed.map(article => {
        if(article.id === item.id) {
          arr.push(item)
        }
      })
    })
    setDisplayArticles([...arr])
  }, [])


  
  return (
    <article>
      {user &&
        <ThreeDots id={collection?.id}
          thumbnail={collection?.thumbnail}
          creator={collection?.creator || ''}
          type='collection'
          isDeleted={collection?.deleted}
        />
      }

      {user &&
        <>
          <Link to={link === 'blocking' ? '' : collection?.id}
            className='collection-img-div'>
            {displayArticles.slice(0, 3).map(val => {
              return (
                <div key={val.id}>
                  <img src={val.thumbnail} alt="" />
                </div>
              )
            })}
          </Link>

          <p>{collection?.name} . {displayArticles.length} {displayArticles.length === 1 ? 'item' : 'items'}
          </p>
        </>
      }
    </article>
  )
}

export default Collection