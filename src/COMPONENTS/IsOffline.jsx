import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaAngleLeft } from 'react-icons/fa'
import { appContext } from '../App'

import storyScapeLogo from '../images/story-scape-logo.jpg'

const IsOffline = () => {
  const location  = useLocation()
  const { isOnline } = useContext(appContext)
  const [articlePage, setArticlePage] = useState(false)

  useEffect(() => {
    if (location.pathname.includes('articles')) {
      setArticlePage(true)

    } else {
      setArticlePage(false)
    }
  }, [location])

  
  if (articlePage) {
    return (
      <section className="is-offline-article-page">
        <header>
          <Link to={location.state?.from ? location.state?.from : '/'}>
            <FaAngleLeft />
          </Link>
          <img src={storyScapeLogo} alt="" />
          <h1>Story Scape</h1>
        </header>
  
        <b>
          Oops...
        </b>
        
        <p>
          Looks like your connection is poor
        </p>
  
        <button onClick={() => window.location.reload()}>
          Reload page
        </button>
      </section>
    )

  } else {
    return (
      <section className="is-offline"
        style={{
          height: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '50px'
        }}
      >
        <header
          style={{
            marginTop: '0px',
            position: 'fixed',
            top: '0',
            right: '0',
            paddingLeft: '20px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img src={storyScapeLogo} alt="" />
          <h1>Story Scape</h1>
        </header>
  
        <b style={{
            fontSize: '2rem',
            marginBottom: '20px'
          }}
        >
          Oops...
        </b>
        
        <p>
          Looks like your connection is poor
        </p>
  
        <button onClick={() => window.location.reload()}
          style={{
            height: '45px',
            width: '200px',
            borderRadius: '30px',
            border: 'none',
            marginTop: '100px',
            marginBottom: '50px'
          }}
        >
          Reload page
        </button>
      </section>
    )
  }
}

export default IsOffline