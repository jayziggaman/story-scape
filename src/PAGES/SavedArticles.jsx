import React from 'react'
import { Link } from 'react-router-dom'
import { FaAngleLeft } from 'react-icons/fa'
import ProfileArticle from '../COMPONENTS/ProfileArticle'

const SavedArticles = () => {
  const saved = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 5, 89, 0]
  
  return (
    <main className="saved-articles-main">
      <header>
        <Link to='/profile?content-type=collections'>
          <FaAngleLeft />
        </Link>
        <h3>Saved articles</h3>
      </header>

      <section className="saved-articles">
        {saved.map((save, i) => <ProfileArticle key={i} article={save}
        />)}
      </section>
    </main>
  )
}

export default SavedArticles