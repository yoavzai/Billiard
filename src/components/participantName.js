import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPlayerByParticipantIdFromStore,
  getStandings,
  isValidUpdatePlayer,
  updatePlayer,
} from "./utils";

export default function ParticipantNameComp(props) {
  const dispatch = useDispatch();
  const rankings = useSelector((state) => state.rankings);
  const player = props.player;
  const players = useSelector((state) => state.players);
  const participants = useSelector((state) => state.participants);
  const currentTournament = useSelector((state) => state.currentTournament);
  const [isUpdatePlayer, setIsUpdtaePlayer] = useState(false);
  const [playerNewData, setPlayerNewData] = useState({ name: "", ranking: "" });
  const [isUpdatePlayerErrorMessage, setIsUpdatePlayerErrorMessage] =
    useState(false);
  const [updatePlayerErrorMessage, setUpdatePlayerErrorMessage] = useState("");


  async function updatePlayerData() {
    const res = isValidUpdatePlayer(playerNewData, players, player);
    if (res.status === false) {
      setIsUpdatePlayerErrorMessage(true);
      setUpdatePlayerErrorMessage(res.message);
      return;
    }

    setIsUpdatePlayerErrorMessage(false);
    const newPlayers = await updatePlayer(player.id, playerNewData, players, dispatch);
    setIsUpdtaePlayer(false);
    const [standings, allResults] = await getStandings(currentTournament.id, participants, newPlayers);
    dispatch({
      type: "standings",
      payload: { standings: standings, allResults: allResults },
    });
  }

  function editPlayer() {
    const cancelEditPlayerButtons =
      document.getElementsByClassName("cancel_edit_player");
    for (const b of cancelEditPlayerButtons) {
      b.click();
    }
    setPlayerNewData({ name: player.data.name, ranking: player.data.ranking });
    setIsUpdtaePlayer(true);
  }

  function cancelEditPlayer() {
    setPlayerNewData({ name: "", ranking: "" });
    setIsUpdatePlayerErrorMessage(false);
    setIsUpdtaePlayer(false);
  }


  return (
    <div className={`active_participant_container`}>
        <div>
            <span>{player?.data?.name}</span>
        </div>
        <button className="button edit_button" onClick={editPlayer}>
              ערוך
        </button>
        {isUpdatePlayer &&
        <div className="update_player_form_container container">
          <form>
            <div className="text_input_container">
              <label htmlFor="name">שם</label>
              <input
                className={`${isUpdatePlayerErrorMessage ? "error_input" : ""}`}
                name="name"
                type="text"
                defaultValue={player.data.name}
                onChange={(e) => {
                  setPlayerNewData({ ...playerNewData, name: e.target.value });
                  setIsUpdatePlayerErrorMessage(false);
                }}
              ></input>
            </div>
            <div className="select_container">
              <label htmlFor="ranking-select">דירוג</label>
              <select
                defaultValue={player.data.ranking}
                name="ranking-select"
                onChange={(e) =>
                  setPlayerNewData({
                    ...playerNewData,
                    ranking: e.target.value,
                  })
                }
              >
                {rankings.map((rank, index) => {
                  return (
                    <option key={index} value={rank}>
                      {rank}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="buttons_container">
              <input
                disabled={playerNewData.name.length === 0 ? true : false}
                className="button"
                type="button"
                onClick={updatePlayerData}
                value="עדכן"
              ></input>
              <input
                className="button cancel_edit_player"
                type="button"
                onClick={cancelEditPlayer}
                value="בטל"
              ></input>
            </div>
          </form>
          {isUpdatePlayerErrorMessage && (
            <div className="error_message_container">
                <span>{updatePlayerErrorMessage}</span>
            </div>
          )}
        </div>
        }
    </div>
  );
}
