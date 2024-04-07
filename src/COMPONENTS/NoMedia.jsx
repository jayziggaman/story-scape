import React from 'react'
import noMedia from '../images/no-media-found-IV.jpg'

const NoMedia = ({ message }) => {
  
  return (
    <div className='no-media'>
      <img src={noMedia} alt="" />
      <h2>
        Oops, nothing to show here.
      </h2>
      <p>
        {message}
      </p>
    </div>
  )
}

export default NoMedia