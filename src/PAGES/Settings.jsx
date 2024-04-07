import { getRedirectResult, signInWithRedirect } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import React, { useContext, useEffect, useRef, useState } from 'react'
import {FaAngleRight} from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'
import { appContext } from '../App'
import { auth, db, facebookProvider, githubProvider, googleProvider } from '../firebase/config'

const Settings = () => {
  const { darkMode, setDarkMode, user, setShowDeleteForm, setShowLogOut, userAuth, setPopup, setShowPopup } = useContext(appContext) 
  const [articlesArePrivate, setArticlesArePrivate] = useState(
    JSON.parse(localStorage.getItem('story-scape-articles-private')) ?
    JSON.parse(localStorage.getItem('story-scape-articles-private')) : false
  )
  const [collectionsArePrivate, setCollectionsArePrivate] = useState(
    JSON.parse(localStorage.getItem('story-scape-collections-private')) ?
    JSON.parse(localStorage.getItem('story-scape-collections-private')) : false
  )

  const toggleRefs = useRef([])
  const toggleRef = el => toggleRefs.current.push(el)

  const location = useLocation()

  useEffect(() => {
    const click = (e) => {
      e.currentTarget.classList.toggle('active')
    }

    toggleRefs.current.forEach(toggle => {
      if (toggle) {
        toggle.addEventListener('click', e => click(e))
      }
    })

    return () => {
      toggleRefs.current.forEach(toggle => {
        if (toggle) {
          toggle.removeEventListener('click', e => click(e))
        }
      })
    }
  }, [])


  const articlesRef = useRef(true)
  useEffect(() => {
    if (articlesRef.current) {
      articlesRef.current = false

    } else {
      const userRef = doc(db, 'users', userAuth)

      if (articlesArePrivate) {
        updateDoc(userRef, {
          areArticlesPrivate: true

        }).then(() => {
          setShowPopup(true)
          setPopup({
            type: 'good',
            message: `Articles are now private.`
          })

        }).catch(() => {
          updateDoc(userRef, {
            areArticlesPrivate: false
          })

          setShowPopup(true)
          setPopup({
            type: 'bad',
            message: `Could not make articles private. Please try again.`
          })
        })

      } else {
        updateDoc(userRef, {
          areArticlesPrivate: false

        }).then(() => {
          setShowPopup(true)
          setPopup({
            type: 'good',
            message: `Articles are now public.`
          })

        }).catch(() => {
          updateDoc(userRef, {
            areArticlesPrivate: true
          })

          setShowPopup(true)
          setPopup({
            type: 'bad',
            message: `Could not make articles public. Please try again.`
          })
        })
      }

      localStorage.setItem('story-scape-articles-private', JSON.stringify(articlesArePrivate))
    }
  }, [articlesArePrivate])


  const colRef = useRef(true)
  useEffect(() => {
    if (colRef.current) {
      colRef.current = false

    } else {
      const userRef = doc(db, 'users', userAuth)

      if (collectionsArePrivate) {
        updateDoc(userRef, {
          areCollectionsPrivate: true

        }).then(() => {
          setShowPopup(true)
          setPopup({
            type: 'good',
            message: `Collections are now private.`
          })

        }).catch(() => {
          updateDoc(userRef, {
            areCollectionsPrivate: false
          })

          setShowPopup(true)
          setPopup({
            type: 'bad',
            message: `Could not make collections private. Please try again.`
          })
        })

      } else {
        updateDoc(userRef, {
          areCollectionsPrivate: false

        }).then(() => {
          setShowPopup(true)
          setPopup({
            type: 'good',
            message: `Collections are now public.`
          })

        }).catch(() => {
          updateDoc(userRef, {
            areCollectionsPrivate: true
          })

          setShowPopup(true)
          setPopup({
            type: 'bad',
            message: `Could not make collections public. Please try again.`
          })
        })
      }

      localStorage.setItem('story-scape-collections-private', JSON.stringify(collectionsArePrivate))
    }
  }, [collectionsArePrivate])

  useEffect(() => {
    getRedirectResult(auth).then(result => {
      if (result) {
        setShowDeleteForm(true)
      }
      
    }).catch(() => {
      setShowPopup(true)
      setPopup({
        type: 'bad',
        message: `An error occured. Please try again.`
      })
    })
  }, [])
  

  return (
    <main className="settings-main">
      <header>
        <h2>Settings</h2>
      </header>

      <section className="settings">

        <div>
          <div>
            <p>Make collections Private</p>
            <span>
              All collections you have created won't be seen by anyone except you.
            </span>
          </div>

          <span ref={user && toggleRef}
            className={collectionsArePrivate ? 'active toggle' : 'toggle'}
            onClick={e => setCollectionsArePrivate(!collectionsArePrivate)}
          >
            <span>
              <span></span>
            </span>
          </span>
        </div>


        <div>
          <div>
            <p>Make articles Private</p>
            <span>
              All articles you have written won't be seen by anyone except you.
            </span>
          </div>

          <span ref={user && toggleRef}
            className={articlesArePrivate ? 'active toggle' : 'toggle'}
            onClick={e => setArticlesArePrivate(!articlesArePrivate)}
          >
            <span>
              <span></span>
            </span>
          </span>
        </div>

        
        <div>
          <div>
            <p>Dark Mode</p>
          </div>
          <span ref={toggleRef}
            className={darkMode ? 'active toggle' : 'toggle'}
            onClick={e => setDarkMode(!darkMode)}
          >
            <span>
              <span></span>
            </span>
          </span>
        </div>


        <Link to={user ? 'edit' : `/login?type=sign-in&from=${location.pathname}`}>
          <div>
            <p>Edit Profile</p>
            <span>
              Change the things about your account that you don't like anymore.
            </span>
          </div>
          <span className='arrow'>
            <FaAngleRight />
          </span>
        </Link>


        <a href={user ? '/settings/deleted-articles' : `/login?type=sign-in&from=${location.pathname}`}>
          <div>
            <p>Deleted articles</p>
            <span>
              View your recently deleted articles.
            </span>
          </div>
          <span className='arrow'>
            <FaAngleRight />
          </span>
        </a>


        <a href={user ? '/settings/deleted-collections' : `/login?type=sign-in&from=${location.pathname}`}>
          <div>
            <p>Deleted collections</p>
            <span>
              View your recently deleted collections.
            </span>
          </div>
          <span className='arrow'>
            <FaAngleRight />
          </span>
        </a>


        {user &&
          <>
            <div role={'button'} onClick={() => setShowLogOut(true)} className='btn-div'>
              <div>
                <p>Log out</p>
                <span>
                  If you log out you will be asked to put in your password to log in again. 
                </span>
              </div>
            </div>
              

            <div role={'button'} className='btn-div'
              onClick={() => {
                if (user.createdWith === 'email') {
                  setShowDeleteForm(true)

                } else if (user.createdWith === 'google.com') {
                  signInWithRedirect(auth, googleProvider)

                } else if (user.createdWith === 'facebook.com') {
                  signInWithRedirect(auth, facebookProvider)

                } else if (user.createdWith === 'github.com') {
                  signInWithRedirect(auth, githubProvider)

                }
              }}
            >
              <div>
                <p>Delete account</p>
                <span>
                  Your account will be permanently deleted. You will have to create a new account.
                </span>
              </div>
            </div>
          </>
        }

        
      </section>
    </main>
  )
}

export default Settings