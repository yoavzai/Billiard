import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RoundComp from "./round";
import RoundResultComp from "./roundResult";
import {
  addRound,
  getMissingsAmount,
  getPlayerByParticipantIdFromStore,
  getRoundByIdFromServer,
  getStandings,
  setRound,
  updateParticipantOnServer,
  updateRoundOnServer,
} from "./utils";

export default function RoundsComp() {
  const dispatch = useDispatch();
  const currentTournament = useSelector((state) => state.currentTournament);
  const rankings = useSelector((state) => state.rankings);
  const participants = useSelector((state) => state.participants);
  const players = useSelector((state) => state.players);
  const rounds = useSelector((state) => state.rounds);
  const months = useSelector((state) => state.months);
  const [isNewRoundConfirmation, setIsNewRoundConfirmation] = useState(false);
  const [isRoundSelected, setIsRoundSelected] = useState(false);
  const [isTechnicalsConfirmation, setIsTechnicalsConfirmation] =
    useState(false);
  const [technicalResults, setTechnicalResults] = useState([]);
  const [newParticipants, setNewParticipants] = useState([]);
  const [startDate, setStartDate] = useState({
    fullDate: "",
    day: "",
    month: "",
    year: "",
  });
  const [isStartRoundErrorMessage, setIsStartRoundErrorMessage] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingNewRound, setIsLoadingNewround] = useState(false);
  const [isLoadingTechnicals, setIsLoadingTechnicals] = useState(false);

  async function startNewRound() {
    setIsNewRoundConfirmation(false);
    setIsLoadingNewround(true);
    const newRoundNumber = rounds.length + 1;
    const missings = {};
    for (const p of participants) {
      missings[p.id] = getMissingsAmount(p, participants);
    }

    const newRoundData = {
      startDate: startDate,
      number: newRoundNumber,
      arrivedParticipants: [],
      results: [],
      isActive: true,
      missings: missings,
    };

    await addRound(currentTournament.id, newRoundData, dispatch);
    setIsRoundSelected(true);
    setIsLoadingNewround(false);
    document.body.classList.add("round_open");
  }

  async function roundSelected(roundId) {
    setIsNewRoundConfirmation(false);
    setIsLoadingNewround(true);
    await setRound(currentTournament.id, roundId, dispatch);
    setIsLoadingNewround(false);
    setIsRoundSelected(true);
    document.body.classList.add("round_open");
  }

  function startNewRoundBtnClick() {
    for (const round of rounds) {
      //              !!!!!!!!!!!!!!!! uncomment for production !!!!!!!!!!!!!!!!!!

      // if (round.data.startDate.year === startDate.year && round.data.startDate.month === startDate.month && round.data.startDate.day === startDate.day) {
      //     setIsNewRoundConfirmation(false)
      //     setIsStartRoundErrorMessage(true)
      //     setErrorMessage("סיבוב זה כבר קיים")
      //     return
      // }

      if (round.data.isActive) {
        setIsNewRoundConfirmation(false);
        setIsStartRoundErrorMessage(true);
        setErrorMessage("אי אפשר להתחיל סיבוב חדש בזמן שקיים סיבוב פעיל");
        return;
      }
    }
    const newDate = new Date();
    const newMonth = newDate.getMonth();
    const newYear = newDate.getFullYear();
    const newDay = newDate.getDate();
    const newTime = newDate.getTime();

    setStartDate({
      fullDate: newTime,
      day: newDay,
      month: months[newMonth],
      year: newYear,
    });
    setIsNewRoundConfirmation(true);
  }

  function isGameInResults(id1, id2, results) {
    for (const r of results) {
      if (r.id === id1 + id2 || r.id === id2 + id1) {
        return true;
      }
    }
    return false;
  }

  function produceTechnicalResult(
    winnerParticipantId,
    looserParticipantId,
    roundNumber
  ) {
    let result = {
      isTechnical: true,
      id: winnerParticipantId + looserParticipantId,
      roundNumber: roundNumber,
      participant1: { id: winnerParticipantId, score: "3", won: true },
      participant2: { id: looserParticipantId, score: "0", won: false },
    };
    let winnerRanking = getPlayerByParticipantIdFromStore(
      winnerParticipantId,
      participants,
      players
    ).data.ranking;
    let looserRanking = getPlayerByParticipantIdFromStore(
      looserParticipantId,
      participants,
      players
    ).data.ranking;
    winnerRanking = rankings.indexOf(winnerRanking);
    looserRanking = rankings.indexOf(looserRanking);
    const difference = winnerRanking - looserRanking;

    if (difference > 2) {
      result = {
        ...result,
        participant2: { ...result.participant2, score: "2" },
      };
    } else if (difference === 2) {
      result = {
        ...result,
        participant2: { ...result.participant2, score: "1" },
      };
    }

    return result;
  }

  async function calcTechnicalsBtnClick() {
    calcTechnicals();
    setIsTechnicalsConfirmation(true);
  }

  async function technicalResultsConfirmed() {
    setIsTechnicalsConfirmation(false);
    setIsLoadingTechnicals(true)
    const lastRound = await getRoundByIdFromServer(
      currentTournament.id,
      rounds[0].id
    );
    const roundNewData = {
      ...lastRound.data,
      results: lastRound.data.results.concat(technicalResults),
    };
    dispatch({ type: "participants", payload: newParticipants });
    await updateRoundOnServer(currentTournament.id, lastRound.id, roundNewData);
    const [standings, allResults] = await getStandings(currentTournament.id);
    dispatch({
      type: "standings",
      payload: { standings: standings, allResults: allResults },
    });
    for (const p of newParticipants) {
      await updateParticipantOnServer(currentTournament.id, p.id, p.data);
    }
    setIsLoadingTechnicals(false)
  }

  function technicalResultsNotConfirmed() {
    setIsTechnicalsConfirmation(false);
    setTechnicalResults([]);
    setNewParticipants([]);
  }

  async function calcTechnicals() {
    if (rounds.length === 0) {
      return
    }
    const lastRound = await getRoundByIdFromServer(
      currentTournament.id,
      rounds[0].id
    );
    const missings = lastRound.data.missings;
    const arrivedParticipants = lastRound.data.arrivedParticipants;
    const roundNumber = lastRound.data.number;
    const technicalResults = [];
    const newParticipantsTmp = participants.map((p) => {

      const newParticipantsToPlayIds = [];
      const missingGames = missings[p.id];

      for (const rivalParticipantId of p.data.participantsToPlayIds) {
        if (isGameInResults(p.id, rivalParticipantId, technicalResults)) {
          continue;
        }
        const rivalMissingGames = missings[rivalParticipantId];
        if (
          (missingGames === 0 && rivalMissingGames > 1) ||
          (missingGames === 1 &&
            rivalMissingGames > 1 &&
            arrivedParticipants.map((p) => p.participantId).includes(p.id))
        ) {
          technicalResults.push(
            produceTechnicalResult(p.id, rivalParticipantId, roundNumber)
          );
          continue;
        }
        if (
          (missingGames > 1 && rivalMissingGames === 0) ||
          (missingGames > 1 &&
            rivalMissingGames === 1 &&
            arrivedParticipants
              .map((p) => p.participantId)
              .includes(rivalParticipantId))
        ) {
          technicalResults.push(
            produceTechnicalResult(rivalParticipantId, p.id, roundNumber)
          );
          continue;
        }
        newParticipantsToPlayIds.push(rivalParticipantId);
      }

      return {
        ...p,
        data: { ...p.data, participantsToPlayIds: newParticipantsToPlayIds },
      };
    })

    setTechnicalResults(technicalResults.sort((a,b) => {
      const name1 = getPlayerByParticipantIdFromStore(a.participant1.id, participants, players).data.name
      const name2 = getPlayerByParticipantIdFromStore(b.participant1.id, participants, players).data.name
      return name1.localeCompare(name2)
    }));
    setNewParticipants(newParticipantsTmp);

    // const roundNewData = {...lastRound.data, results: lastRound.data.results.concat(technicalResults)}
    // dispatch({type: "participants", payload: newParticipants})
    // await updateRoundOnServer(currentTournament.id, lastRound.id, roundNewData)
    // const [standings, allResults] = await getStandings(currentTournament.id)
    // dispatch({type: "standings", payload: {"standings": standings, "allResults": allResults}})
    // for (const p of newParticipants) {
    //   await updateParticipantOnServer(currentTournament.id, p.id, p.data)
    // }
  }

  return (
    <div className="container rounds_container">
      <h3>בחר סיבוב</h3>
      {rounds.length > 0 ? (
        rounds.map((round) => {
          return (
            <div className="round_text_container" key={round.id}>
              <span onClick={() => roundSelected(round.id)}>סיבוב</span>
              <span onClick={() => roundSelected(round.id)}>
                {" " + round.data.number + " - "}
              </span>
              <span onClick={() => roundSelected(round.id)}>
                {" " +
                  round.data.startDate.day +
                  " " +
                  round.data.startDate.month +
                  " " +
                  round.data.startDate.year +
                  " "}
              </span>
              <span onClick={() => roundSelected(round.id)}>
                {round.data.isActive ? "(פעיל)" : "(הסתיים)"}
              </span>
            </div>
          );
        })
      ) : (
        <span>אין סיבובים להציג</span>
      )}
      {currentTournament?.data?.isActive && (
        <div className="buttons_container">
          <button className="button" onClick={startNewRoundBtnClick}>
            התחל סיבוב חדש
          </button>
          <button className="button" onClick={calcTechnicalsBtnClick}>
            חשב טכניים
          </button>
        </div>
      )}
      {isLoadingTechnicals &&
        <div>
          <span>שומר טכניים...</span>
        </div>
      }
      {isTechnicalsConfirmation && (
        <div>
          <span>האם להוסיף את התוצאות הבאות לסיבוב האחרון?</span>
          {technicalResults.map((r) => {
            return <RoundResultComp key={r.id} result={r}></RoundResultComp>;
          })}
          <div className="buttons_container">
            <button className="button" onClick={technicalResultsConfirmed}>
              כן
            </button>
            <button
              className="button"
              onClick={technicalResultsNotConfirmed}
            >
              לא
            </button>
          </div>
        </div>
      )}
      {isNewRoundConfirmation && (
        <div className="confirmation_container">
          <span>להתחיל סיבוב</span>
          <span>
            {" " + startDate.day + " " + startDate.month + " " + startDate.year}
          </span>
          <span>?</span>
          <div className="buttons_container">
            <button className="button" onClick={startNewRound}>
              התחל
            </button>
            <button
              className="button"
              onClick={() => setIsNewRoundConfirmation(false)}
            >
              בטל
            </button>
          </div>
        </div>
      )}
      {isLoadingNewRound && (
        <div className="loading_container">
          <h2>טוען...</h2>
        </div>
      )}
      {isStartRoundErrorMessage && (
        <div className="error_message_container">
          <span>{errorMessage}</span>
          <div className="buttons_container">
            <button
              className="button ok_button"
              onClick={() => setIsStartRoundErrorMessage(false)}
            >
              Ok
            </button>
          </div>
        </div>
      )}
      {isRoundSelected && <RoundComp></RoundComp>}
    </div>
  );
}
