import React, { useContext } from 'react'
import { appContext } from '../App'
import HomeHeader from '../COMPONENTS/HomeHeader'
import IsOffline from '../COMPONENTS/IsOffline'
import Landing from '../COMPONENTS/Landing'

const Home = () => {
  const { windowWidth, isOnline } = useContext(appContext)
  
  return (
    <main className='home-main'>
      {isOnline ?
        <>
          {windowWidth < 800 && <HomeHeader />}
          <Landing />
        </>
        :
        <IsOffline />
      }
    </main>
  )
}

export default Home