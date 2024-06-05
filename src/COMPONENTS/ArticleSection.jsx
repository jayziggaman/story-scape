import React, { useContext, useEffect, useRef, useState } from 'react'
import { appContext } from '../App'
import Article from './Article'

const ArticleSection = ({header}) => {
  const { accessOptions } = useContext(appContext)

  return (
    <section className={`${header} article-section`}>
      <div role={'button'} onClick={e => accessOptions(e, '')}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <h2>#{header}</h2>
        <Article />
    </section>
  )
}

export default ArticleSection
