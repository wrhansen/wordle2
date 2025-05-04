import { useEffect, useState } from 'react'
import { useKeyPress } from './hooks/useKeyPress'
import './App.css'
import Line from './Line'
import { GetRandomWord } from './utils/WordBank'
import Message, { MessageType } from './Message'
import refreshIcon from './assets/refresh.svg'
import { GuessArray } from './types/GuessArray'
import {
  BackspaceKeyHandler,
  LetterKeyHandler,
  EnterKeyHandler,
} from './Handlers'
import { KeyCommand } from './types/KeyCommand'

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
    if (isGameOver) return

    const key = event.key.toLowerCase()
    const currentGuess = guesses[currentGuessIndex]

    const handlers: { [key: string]: KeyCommand } = {
      letter: new LetterKeyHandler(key, guesses, currentGuessIndex, setGuesses),
      enter: new EnterKeyHandler(
        solution,
        currentGuessIndex,
        setCurrentGuessIndex,
        setMessage,
        setMessageType,
        setIsGameOver,
      ),
      backspace: new BackspaceKeyHandler(
        guesses,
        currentGuessIndex,
        setGuesses,
      ),
    }

    const handler =
      key === 'enter'
        ? handlers.enter
        : key === 'backspace'
          ? handlers.backspace
          : handlers.letter

    if (handler.canExecute(currentGuess)) {
      handler.execute(currentGuess)
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
