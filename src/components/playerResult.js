
import { useEffect } from "react"
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { isValidScore, 
         updateResult,
         removeResult, 
         getRoundByNumberFromServer} from "./utils"
 


export default function PlayerResultComp(props) {

    const dispatch = useDispatch()
    const roundNumber = props. roundNumber
    const result = props.result
    const players = useSelector(state => state.players)
    const participants = useSelector(state => state.participants)
    const currentTournament = useSelector(state => state.currentTournament)
    const currentRound = useSelector(state => state.currentRound)
    const rounds = useSelector(state => state.rounds)
    const standings = useSelector(state => state.standings)
    const [newResult, setNewResult] = useState({})
    const [isEditResult, setIsEditResult] = useState(false)
    const [isEditResultErrorMessage, setIsEditResultErrorMessage] = useState(false)
    const [editResultErrorMessage, setEditResultErrorMessage] = useState("")
    const [isDeleteResultConfirmation, setIsDeleteResultConfirmation] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isErasing, setIsErasing] = useState(false)


    useEffect(() => {
        setNewResult({player1Score: result.player1Score, player2Score: result.player2Score})
    }, [result])

    useEffect(() => {
        setIsErasing(false)
    },[standings])
    
    async function editResult() {
        const res = isValidScore([newResult.player1Score, newResult.player2Score])
        if (res.status === false) {
            setIsEditResultErrorMessage(true)
            setEditResultErrorMessage(res.message)
            return
        }
        setIsEditResultErrorMessage(false)

        const originalResult = result.originalResult
        const round = await getRoundByNumberFromServer(roundNumber, rounds, currentTournament.id)
        const player1Won = newResult.player1Score > newResult.player2Score ? true : false
        const player2Won = !player1Won
        let newResultData = {}

        if (result.originalParticipantNumber === 1) {
            newResultData = {participant1Score: newResult.player1Score,
                             participant2Score: newResult.player2Score,
                             participant1Won: player1Won,
                             participant2Won: player2Won}
        }
        else {
            newResultData = {participant1Score: newResult.player2Score,
                participant2Score: newResult.player1Score,
                participant1Won: player2Won,
                participant2Won: player1Won}
        }
        setIsEditResult(false)
        setIsUpdating(true)
        
        await updateResult(originalResult, 
            newResultData,
            round,
            currentRound,
            currentTournament,
            dispatch)
            
        setIsUpdating(false)
    }

    function deleteResultBtnClick() {
        setIsDeleteResultConfirmation(true)
    }

    async function deleteResultConfirmed() {
        setIsDeleteResultConfirmation(false)
        setIsErasing(true)
        const round = await getRoundByNumberFromServer(roundNumber, rounds, currentTournament.id)
        await removeResult(result.originalResult, round, currentRound, currentTournament, players, participants, dispatch)
    }

    function cancelEditResult() {
        setIsEditResult(false)
        setIsEditResultErrorMessage(false)
        setNewResult({player1Score: result.player1Score, player2Score: result.player2Score})
    }

    return (
        <div className="round_result_container">
            {currentTournament.data.isActive ?
            <div>
                {isEditResult ?
                <div className="edit_result_container">
                    <div className="text_input_container">
                        <span>{result.player1Name}</span>
                        <input  className={`${isEditResultErrorMessage ? "error_input" : ""}`}
                                type="text" value={newResult.player1Score}
                                onChange={(e) => {setNewResult({...newResult, player1Score: e.target.value}); setIsEditResultErrorMessage(false)}}>
                        </input>
                    </div>
                    <div className="text_input_container">
                        <span>{result.player2Name}</span>
                        <input  className={`${isEditResultErrorMessage ? "error_input" : ""}`}
                                type="text" value={newResult.player2Score}
                                onChange={(e) => {setNewResult({...newResult, player2Score: e.target.value}); setIsEditResultErrorMessage(false)}}>
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
                isUpdating ?
                <div>
                    <span>מעדכן...</span>
                </div> :
                isErasing ?
                <div>
                    <span>מוחק...</span>
                </div> :
                <div className={`result_container ${result.won ? "player_won" : "player_lost"}`}>
                    <span>{result.player1Name}</span>
                    <span>{result.player1Score}</span>
                    <span>{result.player2Name}</span>
                    <span>{result.player2Score}</span>

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
            <div className={`result_container ${result.won ? "player_won" : "player_lost"}`}>
                <span>{result.player1Name}</span>
                <span>{result.player1Score}</span>
                <span>{result.player2Name}</span>
                <span>{result.player2Score}</span>
            </div>
            }
        </div>
    )
}


