import React, { useContext } from 'react'
import { appContext } from '../App'

const ThreeDots = ({ id, thumbnail, type, creator, isDeleted, collectionId }) => {
  
  const { accessOptions, user } = useContext(appContext)


  return (
    <div className="three-dots" id={id}
      onClick={e => {
        accessOptions(e, id, thumbnail, type, creator, isDeleted, collectionId)
      }}
    >
      {user &&
        <>
        <span></span>
        <span></span>
        <span></span>
        </>
      }
    </div>
  )
}

export default ThreeDots