import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getPlayerByIdFromStore, isValidScore, updatePlayoff8, updateWinners } from "./utils"




export default function Playoff8GameComp(props) {

    const dispatch = useDispatch()
    const currentTournament = useSelector(state => state.currentTournament)
    const players = useSelector(state => state.players)
    const [scoreErrorMessage, setScoreErrorMessage] = useState("")
    const [isScoreErrorMessage, setIsScoreErrorMessage] = useState(false)
    const index = props.index
    const game = props.game
 

    function enterScore(gameNum, playerNum, score) {
        const newWinners = currentTournament.data.winners
        const newGames = currentTournament.data.playoff8.map((game, index) => {
            if (index === gameNum) {
                if (playerNum === 1) {
                    return ({...game, "player1Score": score})
                }
                else {
                    return ({...game, "player2Score": score})
                }
            }
            else {
                return game
            }
        })
        updatePlayoff8(currentTournament, newGames, newWinners, dispatch)
    }

    function endGame() {
        const res = isValidScore([game.player1Score, game.player2Score])
        if (res.status === false) {
            setIsScoreErrorMessage(true)
            setScoreErrorMessage(res.message)
            return
        }

        const winner = Number(game.player1Score) > Number(game.player2Score) ? game.player1 : game.player2
        const looser = Number(game.player1Score) < Number(game.player2Score) ? game.player1 : game.player2

        let newWinners = currentTournament.data.winners
        const newGames = currentTournament.data.playoff8.map((g, i) => {
            if (i === game.winnerNextGame) {
                if (game.winnerPlayerNumber === "1") {
                    const newGame = {...g, player1: winner}
                    return (newGame)
                }
                else {
                    const newGame = {...g, player2: winner}
                    return (newGame)
                }
            }
            else if (i === game.looserNextGame) {
                if (game.looserPlayerNumber === "1") {
                    const newGame = {...g, player1: looser}
                    return (newGame)
                }
                else {
                    const newGame = {...g, player2: looser}
                    return (newGame)
                }
            }
            else if (game.looserNextGame === "third") {
                newWinners = {...newWinners, "third": looser}
                return g
            }
            else if (game.winnerNextGame === "first") {
                newWinners = {...newWinners, "first": winner, "second": looser}
                return g
            }
            else {
                return g
            }
        })

        updatePlayoff8(currentTournament, newGames, newWinners, dispatch)

    }

    return (
        <div key={index} className="playoff_game_container">
            <h3>{`משחק ${index+1}`}</h3>
            <div>
                <span>{getPlayerByIdFromStore(game?.player1?.playerId, players)?.data.name}</span>
                <input type="text" onChange={(e) => enterScore(index, 1, e.target.value)} value={game.player1Score}></input>
            </div>
            <div>
                <span>{getPlayerByIdFromStore(game?.player2?.playerId, players)?.data.name}</span>
                <input type="text" onChange={(e) => enterScore(index, 2, e.target.value)} value={game.player2Score}></input>
            </div>
            <div className="buttons_container">
                <button className="button" onClick={() => endGame()}>סיים משחק</button>
            </div>
            {isScoreErrorMessage &&
            <div>
                <span>{scoreErrorMessage}</span>
                <button className="button ok_button" onClick={() => setIsScoreErrorMessage(false)}>OK</button>
            </div>
            }
        </div>
    )
}