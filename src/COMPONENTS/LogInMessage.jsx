import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaAngleLeft } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'
import { appContext } from '../App'

const LogInMessage = () => {
  const { darkMode } = useContext(appContext)
  const [articlePage, setArticlePage] = useState(false)
  const ref = useRef()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/login' ||
      location.pathname === '/create-account' ||
      location.pathname === '/set-password' 

    ) {
      ref.current.classList.add('hide-login')
    } else {
      ref.current.classList.remove('hide-login')
    }

    if (location.pathname.includes('articles')) {
      setArticlePage(true)

    } else {
      setArticlePage(false)
    }
  }, [location])



  return (
    <div ref={ref} className='log-in-message'>
      <p></p>
      {articlePage && 
        <Link to={location.state?.from ? location.state?.from : '/'}
          style={{
            backgroundColor: 'transparent', position: 'absolute', left: '-10px',
            color: darkMode ? 'white' : 'black'
          }}
          className='log-in-back-link'
        >
          <FaAngleLeft /> back
        </Link>
      }
      <div>
        <a
          href={`
          /login?type=sign-in&from=${location.pathname}`
          }
        >
          Log In 
        </a>
        
        <a
          href={`
          /login?type=sign-up&from=${location.pathname}`
          }
        >
          Sign Up
      </a>
      </div>
    </div>
  )
}

export default LogInMessage