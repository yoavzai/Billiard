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
    <div>
      <span
        className={`${
          gamesLeftAboveAvarge(participants, participant) ? "red" : ""
        }`}
        onMouseEnter={() => setIsParticipantsToPlay(true)}
        onMouseLeave={() => setIsParticipantsToPlay(false)}
      >
        {participant?.data?.participantsToPlayIds.length}
      </span>
      {isParticipantsToPlay && (
        <div className="participants_to_play_list_container container">
          <ul>
            {[...participant?.data?.participantsToPlayIds]
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
        </div>
      )}
    </div>
  );
}
