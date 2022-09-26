import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GamesLeftComp from "./gamesLeft";
import ParticipantComp from "./participant";
import {
  addParticipant,
  addPlayer,
  getParticipantByNameFromStore,
  getPlayerByNameFromStore,
  getPlayerByParticipantIdFromStore,
  playersNotRegistered,
} from "./utils";

export default function ParticipantsComp() {

  const dispatch = useDispatch();
  const rankings = useSelector((state) => state.rankings);
  const participants = useSelector((state) => state.participants);
  const players = useSelector((state) => state.players);
  const currentTournament = useSelector((state) => state.currentTournament);
  const [wantedPlayerName, setWantedPlayerName] = useState("");
  const [isAddPlayer, setIsAddPlayer] = useState(false);
  const [newPlayerData, setNewPlayerData] = useState({
    name: "",
    ranking: rankings[0],
  });
  const [isAddPlayerConfirmation, setIsAddPlayerConfirmation] = useState(false);
  const [isAddPlayerErrorMessage, setIsAddPlayerErrorMessage] = useState(false);
  const [addPlayerErrorMessage, setAddPlayerErrorMessage] = useState("");
  const [playerOptions, setPlayerOptions] = useState([]);
  const [isAddingToServer, setIsAddingToServer] = useState(false);
  const [isPresentPlayerOptions, setIsPresentPlayerOptions] = useState(false);
  const [sortBy, setSortBy] = useState("name")

  async function addNewPlayer() {
    setIsAddPlayer(false);
    setIsAddingToServer(true);
    const time = new Date();
    const newPlayer = await addPlayer(
      { ...newPlayerData, date: time.getTime() },
      players,
      dispatch
    );
    setIsAddingToServer(false);
    setNewPlayerData({ name: "", ranking: rankings[0] });
    addNewParticipant(newPlayer);
  }

  function addPlayerConfirmed() {
    setIsAddPlayerConfirmation(false);
    setIsAddPlayer(true);
    setAddPlayerErrorMessage(false);
    setNewPlayerData({ ...newPlayerData, name: wantedPlayerName });
  }

  async function addNewParticipant(player) {
    setIsAddingToServer(true);
    const time = new Date();
    const newParticipantData = {
      playerId: player.id,
      date: time.getTime(),
      participantsToPlayIds: participants.filter(p => p.data.active).map((participant) => participant.id),
      active: true
    };
    await addParticipant(
      newParticipantData,
      currentTournament.id,
      participants,
      dispatch
    );
    setIsAddingToServer(false);
    setWantedPlayerName("");
  }

  async function addNewParticipantBtnClick() {
    if (wantedPlayerName.length === 0) {
      setIsAddPlayerErrorMessage(true);
      setAddPlayerErrorMessage("הכנס שם");
      return;
    }
    const participant = getParticipantByNameFromStore(
      wantedPlayerName,
      participants,
      players
    );
    if (participant !== undefined) {
      setIsAddPlayerErrorMessage(true);
      setAddPlayerErrorMessage("שחקן זה כבר רשום");
      return;
    }
    setAddPlayerErrorMessage(false);
    const player = getPlayerByNameFromStore(wantedPlayerName, players);
    if (player === undefined) {
      setIsAddPlayerConfirmation(true);
      return;
    }
    addNewParticipant(player);
  }

  function searchPlayer(e) {
    setIsAddPlayerErrorMessage(false);
    setWantedPlayerName(e.target.value);
    if (e.target.value.length === 0) {
      setIsPresentPlayerOptions(false)
      setPlayerOptions([]);
      return;
    }

    setPlayerOptions(
      playersNotRegistered(players, participants).filter((player) =>
        player.data.name.toLowerCase().startsWith(e.target.value.toLowerCase())
      )
      );
      setIsPresentPlayerOptions(true)
  }

  function cancelNewPlayer() {
    setNewPlayerData({ name: "", ranking: rankings[0] });
    setIsAddPlayerErrorMessage(false);
    setIsAddPlayer(false);
  }

  function sortedParticipantsByGamesLeft() {
    const sorted = participants.sort((a, b) => {
      const difference =
        b.data.participantsToPlayIds.length -
        a.data.participantsToPlayIds.length;
      if (difference !== 0) {
        return difference;
      }
      return b.data.date - a.data.date;
    });
    return sorted;
  }

  function sortedParticipantsByName() {
    return participants.sort((a,b) => {
      const name1 = getPlayerByParticipantIdFromStore(a.id, participants, players)?.data?.name
      const name2 = getPlayerByParticipantIdFromStore(b.id, participants, players)?.data?.name
      return name1.localeCompare(name2)
    })
  }

  function searchPlayerKeyPress(e) {
    if (playerOptions.length === 0) {
      return
    }
    if (e.code === "ArrowDown") {
      e.preventDefault()
      const firstOption = document.getElementById("player_options0")
      firstOption.focus()
    }
  }

  function playerOptionKeyPress(e) {
    e.preventDefault()
    const playerOptionIndex = Number(e.target.id[e.target.id.length - 1])
    if (e.code === "ArrowDown") {
      if (playerOptions.length - 1 === playerOptionIndex) {
        return
      }
      const nextOptionId = "player_options" + String(playerOptionIndex+1)
      const nextOption = document.getElementById(nextOptionId)
      nextOption.focus()
    }
    else if (e.code === "ArrowUp") {
      if (playerOptionIndex === 0) {
        const searchInput = document.getElementById("choose-players-text-input")
        searchInput.focus()
      }
      else {
        const prevOptionId = "player_options" + String(playerOptionIndex-1)
        const prevOption = document.getElementById(prevOptionId)
        prevOption.focus()
      }
    }
    else if (e.code === "Escape") {
      setIsPresentPlayerOptions(false)
      const searchInput = document.getElementById("choose-players-text-input")
      searchInput.focus()
    }
    else if(e.code === "Enter") {
      e.target.click()
    }
  }

  return (
    <div className="container participants_container">
      <h3>
        <span>משתתפים</span>
        <span>{` (${participants.length})`}</span>
      </h3>
      {currentTournament?.data?.isActive && (
        <div className="add_participant_container the_one">
          <div className="text_input_container">
            <label htmlFor="choose-players-text-input">הוסף משתתף</label>
            <div className="drop_box">
              <input
                className={`${isAddPlayerErrorMessage ? "error_input" : ""}`}
                type="text"
                onChange={searchPlayer}
                onKeyDown={searchPlayerKeyPress}
                id="choose-players-text-input"
                value={wantedPlayerName}
              ></input>
              {isPresentPlayerOptions && (
                <div className="drop_list">
                  {playerOptions.map((p, i) => {
                    return (
                      <span
                        id={"player_options"+i}
                        tabIndex="0"
                        style={{ display: "block" }}
                        key={p.data.name}
                        onKeyDown={playerOptionKeyPress}
                        onMouseEnter={e => e.target.focus()}
                        onClick={(e) => {
                          setWantedPlayerName(p.data.name);
                          setPlayerOptions([]);
                          setIsPresentPlayerOptions(false)
                        }}
                      >
                        {p.data.name}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          {isAddPlayerConfirmation ? (
            <div className=" confirmation_container">
              <span>אין שחקן כזה במאגר השחקנים. האם ליצור שחקן חדש?</span>
              <div className="buttons_container">
                <button
                  className="button yes_button"
                  onClick={addPlayerConfirmed}
                >
                  כן
                </button>
                <button
                  className="button no_button"
                  onClick={() => setIsAddPlayerConfirmation(false)}
                >
                  לא
                </button>
              </div>
            </div>
          ) : isAddPlayer ? (
            <div className="container update_player_form_container">
              <form>
                <div className="input_text_container">
                  <label htmlFor="name">שם</label>
                  <input
                    readOnly
                    value={wantedPlayerName}
                    name="name"
                    type="text"
                  ></input>
                </div>
                <div className="select_container">
                  <label htmlFor="ranking-select">דירוג</label>
                  <select
                    name="ranking-select"
                    defaultValue={rankings[0]}
                    onChange={(e) =>
                      setNewPlayerData({
                        ...newPlayerData,
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
                    className="button"
                    type="button"
                    onClick={addNewPlayer}
                    value="הוסף"
                  ></input>
                  <input
                    className="button"
                    type="button"
                    onClick={cancelNewPlayer}
                    value="בטל"
                  ></input>
                </div>
              </form>
              {isAddPlayerErrorMessage && (
                <div className="error_message_container">
                  <span>{addPlayerErrorMessage}</span>
                </div>
              )}
            </div>
          ) : isAddingToServer ? (
            <div>
              <span>מוסיף את</span>
              <span>{" " + wantedPlayerName + "..."}</span>
            </div>
          ) : (
            <div className="buttons_container">
              <button
                disabled={wantedPlayerName.length === 0 ? true : false}
                className="button"
                onClick={addNewParticipantBtnClick}
              >
                הוסף
              </button>
            </div>
          )}
        </div>
      )}
      <div className="buttons_container">
            <button onClick={() => setSortBy("name")}>לפי שם</button>
            <button onClick={() => setSortBy("games left")}>לפי משחקים שנשארו</button>
      </div>
      <div className="participants_table">
        {sortBy === "name" ? 
          sortedParticipantsByName().map((participant) => {
            return (
              <div className={`participant_box container  ${participant.data.active ? "" : "par_not_active"}`} key={participant.id}>
                <div>
                  <ParticipantComp participant={participant}></ParticipantComp>
                </div>
                <div>
                  <GamesLeftComp participant={participant}></GamesLeftComp>
                </div>
              </div>
            );
          })
          :
          sortedParticipantsByGamesLeft().map((participant) => {
            return (
              <div className={`participant_box container  ${participant.data.active ? "" : "par_not_active"}`} key={participant.id}>
                <div>
                  <ParticipantComp participant={participant}></ParticipantComp>
                </div>
                <div>
                  <GamesLeftComp participant={participant}></GamesLeftComp>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}
