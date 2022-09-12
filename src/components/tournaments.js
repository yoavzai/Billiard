import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { addTournament } from "./utils";
import companyLogo from "../lin-logo.png";

export default function TournamentsComp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tournaments = useSelector((state) => state.tournaments);
  const months = useSelector((state) => state.months);
  const [isNewTournamentConfirmation, setIsNewTournamentConfirmation] =
    useState(false);
  const [startDate, setStartDate] = useState({
    fullDate: "",
    month: "",
    year: "",
  });
  const [isStartTournamentErrorMessage, setIsStartTournamentErrorMessage] =
    useState(false);
  const [tournamentErrorMessage, setTournamentErrorMessage] = useState("");

  useEffect(() => {
    dispatch({
      type: "tournamentSelected",
      payload: {
        currentTournament: {},
        participants: [],
        rounds: [],
        currentRound: {},
        standings: [],
        allResults: [],
      },
    });
  }, []);

  async function tournamentsSelected(e) {
    navigate("/tournament/" + e.target.value);
  }

  async function startNewTournament() {
    const tourId = await addTournament(
      { startDate: startDate, isActive: true },
      dispatch
    );
    navigate("/tournament/" + tourId);
  }

  function newTournamentBtnClick() {
    for (const tour of tournaments) {
      //          !!!!!!!!!!!!!!!! uncomment for production !!!!!!!!!!!!!!!!!!
      // if (tour.data.startDate.year === startDate.year && tour.data.startDate.month === startDate.month) {
      //     setIsNewTournamentConfirmation(false)
      //     setIsStartTournamentErrorMessage(true)
      //     setTournamentErrorMessage("טורניר זה כבר קיים")
      //     return
      // }

      if (tour.data.isActive) {
        setIsNewTournamentConfirmation(false);
        setIsStartTournamentErrorMessage(true);
        setTournamentErrorMessage(
          "אי אפשר להתחיל טורניר חדש בזמן שקיים טורניר פעיל"
        );
        return;
      }
    }
    const newDate = new Date();
    const newMonth = newDate.getMonth();
    const newYear = newDate.getFullYear();
    const newTime = newDate.getTime();

    setStartDate({ fullDate: newTime, month: months[newMonth], year: newYear });
    setIsNewTournamentConfirmation(true);
  }

  return (
    <div className="tournaments_container">
      <div className="select_container">
        <div className="companylogo">
          <img src={companyLogo} alt="לינקולן לוגו" />
        </div>
        <label htmlFor="select-tournament"></label>
        <select
          name="select-tournament"
          onChange={tournamentsSelected}
          value="Select Tournament"
        >
          <option>בחר טורניר</option>
          {tournaments.map((tour) => {
            return (
              <option key={tour.id} value={tour.id}>
                {`${tour?.data?.startDate.month} ${
                  tour?.data?.startDate.year
                } ${tour?.data.isActive ? "(פעיל)" : "(הסתיים)"}`}
              </option>
            );
          })}
        </select>
      </div>
      <div className="buttons_container">
        <button className="button" onClick={newTournamentBtnClick}>
          התחל טורניר חדש
        </button>
      </div>
      {isNewTournamentConfirmation && (
        <div className="confirmation_container">
          <span>להתחיל טורניר</span>
          <span>{" " + startDate.month + " " + startDate.year}</span>
          <span>?</span>
          <div className="buttons_container">
            <button className="button yes_button" onClick={startNewTournament}>
              כן
            </button>
            <button
              className="button no_button"
              onClick={() => setIsNewTournamentConfirmation(false)}
            >
              לא
            </button>
          </div>
        </div>
      )}
      {isStartTournamentErrorMessage && (
        <div className="error_message_container">
          <span>{tournamentErrorMessage}</span>
          <div className="buttons_container">
            <button
              className="button ok_button"
              onClick={() => setIsStartTournamentErrorMessage(false)}
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
