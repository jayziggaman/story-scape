import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { appContext } from '../App'

const SearchArticle = ({article, search}) => {
  const { windowWidth, recentSearches } = useContext(appContext)
  const location = useLocation()

  const time = new Date()

  
  function setSearchInStorage() {
    if (search !== '') {
      const condition = recentSearches.find(item => item.searchItem === search)
      if (!condition) {
        localStorage.setItem('story-scape-recent-searches', JSON.stringify([...recentSearches, {
          id: time,
          searchItem: search
        }]))
      }
    }
  }
  

  return (
    <article className='article'>

      <Link to={`/articles/${article?.id}`}
        state={{
          from:
            location.state ? location.pathname + location.search :
              location.pathname
        }}
        onClick={() => setSearchInStorage()}
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
                {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, optio dicta nostrum praesentium dolorem delectus odit aliquid sequi voluptas accusantium. */}
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

export default SearchArticle