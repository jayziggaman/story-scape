import { doc, updateDoc } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { FaThumbtack, FaRegHeart } from 'react-icons/fa'
import { appContext } from '../App'
import { db } from '../firebase/config'

const ArticleComment = ({
  comment, setOptionsCoord, setShowCommentOptions, showCommentOptions
}) => {
  const { users, userAuth, articleInView, user, darkMode, dmUserIcon, lmUserIcon } = useContext(appContext)
  const [commentCreator, setCommentCreator] = useState()
  const [showFullComment, setShowFullComment] = useState(false)


  useEffect(() => {
    setCommentCreator(users.find(user => user.id === comment.creator))
  })

  function toggleCommentOptions(e) {
    setShowCommentOptions(!showCommentOptions)
    const btn = e.currentTarget
    const coord = btn.getBoundingClientRect()
    setOptionsCoord({
      id: btn.id,
      x: coord.x,
      y: window.innerHeight - coord.y < 150 ? window.innerHeight - 150 : coord.y
    })
  }



  const likeComment = (e) => {
    if (user) {
      const id = e.currentTarget.id

      const docRef = doc(db, 'articles', articleInView.id)

      let comments = articleInView.comments.value

      const commentIndex = comments.findIndex(comment => comment.id === id)

      const condition = comments[commentIndex].likes.value.find(like => like === userAuth)

      if (condition) {
        comments[commentIndex].likes.value = comments[commentIndex].likes.value.filter(like => like !== userAuth)

      } else {
        comments[commentIndex].likes.value = [...comments[commentIndex].likes.value, userAuth]
      }


      updateDoc(docRef, {
        comments: {
          value: [...comments]
        }
      })
    }
  }



  return (
    <div className="article-comment">
      <div className="article-comment-img-div">
        {darkMode ?
          <img src={commentCreator?.avatar || dmUserIcon} alt="" />
          :
          <img src={commentCreator?.avatar || lmUserIcon} alt="" />
        }
      </div>

      <pre onClick={() => setShowFullComment(!showFullComment)}>
        {comment.body.length > 100 ?
          <>
            {showFullComment ?
              <>
                {comment.body}
              </>
              :
              <>
                {comment.body.slice(0, 100)}... <b>more</b>
              </>
            }
          </>
          :
          <>
            {comment.body}
          </>
        }
      </pre>

      <span className='pin-span'>
        {comment.pinned && <FaThumbtack />}

        <span role={'button'} onClick={(e) => likeComment(e)} id={comment.id}
          className={comment.likes.value.includes(userAuth) ? 'liked' : ''}
          style={{ marginTop: comment.pinned ? '25px' : '0px' }}>
          <FaRegHeart />
        </span>
      </span>

      <button className="article-comment-options-div opt" id={comment.id}
        onClick={(e) => user && toggleCommentOptions(e)}
      >
        <span className='opt'></span>
        <span className='opt'></span>
        <span className='opt'></span>
      </button>
    </div>
  )
}

export default ArticleComment