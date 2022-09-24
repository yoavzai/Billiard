
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { clearParticipantFromTable, isParticipantFree, updatePlayerChecked} from "./utils"


export default function RoundParticipant(props) {

    const dispatch = useDispatch()
    const participant = props.participant
    const currentRound = props.currentRound
    const name = props.name
    const tables = useSelector(state => state.tables)
    const currentTournament = useSelector(state => state.currentTournament)
    const [isFree, setIsFree] = useState(true)
    const [isArrived, setIsArrived] = useState(false)
    

    useEffect(() => {
        const arrivedParticipant = currentRound?.data?.arrivedParticipants?.find(e => e.participantId === participant.id)
        if (arrivedParticipant !== undefined) {
            setIsArrived(true)
            if (arrivedParticipant.isFree) {
                setIsFree(true)
            }
            else {
                setIsFree(false)
            }
        } 
        else {
            setIsArrived(false)
        }
    }, [currentRound, tables])


    async function playerChecked(e) {
        if (e.target.checked === false) {
            if(isParticipantFree(currentRound.data.arrivedParticipants, participant.id)) {
                clearParticipantFromTable(tables, participant.id, dispatch)
            }
            else {  
                e.target.checked = true
                return
            }
        }
        updatePlayerChecked(e.target.checked, currentTournament.id, participant.id, currentRound, dispatch)
    }


    function isParticipantArrived() {
        if (currentRound?.data?.arrivedParticipants.find(p => p.participantId === participant.id) === undefined) {
            return false
        }
        return true
    }

    return (
        <div className={`round_participant_container ${isArrived ? (isFree ? "free_player" : "not_free_player") : ""}`}>
            <label htmlFor={participant.id}>{name}</label>
            <input className="checkbox" checked={isParticipantArrived()}
                id={participant.id}
                onChange={playerChecked}
                type="checkbox"
                disabled={!currentRound?.data?.isActive}
                value={name} 
                name={name}>
            </input>
        </div>
    )
}