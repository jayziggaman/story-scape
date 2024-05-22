import React, { useContext, useEffect, useState } from 'react'
import { appContext } from '../App'
import {v4 as uuidv4} from 'uuid';
import { collection, deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const CreateCollection = () => {
  const { userAuth, time, setShowPopup, setPopup, createCollection, setCreateCollection, deletedCollections, userCollections, quickAddToCollection, setQuickAddToCollection, feed, optionInfo, isOnline } = useContext(appContext)
  const [collectionName, setCollectionName] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [articleToAdd, setArticleToAdd] = useState()


  useEffect(() => {
    if (quickAddToCollection) {
      const article = feed.find(article => article.id === optionInfo.current.id)

      const { id, thumbnail } = article
      
      setArticleToAdd({ id, thumbnail })
      
    } else {
      setArticleToAdd(null)
    }
  }, [quickAddToCollection])
  

  const cancelUpload = (collectionId) => {
    const ref = doc(db, 'users', userAuth, 'collections', collectionId)
    deleteDoc(ref)
  }

  const createNewCollection = (e) => {
    e.preventDefault()
    if (isOnline) {
      setCreateCollection(false)

      const condition = userCollections.find(collection => collection.name === collectionName)

      const conditionII = deletedCollections.find(collection => collection.name === collectionName)

      if (conditionII) {
        setShowPopup(true) 
        setPopup({
          type: 'bad', message: `A collection already exists with this name. Profile > Settings`
        })
        
      } else {
        if (condition) {
          setShowPopup(true) 
          setPopup({
            type: 'bad', message: `A collection already exists with this name.`
          })
    
        } else {
          const collectionId = uuidv4()
    
          const newCollection = {
            id: collectionId,
            name: collectionName,
            isPublic,
            items: { value: articleToAdd ? [articleToAdd] : [] },
            createdAt: serverTimestamp(),
            creator: userAuth,
            date: `${time.day} / ${time.month} / ${time.year}`,
            deleted: false
          }
      
          const collectionRef = collection(db, 'users', userAuth, 'collections')
          setDoc(doc(collectionRef, collectionId), newCollection).then(() => {
            setQuickAddToCollection(false)
            setShowPopup(true) 
            setPopup({
              type: 'good', message: `Collection created successfully.`
            })
      
          }).catch(() => {
            setQuickAddToCollection(false)
            cancelUpload(collectionId)
            setShowPopup(true) 
            setPopup({
              type: 'bad', message: `Couldn't create collection. Please try again.`
            })
          })
        }
      }

    } else {
      setShowPopup(true)
      setPopup({
        type: 'bad', message: `Oops! Looks like there is no internet connection. Please try again.`
      })
    }
    
  }


  const closeClick = e => {
    const name = e.target.nodeName

    if (name === 'INPUT' ||
      name === 'FORM' ||
      name === 'LABEL' ||
      name === 'BUTTON'
    ) {
      return
    } else {
      setCreateCollection(false)
    }
  }

  
  return (
    <section className="create-collection" role={'button'}
      style={{ transform: createCollection ? 'scale(100%)' : 'scale(0%)' }}
      onClick={e => closeClick(e)}
    >
      <form action='submit' onSubmit={e => createNewCollection(e)}>
        <label htmlFor="collection-name">
          Collection name :
          <input type="text" name='collection-name'
            id='collection-name' value={collectionName}
            onChange={e => setCollectionName(e.target.value)}
          />
        </label>

        Make collection available to the public ?
        <label htmlFor="collection-type">
          <input type="radio" name="collection-type"
            onChange={e => {
              if (e.target.value === 'on') {
                setIsPublic(true)
              }
            }} 
          /> Public

          <br />

          
          <input type="radio" name="collection-type"
            onChange={e => {
              if (e.target.value === 'on') {
                setIsPublic(false)
              }
            }} 
          /> Private
        </label>


        <button>
          Create collection
        </button>
      </form>
    </section>
  )
}

export default CreateCollection