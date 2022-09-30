
import { useDispatch, useSelector } from "react-redux"
import Playoff8GameComp from "./playoff8Game"
import { erasePlayoffData, getPlayerByIdFromStore } from "./utils"


export default function Playoff8Comp(props) {

    const dispatch = useDispatch()
    const currentTournament = useSelector(state => state.currentTournament)
    const players = useSelector(state => state.players)


    async function cancelPlayoff() {
        erasePlayoffData(currentTournament, dispatch)
        props.closePlayoff()
    }


    return (
        <div className="container playoff_container playoff8_container">
            <div className="buttons_container">
                <button className="button close_button" onClick={() => props.closePlayoff()}>סגור</button>
                <button className="button" onClick={cancelPlayoff}>בטל פלייאוף</button>
            </div>
            <div>
                {currentTournament.data.playoff8.map((game, index) => {
                    return (
                        <Playoff8GameComp key={index} game={game} index={index}></Playoff8GameComp>
                    )
                })}
                <div>
                    <div>
                        <h3>מקום ראשון</h3>
                        <span>{getPlayerByIdFromStore(currentTournament.data.winners?.first?.playerId, players)?.data.name}</span>
                    </div>
                    <div>
                        <h3>מקום שני</h3>
                        <span>{getPlayerByIdFromStore(currentTournament.data.winners?.second?.playerId, players)?.data.name}</span>
                    </div>
                    <div>
                        <h3>מקום שלישי</h3>
                        <span>{getPlayerByIdFromStore(currentTournament.data.winners?.third?.playerId, players)?.data.name}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}