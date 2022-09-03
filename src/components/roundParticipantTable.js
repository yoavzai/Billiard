
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"



export default function RoundParticipantTableComp(props) {

    const tables = useSelector(state => state.tables)
    const participant = props.participant
    const addParticipant = props.addParticipantToNewGame
    const [participantTableNumber, setParticipantTableNumber] = useState("")

    useEffect(() => {
        const table = tables.find(t => {
            return ((t.data.participant1Id === participant.id || t.data.participant2Id === participant.id) && t.data.isTaken)
        })

        setParticipantTableNumber(table === undefined ? "" : table.data.number)
    }, [])


    // function participantTableNumber(participantId) {
    //     const table = tables.find(t => {
    //         return ((t.data.participant1Id === participantId || t.data.participant2Id === participantId) && t.data.isTaken)
    //     })

    //     return table === undefined ? "" : table.data.number
    // }

    function tableNumberChange(tableNum) {
        addParticipant(participant, tableNum)
    }

    return (
        <div>
            {participantTableNumber.length > 0 ?
            <div>
                <span>{participantTableNumber}</span>
            </div> :
            <div>
                <input id={'table'+participant.id} type="text" onChange={e => tableNumberChange(e.target.value)}></input>
            </div>
            }
        </div>
    )
}