import React, { useContext, useEffect, useRef, useState } from 'react'
import { appContext } from '../App'
import Article from './Article'

const ArticleSection = ({header}) => {
  const { windowWidth, accessOptions } = useContext(appContext)
  const [index, setIndex] = useState(0)
  let touchStart 
  let touchMove
  let diff

  // article.current?.addEventListener('touchstart', function (e) {
  //   [...e.changedTouches].forEach(touch => {
  //     touchStart = touch.pageX
  //   })
  // })

  // article.current?.addEventListener('touchmove', function (e) {
  //   [...e.changedTouches].forEach(touch => {
  //     touchMove = touch.pageX
  //   })
  //   console.log([...e.changedTouches], 'changing')
  // })

  // article.current?.addEventListener('touchend', function (e) {
  //   [...e.changedTouches].forEach(touch => {
  //     diff = touchStart - touchMove

  //     if (index < 3 && diff > 0) {
  //       setIndex(index => index + 1)
  //     } else if (index > 0 && diff < 0) {
  //       setIndex(index => index - 1)
  //     }
  //   })
  // })

  useEffect(() => {
    // console.log(options)
  }, [index])

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
