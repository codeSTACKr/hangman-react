import React from 'react'

const WrongLetters = ({ wrongLetters }) => {

  return (
    <div className="wrong-letters-container">
      {wrongLetters.length > 0 && 
        <p>Wrong</p>
      }
      {wrongLetters.map((letter, i) => <span key={i}>{letter}</span>)}
    </div>
  )
}

export default WrongLetters
