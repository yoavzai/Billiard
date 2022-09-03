
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getOptionalParticipantsIdsToPlay,
         getPlayerByParticipantIdFromStore, 
         playerSelectedToTable,
         clearTable,
         updateTableNumber,
         updateParticipantScore,
         removeTable,
         endGame, 
         isValidScore,
         cancelGame,
         startGame,
         setTableFreezeStatus} from "./utils"

export default function TableComp(props) {
   
    const dispatch = useDispatch()
    const table = props.table
    const currentTournament = useSelector(state => state.currentTournament)
    const tables = useSelector(state => state.tables)
    const currentRound = useSelector(state => state.currentRound)
    const players = useSelector(state => state.players)
    const participants = useSelector(state => state.participants)
    const rankings = useSelector(state => state.rankings)
    const [isInputErrorMessage, setIsInputErrorMessage] = useState(false)
    const [inputErrorMessage, setInputErrorMessage] = useState("")
    const [isDeleteTableConfirmation, setIsDeleteTableConfirmation] = useState(false)

    async function participant1Selected(newParticipantId) {
        setIsInputErrorMessage(false)
        playerSelectedToTable(table, tables, newParticipantId, 1, currentRound, currentTournament, dispatch)
    }

    async function participant2Selected(newParticipantId) {
        setIsInputErrorMessage(false)
        playerSelectedToTable(table, tables, newParticipantId, 2, currentRound, currentTournament, dispatch)
    }

    async function clear() {
        clearTable(table, tables, currentRound, currentTournament, dispatch)
    }

    async function start() {
        if (table.data.participant1Id === "" || table.data.participant2Id === "") {
            setIsInputErrorMessage(true)
            setInputErrorMessage("הכנס שני שחקנים")
            return
        }
        startGame(table, tables, participants, players, rankings, dispatch, currentRound, currentTournament.id)
    }

    async function cancel() {
        setIsInputErrorMessage(false)
        cancelGame(table, tables, currentRound, currentTournament, dispatch)
    }

    async function end() {
        const res = isValidScore([table.data.participant1Score, table.data.participant2Score])
        if (res.status === false) {
            setIsInputErrorMessage(true)
            setInputErrorMessage(res.message)
            return
        }
        setIsInputErrorMessage(false)
        endGame(table, tables, currentRound, currentTournament, participants, players, dispatch)
    }

    function participant1NameAndRanking() {
        const player = getPlayerByParticipantIdFromStore(table.data.participant1Id, participants, players)
        return (
            `${player?.data.name} (${player?.data.ranking})`
        )
    }

    function participant2NameAndRanking() {
        const player = getPlayerByParticipantIdFromStore(table.data.participant2Id, participants, players)
        return (
            `${player?.data.name} (${player?.data.ranking})`
        )
    }

    function deleteTable() {
        removeTable(table, tables, dispatch)
    }

    function freezeTable() {
        setTableFreezeStatus(table, tables, true, dispatch)
    }
 
    function unfreezeTable() {
        setTableFreezeStatus(table, tables, false, dispatch)
    }

    function editParticipantScore(newScore, playerNumber) {
        setIsInputErrorMessage(false)
        updateParticipantScore(newScore, table, tables, playerNumber, dispatch)
    }


    return (
            <div className={`table_container ${table.data.isTaken ? "taken_table" : (table.data.isFrozen ? "frozen_table" : "free_table")}`}>
                {table?.data.isTaken ?
                <div className="table_taken_contianer">
                    <div>
                        <span>מספר שולחן</span>
                        <input type="text"
                                onChange={(e) => updateTableNumber(table, tables, e.target.value, dispatch)}
                                value={table.data.number}>
                        </input>
                    </div>
                    <div className="text_input_container">
                        <span>{participant1NameAndRanking()}</span>
                        <input className={`score_input ${isInputErrorMessage ? "error_input" : ""}`}
                                type="text"
                                value={table.data.participant1Score}
                                onChange={(e) => editParticipantScore(e.target.value, 1)}></input>
                    </div>
                    <div className="text_input_container">
                        <span>{participant2NameAndRanking()}</span>
                        <input className={`score_input ${isInputErrorMessage ? "error_input" : ""}`}
                                type="text"
                                value={table.data.participant2Score}
                                onChange={(e) => editParticipantScore(e.target.value, 2)}></input>
                    </div>
                    <div className="buttons_container">
                        <button className="button" onClick={end}>סיים משחק</button>
                        <button className="button" onClick={cancel}>בטל משחק</button>
                    </div>
                </div>
                :
                table?.data.isFrozen ?
                <div>
                    <div className="buttons_container">
                        <button className="button" onClick={unfreezeTable}>החזר שולחן לפעילות</button>
                    </div> 
                    <div>
                        <span>מספר שולחן</span>
                        <input type="text"
                                onChange={(e) => updateTableNumber(table, tables, e.target.value, dispatch)}
                                value={table.data.number}>
                        </input>
                    </div>
                </div>
                :
                <div className="free_table_container">
                    <div className="buttons_container">
                        <button className="button delete_button" onClick={() => setIsDeleteTableConfirmation(true)}>מחק שולחן</button>
                        <button className="button freeze_button" onClick={freezeTable}>הקפא שולחן</button>
                    </div>
                    {isDeleteTableConfirmation &&
                    <div className="confirmation_container">
                        <span>האם אתה בטוח שברצונך למחוק את השולחן?</span>
                        <div className="buttons_container">
                            <button className="button yes_button" onClick={deleteTable}>כן</button>
                            <button className="button no_button" onClick={() => setIsDeleteTableConfirmation(false)}>לא</button>
                        </div>
                    </div>
                    }
                    <div>
                        <span>מספר שולחן</span>
                        <input type="text"
                                onChange={(e) => updateTableNumber(table, tables, e.target.value, dispatch)}
                                value={table.data.number}>
                        </input>
                    </div>
                    <div>
                        <span>שחקנים</span>
                    </div>
                    <div className="select_container">
                        <label htmlFor="select-participant1"></label>
                        <select className={`${isInputErrorMessage ? "error_input" : ""}`}
                                id="select-participant1"
                                name="select-participant1"
                                onChange={e => participant1Selected(e.target.value)}
                                onClick={e => e.preventDefault()}
                                value={table.data.participant1Id}>
                            <option></option>
                            {getOptionalParticipantsIdsToPlay(currentRound, table.data.participant2Id, participants, players).map((participantId,index) => {
                                const player = getPlayerByParticipantIdFromStore(participantId, participants, players)
                                return (
                                    <option key={index} value={participantId}>{`${player?.data.name} (${player?.data.ranking})`}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="select_contianer">
                        <label htmlFor="select-participant2"></label>
                        <select className={`${isInputErrorMessage ? "error_input" : ""}`}
                                id="select-participant2"
                                name="select-participant2"
                                onChange={e => participant2Selected(e.target.value)}
                                value={table.data.participant2Id}>
                            <option></option>
                            {getOptionalParticipantsIdsToPlay(currentRound, table.data.participant1Id, participants, players).map((participantId,index) => {
                                const player = getPlayerByParticipantIdFromStore(participantId, participants, players)
                                return (
                                    <option key={index} value={participantId}>{`${player?.data.name} (${player?.data.ranking})`}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="buttons_container">
                        <button className="button" 
                                onClick={start}
                                disabled={table.data.participant1Id.length > 0 && table.data.participant2Id.length > 0 ? false : true}>
                                התחל משחק
                        </button>
                        <button className="button" onClick={clear}>נקה</button>
                    </div> 
                </div>
                }
                {isInputErrorMessage &&
                <div className="error_message_container">
                    <span>{inputErrorMessage}</span>
                </div>
                }
            </div>

    )}