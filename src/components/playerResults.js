import { useState } from "react";
import { useSelector } from "react-redux";
import PlayerResultComp from "./playerResult";
import {
  getParticipantByIdFromStore,
  getPlayerByParticipantIdFromStore,
} from "./utils";

export default function PlayerResultsComp(props) {
  const player = props.player;
  const participants = useSelector((state) => state.participants);
  const players = useSelector((state) => state.players);
  const rounds = useSelector((state) => state.rounds);
  const [orderBy, setOrderBy] = useState("round");

  function playerResultsByRound() {
    let playerResults = {};
    for (const round of rounds) {
      playerResults[round.data.number] = [];
    }
    for (const result of player.results) {
      const participant1 = getParticipantByIdFromStore(
        result.participant1.id,
        participants
      );
      const participant2 = getParticipantByIdFromStore(
        result.participant2.id,
        participants
      );
      const active =
        participant1.data.active && participant2.data.active ? true : false;
      if (result.participant1.id === player.participantId) {
        const won = result.participant1.won;
        const player1Name = player.name;
        const player1Score = result.participant1.score;
        const player2Name = getPlayerByParticipantIdFromStore(
          result.participant2.id,
          participants,
          players
        )?.data?.name;
        const player2Score = result.participant2.score;
        playerResults[result.roundNumber].push({
          player1Name: player1Name,
          player1Score: player1Score,
          player2Name: player2Name,
          player2Score: player2Score,
          won: won,
          originalParticipantNumber: 1,
          originalResult: result,
          active: active,
        });
      } else if (result.participant2.id === player.participantId) {
        const won = result.participant2.won;
        const player1Name = player.name;
        const player1Score = result.participant2.score;
        const player2Name = getPlayerByParticipantIdFromStore(
          result.participant1.id,
          participants,
          players
        )?.data?.name;
        const player2Score = result.participant1.score;
        playerResults[result.roundNumber].push({
          player1Name: player1Name,
          player1Score: player1Score,
          player2Name: player2Name,
          player2Score: player2Score,
          won: won,
          originalParticipantNumber: 2,
          originalResult: result,
          active: active,
        });
      }
    }
    return playerResults;
  }

  function playerResultsByName() {
    let playerResults = [];
    for (const result of player.results) {
      const participant1 = getParticipantByIdFromStore(
        result.participant1.id,
        participants
      );
      const participant2 = getParticipantByIdFromStore(
        result.participant2.id,
        participants
      );
      const active =
        participant1.data.active && participant2.data.active ? true : false;
      if (result.participant1.id === player.participantId) {
        const won = result.participant1.won;
        const player1Name = player.name;
        const player1Score = result.participant1.score;
        const player2Name = getPlayerByParticipantIdFromStore(
          result.participant2.id,
          participants,
          players
        )?.data?.name;
        const player2Score = result.participant2.score;
        playerResults.push({
          player1Name: player1Name,
          player1Score: player1Score,
          player2Name: player2Name,
          player2Score: player2Score,
          won: won,
          originalParticipantNumber: 1,
          originalResult: result,
          roundNumber: result.roundNumber,
          active: active,
        });
      } else if (result.participant2.id === player.participantId) {
        const won = result.participant2.won;
        const player1Name = player.name;
        const player1Score = result.participant2.score;
        const player2Name = getPlayerByParticipantIdFromStore(
          result.participant1.id,
          participants,
          players
        )?.data?.name;
        const player2Score = result.participant1.score;
        playerResults.push({
          player1Name: player1Name,
          player1Score: player1Score,
          player2Name: player2Name,
          player2Score: player2Score,
          won: won,
          originalParticipantNumber: 2,
          originalResult: result,
          roundNumber: result.roundNumber,
          active: active,
        });
      }
    }
    return playerResults.sort((a, b) => {
      return a.player2Name.localeCompare(b.player2Name);
    });
  }

  return (
    <div className="container player_results_container">
      <div className="buttons_container">
        <button
          className="button close_button close_results"
          onClick={() => props.closeComponentFunc()}
        >
          סגור
        </button>
      </div>
      <h3>{player.name}</h3>
      <div className="buttons_container filter_box">
        <button
          className={`button ${orderBy === "name" ? "active" : ""}`}
          onClick={() => setOrderBy("name")}
        >
          לפי שם
        </button>
        <button
          className={`button ${orderBy === "name" ? "" : "active"}`}
          onClick={() => setOrderBy("round")}
        >
          לפי סיבוב
        </button>
      </div>
      {orderBy === "round" &&
        Object.entries(playerResultsByRound()).map((round) => {
          const roundNumber = round[0];
          return (
            <div className="player_round_results_container" key={roundNumber}>
              <h5>
                <span>סיבוב</span>
                <span>{" " + roundNumber}</span>
              </h5>
              {round[1].length === 0 ? (
                <div>
                  <span>לא שיחק</span>
                </div>
              ) : (
                <div>
                  {round[1].map((result, index) => {
                    return (
                      <PlayerResultComp
                        key={index}
                        result={result}
                        roundNumber={roundNumber}
                      ></PlayerResultComp>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      {orderBy === "name" &&
        playerResultsByName().map((result, index) => {
          return (
            <div className="player_round_results_container" key={index}>
              <PlayerResultComp
                key={index}
                result={result}
                roundNumber={result.roundNumber}
              ></PlayerResultComp>
            </div>
          );
        })}
    </div>
  );
}
