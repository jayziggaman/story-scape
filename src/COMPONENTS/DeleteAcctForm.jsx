import { deleteUser } from 'firebase/auth'
import { deleteDoc, doc, getDoc } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { appContext } from '../App'
import { articlesRef, auth, db, usersRef } from '../firebase/config'

const DeleteAcctForm = () => {
  const { showDeleteForm, setShowDeleteForm, userAuth, setPopup, setShowPopup, articles, user } = useContext(appContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const navigate = useNavigate()


  useEffect(() => {
    if (!showDeleteForm) {
      setEmail('')
      setPassword('')
      setConfirmPassword('')
    }
  }, [showDeleteForm])



  const deleteAcct = e => {
    e.preventDefault()

    if (password === confirmPassword) {
      const docRef = doc(db, 'users', userAuth, 'encrypted', userAuth)
    
      getDoc(docRef).then(doc => {

        const userPassword = doc.data()

        if (userPassword.value === password) {
          deleteUser(auth.currentUser).then(() => {

            const userRef = doc(usersRef, userAuth)

            deleteDoc(userRef)

            articles.map(article => {
              if (article.creator === userAuth) {
                const docRef = doc(articlesRef, article.id)

                deleteDoc(docRef)
              }
            })
            
            localStorage.removeItem('story-scape-user-auth')
            localStorage.removeItem('story-scape-dark-mode')
            localStorage.removeItem('story-scape-recent-searches')
            localStorage.removeItem('story-scape-sign-in-method')
            
            setShowDeleteForm(false)
            navigate('/login?type=sign-up&from=/')

          }).catch(err => {
            setShowPopup(true)
            setPopup({
              type: 'bad', message: `Couldn't complete account deletion. Please try again.`
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
      setShowDeleteForm(false)
    }
  }
  

  return (
    <section className='delete-acct-form-section' role={'button'}
      onClick={e => closeClick(e)}
      style={{transform: `scale(${showDeleteForm ? '100%' : '0%'})`}}
    >
      <form action="submit" onSubmit={e => deleteAcct(e)}>
        {user?.createdWith === 'email' &&
          <label htmlFor="email">
            Enter your email
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </label>
        }

        <label htmlFor="password">
          Enter your password
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>

        <label htmlFor="confirm-password">
          Confirm your password
          <input type="password" value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </label>


        <button>
          Delete account
        </button>
      </form>
    </section>
  )
}

export default DeleteAcctForm