import { useState } from "react";
import { useSelector } from "react-redux";
import {
  gamesLeftAboveAvarge,
  getParticipantByIdFromStore,
  getPlayerByParticipantIdFromStore,
} from "./utils";

export default function RoundParticipantGamesLeftComp(props) {
  const participants = useSelector((state) => state.participants);
  const currentRound = useSelector((state) => state.currentRound);
  const players = useSelector((state) => state.players);
  const participant = props.participant;
  const [isParticipantsToPlay, setIsParticipantsToPlay] = useState(false);

  return (
    <div className="possible_rivals_container">
      {participant?.data?.participantsToPlayIds.length === 0 ? (
        <div>
          <span>אין משחקים</span>
        </div>
      ) : (
        <div>
          <div className="number_eye">
            <span
              className={`${
                gamesLeftAboveAvarge(participants, participant) ? "red" : ""
              }`}
            >
              {participant?.data?.participantsToPlayIds.length}
            </span>
            <div className="buttons_container">
              <button
                className={`button info_button games_left_button ${
                  isParticipantsToPlay ? "games_left_button_open" : ""
                }`}
                onClick={() => setIsParticipantsToPlay(!isParticipantsToPlay)}
              >
                מידע
              </button>
            </div>
          </div>
          {isParticipantsToPlay && (
            <ul className="possible_rivals_list">
              {[...participant?.data?.participantsToPlayIds]
                .sort((a, b) => {
                  const aArrived = currentRound.data.arrivedParticipants.filter((p) => p.participantId == a).length > 0
                  const bArrived = currentRound.data.arrivedParticipants.filter((p) => p.participantId == b).length > 0
                  if (aArrived && !bArrived) {
                     return -1
                  }
                  return 0
                  // const name1 = getPlayerByParticipantIdFromStore(
                  //   a,
                  //   participants,
                  //   players
                  // ).data.name;
                  // const name2 = getPlayerByParticipantIdFromStore(
                  //   b,
                  //   participants,
                  //   players
                  // ).data.name;
                  // return name1.localeCompare(name2);
                })
                .map((participantId) => {
                  const arrived = currentRound.data.arrivedParticipants.filter((p) => p.participantId == participantId).length > 0
                  return (
                    <li key={participantId}>
                      <span className={arrived ? "green" : ""}>
                        {
                          getPlayerByParticipantIdFromStore(
                            participantId,
                            participants,
                            players
                          )?.data?.name
                        }
                      </span>
                      <span>,</span>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
