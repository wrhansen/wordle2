import { wordBank } from '../data/wordBank'

export const GetRandomWord = (): string => {
  const randomIndex = Math.floor(Math.random() * wordBank.length)
  return wordBank[randomIndex].toLowerCase()
}

export const isWordInWordBank = (word: string): boolean => {
  return wordBank.includes(word.toUpperCase())
}
