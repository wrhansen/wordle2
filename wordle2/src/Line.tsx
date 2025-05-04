/**
 * Props for the `Line` component.
 *
 * @interface LineProps
 * @property {string | null} guess - The current guess entered by the user. Can be `null` if no guess has been made.
 * @property {string | null} solution - The solution word for the game. Can be `null` if the solution is not yet available.
 * @property {boolean} entered - Indicates whether the guess has been fully entered and submitted.
 */
interface LineProps {
  guess: string | null
  solution: string | null
  entered: boolean
}

function Line({ guess, solution, entered }: LineProps) {
  return (
    <>
      <div className="line">
        {solution &&
          solution.split('').map((solutionLetter, index) => {
            const classNames = ['box']
            const guessLetter = guess ? guess[index] : null
            if (guess && entered) {
              if (solutionLetter === guessLetter) {
                classNames.push('correct')
              } else if (guessLetter && solution.includes(guessLetter)) {
                classNames.push('present')
              } else {
                classNames.push('absent')
              }
            }
            return (
              <div className={classNames.join(' ')} key={index}>
                {guess && guess[index]}
              </div>
            )
          })}
      </div>
    </>
  )
}
export default Line
