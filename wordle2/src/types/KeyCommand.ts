export interface KeyCommand {
  execute: (currentGuess: string | null) => void
  canExecute: (currentGuess: string | null) => boolean
}
