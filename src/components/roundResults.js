
import { useState } from "react"
import { useSelector } from "react-redux"
import RoundResultComp from "./roundResult"
import { getPlayerByParticipantIdFromStore, participantsNames } from "./utils"



export default function RoundResultsComp() {

    const currentRound = useSelector(state => state.currentRound)
    const participants = useSelector(state => state.participants)
    const players = useSelector(state => state.players)
    const [wantedPlayerName, setWantedPlayerName] = useState("")


    return (
        <div className="round_results_container">
            <h3>{`משחקים שהסתיימו (${currentRound?.data?.results.length})`}</h3>
            <div className="text_input_container">
                <label htmlFor="search-player">חפש</label>
                <input type="text" onChange={(e) => setWantedPlayerName(e.target.value)}></input>
            </div>
            {currentRound?.data?.results
            .filter(result => {
                const namesOptions = participantsNames(participants, players).filter(n => n.toLowerCase().startsWith(wantedPlayerName.toLowerCase()))
                const name1 = getPlayerByParticipantIdFromStore(result.participant1.id, participants, players)?.data.name
                const name2 = getPlayerByParticipantIdFromStore(result.participant2.id, participants, players)?.data.name
                return (namesOptions.includes(name1) || namesOptions.includes(name2))
            })
            .map((result, index) => {
                return (
                    <div key={index}>
                        <RoundResultComp result={result}></RoundResultComp>
                    </div>
                )
            })}
        </div>
    )
}