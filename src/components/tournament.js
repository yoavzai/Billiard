import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import ParticipantsComp from "./participants";
import Playoff16Comp from "./playoff16";
import Playoff8Comp from "./playoff8";
import RoundsComp from "./rounds";
import StandingsComp from "./standings";
import {
  endTournament,
  getPlayoff16,
  getPlayoff8,
  loadTournamentData,
  updatePlayoff16,
  updatePlayoff8,
} from "./utils";

export default function TournamentComp() {
  const params = useParams();
  const dispatch = useDispatch();
  const currentTournament = useSelector((state) => state.currentTournament);
  const standings = useSelector((state) => state.standings);
  const rounds = useSelector((state) => state.rounds);
  const tournaments = useSelector((state) => state.tournaments);
  const [isFinishTournamentErrorMessage, setIsFinishTournamentErrorMessage] =
    useState(false);
  const [isFinishTournamentConfirmation, setIsFinishTournamentConfirmation] =
    useState(false);
  const [isPlayoff8, setIsPlayoff8] = useState(false);
  const [isPlayoff16, setIsPlayoff16] = useState(false);
  const [isPlayoffErrorMessage, setIsPlayoffErrorMessage] = useState(false);

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

  function openPlayoff8() {
    setIsPlayoff16(false);
    setIsPlayoff8(true);
  }

  async function startPlayoff8() {
    if (standings.length < 8) {
      setIsPlayoffErrorMessage(true);
      return;
    }
    const playoff8 = getPlayoff8(standings);
    updatePlayoff8(
      currentTournament,
      playoff8,
      { first: {}, second: {}, third: {} },
      dispatch
    );
    setIsPlayoff16(false);
    setIsPlayoff8(true);
  }

  function openPlayoff16() {
    setIsPlayoff8(false);
    setIsPlayoff16(true);
  }

  async function startPlayoff16() {
    if (standings.length < 16) {
      setIsPlayoffErrorMessage(true);
      return;
    }
    const playoff16 = getPlayoff16(standings);
    updatePlayoff16(
      currentTournament,
      playoff16,
      { first: {}, second: {}, third: {} },
      dispatch
    );
    setIsPlayoff8(false);
    setIsPlayoff16(true);
  }

  function closePlayoff() {
    setIsPlayoff16(false);
    setIsPlayoff8(false);
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
          <div className="turnament_top_buttons_box">
            {currentTournament?.data?.isActive && (
              <div className="buttons_container finish_turnament">
                <button className="button" onClick={finishTournamentBtnClick}>
                  סיים טורניר
                </button>
              </div>
            )}
            {currentTournament.data.playoff8.length === 0 &&
            currentTournament.data.playoff16.length === 0 ? (
              <div className="buttons_container">
                <button className="button" onClick={startPlayoff8}>
                  התחל פלייאוף 8
                </button>
                &nbsp; &nbsp;
                <button className="button" onClick={startPlayoff16}>
                  התחל פלייאוף 16
                </button>
              </div>
            ) : currentTournament.data.playoff8.length > 0 ? (
              <div className="buttons_container">
                <button className="button" onClick={openPlayoff8}>
                  פלייאוף 8
                </button>
              </div>
            ) : (
              <div className="buttons_container">
                <button className="button" onClick={openPlayoff16}>
                  פלייאוף 16
                </button>
              </div>
            )}
          </div>
          {isPlayoffErrorMessage && (
            <div>
              <span>אין מספיק שחקנים</span>
              <div>
                <button onClick={() => setIsPlayoffErrorMessage(false)}>
                  OK
                </button>
              </div>
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
          {isPlayoff8 && (
            <div>
              <Playoff8Comp closePlayoff={closePlayoff}></Playoff8Comp>
            </div>
          )}
          {isPlayoff16 && (
            <div>
              <Playoff16Comp closePlayoff={closePlayoff}></Playoff16Comp>
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
