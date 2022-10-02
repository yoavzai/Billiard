import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PlayerResultsComp from "./playerResults";
import { getMissingsAmount, getParticipantByIdFromStore } from "./utils";

export default function StandingsComp() {

  const standings = useSelector((state) => state.standings);
  const participants = useSelector((state) => state.participants);
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
            <th>תוצאות</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((player, index) => {
            const participant = getParticipantByIdFromStore(player.participantId, participants)
            return (
              <tr key={index} className={`${participant.data.active ? "" : "par_not_active"} ${participant.data.arrivedToPlayoff ? "" : "par_not_arrived_to_playoff"}`}>
                <td>{index + 1}</td>
                <td>{player.name}</td>
                <td>{player.games}</td>
                <td>{player.wins}</td>
                <td>{player.losses}</td>
                <td><span className="difference">{player.plusMinus}</span></td>
                <td>{getMissingsAmount(participant, participants)}</td>
                <td>
                  <button
                    id={player.participantId + "presentResults"}
                    className="button"
                    onClick={() => presentPlayerResultsBtnClick(player)}
                    >
                    הצג
                  </button>
                </td>
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
