import {  deleteDoc, doc, updateDoc } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { appContext } from '../App'
import { db } from '../firebase/config'

const Options = () => {
  const { options, viewOptions, optionInfo, userAuth, users,
    setShowAddToCollectionForm, setPopup, setShowPopup, changeUserDeletedStatus, subscribeToUser, unSubscribeToUser, feed, collections, makeArticlePrivate, makeArticlePublic, deletedArticles, removeFromCollection, setCollectionType, profileOptionsInfo, isOnline } = useContext(appContext)
  const { id, type, creator, collectionId } = optionInfo.current

  const [creatorAccount, setCreatorAccount] = useState()
  const [isSubscribed, setIsSubscribed] = useState(false)

  const [thisArticle, setThisArticle] = useState()
  const [thisCollection, setThisCollection] = useState()

  const navigate = useNavigate()


  useEffect(() => {
    if (users) {
      setCreatorAccount(users.find(user => user.id === creator))
    }
  }, [users, creator])


  useEffect(() => {
    if (creatorAccount) {
      const condition = creatorAccount.subscribers.value.find(sub => sub.id === userAuth)

      if (!condition) {
        setIsSubscribed(false)
      } else {
        setIsSubscribed(true)
      }
    }
  }, [creatorAccount, userAuth])


  useEffect(() => {
    if (collections) {
      if (type === 'article' || type === 'in-collection') {
        setThisArticle(feed.find(article => article.id === id))
        setThisCollection(collections.find(collection => collection.id === collectionId))
  
      } else if (type === 'collection') {
        setThisCollection(collections.find(collection => collection.id === id))
  
      } else if (type === 'deleted') {
        setThisArticle(deletedArticles.find(article => article.id === id))
      }
    }
  }, [feed, collections, id, type])


  const deleteArticle = () => {
    if (isOnline) {
      const docRef = doc(db, 'articles', id)
      updateDoc(docRef, {
        deleted: true

      }).then(() => {
        setShowPopup(true)
        setPopup({
          type: 'good',
          message: `Article deleted successfully.`
        })
        
      }).then(() => {
        changeUserDeletedStatus()

      }).catch(() => {
        const docRef = doc(db, 'articles', id)
        updateDoc(docRef, {
          deleted: false

        }).then(() => {
          setShowPopup(true)
          setPopup({
            type: 'bad',
            message: `Couldn't delete article. Please try again`
          })
        })
      })

    } else {
      setShowPopup(true)
      setPopup({
        type: 'bad', message: `Oops! Looks like there is no internet connection. Please try again.`
      })
    }
  }


  const deleteCollection = () => {
    if (isOnline) {
      const ref = doc(db, 'users', userAuth, 'collections', id)
      updateDoc(ref, {
        deleted: true

      }).then(() => {
        setShowPopup(true)
        setPopup({
          type: 'good',
          message: `Collection deleted successfully.`
        })
        
      }).then(() => {
        changeUserDeletedStatus()

      }).catch(() => {
        const ref = doc(db, 'users', userAuth, 'collections', id)

        updateDoc(ref, {
          deleted: false

        }).then(() => {
          setShowPopup(true)
          setPopup({
            type: 'bad',
            message: `Couldn't delete collection. Please try again`
          })
        })
      })

    } else {
      setShowPopup(true)
      setPopup({
        type: 'bad', message: `Oops! Looks like there is no internet connection. Please try again.`
      })
    }
  }


  const recoverArticle = () => {
    if (isOnline) {
      const docRef = doc(db, 'articles', id)
      updateDoc(docRef, {
        deleted: false

      }).then(() => {
        setShowPopup(true)
        setPopup({
          type: 'good',
          message: `Article recovered successfully.`
        })
        
      }).catch(() => {
        const docRef = doc(db, 'articles', id)
        updateDoc(docRef, {
          deleted: true

        }).then(() => {
          setShowPopup(true)
          setPopup({
            type: 'bad',
            message: `Couldn't recover article. Please try again`
          })
        })
      })

    } else {
      setShowPopup(true)
      setPopup({
        type: 'bad', message: `Oops! Looks like there is no internet connection. Please try again.`
      })
    }
  }
  

  const deleteArticlePermanently = () => {
    if (isOnline) {
      const docRef = doc(db, 'articles', id)
      deleteDoc(docRef).then(() => {
        setShowPopup(true)
        setPopup({
          type: 'good',
          message: `Article deleted permanently.`
        })
      })

    } else {
      setShowPopup(true)
      setPopup({
        type: 'bad', message: `Oops! Looks like there is no internet connection. Please try again.`
      })
    }
  }


  const deleteCollectionPermanently = () => {
    if (isOnline) {
      const ref = doc(db, 'users', userAuth, 'collections', id)
      updateDoc(ref, {
        deleted: true

      }).then(() => {
        setShowPopup(true)
        setPopup({
          type: 'good',
          message: `Collection deleted successfully.`
        })
        
      }).then(() => {
        changeUserDeletedStatus()

      }).catch(() => {
        const ref = doc(db, 'users', userAuth, 'collections', id)

        updateDoc(ref, {
          deleted: false

        }).then(() => {
          setShowPopup(true)
          setPopup({
            type: 'bad',
            message: `Couldn't delete collection. Please try again`
          })
        })
    })

    } else {
      setShowPopup(true)
      setPopup({
        type: 'bad', message: `Oops! Looks like there is no internet connection. Please try again.`
      })
    }
  }
  

  const recoverCollection = () => {
    if (isOnline) {
      const ref = doc(db, 'users', userAuth, 'collections', id)
      updateDoc(ref, {
        deleted: false
  
      }).then(() => {
        setShowPopup(true)
        setPopup({
          type: 'good',
          message: `Collection recovered successfully.`
        })
        
      }).catch(() => {
        const ref = doc(db, 'users', userAuth, 'collections', id)
  
        updateDoc(ref, {
          deleted: true
  
        }).then(() => {
          setShowPopup(true)
          setPopup({
            type: 'bad',
            message: `Couldn't recover collection. Please try again`
          })
        })
      })

    } else {
      setShowPopup(true)
      setPopup({
        type: 'bad', message: `Oops! Looks like there is no internet connection. Please try again.`
      })
    }
  }
  

  return (
    <div className="options opt" 
      style={{
        display: viewOptions ? 'block' : 'none',
        left: (options.x - 250) > 0 ? (options.x - 250) : 20,
        top: options.y + 20
      }}
    >
      <div>
        {type === 'article' &&
          <>
            <button onClick={() => {
              setShowAddToCollectionForm(true)
              setCollectionType('add')
            }}>
              Add to collection
            </button>
            <>
              {creator === userAuth &&
                <>
                {thisArticle?.isPublic ?
                  <button onClick={() => makeArticlePrivate(id)}>
                    Make private
                  </button>
                  :
                  <button onClick={() => makeArticlePublic(id)}>
                    Make public
                  </button>
                  }
                  <button className='red' onClick={() => deleteArticle()}>
                    Delete {type}
                  </button>
                </>
              }
          </>
          {creator !== userAuth &&
            <>
              {isSubscribed ?
              <button className='red'
                onClick={() => unSubscribeToUser(creatorAccount)}
              >
                Unsubscribe from this account
              </button>
              :
              <button onClick={() => subscribeToUser(creatorAccount)}>
                Subscribe to account {creator}
              </button>
              }
            </>
          }
            </>
        }

        {type === 'deleted' &&
          <>
            <button onClick={() => recoverArticle()}>
              Recover article
            </button> 

            <button className='red'
              onClick={() => deleteArticlePermanently()}
            >
              Delete article permanently
            </button> 
          </>
        }


        {type === 'collection' &&
          <>
            {creator === userAuth &&
              <>
                
                {thisCollection?.deleted ?
                  <>
                    <button onClick={() => recoverCollection()}>
                      Recover this collection
                    </button>
                  
                    <button className='red'
                      onClick={() => deleteCollectionPermanently()}
                    >
                      Delete {type} permanently
                    </button>
                  </>
                  :
                  <>
                    <button>
                      Edit collection
                    </button>
                    <button className='red' onClick={() => deleteCollection()}>
                      Delete {type} 
                    </button>
                  </>
                }
              </>
            }
          </>
        }


        {type === 'in-collection' &&
          <>
            <button onClick={() => {
              removeFromCollection(thisCollection, id)
            }}>
              Remove from collection
            </button>
            {thisArticle?.creator === userAuth &&
              <button className='red' onClick={() => deleteArticle()}>
                Delete article
              </button>
            }
          </>
        }

        {profileOptionsInfo.current?.type === 'profile' &&
          <>
            <button 
              onClick={() => {
                navigate(`${profileOptionsInfo.current.user.userName}`)
              }}
            >
              View profile
            </button>
            
            {profileOptionsInfo.current?.user.id !== userAuth &&
              <>
                {profileOptionsInfo.current?.user?.subscribers?.value
                  .find(id => id === userAuth) ?
                  <button className='red' onClick={() => unSubscribeToUser(profileOptionsInfo.current.user)}>
                    Unsbscribe to user
                  </button>
                  :
                  <button
                    onClick={() => subscribeToUser(profileOptionsInfo.current.user)}
                  >
                    Subscribe to user
                  </button>
                }
              </>
            }
          </>
        }
      </div>
    </div>
  )
}

export default Options