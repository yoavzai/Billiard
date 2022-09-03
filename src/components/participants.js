
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import GamesLeftComp from "./gamesLeft"
import ParticipantComp from "./participant"
import { addParticipant,
         addPlayer,
         getParticipantByNameFromStore,
         getPlayerByNameFromStore, 
         getPlayersFromServer, 
         playersNotRegistered} from "./utils"



export default function ParticipantsComp() {

    const dispatch = useDispatch()
    const rankings = useSelector(state => state.rankings)
    const participants = useSelector(state => state.participants)
    const players = useSelector(state => state.players)
    const currentTournament = useSelector(state => state.currentTournament)
    const [wantedPlayerName, setWantedPlayerName] = useState("")
    const [isAddPlayer, setIsAddPlayer] = useState(false)
    const [newPlayerData, setNewPlayerData] = useState({name: "", ranking : rankings[0]})
    const [isAddPlayerConfirmation, setIsAddPlayerConfirmation] = useState(false)
    const [isAddPlayerErrorMessage, setIsAddPlayerErrorMessage] = useState(false)
    const [addPlayerErrorMessage, setAddPlayerErrorMessage] = useState("")
    // const [isConfirmation, setIsConfirmation] = useState(false)
    const [playerOptions, setPlayerOptions] = useState([])

    async function addNewPlayer() {
        const time = new Date()
        const newPlayer = await addPlayer({...newPlayerData, date: time.getTime()}, players, dispatch)
        setNewPlayerData({name: "", ranking : rankings[0]})
        setIsAddPlayer(false)
        await addNewParticipant(newPlayer)
        const newPlayers = await getPlayersFromServer()
        dispatch({type: "players", payload: newPlayers})
        // setIsConfirmation(true)
    }

    function addPlayerConfirmed() {
        setIsAddPlayerConfirmation(false)
        setIsAddPlayer(true)
        setAddPlayerErrorMessage(false)
        setNewPlayerData({...newPlayerData, name: wantedPlayerName})
    }


    async function addNewParticipant(player) {
        setWantedPlayerName("")
        const time = new Date()
        const newParticipantData = {playerId: player.id, date: time.getTime(), participantsToPlayIds: participants.map(participant => participant.id)}
        addParticipant(newParticipantData,
                        currentTournament.id, 
                        participants,
                        dispatch) 
    }

    async function addNewParticipantBtnClick() {
        if (wantedPlayerName.length === 0) {
            setIsAddPlayerErrorMessage(true)
            setAddPlayerErrorMessage("הכנס שם")
            return
        }
        const participant = getParticipantByNameFromStore(wantedPlayerName, participants, players)
        if (participant !== undefined) {
            setIsAddPlayerErrorMessage(true)
            setAddPlayerErrorMessage("שחקן זה כבר רשום")
            // setWantedPlayerName("")
            return
        }
        setAddPlayerErrorMessage(false)
        const player = getPlayerByNameFromStore(wantedPlayerName, players)
        if (player === undefined) {
            setIsAddPlayerConfirmation(true)
            return
        }
        addNewParticipant(player)
    }

    function searchPlayer(e) {
        setIsAddPlayerErrorMessage(false)
        setWantedPlayerName(e.target.value)
        if (e.target.value.length === 0) {
            setPlayerOptions([])
            return
        }

        setPlayerOptions(playersNotRegistered(players, participants)
                        .filter(player => player.data.name.toLowerCase().startsWith(e.target.value.toLowerCase())))

        // if (e.nativeEvent.inputType != "deleteContentBackward")
        // {
        //     const playerOptions =
        //         playersNotRegistered(players, participants)
        //         .filter(player => player.data.name.toLowerCase().startsWith(e.target.value.toLowerCase()))
            
        //     if (playerOptions.length === 1) {
        //         setWantedPlayerName(playerOptions[0].data.name)
        //         //add small delay
        //     }
        // }
    }

    function cancelNewPlayer() {
        setNewPlayerData({name: "", ranking : rankings[0]})
        setIsAddPlayerErrorMessage(false)
        setIsAddPlayer(false)
    }

    function sortedParticipantsByGamesLeft() {
        const sorted = participants.sort((a,b) => {
            const difference = b.data.participantsToPlayIds.length - a.data.participantsToPlayIds.length
            if (difference !== 0) {
                return difference
            }
            return b.data.date - a.data.date
        })
        return sorted
    }

    return (
        <div className="container participants_container">
            <h2><span>משתתפים</span><span>{` (${participants.length})`}</span></h2>
            {currentTournament?.data?.isActive &&
            <div className="add_participant_container">
                <div className="text_input_container">
                    <label htmlFor="choose-players-text-input">הוסף משתתף</label>
                    <input className={`${isAddPlayerErrorMessage ? "error_input" : ""}`}
                            type="text"
                        onChange={searchPlayer}
                        id="choose-players-text-input"
                        value={wantedPlayerName}></input>
                </div>
                <div>
                    <ul>
                    {playerOptions.map(p => {
                        return <li><button value={p.data.name} onClick={(e) => {setWantedPlayerName(e.target.value); setPlayerOptions([])}}>{p.data.name}</button></li>
                    })}
                    </ul>
                </div>
                {isAddPlayerConfirmation ?
                <div className="container confirmation_container">
                    <span>אין שחקן כזה במאגר השחקנים. האם ליצור שחקן חדש?</span>
                    <div className="buttons_container">
                        <button className="button yes_button" onClick={addPlayerConfirmed}>כן</button>
                        <button className="button no_button" onClick={() => setIsAddPlayerConfirmation(false)}>לא</button>
                    </div>
                </div> :
                isAddPlayer ?
                <div className="container update_player_form_container">
                    <form>
                        <div className="input_text_container">
                            <label htmlFor="name">שם</label>
                            <input readOnly value={wantedPlayerName} name="name" type="text"></input>
                        </div>
                        <div className="select_container">
                            <label htmlFor="ranking-select">דירוג</label>
                            <select name="ranking-select" defaultValue={rankings[0]}
                                    onChange={(e) => setNewPlayerData({...newPlayerData, ranking: e.target.value})}>
                                    {rankings.map((rank, index) => {
                                        return <option key={index} value={rank}>{rank}</option>
                                    })}
                            </select>
                        </div>
                        <div className="buttons_container">
                            <input className="button" type="button" onClick={addNewPlayer} value="הוסף"></input>
                            <input className="button" type="button" onClick={cancelNewPlayer} value="בטל"></input>
                        </div>
                    </form>
                    {isAddPlayerErrorMessage &&
                    <div className="error_message_container">
                        <span>{addPlayerErrorMessage}</span>
                        {/* <button onClick={() => setIsAddPlayerErrorMessage(false)}>Ok</button>    */}
                    </div>
                    }
                </div> :
                <div className="buttons_container">
                        <button disabled={wantedPlayerName.length === 0 ? true : false} className="button" onClick={addNewParticipantBtnClick}>הוסף</button>
                </div>
                }       
            </div>
            }
            {/* {isConfirmation && 
            <div className="confirmation_container">
                <span>שחקן הוסף</span>
                <div className="buttons_container">
                    <button className="button ok_button" onClick={() => setIsConfirmation(false)}>Ok</button>
                </div>
            </div>} */}
            <div className="participants_table">
                <table className="table">
                    <thead>
                        <tr>
                            <th>שם</th>
                            <th>משחקים שנשארו</th>
                        </tr>
                    </thead>
                    <tbody>
                    {sortedParticipantsByGamesLeft().map(participant => {
                        return (
                            <tr key={participant.id}>
                                <td><ParticipantComp participant = {participant}></ParticipantComp></td>
                                <td><GamesLeftComp participant = {participant}></GamesLeftComp></td>
                            </tr>
                        )
                    })}

                    </tbody>
                </table>
            </div>     
        </div>
    )
}