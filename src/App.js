import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Figure from './components/Figure';
import WrongLetters from './components/WrongLetters';
import Word from './components/Word';
import Popup from './components/Popup';
import Notification from './components/Notification';
import { showNotification as show } from './helpers/helpers';
import axios from 'axios';

import './App.css';

function App() {
  const [words, setWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [playable, setPlayable] = useState(true);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    axios.get('https://api.datamuse.com/words?topics=code,computer')
      .then(({data}) => {
        // Filter out phrases with spaces and hyphens to get only single words
        const filteredWords = data.filter(wordObj => {
          return !wordObj.word.includes(' ') && !wordObj.word.includes('-') 
        });

        setWords(filteredWords);
        setSelectedWord(filteredWords[Math.floor(Math.random() * filteredWords.length)].word);
      })
      .catch(err => console.error(err));
  }, [])

  // console.log(selectedWord);

  useEffect(() => {
    const handleKeydown = event => {
      const { key, keyCode } = event;
      if (playable && keyCode >= 65 && keyCode <= 90) {
        const letter = key.toLowerCase();
        if (selectedWord.includes(letter)) {
          if (!correctLetters.includes(letter)) {
            setCorrectLetters(currentLetters => [...currentLetters, letter]);
          } else {
            show(setShowNotification);
          }
        } else {
          if (!wrongLetters.includes(letter)) {
            setWrongLetters(currentLetters => [...currentLetters, letter]);
          } else {
            show(setShowNotification);
          }
        }
      }
    }
    window.addEventListener('keydown', handleKeydown);

    return () => window.removeEventListener('keydown', handleKeydown);
  }, [correctLetters, wrongLetters, playable, selectedWord]);

  function playAgain() {
    setPlayable(true);

    // Empty Arrays
    setCorrectLetters([]);
    setWrongLetters([]);

    // Get New Word
    setSelectedWord(words[Math.floor(Math.random() * words.length)].word);
  }

  return (
    <>
      <Header />
      {selectedWord ? (
          <>
            <div className="game-container">
              <Figure wrongLetters={wrongLetters} />
              <WrongLetters wrongLetters={wrongLetters} />
              <Word selectedWord={selectedWord} correctLetters={correctLetters} />
            </div>
            <Popup correctLetters={correctLetters} wrongLetters={wrongLetters} selectedWord={selectedWord} setPlayable={setPlayable} playAgain={playAgain} />
            <Notification showNotification={showNotification} />
          </>
        ) : <div>loading...</div>
      }
    </>
  );
}

export default App;
