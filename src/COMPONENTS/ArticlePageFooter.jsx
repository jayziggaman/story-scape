import { doc, updateDoc } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { FaBookmark, FaRegHeart, FaHeart, FaRegComment, FaRegBookmark } from 'react-icons/fa'
import { appContext } from '../App'
import { db } from '../firebase/config'

const ArticlePageFooter = ({ setShowCommentForm, article }) => {
  const { userAuth, setPopup, setShowPopup, user, setShowAddToCollectionForm, optionInfo, setCollectionType, loggedIn } = useContext(appContext)
  const [hasLiked, setHasLiked] = useState(false)
  const [hasSaved, setHasSaved] = useState(false)

  useEffect(() => {
    const cond = article.likes.value.find(user => user === userAuth)

    if (cond) {
      setHasLiked(true)
    } else {
      setHasLiked(false)
    }

    if (loggedIn) {
      const condII = user.collections.value.find(col => col === article.id)
      
      if (condII) {
        setHasSaved(true)
      } else {
        setHasSaved(false)
      }
    }
  }, [article, userAuth, user])


  
  const likeArticle = (id) => {
    if (user) {
      const docRef = doc(db, 'articles', id)
  
      updateDoc(docRef, {
        likes: {
          value: [...article.likes.value, userAuth]
        }
        
      }).catch(() => {
        const docRef = doc(db, 'articles', id)
      
        updateDoc(docRef, {
          likes: {
            value: article.likes.value.filter(user => user !== userAuth)
          }
        }).then(() => {
          setShowPopup(true)
          setPopup({
            type: 'bad', message: `Couldn't complete request. PLease try again.`
          })
        })  
      })
    }
  }


  const unLikeArticle = (id) => {
    if (user) {
      const docRef = doc(db, 'articles', id)
  
      updateDoc(docRef, {
        likes: {
          value: article.likes.value.filter(user => user !== userAuth)
        }
        
      }).catch(() => {
        const docRef = doc(db, 'articles', id)
      
        updateDoc(docRef, {
          likes: {
            value: [...article.likes.value, userAuth]
          }
        }).then(() => {
          setShowPopup(true)
          setPopup({
            type: 'bad', message: `Couldn't complete request. PLease try again.`
          })
        })  
      })
    }
  }


  const saveArticle = (article) => {
    if (user) {

      const { id, thumbnail, creator, deleted } = article
    
      optionInfo.current.id = id
      optionInfo.current.thumbnail = thumbnail
      optionInfo.current.creator = creator
      optionInfo.current.type = 'article'
      optionInfo.current.isDeleted = deleted
      setShowAddToCollectionForm(true)
      setCollectionType('add')
    }
  }


  const unSaveArticle = () => {
    setCollectionType('remove')
    setShowAddToCollectionForm(true)
  }



  return (
    <footer className='form'>

      <div>
        <div>
          {hasLiked ?
            <button className='liked' onClick={() => unLikeArticle(article.id)}>
              <FaRegHeart />
            </button>
            :
            <button onClick={() => likeArticle(article.id)}>
              <FaRegHeart />
            </button>
          }

          <span className={hasLiked ? 'liked' : ''}>
            {article.likes.value.length}
          </span>
        </div>

        
        <div>
          <button onClick={() => setShowCommentForm(true)}>
            <FaRegComment />
          </button>

          <span>
            {article.comments.value.length}
          </span>
        </div>

        
        <div>
          {hasSaved ?
            <button onClick={() => unSaveArticle()}>
              <FaBookmark />
            </button>
            :
            <button onClick={() => saveArticle(article)}>
              <FaRegBookmark />
            </button>
          }
        </div>
      </div>
    </footer>
  )
}

export default ArticlePageFooter