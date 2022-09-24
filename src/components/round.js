import RoundParticipant from "./roundParticipant";
import TablesComp from "./tables";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  endRound,
  getPlayerByParticipantIdFromStore,
  isParticipantArrived,
} from "./utils";
import RoundResultsComp from "./roundResults";
import { useEffect } from "react";
import { RoundParticipantPossibleRivalsComp } from "./roundParticipantPossibleRivals";
import RoundParticipantGamesLeftComp from "./roundParticipantGamesLeft";


export default function RoundComp() {
  const dispatch = useDispatch();
  const tables = useSelector((state) => state.tables);
  const rounds = useSelector((state) => state.rounds);
  const players = useSelector((state) => state.players);
  const participants = useSelector((state) => state.participants);
  const currentTournament = useSelector((state) => state.currentTournament);
  const currentRound = useSelector((state) => state.currentRound);
  const [scrollTopPos, setScrollTopPos] = useState(0)
  const [isFinishRoundErrorMessage, setIsFinishRoundErrorMessage] =
    useState(false);
  const [isFinishRoundConfirmation, setIsFinishRoundConfirmation] =
    useState(false);

  
  useEffect(() => {
    const roundDiv = document.getElementById("round_container")
    if (roundDiv != null) {
      roundDiv.scrollTo(0, Number(scrollTopPos))
    }
  }, [tables, currentRound])

  function finishRoundBtnClick() {
    for (const table of tables) {
      if (table.data.isTaken) {
        setIsFinishRoundErrorMessage(true);
        return;
      }
    }
    setIsFinishRoundConfirmation(true);
  }

  async function finishRoundConfirmed() {
    setIsFinishRoundConfirmation(false);
    endRound(currentTournament.id, currentRound, rounds, tables, dispatch);
  }

  function sortedRoundParticipants() {
    let sortedParticipants = participants.sort((a, b) => {
      const player1 = currentRound.data.arrivedParticipants.find(
        (p) => p.participantId === a.id
      );
      const player2 = currentRound.data.arrivedParticipants.find(
        (p) => p.participantId === b.id
      );
      if (player1 === undefined && player2 === undefined) {
        return 0;
      } else if (player1 === undefined && player2 !== undefined) {
        return 1;
      } else if (player2 === undefined && player1 !== undefined) {
        return -1;
      } else {
        if (player1.isFree && player2.isFree) {
          return 0;
        } else if (player1.isFree && !player2.isFree) {
          return 1;
        } else if (!player1.isFree && player2.isFree) {
          return -1;
        } else {
          const player1TableNumber = tables.find(
            (t) =>
              t.data.participant1Id === player1.participantId ||
              t.data.participant2Id === player1.participantId
          ).data.number;
          const player2TableNumber = tables.find(
            (t) =>
              t.data.participant1Id === player2.participantId ||
              t.data.participant2Id === player2.participantId
          ).data.number;
          return player1TableNumber - player2TableNumber;
        }
      }
    });
    return sortedParticipants;
  }

  // function clearRoundParticipantTableNumber(participantId) {
  //     if (participantId.length !== 0) {
  //         document.getElementById("table"+participantId).value = ""
  //     }
  // }

  // function addParticipantToNewGame(participant, newTableNum) {

  //     if (newTableNum.length === 0) {

  //         if (newGameData.participant1Id === participant.id && newGameData.participant2Id.length > 0) {
  //             setNewGameData({...newGameData, participant1Id: ""})
  //         }
  //         else if (newGameData.participant2Id === participant.id && newGameData.participant1Id.length > 0) {
  //             setNewGameData({...newGameData, participant2Id: ""})
  //         }
  //         else {
  //             setNewGameData({tableNum: "", participant1Id: "", participant2Id: ""})
  //         }
  //     }

  //     else {
  //         if (newTableNum === newGameData.tableNum) {
  //             if (newGameData.participant1Id.length > 0 && newGameData.participant2Id.length === 0) {
  //                 setNewGameData({...newGameData, participant2Id: participant.id})
  //             }
  //             else if (newGameData.participant2Id.length > 0 && newGameData.participant1Id.length === 0) {
  //                 setNewGameData({...newGameData, participant1Id: participant.id})
  //             }
  //             else {
  //                 clearRoundParticipantTableNumber(newGameData.participant1Id)
  //                 clearRoundParticipantTableNumber(newGameData.participant2Id)
  //                 setNewGameData({tableNum: newTableNum, participant1Id: participant.id, participant2Id: ""})
  //             }
  //         }
  //         else {
  //             if (newGameData.participant1Id === participant.id) {
  //                 clearRoundParticipantTableNumber(newGameData.participant2Id)
  //                 setNewGameData({...newGameData, tableNum: newTableNum, participant2Id: ""})
  //             }
  //             else if (newGameData.participant2Id === participant.id) {
  //                 clearRoundParticipantTableNumber(newGameData.participant1Id)
  //                 setNewGameData({...newGameData, tableNum: newTableNum, participant1Id: ""})
  //             }
  //             else {
  //                 clearRoundParticipantTableNumber(newGameData.participant1Id)
  //                 clearRoundParticipantTableNumber(newGameData.participant2Id)
  //                 setNewGameData({tableNum: newTableNum, participant1Id: participant.id, participant2Id: ""})
  //             }
  //         }
  //     }
  // }

  // function newGamePlayerName(participantId) {
  //     const player = getPlayerByParticipantIdFromStore(participantId, participants, players)
  //     return player === undefined ? "" : player.data.name
  // }

  function getParticipantTableNumber(participantId) {
    const table = tables.find(
      (t) =>
        (t.data.participant1Id === participantId ||
          t.data.participant2Id === participantId) &&
        t.data.isTaken
    );
    return table === undefined ? "" : table.data.number;
  }

  function closeRoundBtnClick() {
    dispatch({ type: "currentRound", payload: {} });
    document.body.classList.remove("round_open");
  }

  function checkAllPosibleRivals() {
    const openButtons = Array.from(document.getElementsByClassName("possible_rivals_button_open"))
    const allButtons = Array.from(document.getElementsByClassName("possible_rivals_button"))
    if (openButtons.length === allButtons.length) {
      for (const b of allButtons) {
        b.click()
      }
    }
    else {
      const buttonsToClick = allButtons.filter(b => !openButtons.includes(b))
      for (const button of buttonsToClick) {
        button.click()
      }

    }
  }

  function checkAllGamesLeft() {
    const openButtons = Array.from(document.getElementsByClassName("games_left_button_open"))
    const allButtons = Array.from(document.getElementsByClassName("games_left_button"))
    if (openButtons.length === allButtons.length) {
      for (const b of allButtons) {
        b.click()
      }
    }
    else {
      const buttonsToClick = allButtons.filter(b => !openButtons.includes(b))
      for (const button of buttonsToClick) {
        button.click()
      }

    }
  }

  return (
    <div>
      {Object.keys(currentRound).length > 0 && (
        <div id="round_container" className="container round_container" onScroll={(e) => setScrollTopPos(e.target.scrollTop)}>
          <div className="buttons_container close_button_container">
            <button
              className="button close_button"
              onClick={closeRoundBtnClick}
            >
              סגור
            </button>
            {currentRound?.data?.isActive && (
              <div className="buttons_container">
                <button className="button" onClick={finishRoundBtnClick}>
                  סיים סיבוב
                </button>
              </div>
            )}
            {isFinishRoundConfirmation && (
              <div className="confirmation_container container finish_round_confirmation">
                <span>האם אתה בטוח שברצונך לסיים את הסיבוב?</span>
                <div className="buttons_container">
                  <button
                    className="button yes_button"
                    onClick={finishRoundConfirmed}
                  >
                    כן
                  </button>
                  <button
                    className="button no_button"
                    onClick={() => setIsFinishRoundConfirmation(false)}
                  >
                    לא
                  </button>
                </div>
              </div>
            )}
          </div>
          <h3>
            <span>סיבוב</span>
            <span>{" " + currentRound.data.number + " - "}</span>
            <span>
              {" " +
                currentRound.data.startDate.day +
                " " +
                currentRound.data.startDate.month +
                " " +
                currentRound.data.startDate.year +
                " "}
            </span>
            <span>{currentRound.data.isActive ? "(פעיל)" : "(הסתיים)"}</span>
          </h3>

          <div className="participants_box container">
            {isFinishRoundErrorMessage && (
              <div className="error_message_container">
                <span>אי אפשר לסיים סיבוב בזמן שקיימים משחקים פעילים</span>
                <div className="buttons_container">
                  <button
                    className="button ok_button"
                    onClick={() => setIsFinishRoundErrorMessage(false)}
                  >
                    Ok
                  </button>
                </div>
              </div>
            )}

            <h4>{`משתתפים נוכחים (${currentRound?.data?.arrivedParticipants?.length})`}</h4>
            <div className="arrived_participants_table_container">
              <table className="table arrived_participants_table">
                <thead>
                  <tr>
                    <th className="pa_name">שם</th>                  
                    <th className="t_num">שולחן</th>
                    <th className="opp_info" >יריבים אפשריים<button className="button info_all_rivals_button" onClick={checkAllPosibleRivals}>הצג הכל</button></th>
                    <th className="left_games">משחקים שנותרו<button className="button info_all_games_left_button" onClick={checkAllGamesLeft}>הצג הכל</button></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRoundParticipants().map((participant, index) => {
                    return (
                      <tr key={participant.id}>
                        <td className="pa_name">
                          <RoundParticipant
                            participant={participant}
                            name={
                              getPlayerByParticipantIdFromStore(
                                participant.id,
                                participants,
                                players
                              ).data.name
                            }
                            currentRound={currentRound}
                            index={index}
                          ></RoundParticipant>
                        </td>
                        {currentRound.data.isActive && (
                          <td className="t_num">
                            {getParticipantTableNumber(participant.id)}
                            {/* <RoundParticipantTableComp 
                                                participant={participant}
                                                addParticipantToNewGame={addParticipantToNewGame}>
                                        </RoundParticipantTableComp> */}
                          </td>
                        )}
                        {currentRound.data.isActive &&
                          <td className="opp_info">
                            {isParticipantArrived(currentRound,  participant.id) &&
                            <RoundParticipantPossibleRivalsComp
                              participant={participant}
                            ></RoundParticipantPossibleRivalsComp>
                            }
                          </td>
                        }
                        {currentRound.data.isActive &&
                            <td className="left_games">
                              <RoundParticipantGamesLeftComp
                                participant={participant}>
                              </RoundParticipantGamesLeftComp>
                            </td>
                          }
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {currentRound?.data?.isActive ? (
            <TablesComp></TablesComp>
          ) : (
            <RoundResultsComp></RoundResultsComp>
          )}
        </div>
      )}
    </div>
  );
}
