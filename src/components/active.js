import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { freezeParticipant, unfreezeParticipant } from "./utils";

export default function ActiveParticipantComp(props) {
  const dispatch = useDispatch();
  const participant = props.participant;
  const players = useSelector((state) => state.players);
  const tables = useSelector((state) => state.tables);
  const participants = useSelector((state) => state.participants);
  const currentTournament = useSelector((state) => state.currentTournament);
  const currentRound = useSelector((state) => state.currentRound);
  const [isFreezingParticipant, setIsFreezingParticipant] = useState(false);
  const [isUnfreezingParticipant, setIsUnfreezingParticipant] = useState(false);
  const [isRemoveParticipantErrorMessage, setIsRemoveParticipantErrorMessage] =
    useState(false);
  const [removeParticipantErrorMessage, setRemoveParticipantErrorMessage] =
    useState("");
 

  async function removeParticipantConfirmed() {
    setIsFreezingParticipant(true)
    await freezeParticipant(
      currentTournament.id,
      participant.id,
      currentRound,
      participants,
      tables,
      dispatch,
      players
    );
    setIsFreezingParticipant(false)
  }

  async function removeParticipantBtnClick() {
    for (const table of tables) {
      if (
        (table.data.participant1Id === participant.id ||
          table.data.participant2Id === participant.id) &&
        table.data.isTaken
      ) {
        setIsRemoveParticipantErrorMessage(true);
        setRemoveParticipantErrorMessage("אי אפשר למחוק משתתף באמצע משחק");
        return;
      }
    }

    removeParticipantConfirmed()
  }


  async function returnParticipantBtnClick() {
    setIsUnfreezingParticipant(true)
    await unfreezeParticipant(currentTournament.id, participant.id, currentRound, participants, tables, dispatch, players)
    setIsUnfreezingParticipant(false)
  }

  function statusChange(e) {
    if (!participant.data.arrivedToPlayoff) {
        return
    }
    e.target.checked ?
    returnParticipantBtnClick() :
    removeParticipantBtnClick()
  }

  return (
    <div>
        <input className="standings_checkbox" type="checkbox" checked={participant.data.active} onChange={e => statusChange(e)}></input>
        {isRemoveParticipantErrorMessage &&
        <div className="error_message_container">
            <span>{removeParticipantErrorMessage}</span>
            <div className="buttons_container">
            <button
                className="button ok_button"
                onClick={() => setIsRemoveParticipantErrorMessage(false)}
            >
                Ok
            </button>
            </div>
        </div>
        }
        {(isFreezingParticipant || isUnfreezingParticipant) &&
        <div className="wait container">
            <h3>המתן...</h3>
        </div>
        }
    </div>
  );
}
