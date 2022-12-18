import { useDispatch, useSelector } from "react-redux";
import { getStandings, updateParticipantOnServer } from "./utils";

export default function ArrivedToPlayoffComp(props) {
  const dispatch = useDispatch();
  const participant = props.participant;
  const players = useSelector((state) => state.players);
  const currentTournament = useSelector((state) => state.currentTournament);
  const participants = useSelector((state) => state.participants);


  async function notArrivedToPlayoff() {
    const participantNewData = {...participant.data, arrivedToPlayoff: false}
    const newParticipants = participants.map(p => {
      if (p.id === participant.id) {
        return {...participant, data: participantNewData}
      }
      else {
        return p
      }
    })
    dispatch({type: "participants", payload: newParticipants})
    await updateParticipantOnServer(currentTournament.id, participant.id, participantNewData)
    const [standings, allResults] = await getStandings(currentTournament.id, newParticipants, players)
    dispatch({type: "standings", payload: {standings: standings, allResults: allResults}})
  }

  async function arrivedToPlayoff() {
    const participantNewData = {...participant.data, arrivedToPlayoff: true}
    const newParticipants = participants.map(p => {
      if (p.id === participant.id) {
        return {...participant, data: participantNewData}
      }
      else {
        return p
      }
    })
    dispatch({type: "participants", payload: newParticipants})
    await updateParticipantOnServer(currentTournament.id, participant.id, participantNewData)
    const [standings, allResults] = await getStandings(currentTournament.id, newParticipants, players)
    dispatch({type: "standings", payload: {standings: standings, allResults: allResults}})
  }


  function statusChange(e) {
    if (!participant.data.active) {
        return
    }
    e.target.checked ?
    arrivedToPlayoff() :
    notArrivedToPlayoff()
  }

  return (
    <div>
        <input className="standings_checkbox" type="checkbox" checked={participant.data.arrivedToPlayoff} onChange={e => statusChange(e)}></input>
    </div>
  );
}
