import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteParticipant,
  freezeParticipant,
  getPlayerByParticipantIdFromStore,
  getRoundByIdFromServer,
  getStandings,
  isValidUpdatePlayer,
  unfreezeParticipant,
  updateParticipantOnServer,
  updatePlayer,
} from "./utils";

export default function ParticipantComp(props) {
  const dispatch = useDispatch();
  const rankings = useSelector((state) => state.rankings);
  const participant = props.participant;
  const players = useSelector((state) => state.players);
  const tables = useSelector((state) => state.tables);
  const participants = useSelector((state) => state.participants);
  const currentTournament = useSelector((state) => state.currentTournament);
  const currentRound = useSelector((state) => state.currentRound);
  const [player, setPlayer] = useState({});
  const [isUpdatePlayer, setIsUpdtaePlayer] = useState(false);
  const [isFreezingParticipant, setIsFreezingParticipant] = useState(false);
  const [isUnfreezingParticipant, setIsUnfreezingParticipant] = useState(false);
  const [playerNewData, setPlayerNewData] = useState({ name: "", ranking: "" });
  const [isUpdatePlayerConfirmation, setIsUpdatePlayerConfirmation] =
    useState(false);
  const [isRemoveParticipantErrorMessage, setIsRemoveParticipantErrorMessage] =
    useState(false);
  const [removeParticipantErrorMessage, setRemoveParticipantErrorMessage] =
    useState("");
  const [isUpdatePlayerErrorMessage, setIsUpdatePlayerErrorMessage] =
    useState(false);
  const [updatePlayerErrorMessage, setUpdatePlayerErrorMessage] = useState("");
  const [isRemoveParticipantConfirmation, setIsRemoveParticipantConfirmation] =
    useState(false);

  useEffect(() => {
    setPlayer(
      getPlayerByParticipantIdFromStore(participant.id, participants, players)
    );
  }, [players]);

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
    setIsUpdatePlayerConfirmation(true);
    const [standings, allResults] = await getStandings(currentTournament.id, participants, newPlayers);
    dispatch({
      type: "standings",
      payload: { standings: standings, allResults: allResults },
    });
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

  async function removeParticipantConfirmed() {
    setIsRemoveParticipantConfirmation(false);
    setIsFreezingParticipant(true)
    await freezeParticipant(
      currentTournament.id,
      participant.id,
      currentRound,
      participants,
      tables,
      dispatch,
      players
    );
    setIsFreezingParticipant(false)
  }

  async function removeParticipantBtnClick() {
    for (const table of tables) {
      if (
        (table.data.participant1Id === participant.id ||
          table.data.participant2Id === participant.id) &&
        table.data.isTaken
      ) {
        setIsRemoveParticipantErrorMessage(true);
        setRemoveParticipantErrorMessage("אי אפשר למחוק משתתף באמצע משחק");
        return;
      }
    }

    setIsRemoveParticipantConfirmation(true);
  }

  async function notArrivedToPlayoff() {
    const participantNewData = {...participant.data, arrivedToPlayoff: false}
    const newParticipants = participants.map(p => {
      if (p.id === participant.id) {
        return {...participant, data: participantNewData}
      }
      else {
        return p
      }
    })
    dispatch({type: "participants", payload: newParticipants})
    await updateParticipantOnServer(currentTournament.id, participant.id, participantNewData)
    const [standings, allResults] = await getStandings(currentTournament.id, newParticipants, players)
    dispatch({type: "standings", payload: {standings: standings, allResults: allResults}})
  }

  async function arrivedToPlayoff() {
    const participantNewData = {...participant.data, arrivedToPlayoff: true}
    const newParticipants = participants.map(p => {
      if (p.id === participant.id) {
        return {...participant, data: participantNewData}
      }
      else {
        return p
      }
    })
    dispatch({type: "participants", payload: newParticipants})
    await updateParticipantOnServer(currentTournament.id, participant.id, participantNewData)
    const [standings, allResults] = await getStandings(currentTournament.id, newParticipants, players)
    dispatch({type: "standings", payload: {standings: standings, allResults: allResults}})
  }

  async function returnParticipantBtnClick() {
    setIsUnfreezingParticipant(true)
    await unfreezeParticipant(currentTournament.id, participant.id, currentRound, participants, tables, dispatch, players)
    setIsUnfreezingParticipant(false)
  }

  return (
    <div className={`active_participant_container`}>
      <span>{player?.data?.name}</span>
      {currentTournament.data.isActive && isRemoveParticipantConfirmation ? (
        <div className="confirmation_container container">
          <span>
            מחיקת משתתף מהטורניר לא תחשב את התוצאות שלו. האם אתה בטוח?
          </span>
          <div className="buttons_container">
            <button
              className="button yes_button"
              onClick={removeParticipantConfirmed}
            >
              כן
            </button>
            <button
              className="button no_button"
              onClick={() => setIsRemoveParticipantConfirmation(false)}
            >
              לא
            </button>
          </div>
        </div>
      ) : isRemoveParticipantErrorMessage ? (
        <div className="error_message_container">
          <span>{removeParticipantErrorMessage}</span>
          <div className="buttons_container">
            <button
              className="button ok_button"
              onClick={() => setIsRemoveParticipantErrorMessage(false)}
            >
              Ok
            </button>
          </div>
        </div>
      ) : isUpdatePlayer ? (
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
                type="button"
                onClick={updatePlayerData}
                value="עדכן"
              ></input>
              <input
                type="button"
                onClick={cancelEditPlayer}
                value="בטל"
              ></input>
            </div>
          </form>
          {isUpdatePlayerErrorMessage && (
            <div className="error_message_container">
              <div>
                <span>{updatePlayerErrorMessage}</span>
              </div>
              {/* <button onClick={() => setIsUpdatePlayerErrorMessage(false)}>Ok</button> */}
            </div>
          )}
        </div>
      ) : (
        <div>
          {participant.data.active && participant.data.arrivedToPlayoff && !isUnfreezingParticipant &&
          <div className="buttons_container">
            <button className="button edit_button" onClick={editPlayer}>
              ערוך
            </button>
            <button
              className="button delete_button"
              onClick={removeParticipantBtnClick}
            >
              מחק
            </button>
            <button className="button not_arrived_to_playoff_btn" onClick={notArrivedToPlayoff}>
              לא הגיע לפלייאוף
            </button>
          </div>
          }
          {(isFreezingParticipant || isUnfreezingParticipant) &&
            <div>
              <span>המתן...</span>
            </div>
          }
          {!participant.data.active && !isFreezingParticipant &&
          <div className="buttons_container">
            <button
              className="button"
              onClick={returnParticipantBtnClick}
            >
              החזר
            </button>
          </div>
          }
          {!participant.data.arrivedToPlayoff &&
          <button className="button arrived_to_playoff_btn" onClick={arrivedToPlayoff}>
            הגיע לפלייאוף
          </button>
          }
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
