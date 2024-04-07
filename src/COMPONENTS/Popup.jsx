import React, { useContext } from 'react'
import { FaCheckCircle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa'
import { appContext } from '../App'

const Popup = () => {
  const { showPopup, setShowPopup, popup } = useContext(appContext)
  
  return (
    <div role={'button'} onClick={() => {setShowPopup(false)}}
      style={{
      transform: showPopup ? 'translateY(0)' : 'translateY(-200%)',
      opacity: showPopup ? '1' : '0',
    }}
      className={popup.type === 'good' ? 'pop-up good' :
        popup.type === 'bad' ? 'pop-up bad' :
          popup.type === 'info' && 'pop-up'
  }
    >
      <div>
        {popup.type === 'good' ? <FaCheckCircle /> :
          popup.type === 'bad' ? <FaTimesCircle /> :
          popup.type === 'info' && <FaInfoCircle /> 
        }
      </div>

      <div>
        <h3>
          {popup.type === 'good' ? 'Success' :
            popup.type === 'bad' ? 'Error' :
            popup.type === 'info' && 'Info'
          }
        </h3>
        <p>
          {popup.message}
        </p>
      </div>
    </div>
  )
}

export default Popup