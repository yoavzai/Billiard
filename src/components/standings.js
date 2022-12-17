import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActiveParticipantComp from "./active";
import ArrivedToPlayoffComp from "./arrivedToPlayoff";
import GamesLeftComp from "./gamesLeft";
import ParticipantNameComp from "./participantName";
import PlayerResultsComp from "./playerResults";
import { getMissingsAmount, getParticipantByIdFromStore, getPlayerByIdFromStore, getStandings, updateParticipantOnServer } from "./utils";

export default function StandingsComp() {

  const dispatch = useDispatch()
  const standings = useSelector((state) => state.standings);
  const participants = useSelector((state) => state.participants);
  const players = useSelector((state) => state.players);
  const currentTournament = useSelector((state) => state.currentTournament)
  const [isPresentPlayerResults, setIsPresentPlayerResults] = useState(false);
  const [playerToPresentResults, setPlayerToPresentResults] = useState({});

  useEffect(() => {
    if (isPresentPlayerResults === true) {
      const presentPlayerResultsButton = document.getElementById(
        playerToPresentResults.participantId + "presentResults"
      );
      if (presentPlayerResultsButton === null) {
        closePlayerResults();
      } else presentPlayerResultsButton.click();
      // document.getElementById(playerToPresentResults.participantId + "presentResults").click()
    }
    // setIsPresentPlayerResults(false)
  }, [standings]);

  function presentPlayerResultsBtnClick(player) {
    setPlayerToPresentResults(player);
    setIsPresentPlayerResults(true);
  }

  function closePlayerResults() {
    setIsPresentPlayerResults(false);
    setPlayerToPresentResults({});
  }

  async function updateParticipantTieBreakValue(e, p) {
    const newParticipants = participants.map(participant => {
      if (participant.id == p.id) {
        return {...p, data: {...p.data, tieBreakValue: e.target.value}}
      }
      return participant
    })
    const [newStandings, allResults] = await getStandings(currentTournament.id, newParticipants, players);
    dispatch({type:"participants", payload: newParticipants})
    dispatch({
      type: "standings",
      payload: { standings: newStandings, allResults: allResults },
    });
    e.target.blur()
    await updateParticipantOnServer(currentTournament.id, p.id, {...p.data, tieBreakValue: e.target.value})
  }

  return (
    <div className="container standings_container">
      <h3>מקומות</h3>
      <table className="table">
        <thead>
          <tr>
            <th>מקום</th>
            <th>שם</th>
            <th>משחקים</th>
            <th>נצחונות</th>
            <th>הפסדים</th>
            <th>יחס</th>
            <th>חיסורים</th>
            <th>שובר שוויון</th>
            <th>משחקים שנותרו</th>
            <th>תוצאות</th>
            <th>הגיע לפלייאוף</th>
            <th>פעיל</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((player, index) => {
            const participant = getParticipantByIdFromStore(player.participantId, participants)
            const originalPlayer = getPlayerByIdFromStore(player.playerId, players)
            return (
              <tr key={index} className={`${participant.data.active ? "" : "par_not_active"} ${participant.data.arrivedToPlayoff ? "" : "par_not_arrived_to_playoff"}`}>
                <td>{index + 1}</td>
                <td><ParticipantNameComp player={originalPlayer}></ParticipantNameComp></td>
                <td>{player.games}</td>
                <td>{player.wins}</td>
                <td>{player.losses}</td>
                <td><span className="difference">{player.plusMinus}</span></td>
                <td>{getMissingsAmount(participant, participants)}</td>
                <td>
                  <select
                    className="tiebreak_select"
                    onChange={(e) => updateParticipantTieBreakValue(e, participant)}
                    value={participant.data.tieBreakValue}
                  >
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                </td>
                <td><GamesLeftComp participant={participant}></GamesLeftComp></td>
                <td>
                  <button
                    id={player.participantId + "presentResults"}
                    className="button"
                    onClick={() => presentPlayerResultsBtnClick(player)}
                    >
                    הצג
                  </button>
                </td>

                <td><ArrivedToPlayoffComp participant={participant}></ArrivedToPlayoffComp></td>
                <td><ActiveParticipantComp participant={participant}></ActiveParticipantComp></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {isPresentPlayerResults && (
        <PlayerResultsComp
          player={playerToPresentResults}
          closeComponentFunc={closePlayerResults}
        ></PlayerResultsComp>
      )}
    </div>
  );
}
