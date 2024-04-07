import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { appContext } from '../App'
import ThreeDots from './ThreeDots'

const Article = ({article}) => {
  const { windowWidth } = useContext(appContext)
  const location = useLocation()
  

  return (
    <article className='article'>
      <ThreeDots id={article?.id}
        thumbnail={article?.thumbnail}
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
              <img src={article?.thumbnail} alt="article thumbnail" />
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
                {article?.body.slice(0, 400)}
              </p>
              <p>{article?.date}</p>
            </div>
            <div className='article-img-div'>
              <img src={article?.thumbnail}   alt="article thumbnail"
            />
            </div>
          </>
        }

        <div className="trending-marker">
          {[1, 2, 3].map((el, i) =>
            <span key={i} className={i === i ? 'active' : ''}></span>
          )}
        </div>
      </Link>
    </article>
  )
}

export default Article