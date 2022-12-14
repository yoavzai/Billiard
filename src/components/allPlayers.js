
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import PlayerComp from "./player"
import { addPlayer, getPlayersFromServer, isValidNewPlayer } from "./utils"


export default function AllPlayersComp() {

    const dispatch = useDispatch()
    const rankings = useSelector(state => state.rankings)
    const userName = useSelector(state => state.userName)
    const players = useSelector(state => state.players)
    // const [isAddPlayer, setIsAddPlayer] = useState(false)
    const [newPlayerData, setNewPlayerData] = useState({name: "", ranking : rankings[0]})
    const [isAddPlayerConfirmation, setIsAddPlayerConfirmation] = useState(false)
    const [searchPlayerString, setSearchPlayerString] = useState("")
    const [isAddPlayerErrorMessage, setIsAddPlayerErrorMessage] = useState(false)
    const [addPlayerErrorMessage, setAddPlayerErrorMessage] = useState("")
    const [isAddingToServer, setIsAddingToServer] = useState(false)

    async function addNewPlayer() {
        setIsAddPlayerErrorMessage(false)
        setIsAddPlayerConfirmation(false)
        setIsAddingToServer(true)
        const time = new Date()
        await addPlayer({...newPlayerData, date: time.getTime()}, players, dispatch)
        setIsAddingToServer(false)
        setNewPlayerData({name: "", ranking : rankings[0]})
        // const newPlayers = await getPlayersFromServer()
        // dispatch({type: "players", payload: newPlayers})
        // setIsAddPlayer(false)
        // setIsConfirmation(true)
    }

    function addNewPlayerBtnClick() {
        const res = isValidNewPlayer(newPlayerData, players)
        if (res.status === false) {
            setIsAddPlayerErrorMessage(true)
            setAddPlayerErrorMessage(res.message)
            return
        }
        setIsAddPlayerConfirmation(true)
    }

    function cancelNewPlayer() {
        setNewPlayerData({name: "", ranking : rankings[0]})
        setIsAddPlayerErrorMessage(false)
        // setIsAddPlayer(false)
    }

    return (
        <div className="all_players_container">
            <div className="user_name_container">
                <span>{`???? ??????????: ${' '+userName}`}</span>
                <div>
                    <button className="button" onClick={() => window.location.reload()}>??????????</button>
                </div>
            </div>
            <div className='navigation_menu_container'>
                <Link to="/">??????</Link>
                <Link to="/players">????????????</Link>
            </div>
            <h2>????????????</h2>
            <div className="container update_player_form_container">
                <h4>???????? ????????</h4>
                <form>
                    <div className="text_input_container">
                        <label htmlFor="name">????</label>
                        <input className={`${isAddPlayerErrorMessage ? "error_input" : ""}`}
                                name="name" type="text" 
                                value={newPlayerData.name}
                                onChange={(e) => {setNewPlayerData({...newPlayerData, name: e.target.value}); setIsAddPlayerErrorMessage(false)}}></input>
                    </div>

                    <div className="select_container">
                        <label htmlFor="ranking-select">??????????</label>
                        <select name="ranking-select" value={newPlayerData.ranking}
                                onChange={(e) => setNewPlayerData({...newPlayerData, ranking: e.target.value})}>
                                {rankings.map((rank, index) => {
                                    return <option key={index} value={rank}>{rank}</option>
                                })}
                        </select>
                    </div>
                    {isAddPlayerConfirmation ?
                        <div className="confirmation_container">
                            <span>???????????? ????????</span>
                            <span>{" ????: " + newPlayerData.name + ", ??????????: " + newPlayerData.ranking}</span>
                            <span>?</span>
                            <div className="buttons_container">
                                <button className="button yes_button" onClick={addNewPlayer}>????</button>
                                <button className="button no_button" onClick={() => setIsAddPlayerConfirmation(false)}>????</button>
                            </div>                      
                        </div> :
                        isAddingToServer ?
                            <div>
                                <span>?????????? ????</span>
                                <span>{" " + newPlayerData.name + "..."}</span>
                            </div> :
                        <div className="buttons_container">
                            <input disabled={newPlayerData.name.length === 0 ? true : false} className="button" type="button" onClick={addNewPlayerBtnClick} value="????????"></input>
                            {/* <input className="button" type="button" onClick={cancelNewPlayer} value="??????"></input> */}
                        </div>
                    }
                </form>
                {isAddPlayerErrorMessage &&
                <div className="error_message_container">
                    <div>
                        <span>{addPlayerErrorMessage}</span>
                    </div>
                    {/* <button onClick={() => setIsAddPlayerErrorMessage(false)}>Ok</button> */}
                </div>
                }
            </div>
            {/* {isConfirmation && 
            <div className="confirmation_container">
                <span>???????? ????????</span>
                <div className="buttons_container">
                    <button className="button ok_button" onClick={() => setIsConfirmation(false)}>Ok</button>
                </div>
            </div>} */}
            <div className="container players_list_container">
                <div className="text_input_container">
                    <label htmlFor="search-player">?????? ????????</label>
                    <input name="search-player" type="text" onChange={(e) => setSearchPlayerString(e.target.value.toLowerCase())}></input>
                </div>
                {players.length === 0 &&
                <div>
                    <span>?????? ???????????? ??????????</span>
                </div>}
                <ul className="list">
                {players.filter(elem => elem.data.name.toLowerCase().startsWith(searchPlayerString))
                .sort((a,b) => b.data.date - a.data.date)
                .map(player => {
                    return (
                        <li key={player.id}><PlayerComp player={player} players={players}></PlayerComp></li>)
                })}
                </ul>
            </div>
        </div>

    )

}