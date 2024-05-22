import React, { useContext, useEffect, useState } from 'react'
import { appContext } from '../App'
import { FaAngleLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Loading from '../COMPONENTS/Loading'
import Collection from '../COMPONENTS/Collection'
import NoMedia from '../COMPONENTS/NoMedia'
import IsOffline from '../COMPONENTS/IsOffline'

const DeletedCollections = () => {
  const { deletedCollections, isOnline } = useContext(appContext)
  
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    if (isOnline) {
      if (deletedCollections) {
        setPageLoading(false)
      }

    } else {
      setPageLoading(false)
    }
  }, [deletedCollections, isOnline])
  
  
  return (
    <main className="deleted-articles-main">
      <header>
        <Link to='/settings'>
          <FaAngleLeft />
        </Link>
        <h3>Deleted collections</h3>
      </header>

      {isOnline ?
        <>
          {pageLoading ?
            <Loading />
            :
            <section className={
              deletedCollections?.length > 0 ?
                'collections media' : `no-collection collections media`
              }
              style={{
                gridTemplateColumns: deletedCollections?.length === 0 && '1fr'
              }}
            >
              {deletedCollections?.length === 0 ?
                <>
                  <NoMedia
                    message='When you delete a collection it will show here.'
                  />
                </>
                :
                <>
                  {deletedCollections?.map(collection => {
                    return (
                      <Collection key={collection.id} collection={collection}
                        link='blocking'
                      />
                    )
                  })}
                </>
              }
              
            </section>
          }
        </>
        :
        <IsOffline />
      }
    </main>
  )
}

export default DeletedCollections