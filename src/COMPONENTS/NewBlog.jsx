import React, { useContext, useEffect, useRef, useState } from 'react'
import pfpIcon from '../img-icons/camera-icon.jpg'
import { appContext } from '../App'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { articlesRef, db, storage } from '../firebase/config'
import { addDoc, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { useSwipeable } from 'react-swipeable';


const NewBlog = () => {
  const { showNewForm, setShowNewForm, imgTypes, vidTypes, setShowPopup, setPopup, userAuth, time, user, setProcessing, isOnline } = useContext(appContext)

  const [thumbnailProcessing, setThumbnailProcessing] = useState(false)
  const [files, setFiles] = useState(null)
  const [fileLength, setFileLength] = useState(0)
  const [index, setIndex] = useState(1)

  const [processingIndex, setProcessingIndex] = useState(0)
  const spans = document.querySelectorAll('.thumbnail-processing span')

  const [finalStage, setFinalStage] = useState(false)
  const [article, setArticle] = useState('')
  const [articleCategory, setArticleCategory] = useState('')
  const [articleTitle, setArticleTitle] = useState('')
  const [articleThumbnail, setArticleThumbnail] = useState(null)
  const [articleThumbnails, setArticleThumbnails] = useState([])
  const [isPublic, setIsPublic] = useState(true)

  const overlay = useRef()

  const pickRefs = useRef([])
  const pickRef = el => pickRefs.current.push(el)

  let uploadId = ''



  function startProcessing() {
    setThumbnailProcessing(true)
  }


  useEffect(() => {
    if (files) {
      setFileLength(prev => (prev - prev) + files.length)
      
    } else {
      setIndex(prev => (prev - prev) + 1)
      setFileLength(prev => prev - prev)
    }
  }, [files])


  useEffect(() => {
    if (fileLength === 0) {
      return

    } else if (fileLength === 1) {
      const thumbnail = files[0]

      const condition = imgTypes.includes(thumbnail.type) 
      if (condition) {
        startProcessing()
        const imgRef = ref(storage, `pending-article-thumbnail/${userAuth}/${new Date().getTime()}`)
        uploadBytes(imgRef, thumbnail).then(() => {
          getDownloadURL(imgRef).then(url => {
            setArticleThumbnail(url)
          })
        })

      } else {
        setShowPopup(true)
        setPopup({
          type: 'bad', message: `Please select an appropriate file type.`
        })
      }

    } else if (fileLength === 2) {
      const condition = [...files].map(file => imgTypes.includes(file.type) || vidTypes.includes(file.type))

      const thumbnailArr = []
      if (condition) {
        const imgExists = [...files].find(file => imgTypes.includes(file.type))
        
        if (imgExists) {
          if (condition) {
            startProcessing()
          }

          [...files].map(file => {
            let mediaUrl
            const imgRef = ref(storage, `pending-article-thumbnail/${userAuth}/${file.name}`)
            uploadBytes(imgRef, file).then(() => {
              getDownloadURL(imgRef).then(url => {
                mediaUrl = url
  
              }).then(() => {
                if (vidTypes.includes(file.type)) {
                  const video = document.createElement('video')
                  video.src = mediaUrl
  
                  video.addEventListener('loadedmetadata', () => {
                    // Access the duration property once metadata is loaded
                    const duration = video.duration;
  
                    // Log the duration in seconds
                    // console.log(`Video Duration: ${duration} seconds`);
            
                    // Convert duration to a more readable format (HH:MM:SS)
                    // const hours = Math.floor(duration / 3600);
                    // const minutes = Math.floor((duration % 3600) / 60);
                    // const seconds = Math.floor(duration % 60);
            
                    // console.log(`Formatted Duration: ${hours}h ${minutes}m ${seconds}s`);
  
                    if (duration > 15 || duration === 0) {
                      setThumbnailProcessing(false)
                      setFiles(null)
                      setShowPopup(true)
                      setPopup({
                        type: 'bad', message: `Your video has to be at least 1s and not more than 15s.`
                      })
    
                    } else {
                      thumbnailArr.push({
                        type: 'vid',
                        url: mediaUrl
                      })
                      setArticleThumbnails([...thumbnailArr])
                    }
  
                  });
  
                } else if (imgTypes.includes(file.type)) {
                  thumbnailArr.push({
                    type: 'img',
                    url: mediaUrl
                  })
                  setArticleThumbnails([...thumbnailArr])
                }
              })
            })
          })

        } else {
          setFiles(null)
          setShowPopup(true)
          setPopup({
            type: 'bad', message: `You must select at least one image as a thumbnail.`
          })
        }

      } else {
        setShowPopup(true)
        setPopup({
          type: 'bad', message: `Please select an appropriate file type.`
        })
      }
    } else {
      setFiles(null)
      setShowPopup(true)
      setPopup({
        type: 'bad', message: `You can't select more than two files.`
      })
    }
  }, [fileLength])


  useEffect(() => {
    if (articleThumbnails.length === fileLength) {
      setThumbnailProcessing(false)
    }
  }, [articleThumbnails])



  useEffect(() => {
    if (showNewForm) {
      overlay.current.classList.add('show-new-form')
    } else {
      overlay.current.classList.remove('show-new-form')
      setArticle('')
      setArticleCategory('')
      setArticleTitle('')
      setArticleThumbnail(null)
      setFiles(null)
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
      thumbnails: articleThumbnails,
      body: article,
      isPublic,
      creator: userAuth,
      createdAt: serverTimestamp(),
      likes: { value: [] },
      comments: { value: [] },
      date: `${time.day}-${time.month}-${time.year}`,
      deleted: false
    }

    if (isOnline) {
      if (!articleThumbnail && articleThumbnails === []) {
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

    } else {
      setShowPopup(true)
      setPopup({
        type: 'bad', message: `Oops! Looks like there is no internet connection. Please try again.`
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
  

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (index === fileLength) {
        return
          
      } else {
        setIndex(index => index + 1)
      }
    } ,

    onSwipedRight: () => {
      if (index === 1) {
        return

      } else {
        setIndex(index => index - 1)
      }
    },
  });


  useEffect(() => {
    const interval = setInterval(() => {
      if (processingIndex === 2) {
        setProcessingIndex(processingIndex => processingIndex - processingIndex)

      } else {
        setProcessingIndex(processingIndex => processingIndex + 1)
      }
    }, 500);

    return () => {
      clearInterval(interval)
    }
  }, [processingIndex])


  useEffect(() => {
    spans.forEach((span, i) => {
      if (i === processingIndex) {
        span.classList.add('active')

      } else {
        span.classList.remove('active')
      }
    })
  }, [processingIndex])



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
                <option value="Entertainment">Entertainment</option>
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
              <span>*Must include at least one image. max 2 files.</span>

              <div {...handlers}
                style={{
                  // maxHeight:
                  //   (window.innerHeight / 2) > 250 ? (window.innerHeight / 2.1) :
                  //     250
                  border: articleThumbnail && 'none'
                }}
              >
                
                {fileLength < 2 &&
                  <img src={articleThumbnail ? articleThumbnail : pfpIcon} alt=""
                  className={articleThumbnail ? 'with-thumbnail' : ''}
                  style={{
                    height: !articleThumbnail && '70px',
                    width: !articleThumbnail && '70px',
                    borderRadius: !articleThumbnail && '35px',
                    position: !articleThumbnail && 'static',
                    
                  }}
                  />
                }
                {fileLength > 1 && 
                  <>
                    {thumbnailProcessing ?
                      <div className="thumbnail-processing">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      :
                      <>
                        <span>
                          {index} / {fileLength}
                        </span>
                        
                        <button 
                          onClick={() => {
                            if (index === 1) {
                              return

                            } else {
                              setIndex(index => index - 1)
                            }
                          }}
                        >
                          <FaAngleLeft />
                        </button>
                        
                        {articleThumbnails.map((thumbnail, ind) => {
                          const { url, type } = thumbnail
                          
                          return (
                            <div key={ind}
                              style={{
                                transform: `scale(${index === (ind + 1) ? '100%' : '0%'})`,
                                position: index === (ind + 1) ? 'static' : 'absolute'
                              }}
                            >
                              {type === 'img' &&
                                <img src={url} alt="" className='with-thumbnail'/>
                              }

                              {type === 'vid' &&
                                <video src={url} controls className='with-thumbnail'></video>
                              }
                            </div>
                          )
                        })}
                        
                        <button
                          onClick={() => {
                            if (index === fileLength) {
                                return
                                
                            } else {
                              setIndex(index => index + 1)
                            }
                          }}
                        >
                          <FaAngleRight />
                        </button>
                      </>
                    }
                  </>
                }
              </div>
              <input type="file" name='blog-thumbnail' multiple='multiple'
                id='blog-thumbnail' onClick={e => e.target.value = null}
                onChange={e => setFiles(e.target.files)} 
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