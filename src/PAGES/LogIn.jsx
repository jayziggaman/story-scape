import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {FaAngleLeft} from 'react-icons/fa'
import { appContext } from '../App'

import userIcon from '../img-icons/user-icon.jpg'
import lockIcon from '../img-icons/lock-icon.jpg'
import { createUserWithEmailAndPassword, getRedirectResult, signInWithEmailAndPassword, signInWithRedirect } from 'firebase/auth'
import { auth, db, facebookProvider, githubProvider, googleProvider } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import Loading from '../COMPONENTS/Loading'

const LogIn = () => {
  const { windowWidth, setShowPopup, setPopup, hideFeatures, undoHide, setAuthMethod, checkForId, uploadPassword, createUser, userAuth, users, setProcessing, processing } = useContext(appContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const [pageLoading, setPageLoading] = useState(true)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cPassword, setCPassword] = useState('')

  const [goodPassword, setGoodPassword] = useState(false)
  const [samePasswords, setSamePasswords] = useState(false)

  const [type, setType] = useState(
    searchParams.get('type') === null ?'sign-up' : searchParams.get('type')
  )
  const [from, setFrom] = useState()
  const location = useLocation()
  const navigate = useNavigate()



  useEffect(() => {
    const processingDiv = document.querySelector('.processing')
    const loadingDiv = document.querySelector('.loading')

    processingDiv?.classList.add('leave')
    loadingDiv?.classList.add('leave')

    return () => {
      processingDiv?.classList.remove('leave')
      loadingDiv?.classList.remove('leave')
      setProcessing(false)
    }
  }, [])
  

  useEffect(() => {
    if (localStorage.getItem('story-scape-is-redirecting')) {
      setPageLoading(false)
      getRedirectResult(auth).then(result => {
        if (result) {
          setPageLoading(false)
          setProcessing(true)
          checkForId(auth.currentUser.uid, from, result.providerId)

        } else {
          setShowPopup(true)
          setPopup({
            type: 'bad', message: `Service unavailable. Please ${type} with your email instead.`
          }) 

        }
    
      }).catch(err => {
        setShowPopup(true)
        setPopup({
          type: 'bad', message: `Couldn't complete ${type}. Please try again.`
        })  
        const userId = auth.currentUser.uid
        if (err.message === 'Firebase: Error (auth/account-exists-with-different-credential).') {
          const userRef = doc(db, 'users', userId, 'encrypted', userId)
      
          getDoc(userRef).then(doc => {
      
            const password = doc.data()
      
            if (password) {
              const ref = doc(db, 'users', userId)
  
              getDoc(ref).then(doc => {
                const user = doc.data()
                
                if (user.userName) {
                  navigate(from ? from : '/', {replace: true})
        
                } else {
                  navigate(`/create-account?from=${from}`, {replace: true})
                }
              })
      
            } else {
              navigate(`/set-password?from=${from}`, {replace: true})
            }
          })
  
        } else {
          setShowPopup(true)
          setPopup({
            type: 'bad', message: `Couldn't complete ${type}. Please try again.`
          })  
        }   
  
      }).finally(() => {
        setProcessing(false)
        localStorage.removeItem('story-scape-is-redirecting')
      })
    } 
  }, [])


  useEffect(() => {
    if (users) {
      setPageLoading(false)
    }
  }, [users])


  useEffect(() => {
    hideFeatures()

    return () => {
      undoHide()
    }
  }, [location, windowWidth])



  useEffect(() => {
    searchParams.get('from') === null ? setFrom('/') : setFrom(searchParams.get('from'))

    searchParams.get('type') === null ? setType('sign-up') : setType(searchParams.get('type'))
  }, [searchParams])



  function formSubmit(e) {
    e.preventDefault()

    if (type === 'sign-in') {
      setProcessing(true)
      signInWithEmailAndPassword(auth, email, password).then(() => {
        if (!userAuth) {
          setAuthMethod('email')
        } 
        navigate(from ? from : '/', {replace: true})
        window.location.reload();
        
      }).catch(err => {
        const condition = err.message === 'Firebase: Error (auth/invalid-login-credentials).'

        setShowPopup(true)
        setPopup({
          type: 'bad', message: `${err.message}`
        })

        if (condition) {
          setPopup({
            type: 'bad', message: `Oops. Looks like you do not have an account with us. Click Sign up at the bottom of the screen.`
          })
        } else {
          setPopup({
            type: 'bad', message: `Couldn't complete sign in. Please try again`
          })
        }

      }).finally(() => {
        setProcessing(false)
      })
      


    } else if (type === 'sign-up') {
      if (samePasswords && goodPassword) {
        setProcessing(true)
        const finish = () => {
          createUserWithEmailAndPassword(auth, email, password).then(() => {
            const userId = auth.currentUser.uid
            
            createUser('email', userId)
            setAuthMethod('email')
            uploadPassword(password, userId)
            navigate(`/create-account?from=${from}`, {replace: true})
  
          }).catch((err) => {
            setShowPopup(true)
  
            const condition = err.message === 'Firebase: Error (auth/email-already-in-use).'
            if (condition) {
              setPopup({
                type: 'bad', message: `This email is already linked to an account.`
              })
            } else {
              setPopup({
                type: 'bad', message: `Couldn't complete sign up. Please try again`
              })
            }

          }).finally(() => {
            setProcessing(false)
          })
        }

        if (auth.currentUser || userAuth) {
          const condition = users.find(user => user.id === auth.currentUser.uid)
          
          if (condition) {
            navigate(`/create-account?from=${from}`, { replace: true })
            setProcessing(false)
            
          } else {
            finish()
          }
          
        } else {
         finish() 
        }

      } else {
        if (!goodPassword) {
          setShowPopup(true)
          setPopup({
            type: 'bad', message: `Your password is not strong enough.`
          })
        } else if (!samePasswords) {
          setShowPopup(true)
          setPopup({
            type: 'bad', message: `The two passwords have to match.`
          })
        } 
      }
    }
  }


  const passwordRender = useRef(true)
  useEffect(() => {
    setGoodPassword(true)
    if (passwordRender.current) {
      passwordRender.current = false
    } else {
      if (password.length > 7 || password.length === 0) {
        setGoodPassword(true)
      } else {
        setGoodPassword(false)
      }
    }
  }, [password])

  

  const cPasswordRender = useRef(true)
  useEffect(() => {
    if (cPasswordRender.current) {
      cPasswordRender.current = false
    } else {
      if (cPassword.length > 0) {
        if (password === cPassword) {
          setSamePasswords(true)
        } else {
          setSamePasswords(false)
        }
      }
    }
  }, [cPassword])



  const redirectFtn = () => {
    localStorage.setItem('story-scape-is-redirecting', JSON.stringify(true))
  }




  const googleSignIn = () => { 
    if (userAuth) {
      checkForId(userAuth, from, 'google.com')

    } else {
      signInWithRedirect(auth, googleProvider)
      redirectFtn()
    }
  }


  
  const facebookSignIn = () => {
    if (userAuth) {
      checkForId(userAuth, from, 'facebook.com')

    } else {
      signInWithRedirect(auth, facebookProvider)
      redirectFtn()
    }
  }



  const githubSignIn = () => {
    if (userAuth) {
      checkForId(userAuth, from, 'github.com')

    } else {
      signInWithRedirect(auth, githubProvider)
      redirectFtn()
    }
  }


  return (
    <main className="login-main">
      {pageLoading ?
        <Loading />
        :
        <>
          {windowWidth > 550 ?
            <>
              <header
                className={type === 'sign-in' ? "sign-in" :
                  type === 'sign-up' ? "sign-up" : ''}
              >
                <a href={from ? from : '/'}>
                  <FaAngleLeft /> 
              </a>
              </header>

              <section
                className={type === 'sign-in' ? "sign-in" : type === 'sign-up' ? "sign-up" : ''}
              >

                <form action="submit" onSubmit={e => formSubmit(e)}>
                  {type === 'sign-in' ?
                    <>
                      <header>
                        <h1>
                          Sign In
                        </h1>

                        <div>
                          <span role={'button'}
                            onClick={() => googleSignIn()}
                          >
                            <span>
                              Go
                            </span>
                            Google
                          </span>
                          
                          {/* <span role={'button'}
                            onClick={() => facebookSignIn()}
                          >
                            <span>
                              F
                            </span>
                            FaceBook
                          </span> */}
                          
                          <span role={'button'}
                            onClick={() => githubSignIn()}
                          >
                            <span>
                              Gi
                            </span>
                            GitHub
                          </span>
                        </div>

                        <p>
                          Or use your account
                        </p>
                      </header>

                      <div>
                        <label htmlFor="sign-in-email">
                          <img src={userIcon} alt="" />
                          <input required id="sign-in-email" placeholder='Email'
                            value={email} onChange={e => setEmail(e.target.value)}
                          />
                        </label>

                        <label className='right' htmlFor="sign-in-password">
                          <img src={lockIcon} alt="" />
                          <input required value={password}
                            type="password" name="sign-in-password" id="sign-in-password" placeholder='Password'
                            onChange={e => setPassword(e.target.value)}
                          />
                        </label>

                        <button>
                          SIGN IN
                        </button>
                      </div>
                    </>
                    : type === 'sign-up' && 
                    <>
                      <header>
                        <h1>
                          Create Account
                        </h1>

                        <div>
                          <span role={'button'}
                            onClick={() => googleSignIn()}
                          >
                            <span>
                              Go
                            </span>
                            Google
                          </span>
                          
                          {/* <span role={'button'}
                            onClick={() => facebookSignIn()}
                          >
                            <span>
                              F
                            </span>
                            FaceBook
                          </span> */}
                          
                          <span role={'button'}
                            onClick={() => githubSignIn()}
                          >
                            <span>
                              Gi
                            </span>
                            GitHub
                          </span>
                        </div>

                        <p>
                          Or use your email for registration
                        </p>
                      </header>

                      <div>
                        <label htmlFor="sign-up-name">
                          <img src={userIcon} alt="" />
                          <input required type="text" name="sign-up-name" id="sign-up-name"
                            placeholder='Name' value={name}
                            onChange={e => setName(e.target.value)}
                          />
                        </label>

                        <label htmlFor="sign-up-email">
                          <img src={userIcon} alt="" />
                          <input required type="email" name="sign-up-email"
                            id="sign-up-email" placeholder='Email'
                            value={email} onChange={e => setEmail(e.target.value)}
                          />
                        </label>

                        <label htmlFor="sign-up-password" className='right'>
                          <img src={lockIcon} alt="" />
                          <input required onChange={e => setPassword(e.target.value)} autoComplete="off"
                            type="password" name="sign-up-password" id="sign-up-password" placeholder='Password'
                            value={password}
                          />
                          {!goodPassword &&
                            <p>Password must be at least 8 characters long</p>
                          }
                        </label>

                        <label style={{
                          transform: !goodPassword ? 'translateY(20px)' :
                            'translateY(0px)'
                        }}
                          htmlFor="sign-up-c-password" className='right'>
                          <img src={lockIcon} alt="" />
                          <input required type="password" name="sign-up-c-password" autoComplete="off"
                            id="sign-up-c-password" placeholder='Confirm password'
                            value={cPassword} onChange={e => setCPassword(e.target.value)}
                          />
                          {!samePasswords && cPassword.length > 0 &&
                            <p>Both passwords have to match</p>
                          }
                        </label>

                        <button>
                          SIGN UP
                        </button>
                      </div>
                    </>
                  }
                </form>
                
                <article>
                  {type === 'sign-in' ?
                    <>
                      <h1>
                        Hello, Friend!
                      </h1>
            
                      <p>
                        Enter your personal details to continue in your journey with us
                      </p>
            
                      <Link
                        to={`/login?type=sign-up&from=${from ? from : '/'}`}
                      >
                        SIGN UP
                      </Link>
                    </>
                    : type === 'sign-up' && 
                    <>
                      <h1>
                        Welcome back, Friend!
                      </h1>
            
                      <p>
                        To keep connected with us please sign in with your personal info
                      </p>
            
                      <Link
                        to={`/login?type=sign-in&from=${from ? from : '/'}`}
                      >
                        SIGN IN
                      </Link>
                    </>
                  }
                </article>
              </section>
            </>
            :
            <>
              <header
                className={type === 'sign-in' ? "sign-in" :
                  type === 'sign-up' ? "sign-up" : ''}
              >
                <a href={from ? from : '/'}>
                  <FaAngleLeft /> 
                </a>
              </header>
              <section
                className={type === 'sign-in' ? "sign-in" : type === 'sign-up' ? "sign-up" : ''}
                style={{
                  overflowX: type === 'sign-in' && 'hidden'
                }}
              >
                <form action="submit" onSubmit={e => formSubmit(e)}
                  className='sign-in'
                >
                  <header>
                    <h1>
                      Sign In
                    </h1>

                    <div>
                      <span role={'button'}
                        onClick={() => googleSignIn()}
                      >
                        <span>
                          Go
                        </span>
                        Google
                      </span>
                      
                      {/* <span role={'button'}
                        onClick={() => facebookSignIn()}
                      >
                        <span>
                          F
                        </span>
                        FaceBook
                      </span> */}
                      
                      <span role={'button'}
                        onClick={() => githubSignIn()}
                      >
                        <span>
                          Gi
                        </span>
                        GitHub
                      </span>
                    </div>
                    
                    <p>
                      Or use your account
                    </p>
                  </header>

                  <div>
                    <label htmlFor="sign-in-email">
                      <img src={userIcon} alt="" />
                      <input required type="email" name="sign-in-email" id="sign-in-email"
                        placeholder='Email' value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </label>

                    <label className='right' htmlFor="sign-in-password">
                      <img src={lockIcon} alt="" />
                      <input required type="password" name="sign-in-password"
                        id="sign-in-password" placeholder='Password'
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                      />
                    </label>

                    <button>
                      SIGN IN
                    </button>
                  </div>

                  <div>
                    <p>
                      Don't have an account?
                    </p>
                    <Link
                      to={`/login?type=sign-up&from=${from}`}
                    >
                      Sign up
                    </Link>
                  </div>
                </form>
                
                <form action="submit" onSubmit={e => formSubmit(e)}
                  className='sign-up'
                >
                  <header>
                    <h1>
                      Create Account
                    </h1>

                      <div>
                        <span role={'button'}
                          onClick={() => googleSignIn()}
                        >
                          <span>
                            Go
                          </span>
                          Google
                        </span>
                        
                        {/* <span role={'button'}
                          onClick={() => facebookSignIn()}
                        >
                          <span>
                            F
                          </span>
                          FaceBook
                        </span> */}
                        
                        <span role={'button'}
                          onClick={() => githubSignIn()}
                        >
                          <span>
                            Gi
                          </span>
                          GitHub
                        </span>
                      </div>
                    
                    <p>
                      Or use your email for registration
                    </p>
                  </header>

                  <div>
                    <label htmlFor="sign-up-name">
                      <img src={userIcon} alt="" />
                      <input required type="text" name="sign-up-name" id="sign-up-name"
                        placeholder='Name' value={name}
                        onChange={e => setName(e.target.value)}
                      />
                    </label>

                    <label htmlFor="sign-up-email">
                      <img src={userIcon} alt="" />
                      <input required type="email" name="sign-up-email" id="sign-up-email"
                        placeholder='Email' value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </label>

                    <label htmlFor="sign-up-password" className='right'>
                      <img src={lockIcon} alt="" />
                      <input required type="password" name="sign-up-password" id="sign-up-password" placeholder='Password'
                        value={password} autoComplete="off"
                        onChange={e => setPassword(e.target.value)}
                      />
                      {!goodPassword &&
                        <p>Password must be at least 8 characters long</p>
                      }
                    </label>

                    <label style={{
                      transform: !goodPassword ? 'translateY(20px)' :
                      'translateY(0px)'
                      }} htmlFor="sign-up-c-password" className='right'>
                      <img src={lockIcon} alt="" />
                      <input required type="password" autoComplete="off" name="sign-up-c-password" id="sign-up-c-password" placeholder='Confirm password'
                        value={cPassword}
                        onChange={e => setCPassword(e.target.value)}
                      />
                      {!samePasswords && cPassword.length > 0 &&
                        <p>Both passwords have to match</p>
                      }
                    </label>

                    <button>
                      SIGN UP
                    </button>
                  </div>

                  <div>
                    <p>
                      Have an account already?
                    </p>
                    <Link
                      to={`/login?type=sign-in&from=${from}`}
                    >
                      Sign in
                    </Link>
                  </div>
                </form>
              </section>
            </>
          }
        </>
      }
    </main>
  )
}

export default LogIn