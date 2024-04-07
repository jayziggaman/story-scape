import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { appContext } from '../App'
import { auth } from '../firebase/config'

const SetPassword = () => {
  const { windowWidth, hideFeatures, undoHide, root, darkMode, uploadPassword, setPopup, setShowPopup, userAuth } = useContext(appContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const [from, setFrom] = useState()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [samePassword, setSamePassword] = useState(false)
  const [goodPassword, setGoodPassword] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    searchParams.get('from') ? setFrom(searchParams.get('from')) : setFrom('/')
  }, [location])


  useEffect(() => {
    hideFeatures()

    return () => {
      undoHide()
    }
  }, [location, windowWidth])


  useEffect(() => {
    root.style.backgroundColor = 'white'

    
    return () => {
      if (darkMode) {
        root.style.backgroundColor = 'black'
      } else {
        root.style.backgroundColor = 'white'
      }
    }
  }, [darkMode])


  useEffect(() => {
    if (confirmPassword === password) {
      setSamePassword(true)
    } else {
      setSamePassword(false)
    }
    

    if (password.length > 7) {
      setGoodPassword(true)
    } else {
      setGoodPassword(false)
    }
  }, [password, confirmPassword])
  

  const submitPassword = e => {
    e.preventDefault()
    if (goodPassword && samePassword) {
      const userId = auth.currentUser.uid

      uploadPassword(password, userId || userAuth)
      navigate(`/create-account?from=${from ? from : '/'}`)

    } else {
      if (!goodPassword) {
        setShowPopup(true)
        setPopup({
          type: 'bad', message: `Your password is not strong enough.`
        })
      } else if (!samePassword) {
        setShowPopup(true)
        setPopup({
          type: 'bad', message: `The two passwords have to match.`
        })
      } 
    }
  }
  



  return (
    <main className="set-password-main"
      style={{
        backgroundColor: 'white', marginTop: '0px', height: '100vh'
      }}
    >
      <form action="submit" onSubmit={e => submitPassword(e)}>
        <h3>
          Set a strong password for your account
        </h3>


        <label htmlFor="password">
          Enter your password
          <input type="password" value={password} required
            onChange={e => setPassword(e.target.value)}
          />
          {!goodPassword && password.length !== 0 &&
            <p>Password must be at least 8 characters long</p>
          }
        </label>

        
        <label htmlFor="c-password"
          style={{
            transform: `translateY(
            ${!goodPassword && password.length !== 0 ? '20px' : '0px'}
          )`}}
        >
          Confirm your password
          <input type="password" value={confirmPassword} required
            onChange={e => setConfirmPassword(e.target.value)}
          />
          {!samePassword && confirmPassword.length !== 0 && password.length !== 0 &&
            <p>Both passwords have to match</p>
          }
        </label>


        <button>
          Continue
        </button>
      </form>
    </main>
  )
}

export default SetPassword