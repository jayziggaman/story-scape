import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const LogInMessage = () => {
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
  }, [location])



  return (
    <div ref={ref} className='log-in-message'>
      <p>
        {/* Click here to Log In or Sign Up */}
      </p>
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