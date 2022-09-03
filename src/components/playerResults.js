
import { useSelector } from "react-redux"
import { getPlayerByParticipantIdFromStore } from "./utils"


export default function PlayerResults(props) {

    const player = props.player
    const participants = useSelector(state => state.participants)
    const players = useSelector(state => state.players)
    const rounds = useSelector(state => state.rounds)


    function playerResults() {
        let playerResults = {}
        for (const round of rounds) {
            playerResults[round.data.number] = []
        }
        for (const result of player.results) {
            if (result.participant1.id === player.participantId) {
                const won = result.participant1.won
                const player1Name = player.name
                const player1Score = result.participant1.score
                const player2Name = getPlayerByParticipantIdFromStore(result.participant2.id, participants, players)?.data?.name
                const player2Score = result.participant2.score
                playerResults[result.roundNumber].push({player1Name: player1Name,
                                                  player1Score: player1Score, 
                                                  player2Name: player2Name, 
                                                  player2Score: player2Score, 
                                                  won: won,
                                                  })
            }
            else if (result.participant2.id === player.participantId) {
                const won = result.participant2.won
                const player1Name = player.name
                const player1Score = result.participant2.score
                const player2Name = getPlayerByParticipantIdFromStore(result.participant1.id, participants, players)?.data?.name
                const player2Score = result.participant1.score
                playerResults[result.roundNumber].push({player1Name: player1Name, 
                                                  player1Score: player1Score,
                                                  player2Name: player2Name,
                                                  player2Score: player2Score,
                                                  won: won,
                                                  })
            }
        }
        return playerResults
    }


    return (
        <div className="container player_results_container">
            <div className="buttons_container">
                <button className="button close_button" onClick={() => props.closeComponentFunc()}>סגור</button>
            </div>
            <h3>{player.name}</h3>
            {Object.entries(playerResults()).map(round => {
                const roundNumber = round[0]
                return (
                <div className="player_round_results_container" key={roundNumber}>
                    <h4>
                        <span>סיבוב</span>
                        <span>{" " + roundNumber}</span>
                    </h4>
                    {round[1].length === 0 ?
                    <span>לא שיחק</span> :
                    <div>
                    {round[1].map((result, index) => {
                        return (
                            <div key={index} className={`result_container ${result.won ? "player_won" : "player_lost"}`}>
                                <span>{result.player1Name}</span>
                                <span>{result.player1Score}</span>
                                <span>{result.player2Name}</span>
                                <span>{result.player2Score}</span>
                            </div>

                        )
                    })}

                    </div>
                    }

                </div>
                )
            })}
        </div>
    )
} 