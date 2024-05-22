import { doc, getDoc, updateDoc } from 'firebase/firestore'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { appContext } from '../App'
import { db } from '../firebase/config'

const AddToCollectionForm = () => {
  const { showAddToCollectionForm, setShowAddToCollectionForm, userCollections, setCreateCollection, userAuth, setShowPopup, setPopup, optionInfo, setQuickAddToCollection, user, collectionType, articleInView, removeFromCollection, isOnline } = useContext(appContext)

  const [collections, setCollections] = useState([])
  const [displayCollections, setDisplayCollections] = useState([])

  useEffect(() => {
    if (articleInView && userCollections) {
      const arr = []
      userCollections.map(collection => {
        const condition = collection.items.value.find(article => article.id === articleInView.id)

        if (condition) {
          arr.push(collection)
        }
      })

      setDisplayCollections([...arr])
    }
  }, [articleInView, userCollections])


  const inputRefs = useRef([])
  const inputRef = el => inputRefs.current.push(el)

  useEffect(() => {
    if (!showAddToCollectionForm) {
      setQuickAddToCollection(false)
      setCollections([])
      inputRefs.current.forEach(input => {
        if (input) {
          input.checked = false
        }
      })
    }
  }, [showAddToCollectionForm])


  const inputChange = (e) => {
    const condition = e.currentTarget.checked
    const value = e.currentTarget.value
    if (condition && (collections.indexOf(value) < 0)) {
      setCollections([...collections, value])

    } else {
      const arr = collections.filter(collection => collection !== value)
      setCollections([...arr])
    }
  }


  function createNewCollection() {
    setCreateCollection(true)
    setShowAddToCollectionForm(false)
    setQuickAddToCollection(true)
  }
  

  function finish(id) {
    const userRef = doc(db, 'users', userAuth)
    
    updateDoc(userRef, {
      collections: {
        value: [...user.collections.value, id]
      }
    })

    setShowAddToCollectionForm(false)
    setShowPopup(true) 
    setPopup({
      type: 'good', message: `Successfully added to your collection.`
    })
  }
  

  const addToCollection = (e) => {
    e.preventDefault()

    if (isOnline) {
      collections.forEach(collection => {

        const collectionRef = doc(db, 'users', userAuth, 'collections', collection)
  
        getDoc(collectionRef).then(doc => {
          const collectionData = doc.data()
  
          const arr = collectionData.items.value
  
          const {id, thumbnail} = optionInfo.current
  
          const condition = arr.find(item => item.id === id)
  
          if (!condition) {
            updateDoc(collectionRef, {
              items: {
                value: [...arr, {id, thumbnail}]
              }
            }).then(() => {
              finish(id)
    
            }).catch(() => {
              setShowPopup(true) 
              setPopup({
                type: 'bad', message: `Couldn't add to collection. Please try again.`
              })
            })
  
          } else {
            if (collection.length === 1) {
              // setShowPopup(true) 
              // setPopup({
              //   type: 'bad', message: `This article has already been added to the collection.`
              // })
            }
          }
        }).catch(() => {
          setShowPopup(true) 
          setPopup({
            type: 'bad', message: `Couldn't add to collection. Please try again.`
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


  const unaddFromCollection = e => {
    e.preventDefault()

    if (isOnline) {
      collections.map(col => {
        const collection = userCollections.find(item => item.id === col)
        removeFromCollection(collection, articleInView.id)
      })

    } else {
      setShowPopup(true)
      setPopup({
        type: 'bad', message: `Oops! Looks like there is no internet connection. Please try again.`
      })
    }
  }


  const closeClick = e => {
    const name = e.target.nodeName
    if (name === 'INPUT' || name === 'P' || name === 'DIV') {
      return
    } else {
      setShowAddToCollectionForm(false)
    }
  }

  
  return (
    <section className="add-to-collection"
      style={{
        transform: showAddToCollectionForm ? 'scale(100%)' : 'scale(0%)'
      }}
      onClick={e => closeClick(e)}
    >
      <form action='submit' onSubmit={e => {
        collectionType === 'add' ? addToCollection(e) :
          collectionType === 'remove' && unaddFromCollection(e)
      }}>
        {collectionType === 'add' &&
          <p>
            Articles already in collections won't be re added
          </p>
        }
        <header>
          <h3>
          {collectionType === 'add' ?
            `Save article to a collection` :
          collectionType === 'remove' &&
            `Remove articles from collection(s)`
          }
            
          </h3>

          <button>
            Finish
          </button>
        </header>

        <div>
          {collectionType === 'add' &&
            <div className='new-collection-btn'
              onClick={() => createNewCollection()}
            >
              <span>
                <span></span>
                <span></span>
              </span>

              <span>
                Create a new collection
              </span>
            </div>
          }

          <label htmlFor="add-to">
            {collectionType === 'add' ?
              <>
                {userCollections?.map(collection => {
                  return (
                    <div key={collection?.id}>
                      <input type="checkbox" name='add-to' ref={inputRef}
                        value={collection?.id} onChange={e => inputChange(e)}
                      />
                      <p>
                        {collection?.name}
                      </p>
                    </div>
                  )
                })}
              </>
              :
              collectionType === 'remove' &&
              <>
                {displayCollections?.map(collection => {
                  return (
                    <div key={collection?.id}>
                      <input type="checkbox" name='add-to' ref={inputRef}
                        value={collection?.id} onChange={e => inputChange(e)}
                      />
                      <p>
                        {collection?.name}
                      </p>
                    </div>
                  )
                })}
              </>
            }
          </label>
        </div>
      </form>
    </section>
  )
}

export default AddToCollectionForm