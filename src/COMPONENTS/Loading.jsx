import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { appContext } from '../App'

const Loading = () => {
  const { windowWidth } = useContext(appContext)
  const [index, setIndex] = useState(0)
  const location = useLocation()
  const divs = document.querySelectorAll('.loading div')


  useEffect(() => {
    const interval = setInterval(() => {
      if (index === 2) {
        setIndex(index => index - index)
      } else {
        setIndex(index => index + 1)
      }
    }, 500);

    return () => {
      clearInterval(interval)
    }
  }, [index])


  useEffect(() => {
    divs.forEach((div, i) => {
      if (i === index) {
        div.classList.add('active')
      } else {
        div.classList.remove('active')
      }
    })
  }, [index])


  const style = {
    height: '12px',
    width: '12px',
    borderRadius: '20px',
    display: 'block',
    margin: '0',
    padding: '0'
  }


  return (
    <section className='loading'
      style={{
        height: '100vh',
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '5px',
        left: location.pathname === '/login' ? '0px' :
          windowWidth > 599  && windowWidth < 800 ? '100px' :
          windowWidth > 799 && '200px'
      }}
    >
      <div style={style}></div>
      <div style={style}></div>
      <div style={style}></div>
    </section>
  )
}

export default Loading