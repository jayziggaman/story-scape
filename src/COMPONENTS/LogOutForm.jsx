import { signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { appContext } from '../App'
import { auth, db } from '../firebase/config'

const LogOutForm = () => {
  const { showLogOut, setShowLogOut, userAuth, setPopup, setShowPopup } = useContext(appContext)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const navigate = useNavigate()


  useEffect(() => {
    if (!showLogOut) {
      setPassword('')
      setConfirmPassword('')
    }
  }, [showLogOut])



  const logOut = (e) => {
    e.preventDefault()
    if (password === confirmPassword) {
      const docRef = doc(db, 'users', userAuth, 'encrypted', userAuth)
    
      getDoc(docRef).then(doc => {

        const userPassword = doc.data()

        if (userPassword.value === password) {
          signOut(auth).then(() => {
            localStorage.removeItem('story-scape-user-auth')
            localStorage.removeItem('story-scape-dark-mode')
            localStorage.removeItem('story-scape-recent-searches')
            localStorage.removeItem('story-scape-sign-in-method')

            setShowLogOut(false)
            navigate('/login?type=sign-in&from=/')

          }).catch(() => {
            setShowPopup(true)
            setPopup({
              type: 'bad', message: `Couldn't complete log out. Please try again.`
            })
          })

        } else {
          setShowPopup(true)
          setPopup({
            type: 'bad', message: `Incorrect password. Please enter the password you used to create this account.`
          }) 
        }
      })
    } else {
      setShowPopup(true)
      setPopup({
        type: 'bad', message: `Error. The passwords you have entered do not match.`
      })
    }
  }
  


  function closeClick(e) {
    const name = e.target.nodeName

    if (name === 'SECTION') {
      setShowLogOut(false)
    }
  }
  

  return (
    <section className='log-out-form-section' role={'button'}
      onClick={e => closeClick(e)}
      style={{transform: `scale(${showLogOut ? '100%' : '0%'})`}}
    >
      <form action="submit" onSubmit={e => logOut(e)}>

        <label htmlFor="password">
          Enter your password
          <input type="password" value={password} required
            onChange={e => setPassword(e.target.value)}
          />
        </label>

        <label htmlFor="confirm-password">
          Confirm your password
          <input type="password" value={confirmPassword} required
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </label>


        <button>
          Log Out
        </button>
      </form>
    </section>
  )
}

export default LogOutForm