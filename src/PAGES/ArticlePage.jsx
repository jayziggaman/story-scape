import { uuidv4 } from '@firebase/util'
import { doc, Timestamp, updateDoc } from 'firebase/firestore'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaAngleLeft, FaArrowLeft, FaAngleRight } from 'react-icons/fa'
import { Link, useLocation, useParams } from 'react-router-dom'
import { appContext } from '../App'
import ArticleComment from '../COMPONENTS/ArticleComment'
import ArticlePageFooter from '../COMPONENTS/ArticlePageFooter'
import IsOffline from '../COMPONENTS/IsOffline'
import Loading from '../COMPONENTS/Loading'
import { db } from '../firebase/config'
import { useSwipeable } from 'react-swipeable';


const ArticlePage = () => {
  const { articleId } = useParams()
  const { articleInView, setArticleInView, feed, users, hideFeatures, undoHide, windowWidth, userAuth, time, setShowPopup, setPopup, showCommentOptions, setShowCommentOptions, user, setOptionsCoord, darkMode, dmUserIcon, lmUserIcon, isOnline, articles } = useContext(appContext)
  const location = useLocation()
  const [articleLoading, setArticleLoading] = useState(true)
  const [articleCreator, setArticleCreator] = useState()
  const [from, setFrom] = useState('')
  const [comment, setComment] = useState('')
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [thumbnailIndex, setThumbnailIndex] = useState(0)
  const sectionRef = useRef()
  const divRef = useRef()


  useEffect(() => {
    if (isOnline) {
      if (articleInView) {
        setArticleLoading(false)
      }

    } else {
      setArticleLoading(false)
    }
  }, [isOnline, articleInView])



  useEffect(() => {
    if (feed && articles) {
      const article = articles.find(article => article.id === articleId)

      if (article?.isPublic) {
        setArticleInView(feed.find(article => article.id === articleId))

      } else {
        setArticleInView(articles.find(article => article.id === articleId))
      }
    }
  }, [feed, articles])


  const scroll = () => {
    setShowCommentOptions(false)
  }


  useEffect(() => {
    if (!articleLoading) {
      window.addEventListener('scroll', scroll)
      divRef.current?.addEventListener('scroll', scroll)
    }

    return () => {
      if (!articleLoading) {
        window.removeEventListener('scroll', scroll)
        divRef.current?.removeEventListener('scroll', scroll)
      }
    }
  }, [articleLoading])


  useEffect(() => {
    if (articleInView) {
      setArticleCreator(users.find(user => user.id === articleInView.creator))
    }
  }, [articleInView, articleLoading])


  useEffect(() => {
    if (location.state) {
      location.state.from ? setFrom(location.state.from) : setFrom('/')

    } else {
      setFrom('/')
    }
  }, [location])


  useEffect(() => {
    hideFeatures()

    return () => {
      undoHide()
    }
  }, [location, windowWidth])


  const cancelUpload = (articleId, commentId) => {
    const articleRef = doc(db, 'articles', articleId)
    updateDoc(articleRef, {
      comments: {
        value: articleInView.comments.value.filter(comment => comment.id !== commentId)
      }
    })
  }


  const postComment = e => {
    e.preventDefault()
    if (user) {
      const id = uuidv4()

      if (comment !== '') {
        const newComment = {
          id,
          body: comment,
          creator: userAuth,
          pinned: false,
          createdAt: Timestamp.now().seconds,
          likes: { value: [] },
          replies: { value: [] },
          date: `${time.day} / ${time.month} / ${time.year}`
        }
    
        const articleRef = doc(db, 'articles', articleId)
        updateDoc(articleRef, {
          comments: {
            value: [...articleInView.comments.value, newComment]
          }
        }).then(() => {
          setShowCommentForm(false)
          setShowPopup(true)
          setComment('')
          setPopup({
            type: 'good', message: `Comment posted successfully.`
          })
    
        }).catch(() => {
          // setShowCommentForm(false)
          cancelUpload(articleId, id)
          setShowPopup(true)
          setPopup({
            type: 'bad', message: `Couldn't post comment. Please try again.`
          })
        })
      } else {
        setShowPopup(true)
        setPopup({
          type: 'bad', message: `Comment cannot be empty.`
        })
      }
    }
  }


  useEffect(() => {
    if (!articleLoading) {
      if (windowWidth > 699) {
        if (sectionRef.current) {
          sectionRef.current.style.transform = 'translateY(0%)'
        }
  
      } else if (showCommentForm) {
        if (sectionRef.current) {
          sectionRef.current.style.bottom = '0'
          sectionRef.current.style.transform = 'translateY(0%)'
        }
        
  
      } else {
        if (sectionRef.current) {
          sectionRef.current.style.bottom = '-2000px'
          sectionRef.current.style.transform = 'translateY(200%)'
        }
        
      }
    }
  }, [windowWidth, showCommentForm, articleLoading])
  

  useEffect(() => {
    if (!showCommentForm) {
      setComment('')
      setShowCommentOptions(false)
    }
  }, [showCommentForm])


  function closeClick(e) {
    if (showCommentOptions) {
      if (e.target.classList.contains('opt')) {
        return
      } else {
        setShowCommentOptions(false)
      }
    }
  }
  

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (thumbnailIndex === (articleInView?.thumbnails.length - 1)) {
        return
          
      } else {
        setThumbnailIndex(thumbnailIndex => thumbnailIndex + 1)
      }
    },

    onSwipedRight: () => {
      if (thumbnailIndex === 0) {
        return

      } else {
        setThumbnailIndex(thumbnailIndex => thumbnailIndex - 1)
      }
    },
  });
  

  const spans = document.querySelectorAll('.index-div span')
  useEffect(() => {
    spans.forEach((span, ind) => {
      if (thumbnailIndex === ind) {
        span.classList.add('active')

      } else {
        span.classList.remove('active')
      }
    })
  }, [thumbnailIndex])



  return (
    <>
      <main role={'button'} className="article-page-main"
        onClick={e => closeClick(e)}
      >
        <header>
          <a href={from}
            state={{
              collectionArticles: location.state && location.state.collectionArticles
            }}
          >
            <FaAngleLeft /> back
          </a>
          <p>
          </p>
        </header>

        {isOnline ?
          <>
            {articleLoading ?
              <Loading />
              :
              <>
                <section className="article-page-section">
                  <div>
                    {articleInView?.thumbnail ?
                      <img src={articleInView?.thumbnail} alt="" />
                      :
                      <>
                        <button className='index-btn'
                          onClick={() => {
                            if (thumbnailIndex === 0) {
                              return

                            } else {
                              setThumbnailIndex(thumbnailIndex => thumbnailIndex - 1)
                            }
                          }}
                        >
                          <FaAngleLeft />
                        </button>

                        {articleInView?.thumbnails.map((thumbnail, ind) => {
                          const { type, url } = thumbnail
                          return (
                            <div {...handlers} key={ind}
                              className={thumbnailIndex === ind ?
                                'media-div curr-index' : 'media-div'
                              }
                            >
                              {type === 'img' ?
                                <img src={url} alt="" />
                              
                              : type === 'vid' &&
                                <video src={url} controls></video>
                              }
                            </div>
                          )
                        })}

                        <button className='index-btn'
                          onClick={() => {
                            if (thumbnailIndex === (articleInView?.thumbnails.length - 1)) {
                              return
                                
                            } else {
                              setThumbnailIndex(thumbnailIndex => thumbnailIndex + 1)
                            }
                          }}
                        >
                          <FaAngleRight />
                        </button>

                        <div className='index-div'>
                          <span className='active'></span>
                          <span></span>
                        </div>
                      </>
                    }
                  </div>

                  <h3>
                    {articleInView?.title}
                  </h3>

                  <p style={{marginBottom: '30px', marginTop: '0px'}}>
                    {articleInView?.category} . {articleInView?.date}
                  </p>

                  <pre>
                    {articleInView?.body}
                  </pre>

                  <Link to={`/${articleCreator?.userName}`}>
                    {darkMode ?
                      <img
                        src={articleCreator?.avatar || dmUserIcon} alt=""
                      />
                      :
                      <img
                        src={articleCreator?.avatar || lmUserIcon} alt=""
                      />
                    }
                    written by <span>{articleCreator?.userName}</span>
                  </Link>

                  <ArticlePageFooter
                    setShowCommentForm={setShowCommentForm} article={articleInView}
                  />
                </section>

                <section ref={sectionRef} className="article-comment-section"
                  style={{ maxHeight: window.innerHeight < 600 ? '90vh' : '600px' }}
                >
                  <div ref={divRef} className={
                    articleInView?.comments?.value?.length === 0 ?
                      "article-comments no-comment" : "article-comments"}
                  >
                    {articleInView?.comments?.value?.length === 0 ?
                      <p>
                        No comment under this article. Be the first to leave a comment.
                      </p>
                      :
                      <>
                        {articleInView?.comments?.value?.map(comment => {
                          return (
                            <ArticleComment key={comment.id} comment={comment}
                              setOptionsCoord={setOptionsCoord}
                              showCommentOptions={showCommentOptions}
                              setShowCommentOptions={setShowCommentOptions}
                            />
                          )
                        })}
                      </>
                    }
                  </div>

                  <form action="submit" onSubmit={(e) => postComment(e)}>
                    <input type="text" placeholder='Leave a comment' value={comment}
                      onChange={e => setComment(e.target.value)}
                    />
                    <button>
                      <FaArrowLeft />
                    </button>
                  </form>
                </section>
              </>
            }
          </>
          :
          <IsOffline />
        }
      </main>

      {windowWidth < 650 &&
        <div className="article-page-overlay" role={'button'}
          style={{ transform: `scale( ${showCommentForm ? '100%' : '0%'})` }}
          onClick={() => {
            setShowCommentForm(false)
          }}
      ></div>
      }

    </>
  )
}

export default ArticlePage