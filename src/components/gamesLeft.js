import { useState } from "react";
import { useSelector } from "react-redux";
import {
  gamesLeftAboveAvarge,
  getPlayerByParticipantIdFromStore,
} from "./utils";

export default function GamesLeftComp(props) {
  const participants = useSelector((state) => state.participants);
  const players = useSelector((state) => state.players);
  const participant = props.participant;
  const [isParticipantsToPlay, setIsParticipantsToPlay] = useState(false);

  return (
    <div className="games_left_container">
      משחקים שנותרו: &nbsp;
      <span
        className={`${
          gamesLeftAboveAvarge(participants, participant) ? "red" : ""
        }`}
      >
        {participant?.data?.participantsToPlayIds.length}
      </span>
      <div className="buttons_container">
        <button
          className="button info_button"
          onClick={() => setIsParticipantsToPlay(!isParticipantsToPlay)}
        >
          מידע
        </button>
      </div>
      {isParticipantsToPlay && (
        <div className="participants_to_play_list_container container">
          <ul className="list">
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
                    {
                      getPlayerByParticipantIdFromStore(
                        participantId,
                        participants,
                        players
                      )?.data?.name
                    }
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </div>
  );
}
