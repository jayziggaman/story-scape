import React, { useContext, useEffect, useRef, useState } from 'react'
import pfpIcon from '../img-icons/camera-icon.jpg'
import { appContext } from '../App'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { articlesRef, db, storage } from '../firebase/config'
import { addDoc, deleteDoc, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore'


const NewBlog = () => {
  const {showNewForm, setShowNewForm, imgTypes, setShowPopup, setPopup, userAuth, time, user, setProcessing} = useContext(appContext)

  const [finalStage, setFinalStage] = useState(false)
  const [article, setArticle] = useState('')
  const [image, setImage] = useState(null)
  const [articleCategory, setArticleCategory] = useState('')
  const [articleTitle, setArticleTitle] = useState('')
  const [articleThumbnail, setArticleThumbnail] = useState(null)
  const [isPublic, setIsPublic] = useState(true)

  const overlay = useRef()

  const pickRefs = useRef([])
  const pickRef = el => pickRefs.current.push(el)

  let uploadId = ''



  useEffect(() => {
    if (showNewForm) {
      if (image && imgTypes.includes(image.type)) {
        const imgRef = ref(storage, `pending-article-thumbnail/${userAuth}/${new Date().getTime()}`)
        uploadBytes(imgRef, image).then(() => {
          getDownloadURL(imgRef).then(url => {
            setArticleThumbnail(url)
          })
        })
  
      } else {
        setShowPopup(true)
        setPopup({
          type: 'bad', message: `Please select an appropriate file type`
        })
      }
    }
  }, [image])


  useEffect(() => {
    if (showNewForm) {
      overlay.current.classList.add('show-new-form')
    } else {
      overlay.current.classList.remove('show-new-form')
      setArticle('')
      setArticleCategory('')
      setArticleTitle('')
      setArticleThumbnail(null)
      setImage(null)
      setFinalStage(false)
    }
  }, [showNewForm])
  


  const cancelUpload = (articleId) => {
    const ref = doc(db, 'articles', articleId)
    deleteDoc(ref)
  }
  

  const createNewBlog = e => {
    e.preventDefault()

    const newArticle = {
      title: articleTitle,
      category: articleCategory,
      thumbnail: articleThumbnail,
      body: article,
      isPublic,
      creator: userAuth,
      createdAt: serverTimestamp(),
      likes: { value: [] },
      comments: { value: [] },
      date: `${time.day}-${time.month}-${time.year}`,
      deleted: false
    }

    if (!articleThumbnail) {
      setShowPopup(true)
      setPopup({
        type: 'bad', message: `Please select a thumbnail for your article.`
      })

    } else if (article.length < 100) {
      setShowPopup(true)
      setPopup({
        type: 'bad', message: `Your article needs to be longer. At least 100 characters.`
      })

    } else if (articleTitle.length < 5) {
      setShowPopup(true)
      setPopup({
        type: 'bad', message: `Your title needs to be longer. At least 5 characters.`
      })

    } else if (articleCategory === '') {
      setShowPopup(true)
      setPopup({
        type: 'bad', message: `Please select a category for your article.`
      })

    } else {
      setProcessing(true)
      addDoc(articlesRef, newArticle).then(docRef => {
        uploadId = docRef.id
        
        const userRef = doc(db, 'users', userAuth)
        
        updateDoc(userRef, {
          articles: {
            value: [...user.articles.value, uploadId]
          }
        }).catch(() => {
          cancelUpload(uploadId)

        }).finally(() => {
          setProcessing(false)
        })

      }).then(() => {
        setShowNewForm(false)
        setShowPopup(true)
        setPopup({
          type: 'good', message: `Article posted successfully.`
        })

      }).catch(() => {
        cancelUpload(uploadId)
        setShowPopup(true)
        setPopup({
          type: 'bad', message: `Couldn't complete upload. Please try again.`
        })

      }).finally(() => {
        setProcessing(false)
      })
    }
  }


  
  function change(e) {
    const type = e.currentTarget.value

    if (type === 'public') {
      setIsPublic(true)

    } else if (type === 'private') {
      setIsPublic(false)
    }
  }



  return (
    <div className='new-blog-overlay' ref={overlay}>
      <form className="new-blog-form">
        
        {finalStage ? 
          <div className="new-blog-form-content final">

            <label htmlFor="blog-type">
              <span>
                Make article private ? 
              </span>

              <span>
                <input required type="radio" name='blog-type' ref={pickRef}
                  onChange={e => change(e)} value='private'
                /> Yes
              </span>

              <span>
                <input required type="radio" name='blog-type' ref={pickRef}
                  onChange={e => change(e)} value='public'
                /> No
              </span>
              
            </label>

            <label htmlFor="blog-category">
              Pick a category for your article
              <select required name="blog-category" id="blog-category"
                value={articleCategory}
                onChange={e => setArticleCategory(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Business">Business</option>
                <option value="Comedy">Comedy</option>
                <option value="Crypto">Crypto</option>
                <option value="Education">Education</option>
                <option value="Fashion">Fashion</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Music">Music</option>
                <option value="Nature">Nature</option>
                <option value="News">News</option>
                <option value="Sports">Sports</option>
                <option value="Tech">Tech</option>
              </select>
            </label>

            <label htmlFor="blog-thumbnail">
              <p>Pick a thumbnail for your article</p>
              <span
                style={{
                  maxHeight:
                    (window.innerHeight / 2) > 250 ? (window.innerHeight / 2.1) :
                      250
                }}
              >
                <img src={articleThumbnail ? articleThumbnail : pfpIcon} alt=""
                  className={articleThumbnail ? 'with-thumbnail' : ''}
                />
              </span>
              <b>{articleThumbnail?.name}</b>
              <input type="file" name='blog-thumbnail'
                id='blog-thumbnail' onClick={e => e.target.value = null}
                onChange={e => setImage(e.target.files[0])} 
              />
            </label>

          </div>
          :
          <div className="new-blog-form-content">
            <label htmlFor="blog-body">
              <textarea required placeholder='Write your article' name="blog-body" id="blog-body" cols="30" rows="10"
                onChange={e => setArticle(e.target.value)} value={article}
              ></textarea>
            </label>

            <label htmlFor="blog-title">
              <input required type="text" name='blog-title' value={articleTitle}
                placeholder='Article title' maxLength='60'
                onChange={e => setArticleTitle(e.target.value)} 
              />
            </label>
          </div>
        }

        <div className="new-blog-form-cancel-send">
          {finalStage ?
            <div role={'button'} onClick={() => setFinalStage(false)}>
              Back
            </div>
            :
            <div onClick={() => setShowNewForm(false)}>
              Cancel
            </div>
          }

          {finalStage ?
            <button onClick={e => createNewBlog(e)} >
              Post
            </button>
            :
            <button onClick={e => setFinalStage(true)} >
              Next
            </button>
          }
        </div>
      </form>
    </div>
  )
}

export default NewBlog