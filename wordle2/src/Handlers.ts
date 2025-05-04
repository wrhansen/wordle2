import { KeyCommand } from './types/KeyCommand'
import { GuessArray } from './types/GuessArray'
import { MessageType } from './Message'
import { isWordInWordBank } from './utils/WordBank'

export class LetterKeyHandler implements KeyCommand {
  constructor(
    private key: string,
    private guesses: GuessArray,
    private currentGuessIndex: number,
    private setGuesses: (guesses: GuessArray) => void,
  ) {}

  canExecute(currentGuess: string | null): boolean {
    return (
      this.key.length === 1 &&
      /^[a-z]$/.test(this.key) &&
      this.currentGuessIndex < 6 &&
      (currentGuess === null || currentGuess.length < 5)
    )
  }

  execute(currentGuess: string | null): void {
    const newGuess = currentGuess === null ? this.key : currentGuess + this.key
    const newGuesses = [...this.guesses]
    newGuesses[this.currentGuessIndex] = newGuess
    this.setGuesses(newGuesses as unknown as GuessArray)
  }
}

export class EnterKeyHandler implements KeyCommand {
  constructor(
    private solution: string | null,
    private currentGuessIndex: number,
    private setCurrentGuessIndex: (index: number) => void,
    private setMessage: (message: string) => void,
    private setMessageType: (type: MessageType) => void,
    private setIsGameOver: (isGameOver: boolean) => void,
  ) {}

  canExecute(currentGuess: string | null): boolean {
    return currentGuess !== null && currentGuess.length === 5
  }

  execute(currentGuess: string | null): void {
    if (!currentGuess || !this.solution) return

    if (currentGuess === this.solution) {
      console.log('You win!')
      this.setMessage('You win!')
      this.setMessageType(MessageType.SUCCESS)
      this.setIsGameOver(true)
    } else if (isWordInWordBank(currentGuess)) {
      this.setCurrentGuessIndex(this.currentGuessIndex + 1)
      console.log('Guess: ' + currentGuess)
    } else {
      this.setMessage('Not in word bank!')
      this.setMessageType(MessageType.ERROR)
    }
  }
}

export class BackspaceKeyHandler implements KeyCommand {
  constructor(
    private guesses: GuessArray,
    private currentGuessIndex: number,
    private setGuesses: (guesses: GuessArray) => void,
  ) {}

  canExecute(currentGuess: string | null): boolean {
    return currentGuess !== null && currentGuess.length > 0
  }

  execute(currentGuess: string | null): void {
    if (!currentGuess) return

    const newGuess = currentGuess.slice(0, -1)
    const newGuesses = [...this.guesses]
    newGuesses[this.currentGuessIndex] = newGuess
    this.setGuesses(newGuesses as unknown as GuessArray)
  }
}
