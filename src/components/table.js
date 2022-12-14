import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOptionalParticipantsIdsToPlay,
  getPlayerByParticipantIdFromStore,
  playerSelectedToTable,
  clearTable,
  updateTableNumber,
  updateParticipantScore,
  removeTable,
  endGame,
  isValidScore,
  cancelGame,
  startGame,
  setTableFreezeStatus,
  updateTablesNumbers,
} from "./utils";

export default function TableComp(props) {
  const dispatch = useDispatch();
  const table = props.table;
  const currentTournament = useSelector((state) => state.currentTournament);
  const tables = useSelector((state) => state.tables);
  const currentRound = useSelector((state) => state.currentRound);
  const players = useSelector((state) => state.players);
  const participants = useSelector((state) => state.participants);
  const rankings = useSelector((state) => state.rankings);
  const [isInputErrorMessage, setIsInputErrorMessage] = useState(false);
  const [inputErrorMessage, setInputErrorMessage] = useState("");
  const [newTableNum, setNewTableNum] = useState(table.data.number);
  const [isDeleteTableConfirmation, setIsDeleteTableConfirmation] =
    useState(false);

  useEffect(() => {
    setNewTableNum(table.data.number);
  }, [table]);

  async function participant1Selected(newParticipantId) {
    setIsInputErrorMessage(false);
    playerSelectedToTable(
      table,
      tables,
      newParticipantId,
      1,
      currentRound,
      currentTournament,
      dispatch
    );
  }

  async function participant2Selected(newParticipantId) {
    setIsInputErrorMessage(false);
    playerSelectedToTable(
      table,
      tables,
      newParticipantId,
      2,
      currentRound,
      currentTournament,
      dispatch
    );
  }

  async function clear() {
    clearTable(table, tables, currentRound, currentTournament, dispatch);
  }

  async function start() {
    if (table.data.participant1Id === "" || table.data.participant2Id === "") {
      setIsInputErrorMessage(true);
      setInputErrorMessage("???????? ?????? ????????????");
      return;
    }
    startGame(
      table,
      tables,
      participants,
      players,
      rankings,
      dispatch,
      currentRound,
      currentTournament.id
    );
  }

  async function cancel() {
    setIsInputErrorMessage(false);
    cancelGame(table, tables, currentRound, currentTournament, dispatch);
  }

  async function end() {
    const res = isValidScore([
      table.data.participant1Score,
      table.data.participant2Score,
    ]);
    if (res.status === false) {
      setIsInputErrorMessage(true);
      setInputErrorMessage(res.message);
      return;
    }
    setIsInputErrorMessage(false);
    endGame(
      table,
      tables,
      currentRound,
      currentTournament,
      participants,
      players,
      dispatch
    );
  }

  function participant1NameAndRanking() {
    const player = getPlayerByParticipantIdFromStore(
      table.data.participant1Id,
      participants,
      players
    );
    return `${player?.data.name} (${player?.data.ranking})`;
  }

  function participant2NameAndRanking() {
    const player = getPlayerByParticipantIdFromStore(
      table.data.participant2Id,
      participants,
      players
    );
    return `${player?.data.name} (${player?.data.ranking})`;
  }

  function deleteTable() {
    removeTable(table, tables, dispatch);
  }

  function freezeTable() {
    setTableFreezeStatus(table, tables, true, dispatch);
  }

  function unfreezeTable() {
    setTableFreezeStatus(table, tables, false, dispatch);
  }

  function editParticipantScore(newScore, playerNumber) {
    setIsInputErrorMessage(false);
    updateParticipantScore(newScore, table, tables, playerNumber, dispatch);
  }

  async function changeTableNumber() {
    if (newTableNum === table.data.number) {
      return;
    }
    const prevTable = tables.find((t) => t.data.number === newTableNum);
    if (prevTable !== undefined) {
      updateTablesNumbers(
        prevTable,
        table.data.number,
        table,
        newTableNum,
        tables,
        dispatch
      );
    } else {
      updateTableNumber(table, tables, newTableNum, dispatch);
    }
  }

  function tableNumberKeyPress(e) {
    if (e.code === "Enter") {
      e.target.blur();
    }
  }

  return (
    <div
      className={`table_container ${
        table.data.isTaken
          ? "taken_table"
          : table.data.isFrozen
          ? "frozen_table"
          : "free_table"
      }`}
    >
      {table?.data.isTaken ? (
        <div className="table_taken_contianer">
          <div className="tab_num_box">
            <span>???? ??????????</span>
            <input
              className="ta_num"
              type="text"
              onKeyDown={tableNumberKeyPress}
              onChange={(e) => setNewTableNum(e.target.value)}
              onBlur={changeTableNumber}
              value={newTableNum}
            ></input>
          </div>
          <div className="text_input_container">
            <span>{participant1NameAndRanking()}</span>
            <input
              className={`score_input ${
                isInputErrorMessage ? "error_input" : ""
              }`}
              type="text"
              value={table.data.participant1Score}
              onChange={(e) => editParticipantScore(e.target.value, 1)}
            ></input>
          </div>
          <div className="text_input_container">
            <span>{participant2NameAndRanking()}</span>
            <input
              className={`score_input ${
                isInputErrorMessage ? "error_input" : ""
              }`}
              type="text"
              value={table.data.participant2Score}
              onChange={(e) => editParticipantScore(e.target.value, 2)}
            ></input>
          </div>
          <div className="buttons_container">
            <button className="button" onClick={end}>
              ???????? ????????
            </button>
            <button className="button" onClick={cancel}>
              ??????
            </button>
          </div>
        </div>
      ) : table?.data.isFrozen ? (
        <div>
          <div className="buttons_container unlock_container">
            <button className="button unfreeze_button" onClick={unfreezeTable}>
              ???????? ?????????? ??????????????
            </button>
          </div>
          <div className="tab_num_box">
            <span>???? ??????????</span>
            <input
              className="ta_num"
              type="text"
              onKeyDown={tableNumberKeyPress}
              onChange={(e) => setNewTableNum(e.target.value)}
              onBlur={changeTableNumber}
              value={newTableNum}
            ></input>
          </div>
        </div>
      ) : (
        <div className="free_table_container">
          <div className="buttons_container float_buttons">
            <button
              className="button delete_button"
              onClick={() => setIsDeleteTableConfirmation(true)}
            >
              ?????? ??????????
            </button>
            <button className="button freeze_button" onClick={freezeTable}>
              ???????? ??????????
            </button>
          </div>
          {isDeleteTableConfirmation && (
            <div className="confirmation_container container">
              <span>?????? ?????? ???????? ?????????????? ?????????? ???? ?????????????</span>
              <div className="buttons_container">
                <button className="button yes_button" onClick={deleteTable}>
                  ????
                </button>
                <button
                  className="button no_button"
                  onClick={() => setIsDeleteTableConfirmation(false)}
                >
                  ????
                </button>
              </div>
            </div>
          )}
          <div className="tab_num_box">
            <span>???? ??????????</span>
            <input
              className="ta_num"
              type="text"
              onKeyDown={tableNumberKeyPress}
              onChange={(e) => setNewTableNum(e.target.value)}
              onBlur={changeTableNumber}
              value={newTableNum}
            ></input>
          </div>
          <div>
            <span>????????????</span>
          </div>
          <div className="select_container">
            <label htmlFor="select-participant1"></label>
            <select
              className={`${isInputErrorMessage ? "error_input" : ""}`}
              id="select-participant1"
              name="select-participant1"
              onChange={(e) => participant1Selected(e.target.value)}
              onClick={(e) => e.preventDefault()}
              value={table.data.participant1Id}
            >
              <option></option>
              {getOptionalParticipantsIdsToPlay(
                currentRound,
                table.data.participant2Id,
                participants,
                players
              ).map((participantId, index) => {
                const player = getPlayerByParticipantIdFromStore(
                  participantId,
                  participants,
                  players
                );
                return (
                  <option
                    key={index}
                    value={participantId}
                  >{`${player?.data.name} (${player?.data.ranking})`}</option>
                );
              })}
            </select>
          </div>
          <div className="select_contianer">
            <label htmlFor="select-participant2"></label>
            <select
              className={`${isInputErrorMessage ? "error_input" : ""}`}
              id="select-participant2"
              name="select-participant2"
              onChange={(e) => participant2Selected(e.target.value)}
              value={table.data.participant2Id}
            >
              <option></option>
              {getOptionalParticipantsIdsToPlay(
                currentRound,
                table.data.participant1Id,
                participants,
                players
              ).map((participantId, index) => {
                const player = getPlayerByParticipantIdFromStore(
                  participantId,
                  participants,
                  players
                );
                return (
                  <option
                    key={index}
                    value={participantId}
                  >{`${player?.data.name} (${player?.data.ranking})`}</option>
                );
              })}
            </select>
          </div>
          <div className="buttons_container table_buttons">
            <button
              className="button"
              onClick={start}
              disabled={
                table.data.participant1Id.length > 0 &&
                table.data.participant2Id.length > 0
                  ? false
                  : true
              }
            >
              ???????? ????????
            </button>
            <button className="button" onClick={clear}>
              ??????
            </button>
          </div>
        </div>
      )}
      {isInputErrorMessage && (
        <div className="error_message_container">
          <span>{inputErrorMessage}</span>
        </div>
      )}
    </div>
  );
}
