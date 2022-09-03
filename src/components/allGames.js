
import { useState } from "react"
import { useSelector } from "react-redux"
import { getPlayerByParticipantIdFromStore, participantsNames } from "./utils"


export default function AllGamesComp() {

    const participants = useSelector(state => state.participants)
    const allResults = useSelector(state => state.allResults)
    const players = useSelector(state => state.players)
    const [isPresentResults, setIsPresentResults] = useState(false)
    const [wantedPlayerName, setWantedPlayerName] = useState("")


    return (
        <div className="container">
            <button onClick={() => setIsPresentResults(!isPresentResults)}>כל התוצאות</button>
            {isPresentResults &&
            <div>
                <span>חפש</span>
                <input type="text" onChange={(e) => setWantedPlayerName(e.target.value)}></input>
                {allResults.filter(result => {
                    const namesOptions = participantsNames(participants, players).filter(n => n.toLowerCase().startsWith(wantedPlayerName.toLowerCase()))
                    const name1 = getPlayerByParticipantIdFromStore(result.participant1.id, participants, players)?.data.name
                    const name2 = getPlayerByParticipantIdFromStore(result.participant2.id, participants, players)?.data.name
                    return (namesOptions.includes(name1) || namesOptions.includes(name2))
                })
                .map((result, index) => {
                    const name1 = getPlayerByParticipantIdFromStore(result.participant1.id, participants, players)?.data.name
                    const name2 = getPlayerByParticipantIdFromStore(result.participant2.id, participants, players)?.data.name
                    let participant1Score
                    let participant2Score
                    let participant1Name
                    let participant2Name
                    if (name1.toLowerCase().startsWith(wantedPlayerName.toLowerCase())) {
                        participant1Name = name1
                        participant2Name = name2
                        participant1Score = result.participant1.score
                        participant2Score = result.participant2.score
                    }
                    else {
                        participant1Name = name2
                        participant2Name = name1
                        participant1Score = result.participant2.score
                        participant2Score = result.participant1.score
                    }
                    return (
                        <div key={index}>
                            <span>{participant1Name}</span>
                            <span>{participant1Score}</span>
                            <span>{participant2Name}</span>
                            <span>{participant2Score}</span>
                        </div>
                    )
                })}
            </div>
            }
        </div>
    )
}