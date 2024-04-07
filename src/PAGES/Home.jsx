import React, { useContext } from 'react'
import { appContext } from '../App'
import HomeHeader from '../COMPONENTS/HomeHeader'
import Landing from '../COMPONENTS/Landing'

const Home = () => {
  const { windowWidth } = useContext(appContext)
  
  return (
    <main className='home-main'>
      {windowWidth < 800 && <HomeHeader />}
      <Landing />
    </main>
  )
}

export default Home