import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isValidUpdatePlayer, updatePlayer } from "./utils";

export default function PlayerComp(props) {
  const dispatch = useDispatch();
  const rankings = useSelector((state) => state.rankings);
  const players = useSelector((state) => state.players);
  const player = props.player;
  const [isUpdatePlayer, setIsUpdtaePlayer] = useState(false);
  // const [isUpdatePlayerConfirmation, setIsUpdatePlayerConfirmation] = useState(false)
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

    updatePlayer(player.id, playerNewData, players, dispatch);
    setIsUpdatePlayerErrorMessage(false);
    setIsUpdtaePlayer(false);
    // setIsUpdatePlayerConfirmation(true)
  }

  function editPlayer() {
    setPlayerNewData({ name: player.data.name, ranking: player.data.ranking });
    setIsUpdtaePlayer(true);
  }

  function cancelEditPlayer() {
    setPlayerNewData({ name: "", ranking: "" });
    setIsUpdatePlayerErrorMessage(false);
    setIsUpdtaePlayer(false);
  }

  return (
    <div className="player_container">
      <span>{player.data.name}</span>
      <div className="buttons_container">
        <button className="button" onClick={editPlayer}>
          ערוך
        </button>
      </div>
      {isUpdatePlayer && (
        <div className="update_player_form_container">
          <form>
            <div className="text_input_container">
              <label htmlFor="name">שם</label>
              <input
                className={`${isUpdatePlayerErrorMessage ? "error_input" : ""}`}
                name="name"
                type="text"
                value={playerNewData.name}
                onChange={(e) => {
                  setPlayerNewData({ ...playerNewData, name: e.target.value });
                  setIsUpdatePlayerErrorMessage(false);
                }}
              ></input>
            </div>
            <div className="select_container">
              <label htmlFor="ranking-select">דירוג</label>
              <select
                value={playerNewData.ranking}
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
                className="button"
                type="button"
                onClick={cancelEditPlayer}
                value="בטל"
              ></input>
            </div>
          </form>
        </div>
      )}
      {isUpdatePlayerErrorMessage && (
        <div className="error_message_container">
          <span>{updatePlayerErrorMessage}</span>
          {/* <button onClick={() => setIsUpdatePlayerErrorMessage(false)}>Ok</button> */}
        </div>
      )}
      {/* {isUpdatePlayerConfirmation && 
            <div className="confirmation_container">
                <span>שחקן עודכן</span>
                <div className="buttons_container">
                    <button className="button ok_button" onClick={() => setIsUpdatePlayerConfirmation(false)}>Ok</button>
                </div>
            </div>} */}
    </div>
  );
}
