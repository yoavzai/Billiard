import { useDispatch, useSelector } from "react-redux";
import Playoff16GameComp from "./playoff16Game";
import { erasePlayoffData, getPlayerByIdFromStore } from "./utils";

export default function Playoff16Comp(props) {
  const dispatch = useDispatch();
  const currentTournament = useSelector((state) => state.currentTournament);
  const players = useSelector((state) => state.players);

  async function cancelPlayoff() {
    erasePlayoffData(currentTournament, dispatch);
    props.closePlayoff();
  }

  return (
    <div className="container playoff_container playoff16_container">
      <div className="buttons_container">
        <button
          className="button close_button"
          onClick={() => props.closePlayoff()}
        >
          סגור
        </button>
        <button className="button" onClick={cancelPlayoff}>
          בטל פלייאוף
        </button>
      </div>
      <div className="playoff_bracket playoff16_bracket">
        {currentTournament.data.playoff16
          .filter((g) => g.className !== "finals")
          .map((game, index) => {
            return (
              <Playoff16GameComp
                key={index}
                game={game}
                index={index}
              ></Playoff16GameComp>
            );
          })}
      </div>
      <div className="finals_container">
        <div className="final4_container">
          {currentTournament.data.playoff16
            .filter((g) => g.className === "finals")
            .map((game, index) => {
              return (
                <Playoff16GameComp
                  key={index}
                  game={game}
                  index={index}
                ></Playoff16GameComp>
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
