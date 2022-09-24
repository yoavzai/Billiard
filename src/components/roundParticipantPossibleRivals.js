import { useState } from "react";
import { useSelector } from "react-redux";
import { getOptionalParticipantsIdsToPlay, getPlayerByParticipantIdFromStore } from "./utils";





export function RoundParticipantPossibleRivalsComp(props) {

    const participant = props.participant
    const players = useSelector((state) => state.players);
    const participants = useSelector((state) => state.participants);
    const currentRound = useSelector((state) => state.currentRound);
    const [isParticipantsToPlay, setIsParticipantsToPlay] = useState(false)


    return (
        <div className="possible_rivals_container">
            {getOptionalParticipantsIdsToPlay(
                currentRound,
                participant.id,
                participants,
                players)
                .length === 0
                ?
                <div>
                    <span>אין אפשרויות</span>
                </div>
                :
                <div>
                    <span>{getOptionalParticipantsIdsToPlay(
                currentRound,
                participant.id,
                participants,
                players)
                .length}</span>
                    <div className="buttons_container">
                        <button
                            className={`button info_button possible_rivals_button ${isParticipantsToPlay ? "possible_rivals_button_open" : ""}`}
                            onClick={() => setIsParticipantsToPlay(!isParticipantsToPlay)}
                        >
                            מידע
                        </button>
                    </div>
                    {isParticipantsToPlay &&
                    <ul className="possible_rivals_list">
                    {getOptionalParticipantsIdsToPlay(
                        currentRound,
                        participant.id,
                        participants,
                        players
                    ).map((participantId, index) => {
                        const player =
                        getPlayerByParticipantIdFromStore(
                            participantId,
                            participants,
                            players
                        );
                        return (
                        <li key={index}>
                            <span>
                            {player.data.name}
                            </span>
                            <span>
                            ,
                            </span>
                            </li>
                        );
                    })}
                    </ul>
                    }
                </div>
            }
        </div>
    ) 
}