import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import ThreeDots from './ThreeDots'

const ProfileArticle = ({ article, collectionArticles, link, type, collectionId }) => {
  
  const location = useLocation()


  
  return (
    <article className='profile-article'>
      <ThreeDots id={article?.id}
        thumbnail={article?.thumbnail}
        creator={article?.creator || ''}
        type={type ? type : 'article'}
        isDeleted={article?.deleted}
        collectionId={collectionId}
      />

      <Link to={link === 'blocking' ? '' : `/articles/${article?.id}`}
        state={{
          from:
            location.state ? location.pathname + location.search :
              location.pathname,
          collectionArticles: collectionArticles
        }}
      >
        <img src={article?.thumbnail} alt="" />
      </Link>
      <b>{article?.title}</b>
      <p>{article?.category} . {article?.date}</p>
    </article>
  )
}

export default ProfileArticle