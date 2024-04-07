import React, { useContext } from 'react'
import { appContext } from '../App'

import storyScapeLogo from '../images/story-scape-logo.jpg'

const HomeHeader = () => {
  const { windowWidth } = useContext(appContext)

  return (
    <header className="home-header">
      {windowWidth < 600 && <img src={storyScapeLogo} alt="" />}

      <h1 className='home-header-id'>
        Story Scape
      </h1>
    </header>
  )
}

export default HomeHeader