
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getPlayerByParticipantIdFromStore, 
         isValidScore, 
         updateResult,
         removeResult } from "./utils"


export default function RoundResultComp(props) {

    const dispatch = useDispatch()
    const result = props.result
    const players = useSelector(state => state.players)
    const participants = useSelector(state => state.participants)
    const currentTournament = useSelector(state => state.currentTournament)
    const currentRound = useSelector(state => state.currentRound)
    const [newResult, setNewResult] = useState({participant1Score: result?.participant1?.score, participant2Score: result?.participant2?.score})
    const [isEditResult, setIsEditResult] = useState(false)
    const [isEditResultErrorMessage, setIsEditResultErrorMessage] = useState(false)
    const [editResultErrorMessage, setEditResultErrorMessage] = useState("")
    const [isDeleteResultConfirmation, setIsDeleteResultConfirmation] = useState(false)

    function editResult() {
        const res = isValidScore([newResult.participant1Score, newResult.participant2Score])
        if (res.status === false) {
            setIsEditResultErrorMessage(true)
            setEditResultErrorMessage(res.message)
            return
        }
        setIsEditResultErrorMessage(false)
        const participant1Won = newResult.participant1Score > newResult.participant2Score ? true : false
        const participant2Won = !participant1Won

        updateResult(result, 
                     {...newResult, participant1Won: participant1Won, participant2Won: participant2Won},
                     currentRound, currentTournament, 
                     players,
                    participants,
                    dispatch)
        setIsEditResult(false)
    }

    function deleteResultBtnClick() {
        setIsDeleteResultConfirmation(true)
    }

    async function deleteResultConfirmed() {
        setIsDeleteResultConfirmation(false)
        removeResult(result, currentRound, currentTournament, players, participants, dispatch)
    }

    function cancelEditResult() {
        setIsEditResult(false)
        setIsEditResultErrorMessage(false)
        setNewResult({participant1Score: result?.participant1?.score, participant2Score: result?.participant2?.score})
    }

    return (
        <div className="round_result_container">
            {currentTournament.data.isActive ?
            <div>
                {isEditResult ?
                <div className="edit_result_container">
                    <div className="text_input_container">
                        <span>{getPlayerByParticipantIdFromStore(result?.participant1?.id, participants, players)?.data.name}</span>
                        <input  className={`${isEditResultErrorMessage ? "error_input" : ""}`}
                                type="text" value={newResult.participant1Score}
                                onChange={(e) => {setNewResult({...newResult, participant1Score: e.target.value}); setIsEditResultErrorMessage(false)}}>
                        </input>
                    </div>
                    <div className="text_input_container">
                        <span>{getPlayerByParticipantIdFromStore(result?.participant2?.id, participants, players)?.data.name}</span>
                        <input  className={`${isEditResultErrorMessage ? "error_input" : ""}`}
                                type="text" value={newResult.participant2Score}
                                onChange={(e) => {setNewResult({...newResult, participant2Score: e.target.value}); setIsEditResultErrorMessage(false)}}>
                        </input>
                    </div>
                    <div className="buttons_container">
                        <button className="button" onClick={editResult}>שמור</button>
                        <button className="button" onClick={cancelEditResult}>בטל</button>
                    </div>
                    {isEditResultErrorMessage &&
                    <div className="error_message_container">
                        <span>{editResultErrorMessage}</span>
                    </div>
                    }

                </div> :
                <div className="result_container">
                    <span>{getPlayerByParticipantIdFromStore(result?.participant1?.id, participants, players)?.data.name}</span>
                    <span>{result?.participant1?.score}</span>
                    <span>{getPlayerByParticipantIdFromStore(result?.participant2?.id, participants, players)?.data.name}</span>
                    <span>{result?.participant2?.score}</span>

                    {isDeleteResultConfirmation ?
                    <div className="confirmation_container">
                        <span>האם אתה בטוח שאתה רוצה למחוק את התוצאה?</span>
                        <div className="buttons_container">
                            <button className="button yes_button" onClick={deleteResultConfirmed}>כן</button>
                            <button className="button no_button" onClick={() => setIsDeleteResultConfirmation(false)}>לא</button>
                        </div>
                    </div> :
                    <div className="buttons_container">
                        <button className="button edit_button" onClick={() => {setIsEditResult(true); setIsDeleteResultConfirmation(false)}}>ערוך</button>
                        <button className="button delete_button" onClick={deleteResultBtnClick}>מחק</button>
                    </div>
                    }
                </div>
                }
            </div> :
            <div className="result_container">
                <span>{getPlayerByParticipantIdFromStore(result?.participant1?.id, participants, players)?.data.name}</span>
                <span>{result?.participant1?.score}</span>
                <span>{getPlayerByParticipantIdFromStore(result?.participant2?.id, participants, players)?.data.name}</span>
                <span>{result?.participant2?.score}</span>
            </div>
            }
        </div>
    )
}


