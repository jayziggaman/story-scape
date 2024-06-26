import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { appContext } from '../App'
import ThreeDots from './ThreeDots'

const Article = ({article}) => {
  const { windowWidth, users, darkMode, dmUserIcon, lmUserIcon } = useContext(appContext)
  const [articleCreator, setArticleCreator] = useState()
  const location = useLocation()

  useEffect(() => {
    if (article && users) {
      const {creator} = article
      setArticleCreator(users.find(user => user.id === creator))
    }
  }, [users, article])

  
  return (
    <article className='article'>
      <ThreeDots id={article?.id}
        thumbnail={
          article?.thumbnail ? article?.thumbnail : article?.thumbnails.find(item => item.type === 'img').url
        }
        creator={article?.creator}
        type='article'
        isDeleted={article?.deleted}
      />

      <Link to={`/articles/${article?.id}`}
        state={{
          from:
            location.state ? location.pathname + location.search :
              location.pathname
        }}
      >
        {windowWidth < 901 ?
          <>
            <div className='article-img-div'>
              {article?.thumbnail ?
                <img src={article?.thumbnail} alt="article thumbnail" />
                :
                <img src={article?.thumbnails.find(item => item.type === 'img').url}
                  alt="article thumbnail" 
                />
              }
            </div>

            <div>
              <p>
                <span>
                  {article?.category}
                </span>
                <span>.</span>
                <span>
                  {article?.date}
                </span>
              </p>
              <h3>{article?.title}</h3>
              <p className='article-body'>
                {article?.body.slice(0, 150)} ...
              </p>

              <div className='user-det'>
                <div>
                  {darkMode ?
                    <img src={articleCreator?.avatar || dmUserIcon} alt='User pfp' />
                  :
                    <img src={articleCreator?.avatar || lmUserIcon} alt='User pfp' />
                  }
                </div>
                <p>
                  written by <b>{articleCreator?.userName}</b>
                </p>
              </div>
            </div>
          </>
          :
          <>
            <div>
              <p>{article?.category}</p>
              <h3>
                {article?.title}
              </h3>
              <p className='article-body'>
                {article?.body.slice(0, 250)}
              </p>
              <p>{article?.date}</p>

              <div className='user-det'>
                <div>
                  {darkMode ?
                    <img src={articleCreator?.avatar || dmUserIcon} alt='User pfp' />
                  :
                    <img src={articleCreator?.avatar || lmUserIcon} alt='User pfp' />
                  }
                </div>
                <p>
                  written by <b>{articleCreator?.userName}</b>
                </p>
              </div>
            </div>

            <div className='article-img-div'>
             {article?.thumbnail ?
                <img src={article?.thumbnail} alt="article thumbnail" />
                :
                <img src={article?.thumbnails.find(item => item.type === 'img').url}
                  alt="article thumbnail" 
                />
              }
            </div>
          </>
        }

        {/* <div className="trending-marker">
          {[1, 2, 3].map((el, i) =>
            <span key={i} className={i === i ? 'active' : ''}></span>
          )}
        </div> */}
      </Link>
    </article>
  )
}

export default Article