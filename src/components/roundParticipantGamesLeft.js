import { useState } from "react";
import { useSelector } from "react-redux";
import {
  gamesLeftAboveAvarge,
  getPlayerByParticipantIdFromStore,
} from "./utils";

export default function RoundParticipantGamesLeftComp(props) {
  const participants = useSelector((state) => state.participants);
  const players = useSelector((state) => state.players);
  const participant = props.participant;
  const [isParticipantsToPlay, setIsParticipantsToPlay] = useState(false);


  return (
    <div className="possible_rivals_container">
      {participant?.data?.participantsToPlayIds.length === 0
      ? 
      <div>
        <span>אין משחקים</span>
      </div>
      :
      <div>
        <span
          className={`${
            gamesLeftAboveAvarge(participants, participant) ? "red" : ""
          }`}
        >
          {participant?.data?.participantsToPlayIds.length}
        </span>
        <div className="buttons_container">
          <button
            className={`button info_button games_left_button ${isParticipantsToPlay ? "games_left_button_open" : ""}`}
            onClick={() => setIsParticipantsToPlay(!isParticipantsToPlay)}
          >
            מידע
          </button>
        </div>
        {isParticipantsToPlay && (
          <ul className="possible_rivals_list">
          {participant?.data?.participantsToPlayIds
              .sort((a, b) => {
              const name1 = getPlayerByParticipantIdFromStore(
                  a,
                  participants,
                  players
              ).data.name;
              const name2 = getPlayerByParticipantIdFromStore(
                  b,
                  participants,
                  players
              ).data.name;
              return name1.localeCompare(name2);
              })
              .map((participantId) => {
              return (
                  <li key={participantId}>
                  <span>
                      {
                      getPlayerByParticipantIdFromStore(
                          participantId,
                          participants,
                          players
                      )?.data?.name
                      }
                  </span>
                  <span>
                      ,
                  </span>
                  </li>
              );
              })}
          </ul>
        )}
      </div>
      }
    </div>
  );
}
