
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import RoundComp from "./round"
import { addRound, setRound } from "./utils"



export default function RoundsComp() {

    const dispatch = useDispatch()
    const currentTournament = useSelector(state => state.currentTournament)
    const rounds = useSelector(state => state.rounds)
    const months = useSelector(state => state.months)
    const [isNewRoundConfirmation, setIsNewRoundConfirmation] = useState(false)
    const [isRoundSelected, setIsRoundSelected] = useState(false)
    const [startDate, setStartDate] = useState({fullDate: "", day: "", month: "", year: ""})
    const [isStartRoundErrorMessage, setIsStartRoundErrorMessage] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [isLoadingNewRound, setIsLoadingNewround] = useState(false)

    async function startNewRound() {
        setIsNewRoundConfirmation(false)
        setIsLoadingNewround(true)
        const newRoundNumber = rounds.length + 1
        const newRoundData = {startDate: startDate, number: newRoundNumber, arrivedParticipants: [], results: [], isActive: true}
        await addRound(currentTournament.id, newRoundData, dispatch)
        setIsRoundSelected(true)
        setIsLoadingNewround(false)
        document.body.classList.add("round_open")
    }

    async function roundSelected (roundId) {
        setIsNewRoundConfirmation(false)
        setIsLoadingNewround(true)
        await setRound(currentTournament.id, roundId, dispatch)
        setIsLoadingNewround(false)
        setIsRoundSelected(true)
        document.body.classList.add("round_open")
    }


    function startNewRoundBtnClick() {
        for (const round of rounds) {

            //              !!!!!!!!!!!!!!!! uncomment for production !!!!!!!!!!!!!!!!!!

            // if (round.data.startDate.year === startDate.year && round.data.startDate.month === startDate.month && round.data.startDate.day === startDate.day) {
            //     setIsNewRoundConfirmation(false)
            //     setIsStartRoundErrorMessage(true)
            //     setErrorMessage("סיבוב זה כבר קיים")
            //     return
            // }
            
            if (round.data.isActive) {
                setIsNewRoundConfirmation(false)
                setIsStartRoundErrorMessage(true)
                setErrorMessage("אי אפשר להתחיל סיבוב חדש בזמן שקיים סיבוב פעיל")
                return
            }
        }
        const newDate = new Date()
        const newMonth = newDate.getMonth()
        const newYear = newDate.getFullYear()
        const newDay = newDate.getDate()
        const newTime = newDate.getTime()
        
        setStartDate({fullDate: newTime, day: newDay, month: months[newMonth], year: newYear})
        setIsNewRoundConfirmation(true)
    }

    return (
        <div className="container rounds_container">
            <h3>בחר סיבוב</h3>
            {rounds.length > 0 ?
                rounds.map(round => {
                    return (
                        <div className="round_text_container" key={round.id}>
                            <span onClick={() => roundSelected(round.id)}>סיבוב</span>
                            <span onClick={() => roundSelected(round.id)}>{" " + round.data.number + " - "}</span>
                            <span onClick={() => roundSelected(round.id)}>{" " + round.data.startDate.day + " " + round.data.startDate.month + " " + round.data.startDate.year + " "}</span>
                            <span onClick={() => roundSelected(round.id)}>{round.data.isActive ? "(פעיל)" : "(הסתיים)"}</span>
                        </div>
                    )
                }) :
            <span>אין סיבובים להציג</span>
            }
            {currentTournament?.data?.isActive &&
                <button className="button" onClick={startNewRoundBtnClick}>התחל סיבוב חדש</button>
            }
            {isNewRoundConfirmation &&
            <div className="confirmation_container">         
                <span>להתחיל סיבוב</span>
                <span>{" " + startDate.day + " " + startDate.month + " " + startDate.year}</span>
                <span>?</span>
                <div className="buttons_container">
                    <button className="button" onClick={startNewRound}>התחל</button>
                    <button className="button" onClick={() => setIsNewRoundConfirmation(false)}>בטל</button>
                </div>
            </div>
            }
            {isLoadingNewRound &&
            <div className="loading_container">
                <h2>טוען...</h2>
            </div>
            }
            {isStartRoundErrorMessage &&
            <div className="error_message_container">
                <span>{errorMessage}</span>
                <div className="buttons_container">
                    <button className="button ok_button" onClick={() => setIsStartRoundErrorMessage(false)}>Ok</button>
                </div>
            </div>
            }
            {isRoundSelected && <RoundComp></RoundComp>}
        </div>
    )
}