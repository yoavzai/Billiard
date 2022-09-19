import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import ParticipantsComp from "./participants";
import RoundsComp from "./rounds";
import StandingsComp from "./standings";
import { endTournament, loadTournamentData } from "./utils";

export default function TournamentComp() {
  const params = useParams();
  const dispatch = useDispatch();
  const currentTournament = useSelector((state) => state.currentTournament);
  const rounds = useSelector((state) => state.rounds);
  const tournaments = useSelector((state) => state.tournaments);
  const [isFinishTournamentErrorMessage, setIsFinishTournamentErrorMessage] =
    useState(false);
  const [isFinishTournamentConfirmation, setIsFinishTournamentConfirmation] =
    useState(false);

  useEffect(() => {
    loadTournamentData(params.id, dispatch);
  }, []);

  function finishTournamentBtnClick() {
    for (const round of rounds) {
      if (round.data.isActive) {
        setIsFinishTournamentErrorMessage(true);
        return;
      }
    }
    setIsFinishTournamentConfirmation(true);
  }

  async function finishTournamentConfirmed() {
    setIsFinishTournamentConfirmation(false);
    endTournament(currentTournament, tournaments, dispatch);
  }

  return (
    <div>
      {Object.keys(currentTournament).length === 0 ? (
        <div className="loading_container">
          <h2>טוען...</h2>
        </div>
      ) : (
        <div className="tournament_container">
          <div className="navigation_menu_container">
            <Link to="/">בית</Link>
            <Link to="/players">שחקנים</Link>
          </div>
          <h2>
            <span>טורניר</span>
            <span>
              {" " +
                currentTournament?.data?.startDate.month +
                " " +
                currentTournament?.data?.startDate.year}
            </span>
            <span>
              {currentTournament?.data?.isActive ? " (פעיל)" : " (הסתיים)"}
            </span>
          </h2>
          {currentTournament?.data?.isActive && (
            <div className="buttons_container finish_turnament">
              <button className="button" onClick={finishTournamentBtnClick}>
                סיים טורניר
              </button>
            </div>
          )}
          {isFinishTournamentErrorMessage && (
            <div className="error_message_container end_tu_error finish_turnament">
              <span>אי אפשר לסיים טורניר בזמן שקיים סיבוב פעיל</span>
              <div className="buttons_container">
                <button
                  className="button ok_button"
                  onClick={() => setIsFinishTournamentErrorMessage(false)}
                >
                  Ok
                </button>
              </div>
            </div>
          )}
          {isFinishTournamentConfirmation && (
            <div className="confirmation_container right finish_turnament">
              <span>האם אתה בטוח שברצונך לסיים את הטורניר?</span>
              <div className="buttons_container">
                <button
                  className="button yes_button"
                  onClick={finishTournamentConfirmed}
                >
                  כן
                </button>
                <button
                  className="button no_button"
                  onClick={() => setIsFinishTournamentConfirmation(false)}
                >
                  לא
                </button>
              </div>
            </div>
          )}
          <div className="turnament_dashboard">
            <StandingsComp></StandingsComp>
            <ParticipantsComp></ParticipantsComp>
            <RoundsComp></RoundsComp>
          </div>
        </div>
      )}
    </div>
  );
}
