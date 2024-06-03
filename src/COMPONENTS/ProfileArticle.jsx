import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { appContext } from '../App'
import ThreeDots from './ThreeDots'

const ProfileArticle = ({ article, collectionArticles, link, type, collectionId }) => {
  const { unavailable } = useContext(appContext)
  const location = useLocation()

  
  return (
    <article className='profile-article'>
      {type !== 'search' &&
        <ThreeDots id={article?.id}
          thumbnail={
            article?.thumbnail ? article?.thumbnail : article?.thumbnails.find(item => item.type === 'img').url
          }
          creator={article?.creator || ''}
          type={type ? type : 'article'}
          isDeleted={article?.deleted}
          collectionId={collectionId}
        />
      }

      {!article?.isPublic &&
        <img src={unavailable} alt="" className='unavailable-img'/>
      }

      <Link to={link === 'blocking' ? '' : `/articles/${article?.id}`}
        state={{
          from:
            location.state ? location.pathname + location.search :
              location.pathname,
          collectionArticles: collectionArticles
        }}
      >
        {article?.thumbnail ?
          <img src={article?.thumbnail} alt="article thumbnail" />
          :
          <img src={article?.thumbnails.find(item => item.type === 'img').url}
            alt="article thumbnail" 
          />
        }
      </Link>
      <b>{article?.title}</b>
      <p>{article?.category} . {article?.date}</p>
    </article>
  )
}

export default ProfileArticle