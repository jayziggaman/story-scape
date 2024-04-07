import React, { useContext, useEffect, useRef, useState } from 'react'
import { appContext } from '../App'
import Article from './Article'
import Loading from './Loading'

const Landing = () => {
  const { feed, loading } = useContext(appContext)

  return (
    <>
      {loading ?
        <Loading />
        :
        <div className='home-landing'>
         <div>
            <h1> Discover Nice Articles Here </h1>
            <p>
              Enjoy interesting articles on <b>different categories</b> written by creators <b>from all over the world</b>.
            </p>
          </div>

          <section className="article-section">
            {feed?.sort((a, b) => b.createdAt - a.createdAt).map((article, i) => {
              return (
                <Article key={i} article={article}/>
              )
            })}
          </section>

          {/* <ArticleSection header='trending' />
          <ArticleSection header='foryou' />
          <ArticleSection header='new' /> */}
        </div>
      }
    </>
  )
}

export default Landing