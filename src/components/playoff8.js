import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Playoff16GameComp from "./playoff16Game";
import Playoff8GameComp from "./playoff8Game";
import { erasePlayoffData, getPlayerByIdFromStore } from "./utils";

export default function Playoff16Comp(props) {
  const dispatch = useDispatch();
  const currentTournament = useSelector((state) => state.currentTournament);
  const players = useSelector((state) => state.players);
  const [isCancelPlayoffConfirmation, setIsCancelPlayoffConfirmation] = useState(false)


  function cancelPlayoffConfirmed() {
    erasePlayoffData(currentTournament, dispatch);
    props.closePlayoff();
  }

  return (
    <div className="container playoff_container playoff8_container">
      <div className="buttons_container">
        <button
          className="button close_button"
          onClick={() => props.closePlayoff()}
        >
          סגור
        </button>
        {currentTournament.data.isActive &&
        <button className="button" onClick={() => setIsCancelPlayoffConfirmation(true)}>
          בטל פלייאוף
        </button>
        }
      </div>
      {isCancelPlayoffConfirmation && (
        <div className="confirmation_container right">
          <span>האם אתה בטוח שברצונך לבטל את הפלייאוף?</span>
          <div className="buttons_container">
            <button
              className="button yes_button"
              onClick={cancelPlayoffConfirmed}
            >
              כן
            </button>
            <button
              className="button no_button"
              onClick={() => setIsCancelPlayoffConfirmation(false)}
            >
              לא
            </button>
          </div>
        </div>
      )}
      <div className="playoff_bracket playoff8_bracket">
        {currentTournament.data.playoff8
          .filter((g) => g.className !== "finals")
          .map((game, index) => {
            return (
              <Playoff8GameComp
                key={index}
                game={game}
                index={index}
              ></Playoff8GameComp>
            );
          })}
      </div>
      <div className="finals_container">
        <div className="final4_container">
          {currentTournament.data.playoff8
            .filter((g) => g.className === "finals")
            .map((game, index) => {
              return (
                <Playoff8GameComp
                  key={index}
                  game={game}
                  index={index}
                ></Playoff8GameComp>
              );
            })}
        </div>
        <div className="winners_container">
          <div>
            <h3>מקום ראשון</h3>
            <span>
              {
                getPlayerByIdFromStore(
                  currentTournament.data.winners?.first?.playerId,
                  players
                )?.data.name
              }
            </span>
          </div>
          <div>
            <h3>מקום שני</h3>
            <span>
              {
                getPlayerByIdFromStore(
                  currentTournament.data.winners?.second?.playerId,
                  players
                )?.data.name
              }
            </span>
          </div>
          <div>
            <h3>מקום שלישי</h3>
            <span>
              {
                getPlayerByIdFromStore(
                  currentTournament.data.winners?.third?.playerId,
                  players
                )?.data.name
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
