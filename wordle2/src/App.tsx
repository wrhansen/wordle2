import { useEffect, useState } from 'react'
import { useKeyPress } from './hooks/useKeyPress'
import './App.css'
import Line from './Line'
import { GetRandomWord, isWordInWordBank } from './utils/WordBank'
import Message, { MessageType } from './Message'
import refreshIcon from './assets/refresh.svg'

type GuessArray = readonly [
  string | null,
  string | null,
  string | null,
  string | null,
  string | null,
  string | null,
]

function App() {
  const [solution, setSolution] = useState<string | null>(null)
  const [guesses, setGuesses] = useState<GuessArray>([
    null,
    null,
    null,
    null,
    null,
    null,
  ])
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState(MessageType.ERROR)

  const handleKeyPress = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase()
    let currentGuess = guesses[currentGuessIndex]
    if (isGameOver) {
      return
    }
    if (key.length === 1 && /^[a-z]$/.test(key)) {
      if (currentGuessIndex < 6) {
        if (currentGuess === null) {
          currentGuess = key
        } else if (currentGuess.length < 5) {
          currentGuess += key
        } else {
          console.log('Guess is full: ' + currentGuess)
        }
        // set guesses back to array
        const newGuesses = [...guesses]
        newGuesses[currentGuessIndex] = currentGuess
        setGuesses(newGuesses as unknown as GuessArray)
      } else {
        console.log('Game over SHOULD NOT GET HERE')
        setIsGameOver(true)
      }
    } else if (key === 'enter') {
      if (currentGuess && currentGuess.length === 5) {
        if (currentGuess === solution) {
          console.log('You win!')
          setMessage('You win!')
          setMessageType(MessageType.SUCCESS)
          setIsGameOver(true)
        } else {
          if (isWordInWordBank(currentGuess)) {
            setCurrentGuessIndex(currentGuessIndex + 1)
            console.log('Guess: ' + currentGuess)
          } else {
            setMessage('Not in word bank!')
            setMessageType(MessageType.ERROR)
            console.log('Guess is not in word bank: ' + currentGuess)
          }
        }
      } else {
        console.log('Guess is not full: ' + currentGuess)
      }
    } else if (key === 'backspace') {
      if (currentGuess) {
        currentGuess = currentGuess.slice(0, -1)
        const newGuesses = [...guesses]
        newGuesses[currentGuessIndex] = currentGuess
        setGuesses(newGuesses as unknown as GuessArray)
      } else {
        console.log('No guess to delete')
      }
    } else {
      console.log('No letter pressed: ' + key)
    }
  }

  const refreshGame = () => {
    const randomWord = GetRandomWord()
    setSolution(randomWord)
    setIsGameOver(false)
    setGuesses([null, null, null, null, null, null])
    setCurrentGuessIndex(0)
    setMessage('')
    setMessageType(MessageType.ERROR)
  }

  const refreshMessage = () => {
    setTimeout(() => {
      setMessage('')
      setMessageType(MessageType.ERROR)
    }, 2000)
  }

  /* Get the solution when the game starts */
  useEffect(() => {
    refreshGame()
  }, [])

  useEffect(() => {
    if (message && !isGameOver) {
      refreshMessage()
    }
  }, [message, isGameOver])

  useEffect(() => {
    if (currentGuessIndex >= 6 && solution) {
      setIsGameOver(true)
      setMessage('Game Over! The word was: ' + solution)
      setMessageType(MessageType.ERROR)
    }
  }, [solution, currentGuessIndex])

  /* Register key press hook */
  useKeyPress(handleKeyPress, [guesses, currentGuessIndex, isGameOver])

  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1>Wordle2</h1>
        </header>

        {guesses.map((guess, index) => (
          <Line
            key={index}
            guess={guess}
            solution={solution}
            entered={index != currentGuessIndex || isGameOver}
          />
        ))}

        {isGameOver && (
          <button className="refresh-button" onClick={refreshGame}>
            <img src={refreshIcon} alt="Refresh" /> New Game
          </button>
        )}

        <Message message={message} type={messageType} />
      </div>
    </>
  )
}

export default App
