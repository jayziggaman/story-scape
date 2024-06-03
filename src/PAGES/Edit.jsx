import { doc, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaAngleLeft } from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { appContext } from '../App'
import { db, storage } from '../firebase/config'
import pfpIcon from '../img-icons/camera-icon.jpg'

const Edit = () => {
  const { time, imgTypes, userAuth, users, setShowPopup, setPopup, hideFeatures, undoHide, windowWidth, user, setProcessing } = useContext(appContext)
  

  const dobs = [
    {month: 'January', days: 31},
    {month: 'February', days: 28},
    {month: 'March', days: 31},
    {month: 'April', days: 30},
    {month: 'May', days: 31},
    {month: 'June', days: 30},
    {month: 'July', days: 31},
    {month: 'August', days: 31},
    {month: 'September', days: 30},
    {month: 'October', days: 31},
    {month: 'November', days: 30},
    {month: 'December', days: 31},
  ]
  const [userImg, setUserImg] = useState()
  const [pendingImg, setPendingImg] = useState()
  const [userName, setUserName] = useState('')
  const [bio, setBio] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dob, setDob] = useState({
    day: 0,
    month: '',
    year: 0
  })
  const [oldEnough, setOldEnough] = useState(false)
  const [years, setYears] = useState([])
  const [days, setDays] = useState([])
  const location = useLocation()
  const navigate = useNavigate()

  const allowedChar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '_', '.']

  useEffect(() => {
    if (user) {
      setUserImg(user.avatar)
      setUserName(user.userName)
      setBio(user.bio)
      setFirstName(user.firstName)
      setLastName(user.lastName)
      setDob({
        day: user.dob.day,
        month: user.dob.month,
        year: user.dob.year
      })
    }
  }, [user])


  function checkDay(month) {
    setDays([])
    const m = dobs.find(dob => dob.month === month)
    for (let i = 1; i <= m.days; i++) {
      setDays(days => [...days, i])
    }
  }


  useEffect(() => {
    hideFeatures()

    return () => {
      undoHide()
    }
  }, [location, windowWidth])


  useEffect(() => {
    for (let i = new Date().getFullYear(); i > 1899; i--) {
      setYears(years => [...years, i])
    }
    checkDay('January')
  }, [])


  useEffect(() => {
    if (pendingImg && imgTypes.includes(pendingImg.type)) {
      setProcessing(true)
      const selected = pendingImg

      const pfpRef = ref(storage, `pending-edit-pfps/${userAuth}`)
      uploadBytes(pfpRef, selected).then(() => {
        getDownloadURL(pfpRef).then(url => {
          setProcessing(true)
          setUserImg(url)

        }).finally(() => {
          setProcessing(false)
        })

      }).finally(() => {
        setProcessing(false)
      })
    } else {
      setShowPopup(true)
      setPopup({
        type: 'bad', message: `Please select an appropriate file type`
      })
    }
  }, [pendingImg, userAuth])


  const dobRender = useRef(true)
  useEffect(() => {
    if (dobRender.current) {
      dobRender.current = false

    } else {

      const age = time.year - parseInt(dob.year)
      const birthMonthIndex = dobs.findIndex(d => d.month === dob.month)
      const monthIndex = dobs.findIndex(d => d.month === time.month)
      if (age > 18) {
        setOldEnough(true)
        return
      } else if (age === 18) {
        if ((monthIndex - birthMonthIndex) >= 0) {
          setOldEnough(true)
          return
        } else {
          setOldEnough(false)
          setShowPopup(true) 
          setPopup({
            type: 'bad', message: `You have to be at least 18 to create an account.`
          })
        }
      } else {
        setOldEnough(false)
        setShowPopup(true) 
        setPopup({
          type: 'bad', message: `You have to be at least 18 to create an account.`
        })
      }
    }
  }, [dob])


  function editAccount(e) {
    e.preventDefault()

    const updatedUser = {
      id: userAuth,
      avatar: userImg,
      firstName,
      lastName,
      userName,
      bio,
      dob,

      articles: user.articles,
      collections: user.collections,
      savedArticles: user.savedArticles,
      areCollectionsPrivate: user.areArticlesPrivate,
      areArticlesPrivate: user.areCollectionsPrivate,
      
      likes: user.likes,
      subscribers: user.subscribers,
      notifications: user.notifications,

      userSince: user.userSince
    }

    const condition = users.find(user => user.username === userName)

    if (condition) {
      setShowPopup(true) 
      setPopup({
        type: 'bad',
        message: `This username is taken. Try another one.`
      })

    } else if (!oldEnough) {
      setShowPopup(true) 
      setPopup({
        type: 'bad',
        message: `You need to be at least 18 to create an account.`
      })

    } else {
      setProcessing(true)
      const userRef = doc(db, 'users', userAuth)

      updateDoc(userRef, updatedUser).then(() => {
        navigate('/settings')
        setShowPopup(true) 
        setPopup({
          type: 'good',
          message: `Profile updated successfully.`
        })
        
      }).catch(() => {
        setShowPopup(true) 
        setPopup({
          type: 'bad',
          message: `Couldn't complete account creation. Please try again.`
        })
      }).finally(() => {
        setProcessing(false)
      })
    }
  }


  return (
    <main className="edit-main">
      <header>
        <Link to='/settings'>
          <FaAngleLeft /> back
        </Link>
        <h2>
          Edit your account
        </h2>
      </header>
      <form action="submit"
        onSubmit={e => editAccount(e)}
      >
        <label htmlFor="user-img">
          <img src={userImg ? userImg : pfpIcon} alt="" />
          <input type="file" id='user-img' name='user-img'
            onClick={e => e.target.value = null}
            onChange={e => setPendingImg(e.target.files[0])}
          />
          <p>
            Pick a profile picture.
          </p>
        </label>

        <label htmlFor="first-name">
          <input required type="text" id='first-name' name='first-name' placeholder='First name'
            value={firstName} onChange={e => setFirstName(e.target.value)}
          />
        </label>

        <label htmlFor="last-name">
          <input required type="text" id='last-name' name='last-name'
            placeholder='Last name' value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
        </label>

        <label htmlFor="user-name">
          <input required type="text" id='user-name' name='user-name'
            placeholder='User name' value={userName} maxLength='20'
            onChange={e => setUserName(e.target.value)}
            onKeyPress={e => {
              if(allowedChar.indexOf(e.key) < 0) e.preventDefault()
            }} 
          />
          <p>
            {userName.length} / 20
          </p>
        </label>

        <label htmlFor="dob">
          <p>Date of birth</p>
          <div>
            <select required name="dob" id="dob-month" value={dob.month}
              onChange={e => {
                setDob({
                  day: dob.day, month: e.target.value, year: dob.year
                })
                checkDay(e.target.value)
              }}
            >
              {dobs.map((dob, i) => {
                return (
                  <option value={dob.month} key={i}
                    style={{height: '100px'}}
                  >
                    {dob.month}
                  </option>
                )
              })}
            </select>

            <select required name="dob" id="dob-day" value={dob.day}
              onChange={e => {
                setDob({
                  day: e.target.value, month: dob.month, year: dob.year
                })
              }}
            >
              {days.map((day, i) => {
                return (
                  <option value={day} key={i}>
                    {day}
                  </option>
                )
              })}
            </select>

            <select required name="dob" id="dob-year" value={dob.year}
              onChange={e => {
                setDob({
                  day: dob.day, month: dob.month,
                  year: e.target.value
                })
              }}
            >
              {years.map((year, i) => {
                return (
                  <option key={i} value={year}>
                    {year}
                  </option>
                )
              })}
            </select>
          </div>
        </label>

        <label style={{
          transform: !oldEnough ? 'translateY(20px)' :
          'translateY(0px)'}} htmlFor="user-bio"
        >
          <textarea required name="user-bio" id="user-bio"
            cols="30" rows="10" placeholder='Bio' value={bio} maxLength='200'
            onChange={e => setBio(e.target.value)}
          ></textarea>
          <p>
            {bio.length} / 200
          </p>
        </label>


        <button>
          Save 
        </button>

      </form>
    </main>
  )
}

export default Edit