import { collection, doc, getDoc, onSnapshot, query, setDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import dmSettingsIcon from './img-icons/dm-settings-icon.jpg'
import dmUserIcon from './img-icons/user-icon.jpg'
import lmSettingsIcon from './img-icons/lm-settings-icon.jpg'
import lmUserIcon from './img-icons/lm-user-icon.jpg'
import AddToCollectionForm from './COMPONENTS/AddToCollectionForm'
import CreateCollection from './COMPONENTS/CreateCollection'
import Footer from './COMPONENTS/Footer'
import LogInMessage from './COMPONENTS/LogInMessage'
import Nav from './COMPONENTS/Nav'
import NewBlog from './COMPONENTS/NewBlog'
import Options from './COMPONENTS/Options'
import Popup from './COMPONENTS/Popup'
import { articlesRef, auth, db, usersRef } from './firebase/config'
import ArticlePage from './PAGES/ArticlePage'
import CollectionPage from './PAGES/CollectionPage'
import CreateAccount from './PAGES/CreateAccount'
import DeletedArticles from './PAGES/DeletedArticles'
import DeletedCollections from './PAGES/DeletedCollections'
import Discover from './PAGES/Discover'
import Edit from './PAGES/Edit'
import Home from './PAGES/Home'
import LogIn from './PAGES/LogIn'
import Profile from './PAGES/Profile'
import SavedArticles from './PAGES/SavedArticles'
import Settings from './PAGES/Settings'
import ArticleCommentOptions from './COMPONENTS/ArticleCommentOptions'
import LogOutForm from './COMPONENTS/LogOutForm'
import DeleteAcctForm from './COMPONENTS/DeleteAcctForm'
import SetPassword from './PAGES/SetPassword'
import SearchProfile from './PAGES/SearchProfile'
import { onAuthStateChanged } from 'firebase/auth'
import Processing from './COMPONENTS/Processing'
import SearchCollectionPage from './PAGES/SearchCollectionPage'
import unavailable from '../src/images/unavailable.jpg'

export const appContext = React.createContext()

const App = () => {
  if (!localStorage.getItem('story-scape-user-auth') ||
  localStorage.getItem('story-scape-user-auth')  === 'm1Rs8YypXHYxEpIpI2uZnyWsLkR2'
  ) {
    // localStorage.removeItem('story-scape-user-auth')
    // localStorage.removeItem('story-scape-sign-in-method')
  }
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userAuth, setUserAuth] = useState(
    JSON.parse(localStorage.getItem('story-scape-user-auth')) || null
  )
  const [users, setUsers] = useState()
  const [user, setUser] = useState()
  const [currUser, setCurrUser] = useState()
  const [articles, setArticles] = useState()
  const [feed, setFeed] = useState()
  const [deletedArticles, setDeletedArticles] = useState()
  const [myDeletedArticles, setMyDeletedArticles] = useState()
  const [showNewForm, setShowNewForm] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [popup, setPopup] = useState({
    type: 'good',
    message: ``
  })
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [options, setOptions] = useState({
    x: 0,
    y: 0
  })
  const [viewOptions, setViewOptions] = useState(false)
  const [showCommentOptions, setShowCommentOptions] = useState(false)
  const [optionsCoord, setOptionsCoord] = useState({
    id: '',
    x: 0,
    y: 0
  })

  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem('story-scape-recent-searches')) ||
    []
  )
  const [profileRecentSearches, setProfileRecentSearches] = useState(
    JSON.parse(localStorage.getItem('story-scape-profile-recent-searches')) || []
  )
  const [isArticleView, setIsArticleView] = useState(false)
  const [articleInView, setArticleInView] = useState()
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem('story-scape-dark-mode')) ?
    JSON.parse(localStorage.getItem('story-scape-dark-mode')) : false
  )

  const [createCollection, setCreateCollection] = useState(false)
  const [showAddToCollectionForm, setShowAddToCollectionForm] = useState(false)
  const [collectionType, setCollectionType] = useState('')
  const [quickAddToCollection, setQuickAddToCollection] = useState(false)

  const [userArticles, setUserArticles] = useState()
  const [collections, setCollections] = useState()
  const [userCollections, setUserCollections] = useState()
  const [deletedCollections, setDeletedCollections] = useState()
  const [collectionArticles, setCollectionArticles] = useState()

  const [showLogOut, setShowLogOut] = useState(false) 
  const [showDeleteForm, setShowDeleteForm] = useState(false) 

  const appRef = useRef()
  const footerRef = useRef()
  const navRef = useRef()
  const location = useLocation()
  const navigate = useNavigate()

  const root = document.getElementById('root')

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  
  const [imgTypes, setImgTypes] = useState(['image/png', 'image/jpeg', 'image/jpg'])
  const [vidTypes, setVidTypes] = useState(['video/mp4', 'video/mov', 'video/quicktime', 'video/wmv'])



  const uploadPassword = (password, userId) => {
    const userRef = collection(db, 'users', userId, 'encrypted')
    setDoc(doc(userRef, userId), {
      value: password
    })
  }


  const setAuthMethod = (method) => {
    if (
      localStorage.setItem('story-scape-sign-in-method', JSON.stringify(method))
    ) {
      return  
    } else {
      localStorage.setItem('story-scape-sign-in-method', JSON.stringify(method))
    }
  }

    
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (auth.currentUser) {
        localStorage.setItem('story-scape-user-auth', JSON.stringify(auth.currentUser.uid))
      } 
    })

    return () => {
      unsubscribe()
    }
  }, [])


  function createUser(method, userId) {
    const newUser = {
      id: '',
      avatar: '',
      firstName : '',
      lastName : '',
      userName : '',
      bio : '',
      dob : '',

      articles: '',
      collections: '',
      savedArticles: '',
      areCollectionsPrivate: '',
      areArticlesPrivate: '',
      
      likes: '',
      subscribers: '',
      notifications: '',

      userSince: '',
      hasDeleted: '',
      deleted: '',

      createdWith: method
    }

    setDoc(doc(usersRef, userId), newUser).then(() => {
      const userRef = doc(db, 'users', userId)

      updateDoc(userRef, {
        id: ''
      })
    })
  }
  

  const checkForId = (userId, from, method) => {
    const passwordRef = doc(db, 'users', userId, 'encrypted', userId)
    const userRef = doc(db, 'users', userId)

    getDoc(passwordRef).then(doc => {

      const password = doc.data()

      if (password) {
        getDoc(userRef).then(doc => {
          const user = doc.data()

          if (user.userName !== '') {
            navigate(from ? from : '/')

          } else {
            setAuthMethod(method)
            createUser(method, userId)
            navigate(`/create-account?from=${from}`)
          }
        })

      } else {
        setAuthMethod(method)
        createUser(method, userId)
        navigate(`/set-password?from=${from}`)
      }
    })
  }


  function changeUserDeletedStatus() {
    if (user) {
      if (user.deleted) {
        return
  
      } else {
        const userRef = doc(db, 'users', userAuth)
  
        updateDoc(userRef, {
          hasDeleted: true
        })
      }
    }
  }


  const subscribeToUser = (creator) => {
    const { id, userName } = creator
    if (user && id !== userAuth) {
      const thisUser = users.find(user => user.id === id)
      const userRef = doc(db, 'users', id)

      updateDoc(userRef, {
        subscribers: {
          value: [...thisUser.subscribers.value, userAuth]
        }
      }).then(() => {
        setShowPopup(true)
        setPopup({
          type: 'good',
          message: `You have successfully subscribed to ${userName}.`
        })
        
      }).catch(() => {
        const userRef = doc(db, 'users', id)

        updateDoc(userRef, {
          subscribers: {
            value: [...thisUser.subscribers.value.filter(sub => sub !== userAuth)]
          }

        }).then(() => {
          setShowPopup(true)
          setPopup({
            type: 'bad',
            message: `Couldn't subscribe to ${userName}. Please try again`
          })
        })
      })
    }
  }


  const unSubscribeToUser = (creator) => {
    const { id, userName } = creator
    if (user && id !== userAuth) {
      const thisUser = users.find(user => user.id === id)
      const userRef = doc(db, 'users', id)

      updateDoc(userRef, {
        subscribers: {
          value: [...thisUser.subscribers.value.filter(sub => sub !== userAuth)]
        }
      }).then(() => {
        setShowPopup(true)
        setPopup({
          type: 'good',
          message: `You have successfully unsubscribed from ${userName}.`
        })
        
      }).catch(() => {
        const userRef = doc(db, 'users', id)

        updateDoc(userRef, {
          subscribers: {
            value: [...thisUser.subscribers.value, userAuth]
          }

        }).then(() => {
          setShowPopup(true)
          setPopup({
            type: 'bad',
            message: `Couldn't unsubscribe to ${userName}. Please try again`
          })
        })
      })
    }
  }


  const makeArticlePrivate = (id) => {
    if (user) {
      const docRef = doc(db, 'articles', id)

      updateDoc(docRef, {
        isPublic: false

      }).then(() => {
        setShowPopup(true)
        setPopup({
          type: 'good',
          message: `Article is now private.`
        })

      }).catch(() => {
        const docRef = doc(db, 'articles', id)
        updateDoc(docRef, {
          isPublic: true
        }).then(() => {
          setShowPopup(true)
          setPopup({
            type: 'bad',
            message: `Couldn't make article private. Please try again.`
          })
        })
      })
    }
  }


  const makeArticlePublic = (id) => {
    if (user) {
      const docRef = doc(db, 'articles', id)

      updateDoc(docRef, {
        isPublic: true

      }).then(() => {
        setShowPopup(true)
        setPopup({
          type: 'good',
          message: `Article is now public.`
        })
        
      }).catch(() => {
        const docRef = doc(db, 'articles', id)
        updateDoc(docRef, {
          isPublic: false
        }).then(() => {
          setShowPopup(true)
          setPopup({
            type: 'bad',
            message: `Couldn't make article public. Please try again.`
          })
        })
      })
    }
  }


  function finish(id) {
    const userRef = doc(db, 'users', userAuth)
    
    updateDoc(userRef, {
      collections: {
        value: [...user.collections.value.filter(item => item !== id)]
      }
    })

    setShowAddToCollectionForm(false)
  }


  const removeFromCollection = (collection, articleId) => {
    const docRef = doc(db, 'users', userAuth, 'collections', collection?.id)

    updateDoc(docRef, {
      items: {
        value: collection?.items.value.filter(item => item.id !== articleId)
      }
    }).then(() => {
      finish(articleId)
      setShowPopup(true)
      setPopup({
        type: 'good',
        message: `Article removed from collection.`
      })

    }).catch(() => {
      updateDoc(docRef, {
        items: {
          value: [...collection?.items.value, articleId]
        }
      }).then(() => {
        setShowPopup(true)
        setPopup({
          type: 'bad',
          message: `Couldn't remove article from collection. Please try again`
        })
      })
    })
  }


  useEffect(() => {
    if (showDeleteForm) {
      setShowLogOut(false)
    }

    if (showLogOut) {
      setShowDeleteForm(false)
    }
  }, [showDeleteForm, showLogOut])


  useEffect(() => {
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', scroll)

    let usersSnap
    let articleSnap

    const userRef = query(usersRef)
    usersSnap = onSnapshot(userRef, snap => {
      let tempUsers = []
      snap.docs.forEach(doc => {
        tempUsers.push({...doc.data(), id: doc.id})
      })
      setUsers(tempUsers)
    })

    const articleRef = query(articlesRef)
    articleSnap = onSnapshot(articleRef, snap => {
      let tempArticles = []
      snap.docs.forEach(doc => {
        tempArticles.push({...doc.data(), id: doc.id})
      })
      const art = tempArticles.filter(article => article.deleted !== true)
      setArticles(art)

      const deleted = tempArticles.filter(article => article.deleted === true)
      setDeletedArticles(deleted)
    })

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', scroll)

      usersSnap()
      articleSnap()
    }
  }, [])


  useEffect(() => {
    if (isOnline) {
      if (users) {
        setUser(users.find(user => user.id === userAuth))
      }
      
      if (users && feed) {
        setLoading(false)
      }

    } else {
      setLoading(false)
    }
  }, [users, userAuth, feed, isOnline])


  useEffect(() => {
    if (user?.userName) {
      setLoggedIn(true)

    } else {
      setLoggedIn(false)
    }
  }, [user])


  useEffect(() => {
    let collectionSnap

    if (user && userAuth) {
      const collectionRef = collection(db, 'users', userAuth, 'collections')
      collectionSnap = onSnapshot(collectionRef, snap => {
        let tempCollections = []
        snap.docs.forEach(doc => {
          tempCollections.push({...doc.data(), id: doc.id})
        })
        setCollections([...tempCollections])

        const col = tempCollections.filter(col => col.deleted === false)
        setUserCollections(col)

        const delCol = tempCollections.filter(col => col.deleted === true)
        setDeletedCollections(delCol)
      })
    }

    return () => {
      if (user) {
        collectionSnap()
      }
    }
  }, [user, userAuth])


  useEffect(() => {
    if (articles && users) {
      const arr = []
      articles.map(article => {
        const creator = users.find(user => user.id === article.creator)

        if (!creator.areArticlesPrivate && article.isPublic) {
          arr.push(article)
        }
      })
      setFeed([...arr])
    }
  }, [articles, users])




  const time =  {
    day: new Date().getDate(),
    month: months[new Date().getMonth()],
    year: new Date().getFullYear()
  }


  let optionInfo = useRef({
    id: '', thumbnail: '', creator: '', type: '', isDeleted: false, collectionId: ''
  })
  let profileOptionsInfo = useRef({
    user: {}, type: ''
  })
  const accessOptions = (e, id, thumbnail, type, creator, isDeleted, collectionId) => {
    if (user) {
      const yCoord = e.target.getBoundingClientRect().y
      setViewOptions(true)
      setOptions({
        x : e.target.getBoundingClientRect().x,
        y : window.innerHeight - yCoord < 150 ? window.innerHeight - 150 : yCoord
      })
      optionInfo.current.id = id
      optionInfo.current.thumbnail = thumbnail
      optionInfo.current.creator = creator
      optionInfo.current.type = type
      optionInfo.current.isDeleted = isDeleted
      optionInfo.current.collectionId = collectionId
    }
  }


  useEffect(() => {
    let interval
    if (showPopup) {
      interval = setInterval(() => {
        setShowPopup(false)
      }, 4000);
    }

    return () => {
      clearInterval(interval)
    }
  }, [showPopup])


  useEffect(() => {
    if (!options) {
      profileOptionsInfo.current = {user: {}, type: ''}
    }
  }, [options])


  const resize = () => {
    setViewOptions(false)
    setShowCommentOptions(false)
    setWindowWidth(window.innerWidth)
  }


  const scroll = () => {
    setViewOptions(false)
    setShowCommentOptions(false)
  }


  const initialRender = useRef(true)
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      localStorage.setItem('story-scape-dark-mode', JSON.stringify(darkMode))
    }
  }, [darkMode])


  useEffect(() => {
    if (isOnline) {
      const main = document.querySelector('main')
    
      if (main) {
        if (main.classList.contains('login-main') ||
        main.classList.contains('set-password-main') ||
          main.classList.contains('create-account-main'))
        {
          main.style.marginTop = '0px'
          if (location.pathname !== '/create-account') {
            main.style.backgroundColor = 'white'
          }
          
        } else {
          if (loading) {
            main.id = 'loading'

          } else {
            main.id = ''

            if (!loggedIn) {
              main.style.marginTop = '50px'

            } else {
              main.style.marginTop = '0px'
              main.style.minHeight = '100vh'
            } 
          }
        }
      }
    }
  }, [user, location, loading, loggedIn, isOnline])


  function appFtn(e) {
    if (viewOptions) {
      if (e.target.classList.contains('opt')) {
        return
      } else {
        setViewOptions(false)
      }
    }
  }


  const hideFeatures = () => {
    if (appRef.current) {
      appRef.current.style.display = 'block'
    }

    if (footerRef.current) {
      footerRef.current.style.display = 'none'
    }

    if (navRef.current) {
      navRef.current.style.display = 'none'
    }
  }


  const undoHide = () => {
    if (footerRef.current) {
      footerRef.current.style.display = 'flex'
    }

    if (navRef.current) {
      navRef.current.style.display = 'block'
    }
    
    if (appRef.current) {
      appRef.current.style.display = 'grid'
    }
  }


  useEffect(() => {
    if (darkMode) {
      root.style.backgroundColor = 'black'
    } else {
      root.style.backgroundColor = 'white'
    }
  }, [darkMode])


  return (
    <div className={darkMode ? "App dm" : "App"} ref={appRef}
      role={'button'} onClick={e => appFtn(e)}
    >
      <appContext.Provider
        value={{
          showNewForm, setShowNewForm, windowWidth, options, accessOptions, viewOptions, setViewOptions, recentSearches, setRecentSearches, darkMode, setDarkMode, isArticleView, setIsArticleView, articleInView, setArticleInView, userAuth, setUserAuth, navRef, footerRef, showPopup, setShowPopup, popup, setPopup, users, time, imgTypes, vidTypes, user, setUser, articles, userArticles, setUserArticles, userCollections, setUserCollections, showAddToCollectionForm, setShowAddToCollectionForm, createCollection, setCreateCollection, optionInfo, collectionArticles, setCollectionArticles, appRef, hideFeatures, undoHide, setAuthMethod, checkForId, loading, changeUserDeletedStatus, subscribeToUser, unSubscribeToUser, makeArticlePrivate, makeArticlePublic, deletedArticles, myDeletedArticles, setMyDeletedArticles, deletedCollections, collections, quickAddToCollection, setQuickAddToCollection, showCommentOptions, setShowCommentOptions, dmUserIcon, lmUserIcon, dmSettingsIcon, lmSettingsIcon, optionsCoord, setOptionsCoord, showLogOut, setShowLogOut, showDeleteForm, setShowDeleteForm, uploadPassword, root, createUser, collectionType, setCollectionType, removeFromCollection, feed, currUser, setCurrUser, profileRecentSearches, setProfileRecentSearches, setOptions, profileOptionsInfo, loggedIn, processing, setProcessing, isOnline, unavailable
        }}
      >
        {windowWidth < 600 ? <Footer /> : <Nav />}

        <div
          style={{backgroundColor: location.pathname === '/create-account' && 'transparent'}}
        >
          {!loading && !loggedIn && isOnline && <LogInMessage />}

          <Popup />
          <NewBlog />
          <Routes>
            <Route exact path='/login' element={<LogIn />} />
            <Route exact path='/set-password' element={<SetPassword />} />
            <Route exact path='/create-account' element={<CreateAccount />} />
            <Route exact path='/' element={<Home />} />
            <Route exact path='/:profileUserName' element={<SearchProfile />} />
            <Route exact path='/articles/:articleId' element={<ArticlePage />} />
            <Route exact path='/discover' element={<Discover />} />
            <Route exact path='/profile' element={<Profile />} />
            <Route exact path='/profile/:collectionId' element={<CollectionPage />} />
            <Route exact path='/:profileUserName/:collectionId' element={<SearchCollectionPage />} />
            <Route exact path='/settings' element={<Settings />} />
            <Route exact path='/settings/edit' element={<Edit />} />
            <Route exact path='/settings/deleted-articles'
              element={<DeletedArticles />} />
              <Route exact path='/settings/deleted-collections'
                element={<DeletedCollections />} />
            <Route exact path='/settings/saved-articles'
              element={<SavedArticles />} />
          </Routes>
          <CreateCollection />
          <Options />
          <ArticleCommentOptions />
          <AddToCollectionForm />
          <LogOutForm />
          <DeleteAcctForm />
          <Processing />
        </div>
      </appContext.Provider>
    </div>
  )
}

export default App