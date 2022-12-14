import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPlayerByIdFromStore, isValidScore, updatePlayoff16, updatePlayoff8 } from "./utils";

export default function Playoff8GameComp(props) {
  const dispatch = useDispatch();
  const currentTournament = useSelector((state) => state.currentTournament);
  const players = useSelector((state) => state.players);
  const [scoreErrorMessage, setScoreErrorMessage] = useState("");
  const [isScoreErrorMessage, setIsScoreErrorMessage] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const index = props.index;
  const game = props.game;

  function enterScore(gameNum, playerNum, score) {
    const newWinners = currentTournament.data.winners;
    const newGames = currentTournament.data.playoff8.map((g) => {
      if (g.game === gameNum) {
        if (playerNum === 1) {
          return { ...g, player1Score: score };
        } else {
          return { ...g, player2Score: score };
        }
      } else {
        return g;
      }
    });
    updatePlayoff8(currentTournament, newGames, newWinners, dispatch);
  }

  function endGame() {
    const res = isValidScore([game.player1Score, game.player2Score]);
    if (res.status === false) {
      setIsScoreErrorMessage(true);
      setScoreErrorMessage(res.message);
      return;
    }

    setIsGameOver(true);
    const winner =
      Number(game.player1Score) > Number(game.player2Score)
        ? game.player1
        : game.player2;
    const looser =
      Number(game.player1Score) < Number(game.player2Score)
        ? game.player1
        : game.player2;

    let newWinners = currentTournament.data.winners;
    const newGames = currentTournament.data.playoff8.map((g, i) => {
      if (i === game.winnerNextGame) {
        if (game.winnerPlayerNumber === "1") {
          const newGame = { ...g, player1: winner };
          return newGame;
        } else {
          const newGame = { ...g, player2: winner };
          return newGame;
        }
      } else if (i === game.looserNextGame) {
        if (game.looserPlayerNumber === "1") {
          const newGame = { ...g, player1: looser };
          return newGame;
        } else {
          const newGame = { ...g, player2: looser };
          return newGame;
        }
      } else if (game.winnerNextGame === "third") {
        newWinners = { ...newWinners, third: winner };
        return g;
      } else if (game.winnerNextGame === "first") {
        newWinners = { ...newWinners, first: winner, second: looser };
        return g;
      } else {
        return g;
      }
    });

    updatePlayoff8(currentTournament, newGames, newWinners, dispatch);
  }

  return (
    <div key={index} className={`playoff_game_container ${game.className}`}>
      <h3>{`???????? ${game.game}`}</h3>
      <div>
        <span>
          {getPlayerByIdFromStore(game?.player1?.playerId, players)?.data.name}
        </span>
        <input
          type="text"
          onChange={(e) => enterScore(game.game, 1, e.target.value)}
          value={game.player1Score}
        ></input>
        <span className="gh">{game.player1PrevGame}</span>
      </div>
      <div>
        <span>
          {getPlayerByIdFromStore(game?.player2?.playerId, players)?.data.name}
        </span>
        <input
          type="text"
          onChange={(e) => enterScore(game.game, 2, e.target.value)}
          value={game.player2Score}
        ></input>
        <span className="gh">{game.player2PrevGame}</span>
      </div>
      {isGameOver ? (
        <div className="buttons_container">
          <button className="button" onClick={() => endGame()}>
            ????????
          </button>
        </div>
      ) : (
        String(game.player1).length > 0 &&
        String(game.player2).length > 0 && (
          <div className="buttons_container">
            <button className="button" onClick={() => endGame()}>
              ???????? ????????
            </button>
          </div>
        )
      )}
      {isScoreErrorMessage && (
        <div>
          <span>{scoreErrorMessage}</span>
          <button
            className="button ok_button"
            onClick={() => setIsScoreErrorMessage(false)}
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
}
