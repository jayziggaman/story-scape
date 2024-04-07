import { doc, updateDoc } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { appContext } from '../App'
import { db } from '../firebase/config'

const ArticleCommentOptions = () => {
  const { userAuth, articleInView, subscribeToUser, unSubscribeToUser, users, setPopup, setShowPopup, optionsCoord, showCommentOptions, setShowCommentOptions } = useContext(appContext)

  const [isSubscribed, setIsSubscribed] = useState(false)
  const [comment, setComment] = useState()
  const [creator, setCreator] = useState()
  const { id } = optionsCoord


  useEffect(() => {
    setComment(articleInView?.comments.value.find(comment => comment.id === id))
  }, [id, articleInView])


  useEffect(() => {
    if (comment) {
      setCreator(users.find(user => user.id === comment.creator))
    }
  }, [users, comment])
  

  useEffect(() => {
    if (creator) {
      setIsSubscribed(creator.subscribers.value.includes(userAuth))
    }
  }, [creator, userAuth])


  const pinComment = () => {
    const docRef = doc(db, 'articles', articleInView.id)

    let comments = articleInView.comments.value.filter(comment => comment.id !== id)
    comments.forEach(comment => comment.pinned = false)

    comments.sort((a, b) => b.createdAt - a.createdAt)

    const updatedComment = {
      ...comment, pinned: true
    }
    comments = [updatedComment, ...comments]

    updateDoc(docRef, {
      comments: {
        value: [...comments]
      }
    }).catch(() => {
      comments.forEach(comment => comment.pinned = false)

      updateDoc(docRef, {
        comments: {
          value: [...comments]
        }
      })

      setShowPopup(true)
      setPopup({
        type: 'bad',
        message: `Couldn't pin comment. Please try again`
      })
    })
  }


  const unPinComment = () => {
    const docRef = doc(db, 'articles', articleInView.id)

    let comments = articleInView.comments.value.filter(comment => comment.id !== id)
    comments.forEach(comment => comment.pinned = false)

    comments.sort((a, b) => b.createdAt - a.createdAt)

    const updatedComment = {
      ...comment, pinned: false
    }
    comments = [updatedComment, ...comments]

    updateDoc(docRef, {
      comments: {
        value: [...comments]
      }
    }).catch(() => {
      const updatedComment = {
        ...comment, pinned: false
      }

      updateDoc(docRef, {
        comments: {
          value: [updatedComment, ...comments]
        }
      })

      setShowPopup(true)
      setPopup({
        type: 'bad',
        message: `Couldn't pin comment. Please try again`
      })
    })
  }



  const deleteComment = () => {
    const docRef = doc(db, 'articles', articleInView.id)

    const comment = comments.find(comment => comment.id === id)

    let comments = articleInView.comments.value.filter(comment => comment.id !== id)

    updateDoc(docRef, {
      comments: {
        value: [...comments]
      }

    }).catch(() => {
      updateDoc(docRef, {
        comments: {
          value: [...comments, comment]
        }
      })

      setShowPopup(true)
      setPopup({
        type: 'bad',
        message: `Couldn't delete comment. Please try again`
      })
    })
  }


  // const replyComment = () => {
  //   e.preventDefault()
  //   const id = uuidv4()

  //   const newReply = {
  //     id,
  //     body: comment,
  //     creator: userAuth,
  //     pinned: false,
  //     createdAt: Timestamp.now().seconds,
  //     likes: { value: [] },
  //     replies: { value: [] },
  //     date: `${time.day} / ${time.month} / ${time.year}`
  //   }

  //   const articleRef = doc(db, 'articles', articleId)
  //   updateDoc(articleRef, {
  //     comments: {
  //       value: [...articleInView.comments.value, newComment]
  //     }
  //   }).then(() => {
  //     setShowCommentForm(false)
  //     setShowPopup(true)
  //     setPopup({
  //       type: 'good', message: `Comment posted successfully.`
  //     })

  //   }).catch(() => {
  //     // setShowCommentForm(false)
  //     cancelUpload(articleId, id)
  //     setShowPopup(true)
  //     setPopup({
  //       type: 'bad', message: `Couldn't post comment. Please try again.`
  //     })
  //   })
  // }

  useEffect(() => {
    if (comment, articleInView) {
      const buttons = document.querySelectorAll('.opt button')
      
      buttons.forEach(button => {
        button.addEventListener('click', setShowCommentOptions(false))
      })
    }

    return () => {
      if (comment, articleInView) {
        const buttons = document.querySelectorAll('.opt button')

        buttons.forEach(button => {
          button.removeEventListener('click', setShowCommentOptions(false))
        })
      }
    }
  }, [comment, articleInView, isSubscribed])


  
  return (
    <div className="article-comment-options opt"
      style={{
        opacity: showCommentOptions ? '1' : '0',
        zIndex: showCommentOptions ? '100' : '-10',
        top: optionsCoord.y + 20,
        left: (optionsCoord.x - 270) > 0 ? (optionsCoord.x - 270) : 20,
      }}
    >
      <div className='opt'>
        {comment?.pinned ?
          <>
            {articleInView?.creator === userAuth &&
              <button onClick={() => unPinComment()}>
                Unpin comment
              </button>
            }
          </>
          :
          <>
            {articleInView?.creator === userAuth &&
              <button onClick={() => pinComment()}>
                Pin comment
              </button>
            }
          </>
        }

        {/* <button onClick={() => replyComment()}>
          Reply comment
        </button> */}

        {!isSubscribed && comment?.creator !== userAuth &&
          <button onClick={() => subscribeToUser(creator)}>
            Subscribe to user
          </button>
        }

        {isSubscribed &&
          <button className='red' onClick={() => unSubscribeToUser(creator)}>
            Unsubscribe from this user
          </button>
        }

        {comment?.creator === userAuth &&
          <button className='red' onClick={() => deleteComment()}>
            Delete comment
          </button>
        }
      </div>
    </div>
  )
}

export default ArticleCommentOptions