
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import PlayerResults from "./playerResults"



export default function StandingsComp() {

    const standings = useSelector(state => state.standings)
    const [isPresentPlayerResults, setIsPresentPlayerResults] = useState(false)
    const [playerToPresentResults, setPlayerToPresentResults] = useState({})

    useEffect(() => {
        setIsPresentPlayerResults(false)
    }, [standings])

    function presentPlayerResultsBtnClick(player) {
        setPlayerToPresentResults(player)
        setIsPresentPlayerResults(true)
    }

    function closePlayerResults() {
        setIsPresentPlayerResults(false)
    }     
    
    return (
        <div className="container standings_container">
            <h2>מקומות</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>מקום</th>
                        <th>שם</th>
                        <th>משחקים</th>
                        <th>נצחונות</th>
                        <th>הפסדים</th>
                        <th>הפרש</th>
                        <th>תוצאות</th>
                    </tr>
                </thead>
                <tbody>
                {standings.map((player, index) => {
                    return (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{player.name}</td>
                            <td>{player.games}</td>
                            <td>{player.wins}</td>
                            <td>{player.losses}</td>
                            <td>{player.plusMinus}</td>
                            <td><button className="button" onClick={() => presentPlayerResultsBtnClick(player)}>הצג</button></td>
                        </tr>
                    )
                })}
                </tbody>

            </table>
            {isPresentPlayerResults && <PlayerResults player={playerToPresentResults} closeComponentFunc={closePlayerResults}></PlayerResults>}
        </div>
    )
}