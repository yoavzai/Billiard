import db from "./firestore";

// export async function getSortedTournamentsFromServer() {
//    const toursRef =  await db.collection("tournaments").get()
//    const toursSortedByDate = toursRef.docs.map(tour => {
//         return (
//             {id: tour.id,
//              data: tour.data()})
//     }).sort((a,b) => new Date(b.data.startDate) - new Date(a.data.startDate))

//    return toursSortedByDate;
// }

// export async function addArrivedPlayerOnServer(tourId, round, name, participants, players) {
//     const participant = getParticipantByNameFromStore(name, participants, players)
//     updateArrivedPlayersOnServer(tourId, round.id, [...round.data.arrivedPlayers, {"participantId": participant.id, "isFree": true}])
// }

export async function getRoundsFromServer(tourId) {
    const roundsQuery =  await db.collection("tournaments").doc(tourId).collection("rounds").get()
    const rounds = roundsQuery.docs.map(roundQuery => {
        return (
            {
                id: roundQuery.id,
                data: roundQuery.data()
            }
        )
    }).sort((a,b) => b.data.startDate.fullDate - a.data.startDate.fullDate)
    return rounds
}

export async function getTablesFromServer() {
    const tablesQuery =  await db.collection("tables").get()
    const tables = tablesQuery.docs.map(tableQuery => {
        return (
            {
                id: tableQuery.id,
                data: tableQuery.data()
            }
        )
    })
    return tables
}

// export function playersSortedByName(players) {
//     const sortedPlayers = players.sort((a,b) => a.data.name.localeCompare(b.data.name))
//     return sortedPlayers
// }

// export function participantsSortedByName(participants, players) {

//     const sortedParticipans = participants.sort((a,b) => {
//         const player1 = getPlayerByIdFromStore(a?.data.playerId, players)
//         const player2 = getPlayerByIdFromStore(b?.data.playerId, players)
//         return player1?.data.name.localeCompare(player2?.data.name)
//     })
//     return sortedParticipans
// }

//  export function participantsNotArrived(arrivedPlayers, participants) {
//     if (arrivedPlayers === undefined)
//         return []
//     const arrivedPlayersParticipantId = arrivedPlayers.map(p => p?.participantId)
//     return participants.filter(p => !arrivedPlayersParticipantId.includes(p.id))
//  }

export function getParticipantByNameFromStore(name, participants, players) {
    const player = getPlayerByNameFromStore(name, players)
    if (player === undefined) {
        return player
    }
    return getParticipantByPlayerIdFromStore(player.id, participants)
}

export async function updateTableOnServer(tableId, data) {
   return await db.collection("tables").doc(tableId).update(data)
}

export async function removeTablefromServer(tableId) {
    await db.collection("tables").doc(tableId).delete()
}

export async function addPlayerOnServer(playerData) {
    return await db.collection("players").add(playerData)
}

export async function updateArrivedParticipantsOnServer(tourId, roundId, newArrivedParticipants) {
    return await db.collection("tournaments").doc(tourId).collection("rounds").doc(roundId).update({"arrivedParticipants": newArrivedParticipants})

}

export async function removeParticipantFromArrivedParticipantsOnServer(tourId, round, participantId) {
    await updateArrivedParticipantsOnServer(tourId, round.id, round.data.arrivedParticipants.filter(p => p.participantId !== participantId))
}

export async function removeParticipantFromArrivedParticipantsOnAllRounds(tourId, participantId) {
    const rounds = await getRoundsFromServer(tourId)
    for (const round of rounds) {
        await removeParticipantFromArrivedParticipantsOnServer(tourId, round, participantId)
    }
} 

export async function endRoundOnServer(tourId, roundId) {
    await db.collection("tournaments").doc(tourId).collection("rounds").doc(roundId).update({"isActive": false})
}

export async function endTournamentOnServer(tourId) {
    await db.collection("tournaments").doc(tourId).update({"isActive": false})
}

export async function updateRoundOnServer(tourId, roundId, roundNewData) {
    return await db.collection("tournaments").doc(tourId).collection("rounds").doc(roundId).update(roundNewData)
}

export async function updateResultsOnServer(tourId, roundId, newResults) {
    return await db.collection("tournaments").doc(tourId).collection("rounds").doc(roundId).update({"results": newResults})

}

export async function removeResultFromServer(tourId, round, resultId) {
    return await updateResultsOnServer(tourId, round.id, round.data.results.filter(r => r.id !== resultId))
}

export async function removeAllParticipantResults(tourId, participantId) {
    const rounds = await getRoundsFromServer(tourId)
    for (const round of rounds) {
        const newResults = round.data.results.filter(r => r.participant1.id !== participantId && r.participant2.id !== participantId)
        await updateResultsOnServer(tourId, round.id, newResults)
    }
}

export async function addNewParticipantOnServer(tournamentId, participantData) {
    return await db.collection("tournaments").doc(tournamentId).collection("participants").add(participantData)
}

export async function removeParticipantFromServer(tourId, participantId) {
    await db.collection("tournaments").doc(tourId).collection("participants").doc(participantId).delete()
}

export async function addTournamentOnServer(tournamentData) {
   return await db.collection("tournaments").add(tournamentData)
}

export async function addRoundOnServer(tourId, roundData) {
   return await db.collection("tournaments").doc(tourId).collection("rounds").add(roundData)
}

export async function addTableOnServer(data) {
    return await db.collection("tables").add(data)
}

export async function updatePlayerOnServer(playerId, playerNewData) {
    return await db.collection("players").doc(playerId).update(playerNewData)
}

export async function updateParticipantOnServer(tournamentId, participantId, participantNewData) {
    return await db.collection("tournaments").doc(tournamentId).collection("participants").doc(participantId).update(participantNewData)
} 

// export async function addNewParticipantIdToParticipantsPlayingListOnServer(tournamentId, newParticipantId, participants) {
//     for (const participant of participants) {
//         addParticipantIdToParticipantPlayingListOnServer(tournamentId, newParticipantId, participant)
//     }
// }

// export async function addParticipantIdToParticipantPlayingListOnServer(tournamentId, participantIdToAdd, participant) {
//         updateParticipantOnServer(tournamentId, participant.id,
//                                       {...participant.data, participantsToPlayIds: [...participant.data.participantsToPlayIds, participantIdToAdd]})
// }

export async function removeParticipantIdFromParticipantPlayingListOnServer(tournamentId, idToRemove, participant) {
    await updateParticipantOnServer(tournamentId, participant.id, 
        {...participant.data, participantsToPlayIds: participant.data.participantsToPlayIds.filter(participantId => participantId !== idToRemove)})
}

export async function removeParticipantIdFromAllParticipantsPlayingListOnServer(tourId, idToRemove, participants) {
    for (const participant of participants) {
        await removeParticipantIdFromParticipantPlayingListOnServer(tourId, idToRemove, participant)
    }
}

// export async function endGameUpdateParticipantsPlayingList(tourId, participant1Id, participant2Id, participants) {
//     const participant1 = getParticipantByIdFromStore(participant1Id, participants)
//     const participant2 = getParticipantByIdFromStore(participant2Id, participants)
//     await removeParticipantIdFromParticipantPlayingListOnServer(tourId, participant1Id, participant2)
//     await removeParticipantIdFromParticipantPlayingListOnServer(tourId, participant2Id, participant1)
// }

export function getPlayerByIdFromStore(playerId, players) {
    return players.find(elem => elem.id === playerId)
}

export function getPlayerByParticipantIdFromStore(participantId, participants, players) {
    const participant = participants.find(elem => elem.id === participantId)
    if (participant === undefined) {
        return participant
    }
    return getPlayerByIdFromStore(participant.data.playerId, players)
}

export async function getPlayerByParticipantIdFromServer(tourId, participantId) {
    const participant = await getParticipantByIdFromServer(tourId, participantId)
    return await getPlayerByIdFromServer(participant.data.playerId)
}

export function getPlayerByNameFromStore(name, players) {
    return players.find(elem => elem.data.name.toLowerCase() === name.toLowerCase())
}

export function getParticipantByPlayerIdFromStore(playerId, participants) {
    return participants.find(elem => elem.data.playerId === playerId)

}

export function getParticipantByIdFromStore(participantId, participants) {
    return participants.find(elem => elem.id === participantId)

}

export async function getParticipantByIdFromServer(tourId, participantId) {
    const participantQuery =  await db.collection("tournaments").doc(tourId).collection("participants").doc(participantId).get()
    return (
        {id: participantQuery.id,
         data: participantQuery.data()}
    )
}

export async function getPlayerByIdFromServer(playerId) {
    const playerQuery =  await db.collection("players").doc(playerId).get()
    return (
        {id: playerQuery.id,
         data: playerQuery.data()}
    )
}

// export function createParticipantsSnapshot(tourId, dispatch) {
//     db.collection("tournaments").doc(tourId).collection("participants").onSnapshot(participantsRef => {
//         const participants = participantsRef.docs.map(participantRef => {
//             return (
//                 {
//                     id: participantRef.id,
//                     data: participantRef.data()
//                 }
//             )
//         })
//         dispatch({type: "participants", payload: participants})
//     })
// }

// export function createRoundsSnapshot(tourId, dispatch) {
//     db.collection("tournaments").doc(tourId).collection("rounds").onSnapshot(roundsRef => {
//         const rounds = roundsRef.docs.map(roundRef => {
//             return (
//                 {
//                     id: roundRef.id,
//                     data: roundRef.data()
//                 }
//             )
//         }).sort((a,b) => new Date(b.data.startDate) - new Date(a.data.startDate))
//         dispatch({type: "rounds", payload: rounds})
//     })
// }

// export function createTournamentsSnapshot(dispatch) {
//     db.collection("tournaments").onSnapshot(tournamentsRef => {
//         const tournaments = tournamentsRef.docs.map(tournamentRef => {
//           return (
//             {
//               id: tournamentRef.id,
//               data: tournamentRef.data()
//             }
//           )
//         }).sort((a,b) => new Date(b.data.startDate) - new Date(a.data.startDate))
  
//         dispatch({type: "tournaments", payload: tournaments})
//     })
// }

// export function createTablesSnapshot(dispatch) {
//     db.collection("tables").onSnapshot(tablesRef => {
//         const tables = tablesRef.docs.map(tableRef => {
//           return (
//             {
//               id: tableRef.id,
//               data: tableRef.data()
//             }
//           )
//         })
//         dispatch({type: "tables", payload: tables})    
//     })
// }



// export function createPlayersSnapshot(dispatch) {
//     db.collection("players").onSnapshot(playersRef => {
//         const players = playersRef.docs.map(playerRef => {
//           return (
//             {   
//               id: playerRef.id,
//               data: playerRef.data()
//             }
//           )
//         })
//         dispatch({type: "players", payload: players})
        
//       })
// }

export async function getPlayersFromServer() {
    const playersQuery = await db.collection("players").get()
    const players = playersQuery.docs.map(playerQuery => {
        return (
            {id: playerQuery.id,
             data: playerQuery.data()}
        )
    })
    return players
}

export async function getTournamentsFromServer() {
    const tournamentsQuery = await db.collection("tournaments").get()
    const tournaments = tournamentsQuery.docs.map(tournamentQuery => {
        return (
            {id: tournamentQuery.id,
             data: tournamentQuery.data()}
        )
    }).sort((a,b) => b.data.startDate.fullDate - a.data.startDate.fullDate)
    return tournaments
}

export async function init(dispatch) {
    const players = await getPlayersFromServer()
    const tables = await getTablesFromServer()
    const tournaments = await getTournamentsFromServer()
    dispatch({type: "init", payload: {tables: tables, players: players, tournaments: tournaments}})
}

export async function getTournamentByIdFromServer(id) {
    const tournament =  await db.collection("tournaments").doc(id).get()
    return (
        {id: tournament.id,
         data: tournament.data()}
    )
}

export async function getTournamentParticipantsFromServer(tourId) {
    const participants = await db.collection("tournaments").doc(tourId).collection("participants").get()
    return (participants.docs.map(doc => {
        return {id: doc.id, data: doc.data()}
    })) 
}

export async function getTournamentBasicRoundsDataFromServer(tourId) {
    const rounds = await db.collection("tournaments").doc(tourId).collection("rounds").get()
    const sortedRoundsByDate = rounds.docs.map(doc => {
        const data = doc.data()
        return {id: doc.id, data: {startDate: data.startDate, isActive: data.isActive, number: data.number}}
    }).sort((a,b) => b.data.startDate.fullDate - a.data.startDate.fullDate)
    
    return sortedRoundsByDate
}

export async function getRoundByIdFromServer(tourId, roundId) {
    const round =  await db.collection("tournaments").doc(tourId).collection("rounds").doc(roundId).get()
    return (
        {id: round.id,
         data: round.data()}
    )
}

export async function getRoundByNumberFromServer(roundNumber, rounds, tourId) {
    const round = rounds.find(r => Number(r.data.number) === Number(roundNumber))
    return await getRoundByIdFromServer(tourId, round.id)
}

export async function setRound(tourId, roundId, dispatch) {
    const newRound = await getRoundByIdFromServer(tourId, roundId)
    dispatch({type: "currentRound", payload: newRound})
}

export async function loadTournamentData(tourId, dispatch) {
    const currentTournament = await getTournamentByIdFromServer(tourId)
    const participants = await getTournamentParticipantsFromServer(tourId)
    const rounds = await getTournamentBasicRoundsDataFromServer(tourId)
    const [standings, allResults] = await getStandings(currentTournament.id)
    dispatch({type: "tournamentSelected", payload: {currentTournament: currentTournament,
                                                    participants: participants,
                                                    rounds: rounds,
                                                    standings: standings,
                                                    allResults: allResults,
                                                    currentRound: {}}})
}

export function playersNotRegistered(players, participants) {
    const participantsPlayerId = participants.map(participant => participant?.data.playerId)
    return (
        players.filter(player => !participantsPlayerId.includes(player.id))
    )
 }

//  export function participantsArrived(arrivedParticipants, participants) {
//     if (arrivedParticipants === undefined)
//         return []
//     const arrivedPlayersParticipantId = arrivedPlayers.map(p => p?.participantId)
//     return participants.filter(p => arrivedPlayersParticipantId.includes(p.id))
//  }



 export function arrivedParticipantsNames(arrivedParticipants, participants, players) {
    return arrivedParticipants.map(participant => {
        return getPlayerByParticipantIdFromStore(participant.participantId, participants, players).data.name
    })
 }

 export function participantsNames(participants, players) {
    return participants.map(participant => {
        return getPlayerByParticipantIdFromStore(participant.id, participants, players).data.name
    })
 }

 export function getOptionalParticipantsIdsToPlay(round, otherParticipantId, participants, players) {
    if (Object.keys(round).length === 0)
        return []
    const freeParticipantsIds = round?.data?.arrivedParticipants
    .filter(p => p?.isFree && getParticipantByIdFromStore(p.participantId, participants).data.participantsToPlayIds.length > 0)
    .map(p => p.participantId).sort((a,b) => {
        const name1 = getPlayerByParticipantIdFromStore(a, participants, players).data.name
        const name2 = getPlayerByParticipantIdFromStore(b, participants, players).data.name
        return name1.localeCompare(name2)
    })
            

    if (otherParticipantId === "") {
        return freeParticipantsIds
    }

    const otherParticipantParticipantsToPlayIds = getParticipantByIdFromStore(otherParticipantId, participants)?.data?.participantsToPlayIds
    return (
        freeParticipantsIds.filter(id => otherParticipantParticipantsToPlayIds.includes(id))
    )
 }
 
 export function setParticipantIsFreeStatus (arrivedParticipants, participantId, status) {
    const updatedArrivedParticipants = arrivedParticipants.map(participant => {
        if (participant.participantId === participantId) {
            return {...participant, isFree: status}
        }
        return participant
    })

    return updatedArrivedParticipants
 }

function getPlayerByParticipantId(participantId, participants, players) {
    const participant = participants.find(p => p.id === participantId)
    const player = players.find(p => p.id === participant.data.playerId)
    return player
}   

 export async function getStandings(tourId) {
    const rounds = await getRoundsFromServer(tourId)
    const players = await getPlayersFromServer()
    const participants = await getTournamentParticipantsFromServer(tourId)
    const playersResults = {}
    let allResults = []
    for (const round of rounds) {
        for (const result of round.data.results) {
            // allResults.push(result)
            const participant1 = getParticipantByIdFromStore(result.participant1.id, participants)
            const participant2 = getParticipantByIdFromStore(result.participant2.id, participants)
            const player1 = getPlayerByParticipantId(result.participant1.id, participants, players)
            const player1name = player1.data.name
            const player1score = Number(result.participant1.score)
            const player2 = getPlayerByParticipantId(result.participant2.id, participants, players)
            const player2name = player2.data.name
            const player2score = Number(result.participant2.score)
            const player1won = player1score > player2score
            const player2won = !player1won

            if (!playersResults.hasOwnProperty(player1name)){
                playersResults[player1name] = {name: player1name, playerId: player1.id, participantId: result.participant1.id, results: [], games: 0, wins: 0, losses: 0, plusMinus: 0}
            }
            if (!playersResults.hasOwnProperty(player2name)){
                playersResults[player2name] = {name: player2name, playerId: player2.id, participantId: result.participant2.id, results: [], games: 0, wins: 0, losses: 0, plusMinus: 0}
            }
            playersResults[player1name].results.push(result)
            playersResults[player2name].results.push(result)

            if ((participant1.data.active && participant2.data.active) || (!participant1.data.active && !participant2.data.active)) {
                playersResults[player1name].games += 1
                player1won ? playersResults[player1name].wins += 1 : playersResults[player1name].losses += 1
                playersResults[player1name].plusMinus = playersResults[player1name].plusMinus + player1score - player2score
                playersResults[player2name].games += 1
                player2won ? playersResults[player2name].wins += 1 : playersResults[player2name].losses += 1
                playersResults[player2name].plusMinus = playersResults[player2name].plusMinus + player2score - player1score
            }
            else if (!participant1.data.active && participant2.data.active) {
                playersResults[player1name].games += 1
                player1won ? playersResults[player1name].wins += 1 : playersResults[player1name].losses += 1
                playersResults[player1name].plusMinus = playersResults[player1name].plusMinus + player1score - player2score
                playersResults[player2name].games += 1
            }
            else if (participant1.data.active && !participant2.data.active) {
                playersResults[player2name].games += 1
                player2won ? playersResults[player2name].wins += 1 : playersResults[player2name].losses += 1
                playersResults[player2name].plusMinus = playersResults[player2name].plusMinus + player2score - player1score
                playersResults[player1name].games += 1
            }
        }
    }

    const sortedPlayers = Object.values(playersResults).sort((a,b) => {
        const participant1 = getParticipantByIdFromStore(a.participantId, participants)
        const participant2 = getParticipantByIdFromStore(b.participantId, participants)

        if (participant1.data.active && !participant2.data.active) {
            return -1
        }

        if (!participant1.data.active && participant2.data.active) {
            return 1
        }

        if (participant1.data.arrivedToPlayoff && !participant2.data.arrivedToPlayoff) {
            return -1
        }

        if (!participant1.data.arrivedToPlayoff && participant2.data.arrivedToPlayoff) {
            return 1
        }

        if (a.wins > b.wins) {
            return -1
        }
        if (a.wins < b.wins) {
            return 1
        }
        if (a.wins === b.wins) {
            if (a.plusMinus > b.plusMinus) {
                return -1
            }
            return 0
        }
    })
    return [sortedPlayers, allResults]
 }

 export function isValidScore(scores) {
    for (const score of scores) {
        if (isNaN(score) || 
        isNaN(parseInt(score)) || 
        !Number.isInteger(Number(score)) ||
        Number(score) < 0 ||
        score[score.length-1] === '.')
        {
            return {status: false, message: "הכנס מספרים בלבד"}
        }
    }

    if (Number(scores[0]) === Number(scores[1])) {
        return {status: false, message: "תוצאה לא יכולה להיות שוויון"}
    }

    return {status: true, message: ""}
}

export function isValidNewPlayer(newPlayerData, players) {
    if (newPlayerData.name === "") {
        return {status: false, message: "הכנס שם"}
    }
    if (players.map(player => player.data.name.toLowerCase()).includes(newPlayerData.name.toLowerCase())) {
        return {status: false, message: "שחקן עם שם זה כבר קיים"}
    }
    return {status: true, message: ""}
}

export function isValidUpdatePlayer(newPlayerData, players, player) {
    if (newPlayerData.name === "") {
        return {status: false, message: "הכנס שם"}
    }
    if (newPlayerData.name !== player.data.name) {
        if (players.map(player => player.data.name.toLowerCase()).includes(newPlayerData.name.toLowerCase())) {
            return {status: false, message: "שחקן עם שם זה כבר קיים"}
        }
    }
    
    return {status: true, message: ""}
}

export function isTableOccupied(table) {
    if (table.data.participant1Id.length > 0 || table.data.participant2Id.length > 0) {
        return true
    }
    return false
}

export function gamesLeftAboveAvarge(participants, participant) {
    if (participants === undefined || participant === undefined) {
        return false
    }
    const gamesLeftList = participants.map(p => p?.data?.participantsToPlayIds.length)
    const avg = gamesLeftList.reduce((pre, cur) => pre + cur) / participants.length

    return participant?.data?.participantsToPlayIds.length > avg ? true : false
}


export async function updatePlayer(playerId, playerNewData, players, dispatch) {
    let newPlayers = players.map(p => {
        if (p.id === playerId) {
            playerNewData = {...p.data, ...playerNewData}
            return {...p, data: playerNewData}
        }
        return p
    })
    dispatch({type: "players", payload: newPlayers})
    await updatePlayerOnServer(playerId, playerNewData)
    
    // newPlayers = await getPlayersFromServer()
    // dispatch({type: "players", payload: newPlayers})
    
}

export async function addPlayer(playerData, players, dispatch) {
    const newPlayerRef = await addPlayerOnServer(playerData)
    const newPlayerQuery = await newPlayerRef.get()
    const newPlayer = {id: newPlayerQuery.id, data: newPlayerQuery.data()}
    dispatch({type: "players", payload: [...players, newPlayer]})
    return newPlayer
}

export async function addRound(tourId, newRoundData, dispatch) {
    const newRoundRef = await addRoundOnServer(tourId, newRoundData)
    const newRound = await getRoundByIdFromServer(tourId, newRoundRef.id)
    const newRounds = await getTournamentBasicRoundsDataFromServer(tourId)
    dispatch({type: "newRound", payload: {newRound: newRound, newRounds: newRounds}})
    return newRound
}

export async function addParticipant(participantData, tourId, participants, dispatch) {
    const newParticipantRef = await addNewParticipantOnServer(tourId, participantData)
    let newParticipants = participants.map(p => {
        return {...p, data: {...p.data, participantsToPlayIds: [...p.data.participantsToPlayIds, newParticipantRef.id]}}
    })
    newParticipants.push({id: newParticipantRef.id, data: participantData})
    dispatch({type: "participants", payload: newParticipants})
    for (const p of participants) {
        await updateParticipantOnServer(tourId, p.id, {...p.data, participantsToPlayIds: [...p.data.participantsToPlayIds, newParticipantRef.id]})
    }
    
    // newParticipants = await getTournamentParticipantsFromServer(tourId)
    // dispatch({type: "participants", payload: newParticipants})

}

export async function deleteParticipant(tourId, participantId, currentRound, participants, tables, dispatch) {
    let newCurrentRound = {}
    
    if (Object.keys(currentRound).length !== 0){
        const newResults = currentRound.data.results.filter(r => r.participant1.id !== participantId && r.participant2.id !== participantId)
        const newArrivedParticipants = currentRound.data.arrivedParticipants.filter(p => p.participantId !== participantId)
        newCurrentRound = {id: currentRound.id, data: {...currentRound.data, arrivedParticipants: newArrivedParticipants, results: newResults}}
    }
    let newParticipants = participants.map(p => {
        return (
            {...p, data: {...p.data, participantsToPlayIds: p.data.participantsToPlayIds.filter(id => id !== participantId)}}
        )
    }).filter(p => p.id !== participantId)

    let tableId = undefined
    let tableNewData = {}
    let newTables = tables.map(t => {
        if (t.data.participant1Id === participantId) {
            tableId = t.id
            tableNewData = {...t.data, participant1Id: ""}
            return {id: t.id, data: tableNewData}
        }
        if (t.data.participant2Id === participantId) {
            tableId = t.id
            tableNewData = {...t.data, participant2Id: ""}
            return {id: t.id, data: tableNewData}
        }
        return t
    })



    dispatch({type: "participantRemoved", payload: {newParticipants: newParticipants, newCurrentRound: newCurrentRound, newTables: newTables}})
    
    await removeAllParticipantResults(tourId, participantId)
    const [standings, allResults] = await getStandings(tourId)
    dispatch({type: "standings", payload: {standings: standings, allResults: allResults}})
    await removeParticipantFromArrivedParticipantsOnAllRounds(tourId, participantId)
    await removeParticipantIdFromAllParticipantsPlayingListOnServer(tourId, participantId, participants)
    await removeParticipantFromServer(tourId, participantId)
    if (tableId !== undefined) {
        await updateTableOnServer(tableId, tableNewData)
    }
    
    // newParticipants = await getTournamentParticipantsFromServer(tourId)
    // if (Object.keys(newCurrentRound).length !== 0){
    //     newCurrentRound = await getRoundByIdFromServer(tourId, newCurrentRound.id)
    // }
    // newTables = await getTablesFromServer()
    // dispatch({type: "participantRemoved", payload: {newParticipants: newParticipants, newCurrentRound: newCurrentRound, newTables: newTables}})
    
}

export async function freezeParticipant(tourId, participantId, currentRound, participants, tables, dispatch) {
    let newCurrentRound = {}
    let participantNewData = {}

    if (Object.keys(currentRound).length !== 0){
        const newArrivedParticipants = currentRound.data.arrivedParticipants.filter(p => p.participantId !== participantId)
        newCurrentRound = {id: currentRound.id, data: {...currentRound.data, arrivedParticipants: newArrivedParticipants}}
    }
    let newParticipants = participants.map(p => {
        if (p.id === participantId) {
            let removedParticipantsToPlayIds = []
            for (const rp of participants.filter(p => !p.data.active)) {
                if (rp.data.participantsToPlayIds.includes(participantId)) {
                    removedParticipantsToPlayIds.push(rp.id)
                }
            }
            const newParticipantsToPlayIds = p.data.participantsToPlayIds.concat(removedParticipantsToPlayIds)
            participantNewData = {...p.data, active: false, participantsToPlayIds: newParticipantsToPlayIds}
            return (
                {...p, data: participantNewData}
            ) 
        }
        if (p.data.active)  {
            return (
                {...p, data: {...p.data, participantsToPlayIds: p.data.participantsToPlayIds.filter(id => id !== participantId)}}
            )
        }
        return p
    })

    let tableId = undefined
    let tableNewData = {}
    let newTables = tables.map(t => {
        if (t.data.participant1Id === participantId) {
            tableId = t.id
            tableNewData = {...t.data, participant1Id: ""}
            return {id: t.id, data: tableNewData}
        }
        if (t.data.participant2Id === participantId) {
            tableId = t.id
            tableNewData = {...t.data, participant2Id: ""}
            return {id: t.id, data: tableNewData}
        }
        return t
    })

    dispatch({type: "participantRemoved", payload: {newParticipants: newParticipants, newCurrentRound: newCurrentRound, newTables: newTables}})
    
    await updateParticipantOnServer(tourId, participantId, participantNewData)
    const [standings, allResults] = await getStandings(tourId)
    dispatch({type: "standings", payload: {standings: standings, allResults: allResults}})
    await removeParticipantFromArrivedParticipantsOnAllRounds(tourId, participantId)
    for (const p of newParticipants) {
        await updateParticipantOnServer(tourId, p.id, p.data)
    }
    if (tableId !== undefined) {
        await updateTableOnServer(tableId, tableNewData)
    }
    
    // newParticipants = await getTournamentParticipantsFromServer(tourId)
    // if (Object.keys(newCurrentRound).length !== 0){
    //     newCurrentRound = await getRoundByIdFromServer(tourId, newCurrentRound.id)
    // }
    // newTables = await getTablesFromServer()
    // dispatch({type: "participantRemoved", payload: {newParticipants: newParticipants, newCurrentRound: newCurrentRound, newTables: newTables}})
    
}

export async function unfreezeParticipant(tourId, participantId, currentRound, participants, tables, dispatch) {
    let newCurrentRound = {}
    let participantNewData = {}
    const returnedParticipantParticipantsToPlayIds = getParticipantByIdFromStore(participantId, participants).data.participantsToPlayIds

    let newParticipants = participants.map(p => {
        if (p.id === participantId) {
            const newParticipantsToPlayIds = p.data.participantsToPlayIds.filter(id => {
                const participant = getParticipantByIdFromStore(id, participants)
                return participant.data.active
            })
            participantNewData = {...p.data, active: true, participantsToPlayIds: newParticipantsToPlayIds}
            return (
                {...p, data: participantNewData}
            ) 
        }
        if (p.data.active && returnedParticipantParticipantsToPlayIds.includes(p.id))  {
            return (
                {...p, data: {...p.data, participantsToPlayIds: [...p.data.participantsToPlayIds, participantId]}}
            )
        }
        return p
    })

    let tableId = undefined
    let tableNewData = {}
    let newTables = tables.map(t => {
        if (t.data.participant1Id === participantId) {
            tableId = t.id
            tableNewData = {...t.data, participant1Id: ""}
            return {id: t.id, data: tableNewData}
        }
        if (t.data.participant2Id === participantId) {
            tableId = t.id
            tableNewData = {...t.data, participant2Id: ""}
            return {id: t.id, data: tableNewData}
        }
        return t
    })

    dispatch({type: "participantReturned", payload: {newParticipants: newParticipants, newCurrentRound: newCurrentRound, newTables: newTables}})
    
    await updateParticipantOnServer(tourId, participantId, participantNewData)
    const [standings, allResults] = await getStandings(tourId)
    dispatch({type: "standings", payload: {standings: standings, allResults: allResults}})
    await removeParticipantFromArrivedParticipantsOnAllRounds(tourId, participantId)
    for (const p of newParticipants) {
        await updateParticipantOnServer(tourId, p.id, p.data)
    }
    if (tableId !== undefined) {
        await updateTableOnServer(tableId, tableNewData)
    }
    
    // newParticipants = await getTournamentParticipantsFromServer(tourId)
    // if (Object.keys(newCurrentRound).length !== 0){
    //     newCurrentRound = await getRoundByIdFromServer(tourId, newCurrentRound.id)
    // }
    // newTables = await getTablesFromServer()
    // dispatch({type: "participantRemoved", payload: {newParticipants: newParticipants, newCurrentRound: newCurrentRound, newTables: newTables}})
    
}

export async function endRound(tourId, currentRound, rounds, tables, dispatch) {
    let newTables = tables.map(t => {
        return {id: t.id, data: {...t.data, isTaken: false, participant1Id: "", participant2Id: "", participant1Score: "", participant2Score: ""}}        
    })
    let newCurrentRound = {...currentRound, data: {...currentRound.data, isActive: false}}
    let newRounds = rounds.map(r => r.id === currentRound.id ? {...r, data: {...r.data, isActive: false}} : r)
    dispatch({type: "endRound", payload: {newCurrentRound: newCurrentRound, newRounds: newRounds, newTables: newTables}})
    await endRoundOnServer(tourId, currentRound.id)
    for (const table of newTables) {
        await updateTableOnServer(table.id, table.data) 
    }
    
    // newCurrentRound = await getRoundByIdFromServer(newCurrentRound.id)
    // newRounds = await getTournamentBasicRoundsDataFromServer(tourId)
    // newTables = await getTablesFromServer()
    // dispatch({type: "endRound", payload: {newCurrentRound: newCurrentRound, newRounds: newRounds, newTables: newTables}})
}

export async function endTournament(currentTournament, tournaments, dispatch) {
    let newCurrentTournament = {...currentTournament, data: {...currentTournament.data, isActive: false}}
    let newTournaments = tournaments.map(t => t.id === currentTournament.id ? {...t, data: {...t.data, isActive: false}} : t)
    dispatch({type: "endTournament", payload: {newCurrentTournament: newCurrentTournament, newTournaments: newTournaments}})
    await endTournamentOnServer(currentTournament.id)
    
    // newCurrentTournament = await getTournamentByIdFromServer(newCurrentTournament.id)
    // newTournaments = await getTournamentsFromServer()
    // dispatch({type: "endTournament", payload: {newCurrentTournament: newCurrentTournament, newTournaments: newTournaments}})

}


export function isParticipantFree(arrivedParticipants, participantId) {
    return arrivedParticipants.find(p => p.participantId === participantId).isFree
}  


export async function updatePlayerChecked(isChecked, tourId, participantId, currentRound, dispatch) {
    let newArrivedParticipants = currentRound.data.arrivedParticipants
    if (isChecked) {
        newArrivedParticipants = [...newArrivedParticipants, {participantId: participantId, isFree: true}]
    }
    else {
        newArrivedParticipants = newArrivedParticipants.filter(p => p.participantId !== participantId)
    }
    const roundNewData = {...currentRound.data, arrivedParticipants: newArrivedParticipants}
    dispatch({type: "currentRound", payload: {id: currentRound.id, data: roundNewData}})
    await updateRoundOnServer(tourId, currentRound.id, roundNewData)
    
    // const newCurrentRound = await getRoundByIdFromServer(tourId, currentRound.id)
    // dispatch({type: "currentRound", payload: newCurrentRound})
}

export async function clearParticipantFromTable(tables, participantId, dispatch) {
    let tableId = undefined
    let tableNewData
    let newTables = tables.map(t => {
        if (t.data.participant1Id === participantId) {
            tableId = t.id
            tableNewData = {...t.data, participant1Id: ""}
            return {id: t.id, data: tableNewData}
        }
        if (t.data.participant2Id === participantId) {
            tableId = t.id
            tableNewData = {...t.data, participant2Id: ""}
            return {id: t.id, data: tableNewData}
        }
        return t
    })

    if (tableId !== undefined) {
        dispatch({type: "tables", payload: newTables})
        await updateTableOnServer(tableId, tableNewData)
        
        // newTables = await getTablesFromServer()
        // dispatch({type: "tables", payload: newTables})
    }

}

export async function playerSelectedToTable(table, tables, newParticipantId, participantNumber, currentRound, currentTournament, dispatch) {
    // let newArrivedParticipants = currentRound.data.arrivedParticipants
    // const prevParticipantId = participantNumber === 1 ? table.data.participant1Id : table.data.participant2Id
    // if (prevParticipantId.length > 0) {
    //     newArrivedParticipants = setParticipantIsFreeStatus(newArrivedParticipants, prevParticipantId, true)
    // }
    // if (newParticipantId.length > 0) {
    //     newArrivedParticipants = setParticipantIsFreeStatus(newArrivedParticipants, newParticipantId, false)
    // }

    // const roundNewData = {...currentRound.data, arrivedParticipants: newArrivedParticipants}
    // const newCurrentRound = {...currentRound, data: roundNewData}
    let newTables = tables.map(t => {
        if (t.data.participant1Id === newParticipantId) {
            return {id: t.id, data: {...t.data, participant1Id: ""}}
        }
        if (t.data.participant2Id === newParticipantId) {
            return {id: t.id, data: {...t.data, participant2Id: ""}}
        }
        return t
    })
    let tableNewData = {}
    newTables = newTables.map(t => {
        if (t.id === table.id) {
            if (participantNumber === 1) {
                const data = {...t.data, participant1Id: newParticipantId}
                tableNewData = data
                return {id: t.id, data: data}
            }
            else {
                const data = {...t.data, participant2Id: newParticipantId}
                tableNewData = data
                return {id: t.id, data: data}
            }
        }
        return t
    })

    dispatch({type: "tables", payload: newTables})
    // await updateRoundOnServer(currentTournament.id, currentRound.id, roundNewData)
    await updateTableOnServer(table.id, tableNewData)
    
    // newTables = await getTablesFromServer()
    // dispatch({type: "tables", payload: newTables})
}

export async function clearTable(table, tables, currentRound, currentTournament, dispatch) {
    // let newArrivedParticipants = currentRound.data.arrivedParticipants
    
    // if (table.data.participant1Id.length > 0) {
    //     newArrivedParticipants = setParticipantIsFreeStatus(newArrivedParticipants, table.data.participant1Id, true)
    // }

    // if (table.data.participant2Id.length > 0) {
    //     newArrivedParticipants = setParticipantIsFreeStatus(newArrivedParticipants, table.data.participant2Id, true)
    // }

    // const roundNewData = {...currentRound.data, arrivedParticipants: newArrivedParticipants}
    // const newCurrentRound = {...currentRound, data: roundNewData}
    const tableNewData = {...table.data, isTaken: false, participant1Id: "", participant2Id: "", participant1Score: "", participant2Score: ""}
    let newTables = tables.map(t => {
        if (t.id === table.id) {
            return {id: t.id, data: tableNewData}
        }
        return t
    })

    dispatch({type: "tables", payload: newTables})
    // await updateRoundOnServer(currentTournament.id, currentRound.id, roundNewData)
    await updateTableOnServer(table.id, tableNewData)
    
    // newTables = await getTablesFromServer()
    // dispatch({type: "tables", payload: newTables})
}

export async function cancelGame(table, tables, currentRound, currentTournament, dispatch) {
    let newArrivedParticipants = currentRound.data.arrivedParticipants
    newArrivedParticipants = setParticipantIsFreeStatus(newArrivedParticipants, table.data.participant1Id, true)
    newArrivedParticipants = setParticipantIsFreeStatus(newArrivedParticipants, table.data.participant2Id, true)

    const roundNewData = {...currentRound.data, arrivedParticipants: newArrivedParticipants}
    let newCurrentRound = {...currentRound, data: roundNewData}
    const tableNewData = {...table.data, isTaken: false, participant1Id: "", participant2Id: "", participant1Score: "", participant2Score: ""}
    let newTables = tables.map(t => {
        if (t.id === table.id) {
            return {id: t.id, data: tableNewData}
        }
        return t
    })

    dispatch({type: "cancelGame", payload: {newTables: newTables, newCurrentRound: newCurrentRound}})
    await updateRoundOnServer(currentTournament.id, currentRound.id, roundNewData)
    await updateTableOnServer(table.id, tableNewData)
    
    // newCurrentRound = await getRoundByIdFromServer(currentTournament.id, newCurrentRound.id)
    // newTables = await getTablesFromServer()
    // dispatch({type: "cancelGame", payload: {newTables: newTables, newCurrentRound: newCurrentRound}})
}

export async function startGame(table, tables, participants, players, rankings, dispatch, currentRound, tourId) {
    let participant1Ranking = getPlayerByParticipantIdFromStore(table.data.participant1Id, participants, players).data.ranking
    let participant2Ranking = getPlayerByParticipantIdFromStore(table.data.participant2Id, participants, players).data.ranking
    participant1Ranking = rankings.indexOf(participant1Ranking)
    participant2Ranking = rankings.indexOf(participant2Ranking)
    const difference = participant1Ranking - participant2Ranking

    let tableNewData = {}

    if (difference > 2) {
        tableNewData = {...table.data, participant1Score: '0', participant2Score: '2', isTaken: true}
    }
    else if (difference === 2) {
        tableNewData = {...table.data, participant1Score: '0', participant2Score: '1', isTaken: true}
    }
    else if (difference < -2) {
        tableNewData = {...table.data, participant1Score: '2', participant2Score: '0', isTaken: true}
    }
    else if (difference === -2) {
        tableNewData = {...table.data, participant1Score: '1', participant2Score: '0', isTaken: true}
    }
    else {
        tableNewData = {...table.data, participant1Score: '0', participant2Score: '0', isTaken: true}
    }

    let newTables = tables.map(t => {
        if (t.id === table.id) {
            return {id: t.id, data: tableNewData}
        }
        return t
    })

    let newArrivedParticipants = currentRound.data.arrivedParticipants
    newArrivedParticipants = setParticipantIsFreeStatus(newArrivedParticipants, table.data.participant1Id, false)
    newArrivedParticipants = setParticipantIsFreeStatus(newArrivedParticipants, table.data.participant2Id, false)
    const roundNewData = {...currentRound.data, arrivedParticipants: newArrivedParticipants}
    let newCurrentRound = {...currentRound, data: roundNewData}

    dispatch({type: "startGame", payload: {newTables: newTables, newCurrentRound: newCurrentRound}})
    await updateTableOnServer(table.id, tableNewData)
    await updateRoundOnServer(tourId, currentRound.id, roundNewData)
    
    // newCurrentRound = await getRoundByIdFromServer(tourId, newCurrentRound.id)
    // newTables = await getTablesFromServer()
    // dispatch({type: "startGame", payload: {newTables: newTables, newCurrentRound: newCurrentRound}})

}

export async function updateTableNumber(table, tables, number, dispatch) {
    const tableNewData = {...table.data, number: number}
    let newTables = tables.map(t => {
        if (t.id === table.id) {
            return {id: t.id, data: tableNewData}
        }
        return t
    })

    dispatch({type: "tables", payload: newTables})
    await updateTableOnServer(table.id, tableNewData)
    return newTables
    
    // newTables = await getTablesFromServer()
    // dispatch({type: "tables", payload: newTables})
}

export async function updateTablesNumbers(table1, num1, table2, num2, tables, dispatch) {
    const table1NewData = {...table1.data, number: num1}
    const table2NewData = {...table2.data, number: num2}

    let newTables = tables.map(t => {
        if (t.id === table1.id) {
            return {id: t.id, data: table1NewData}
        }
        if (t.id === table2.id) {
            return {id: t.id, data: table2NewData}
        }
        return t
    })


    dispatch({type: "tables", payload: newTables})
    await updateTableOnServer(table1.id, table1NewData)
    await updateTableOnServer(table2.id, table2NewData)
    
    // newTables = await getTablesFromServer()
    // dispatch({type: "tables", payload: newTables})
}


export async function updateParticipantScore(score, table, tables, playerNumber, dispatch) {
    const tableNewData =  playerNumber === 1 ? {...table.data, participant1Score: score} : {...table.data, participant2Score: score}
    let newTables = tables.map(t => {
        if (t.id === table.id) {
            return {id: t.id, data: tableNewData}
        }
        return t
    })

    dispatch({type: "tables", payload: newTables})
    await updateTableOnServer(table.id, tableNewData)
    
    // newTables = await getTablesFromServer()
    // dispatch({type: "tables", payload: newTables})
}

export async function removeTable(table, tables, dispatch) {
    let newTables = tables.filter(t => t.id !== table.id)
    dispatch({type: "tables", payload: newTables})
    await removeTablefromServer(table.id)
    
    // newTables = await getTablesFromServer()
    // dispatch({type: "tables", payload: newTables})
}

export async function setTableFreezeStatus(table, tables, status, dispatch) {
    const tableNewData = {...table.data, isFrozen: status, participant1Id: "", participant2Id: ""}
    let newTables = tables.map(t => {
        if (t.id === table.id) {
            return {id: t.id, data: tableNewData}
        }
        return t
    })

    dispatch({type: "tables", payload: newTables})
    await updateTableOnServer(table.id, tableNewData)

    // newTables = await getTablesFromServer()
    // dispatch({type: "tables", payload: newTables})

}

export async function addTable(tables, dispatch) {
    const time = new Date()
    const newTableData = {number:"", 
                          isTaken: false, 
                          isFrozen: false, 
                          participant1Id: "", 
                          participant2Id: "", 
                          participant1Score: "", 
                          participant2Score: "",
                          date: time.getTime()}
    const newTableRef = await addTableOnServer(newTableData)
    dispatch({type: "tables", payload: [...tables, {id: newTableRef.id, data: newTableData}] })

}

export async function addTournament(tourData, dispatch) {
    const newTourRef = await addTournamentOnServer(tourData)
    const newTournaments = await getTournamentsFromServer()
    dispatch({type: "tournaments", payload: newTournaments})
    return newTourRef.id
}

export async function endGame(table, tables, currentRound, currentTournament, participants, players, dispatch) {

    let newArrivedParticipants = currentRound.data.arrivedParticipants
    newArrivedParticipants = setParticipantIsFreeStatus(newArrivedParticipants, table.data.participant1Id, true)
    newArrivedParticipants = setParticipantIsFreeStatus(newArrivedParticipants, table.data.participant2Id, true)
    const participant1Won = table.data.participant1Score > table.data.participant2Score ? true : false
    const participant2Won = !participant1Won
    const participant1Data = {id: table.data.participant1Id, score: table.data.participant1Score, won: participant1Won}
    const participant2Data = {id: table.data.participant2Id, score: table.data.participant2Score, won: participant2Won}

    const newResults = [...currentRound.data.results, {id: table.data.participant1Id + table.data.participant2Id,
                                              participant1: participant1Data,
                                              participant2: participant2Data,
                                              roundNumber: currentRound.data.number}]


    let newParticipants = participants.map(p => {
        if (p.id === table.data.participant1Id) {
            const updatedParticipantsToPlayIds = p.data.participantsToPlayIds.filter(id => id !== table.data.participant2Id)
            return ({...p, data: {...p.data, participantsToPlayIds: updatedParticipantsToPlayIds}})
        }
 
        if (p.id === table.data.participant2Id) {
            const updatedParticipantsToPlayIds = p.data.participantsToPlayIds.filter(id => id !== table.data.participant1Id)
            return ({...p, data: {...p.data, participantsToPlayIds: updatedParticipantsToPlayIds}})
        }
        return p
    })

    const tableNewData = {...table.data, isTaken: false, participant1Id: "", participant2Id: "", participant1Score: "", participant2Score: ""}
    let newTables = tables.map(t => {
        if (t.id === table.id) {
            return {id: t.id, data: tableNewData}
        }
        return t
    })

    const roundNewData = {...currentRound.data, arrivedParticipants: newArrivedParticipants, results: newResults}
    let newCurrentRound = {...currentRound, data: roundNewData}

    dispatch({type: "endGame", payload: {newParticipants: newParticipants, 
        newCurrentRound: newCurrentRound, 
        newTables: newTables}})
        
    await updateRoundOnServer(currentTournament.id, currentRound.id, roundNewData)
    const [standings, allResults] = await getStandings(currentTournament.id)
    dispatch({type: "standings", payload: {standings: standings, allResults: allResults}})
    await updateTableOnServer(table.id, tableNewData)
    for (const p of newParticipants) {
        await updateParticipantOnServer(currentTournament.id, p.id, p.data)
    }

    // newParticipants = await getTournamentParticipantsFromServer(currentTournament.id)
    // newCurrentRound = await getRoundByIdFromServer(currentTournament.id, currentRound.id)
    // newTables = await getTablesFromServer()

    // dispatch({type: "endGame", payload: {newParticipants: newParticipants, 
    //     newCurrentRound: newCurrentRound, 
    //     newTables: newTables}})
}

export async function updateResult(result, newResult, round, currentRound, currentTournament, dispatch) {

    let newResults = round.data.results.map(r => {
        if (r.id === result.id) {
            return {...result,
                    participant1: {...result.participant1, score: newResult.participant1Score, won: newResult.participant1Won},
                    participant2: {...result.participant2, score: newResult.participant2Score, won: newResult.participant2Won}}
        }
        return r
    })
    const roundNewData = {...round.data, results: newResults}
    let newRound = {id: round.id, data: roundNewData}
    if (currentRound.id === round.id) {
        dispatch({type: "currentRound", payload: newRound})
    }
    await updateRoundOnServer(currentTournament.id, round.id, roundNewData)
    const [standings, allResults] = await getStandings(currentTournament.id)
    dispatch({type: "standings", payload: {standings: standings, allResults: allResults}})
    
    // newCurrentRound = await getRoundByIdFromServer(currentTournament.id, newCurrentRound.id)
    // dispatch({type: "currentRound", payload: newCurrentRound})
}


export async function removeResult(result, round, currentRound, currentTournament, players, participants, dispatch) {
    const roundNewData = {...round.data, results: round.data.results.filter(r => r.id !== result.id)}
    let newRound = {id: round.id, data: roundNewData}
    let newParticipants = participants.map(p => {
        if (p.id === result.participant1.id) {
            const newParticipantsToPlayIds = [...p.data.participantsToPlayIds, result.participant2.id ]
            return {id: p.id, data: {...p.data, participantsToPlayIds: newParticipantsToPlayIds }}
        }
        if (p.id === result.participant2.id) {
            const newParticipantsToPlayIds = [...p.data.participantsToPlayIds, result.participant1.id ]
            return {id: p.id, data: {...p.data, participantsToPlayIds: newParticipantsToPlayIds }}
        }
        return p
    })


    if (currentRound.id === newRound.id) {
        dispatch({type: "deleteResult", payload: {newCurrentRound: newRound, 
            newParticipants: newParticipants}})
        }
    else {
        dispatch({type: "deleteResult", payload: {newCurrentRound: currentRound, 
            newParticipants: newParticipants}})
    }
    
    await updateRoundOnServer(currentTournament.id, newRound.id, roundNewData)
    const [standings, allResults] = await getStandings(currentTournament.id)
    dispatch({type: "standings", payload: {standings: standings, allResults: allResults}})
    for (const p of newParticipants) {
        await updateParticipantOnServer(currentTournament.id, p.id, p.data)
    }

    // newCurrentRound = await getRoundByIdFromServer(currentTournament.id, newCurrentRound.id)
    // newParticipants = await getTournamentParticipantsFromServer(currentTournament.id)
    // dispatch({type: "deleteResult", payload: {newCurrentRound: newCurrentRound, 
    //                                           newParticipants: newParticipants}})
}

export function anyTakenTables(tables) {
    return tables.reduce((prev,curr) => prev.data.isTaken || curr.data.isTAken)
}

export function isParticipantAvailable(currentRound, participantId) {
    let isArrived, isFree
    const arrivedParticipant = currentRound?.data?.arrivedParticipants?.find(e => e.participantId === participantId)
    if (arrivedParticipant !== undefined) {
        isArrived = true
        if (arrivedParticipant.isFree) {
            isFree = true
        }
        else {
            isFree = false
        }
    } 
    else {
        isArrived = false
        isFree = false
    }
    return isArrived && isFree
}

export function isParticipantArrived(currentRound, participantId) {
    const arrivedParticipant = currentRound?.data?.arrivedParticipants?.find(e => e.participantId === participantId)
    if (arrivedParticipant !== undefined) {
        return true
    }
    else {
        return false
    }
}



// async function loadPlayersFromExcel(players, dispatch) {
//     let playersStr = `עמית שרר
//     שלמה ברזילאי
//     אולג שמואלוב
//     מיכאל פוקישנסקי
//     חיים דניאל
//     עידן אוחיון
//     אבי כהן
//     מרסל ינקו
//     סלבה חפץ
//     אמיר ביבי
//     תומר מנדלס
//     עידו דוד
//     תומר נאמן
//     שמעון בר אשר
//     אלי זילברשטיין
//     נתנאל ברוך
//     ניר שרוני
//     שמוליק כהן
//     אודי שפרן
//     אהרון שובל
//     דניאל זיגלר
//     יותם בר אשר
//     יורי פרנקל
//     תומר ביבי
//     אוראל ששון
//     בוריס אורצקי
//     יואב זיידנברג
//     יובל זילבר
//     אייל אורן
//     ירון טל
//     שי אברהם
//     יבגני גיללך`.split('\n')

//     for (let player of playersStr) {
//         const time = new Date()
//         const data = {"name": player.trim(), "ranking": "B", "time": time.getTime()}
//         await addPlayer(data, players, dispatch)
//     }
// }

// async function loadTournamentFromExcel(months, navigate, dispatch) {
//     const newDate = new Date();
//     const newMonth = newDate.getMonth();
//     const newYear = newDate.getFullYear();
//     const newTime = newDate.getTime();
//     const startDate = { fullDate: newTime, month: months[newMonth], year: newYear };

//     const tourId = await addTournament(
//         { startDate: startDate, isActive: true },
//         dispatch
//       );
//       navigate("/tournament/" + tourId);
// }

// export async function addParticipantsFromExcel(tourId) {
//     const players = await getPlayersFromServer()
//     for (const player of players) {
//         const participants = await getTournamentParticipantsFromServer(tourId)
//         const time = new Date();
//         const newParticipantData = {
//           playerId: player.id,
//           date: time.getTime(),
//           participantsToPlayIds: participants.map((participant) => participant.id),
//         };
//         const newParticipantRef = await addNewParticipantOnServer(tourId, newParticipantData)
//         let newParticipants = participants.map(p => {
//             return {...p, data: {...p.data, participantsToPlayIds: [...p.data.participantsToPlayIds, newParticipantRef.id]}}
//         })
//         newParticipants.push({id: newParticipantRef.id, data: newParticipantData})
//         for (const p of participants) {
//             await updateParticipantOnServer(tourId, p.id, {...p.data, participantsToPlayIds: [...p.data.participantsToPlayIds, newParticipantRef.id]})
//         }

//     }
// }


// async function addRoundFromExcel(tourId, months, roundNumber) {

//     const newDate = new Date()
//     const newMonth = newDate.getMonth()
//     const newYear = newDate.getFullYear()
//     const newDay = newDate.getDate()
//     const newTime = newDate.getTime()
    
//     const startDate  = {fullDate: newTime, day: newDay, month: months[newMonth], year: newYear}
//     const newRoundData = {startDate: startDate, number: roundNumber, arrivedParticipants: [], results: [], isActive: false}
//     const newRoundRef = await addRoundOnServer(tourId, newRoundData)
//     const newRound = await getRoundByIdFromServer(tourId, newRoundRef.id)
//     return newRound
// }




// export async function addRoundResultsFromExcel(tourId, months, roundNumber, results) {

//     let round = await addRoundFromExcel(tourId, months, roundNumber)
//     const players = await getPlayersFromServer()
//     let participants = await getTournamentParticipantsFromServer(tourId)
//     const newResults = []

//     results = results.split('\n').map(r => r.split('\t'))
//     for (const r of results) {
//         r[0] = r[0].trim()
//     }

//     for (const r of results) {

//         const participant1Id = getParticipantByNameFromStore(r[0], participants, players).id
//         const participant2Id = getParticipantByNameFromStore(r[1], participants, players).id
//         const participant1Score = Number(r[2])
//         const participant2Score = Number(r[3])
//         const participant1Won = participant1Score > participant2Score ? true : false
//         const participant2Won = !participant1Won
//         const participant1Data = {id: participant1Id, score: participant1Score, won: participant1Won}
//         const participant2Data = {id: participant2Id, score: participant2Score, won: participant2Won}
    
//         newResults.push({id: participant1Id + participant2Id,
//                                                   participant1: participant1Data,
//                                                   participant2: participant2Data,
//                                                   roundNumber: round.data.number})
    
    
//         participants = participants.map(p => {
//             if (p.id === participant1Id) {
//                 const updatedParticipantsToPlayIds = p.data.participantsToPlayIds.filter(id => id !== participant2Id)
//                 return ({...p, data: {...p.data, participantsToPlayIds: updatedParticipantsToPlayIds}})
//             }
     
//             if (p.id === participant2Id) {
//                 const updatedParticipantsToPlayIds = p.data.participantsToPlayIds.filter(id => id !== participant1Id)
//                 return ({...p, data: {...p.data, participantsToPlayIds: updatedParticipantsToPlayIds}})
//             }
//             return p
//         })
    
//         const roundNewData = {...round.data, arrivedParticipants: participants, results: newResults}
//         round = {...round, data: roundNewData}
        
//     }

//     await updateRoundOnServer(tourId, round.id, round.data)
//     for (const p of participants) {
//         await updateParticipantOnServer(tourId, p.id, p.data)
//     }

// }

export async function updatePlayoff8(currentTournament, playoff8, winners, dispatch) {
    dispatch({type: "currentTournament", payload: {...currentTournament, data: {...currentTournament.data, playoff8: playoff8, winners: winners}}})
    await db.collection("tournaments").doc(currentTournament.id).update({playoff8: playoff8, winners: winners})
}

export async function updatePlayoff16(currentTournament, playoff16, winners, dispatch) {
    dispatch({type: "currentTournament", payload: {...currentTournament, data: {...currentTournament.data, playoff16: playoff16, winners: winners}}})
    await db.collection("tournaments").doc(currentTournament.id).update({playoff16: playoff16, winners: winners})
}

export async function updateWinners(currentTournament, data) {
    await db.collection("tournaments").doc(currentTournament.id).update({winners: data})
}

export async function erasePlayoffData(currentTournament, dispatch) {
    dispatch({type: "currentTournament", payload: {...currentTournament, data: {...currentTournament.data, winners: {"first": {}, "second": {}, "third": {}}, playoff16: [], playoff8: []}}})
    await db.collection("tournaments").doc(currentTournament.id).update({winners: {"first": {}, "second": {}, "third": {}}, playoff16: [], playoff8: []})
}

export function getMissingsAmount(participant, participants) {
    let gamesLeft = participant.data.participantsToPlayIds.length
    if (participant.data.active) {
      gamesLeft =  participant.data.participantsToPlayIds.filter(id => {
        const p = getParticipantByIdFromStore(id, participants)
        return p.data.active
      }).length
    }

    return Math.floor(gamesLeft/4)
  }

function getPlayersDataFromStandings(standings) {
    return (
        standings.map(p => {
            return (
                {
                    "name": p.name,
                    "playerId": p.playerId,
                    "participantId": p.participantId
                }
            )
        })
    )
}

export function getPlayoff8(standings) {
    if (standings.length < 8) {
        return []
    }
    const playersData = getPlayersDataFromStandings(standings)
    const games = [
        {   
            "game": 1,
            "player1": playersData[0],
            "player2": playersData[7],
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 4,
            "winnerPlayerNumber": "1",
            "looserNextGame": 6,
            "looserPlayerNumber": "1",
        },
        {
            "game": 2,
            "player1": playersData[3],
            "player2": playersData[4],
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 4,
            "winnerPlayerNumber": "2",
            "looserNextGame": 6,
            "looserPlayerNumber": "2"
        },
        {
            "game": 3,
            "player1": playersData[2],
            "player2": playersData[5],
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 5,
            "winnerPlayerNumber": "1",
            "looserNextGame": 7,
            "looserPlayerNumber": "1"
        },
        {
            "game": 4,
            "player1": playersData[1],
            "player2": playersData[6],
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 5,
            "winnerPlayerNumber": "2",
            "looserNextGame": 7,
            "looserPlayerNumber": "2"
        },
        {
            "game": 5,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 8,
            "winnerPlayerNumber": "1",
            "looserNextGame": 10,
            "looserPlayerNumber": "2"
        },
        {
            "game": 6,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 8,
            "winnerPlayerNumber": "2",
            "looserNextGame": 9,
            "looserPlayerNumber": "2"
        },
        {
            "game": 7,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 9,
            "winnerPlayerNumber": "1",
            "looserNextGame": null,
            "looserPlayerNumber": null
        },
        {
            "game": 8,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 10,
            "winnerPlayerNumber": "1",
            "looserNextGame": null,
            "looserPlayerNumber": null
        },
        {
            "game": 9,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 13,
            "winnerPlayerNumber": "1",
            "looserNextGame": 12,
            "looserPlayerNumber": "2"
        },
        {
            "game": 10,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 11,
            "winnerPlayerNumber": "1",
            "looserNextGame": null,
            "looserPlayerNumber": null
        },
        {
            "game": 11,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 11,
            "winnerPlayerNumber": "2",
            "looserNextGame": null,
            "looserPlayerNumber": null
        },
        {
            "game": 12,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 12,
            "winnerPlayerNumber": "1",
            "looserNextGame": null,
            "looserPlayerNumber": null
        },
        {
            "game": 13,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 13,
            "winnerPlayerNumber": "2",
            "looserNextGame": "third",
            "looserPlayerNumber": null
        },
        {
            "game": 14,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": "first",
            "winnerPlayerNumber": null,
            "looserNextGame": "second",
            "looserPlayerNumber": null
        }
    ]

    return games
}


export function getPlayoff16(standings) {
    if (standings.length < 16) {
        return []
    }
    const playersData = getPlayersDataFromStandings(standings)
    const games = [
        {   
            "game": 1,
            "player1": playersData[0],
            "player2": playersData[15],
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 8,
            "winnerPlayerNumber": "1",
            "looserNextGame": 12,
            "looserPlayerNumber": "1",
        },
        {
            "game": 2,
            "player1": playersData[7],
            "player2": playersData[8],
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 8,
            "winnerPlayerNumber": "2",
            "looserNextGame": 12,
            "looserPlayerNumber": "2"
        },
        {
            "game": 3,
            "player1": playersData[4],
            "player2": playersData[11],
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 9,
            "winnerPlayerNumber": "1",
            "looserNextGame": 13,
            "looserPlayerNumber": "1"
        },
        {
            "game": 4,
            "player1": playersData[3],
            "player2": playersData[12],
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 9,
            "winnerPlayerNumber": "2",
            "looserNextGame": 13,
            "looserPlayerNumber": "2"
        },
        {
            "game": 5,
            "player1": playersData[2],
            "player2": playersData[13],
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 10,
            "winnerPlayerNumber": "1",
            "looserNextGame": 14,
            "looserPlayerNumber": "1"
        },
        {
            "game": 6,
            "player1": playersData[5],
            "player2": playersData[10],
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 10,
            "winnerPlayerNumber": "2",
            "looserNextGame": 14,
            "looserPlayerNumber": "2"
        },
        {
            "game": 7,
            "player1": playersData[6],
            "player2": playersData[9],
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 11,
            "winnerPlayerNumber": "1",
            "looserNextGame": 15,
            "looserPlayerNumber": "1"
        },
        {
            "game": 8,
            "player1": playersData[1],
            "player2": playersData[14],
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 11,
            "winnerPlayerNumber": "2",
            "looserNextGame": 15,
            "looserPlayerNumber": "2"
        },
        {
            "game": 9,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 20,
            "winnerPlayerNumber": "1",
            "looserNextGame": 19,
            "looserPlayerNumber": "2"
        },
        {
            "game": 10,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 20,
            "winnerPlayerNumber": "2",
            "looserNextGame": 18,
            "looserPlayerNumber": "2"
        },
        {
            "game": 11,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 21,
            "winnerPlayerNumber": "1",
            "looserNextGame": 17,
            "looserPlayerNumber": "2"
        },
        {
            "game": 12,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 21,
            "winnerPlayerNumber": "2",
            "looserNextGame": 16,
            "looserPlayerNumber": "2"
        },
        {
            "game": 13,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 16,
            "winnerPlayerNumber": "1",
            "looserNextGame": null,
            "looserPlayerNumber": null
        },
        {
            "game": 14,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 17,
            "winnerPlayerNumber": "1",
            "looserNextGame": null,
            "looserPlayerNumber": null
        },
        {   
            "game": 15,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 18,
            "winnerPlayerNumber": "1",
            "looserNextGame": null,
            "looserPlayerNumber": null,
        },
        {
            "game": 16,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 19,
            "winnerPlayerNumber": "1",
            "looserNextGame": null,
            "looserPlayerNumber": null
        },
        {
            "game": 17,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 22,
            "winnerPlayerNumber": "1",
            "looserNextGame": null,
            "looserPlayerNumber": null
        },
        {
            "game": 18,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 22,
            "winnerPlayerNumber": "2",
            "looserNextGame": null,
            "looserPlayerNumber": null
        },
        {
            "game": 19,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 23,
            "winnerPlayerNumber": "1",
            "looserNextGame": null,
            "looserPlayerNumber": null
        },
        {
            "game": 20,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 23,
            "winnerPlayerNumber": "2",
            "looserNextGame": null,
            "looserPlayerNumber": null
        },
        {
            "game": 21,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 26,
            "winnerPlayerNumber": "1",
            "looserNextGame": 24,
            "looserPlayerNumber": "2"
        },
        {
            "game": 22,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 27,
            "winnerPlayerNumber": "2",
            "looserNextGame": 25,
            "looserPlayerNumber": "1"
        },
        {
            "game": 23,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 24,
            "winnerPlayerNumber": "1",
            "looserNextGame": null,
            "looserPlayerNumber": null
        },
        {
            "game": 24,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 25,
            "winnerPlayerNumber": "2",
            "looserNextGame": null,
            "looserPlayerNumber": null
        },
        {
            "game": 25,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 27,
            "winnerPlayerNumber": "1",
            "looserNextGame": null,
            "looserPlayerNumber": null
        },
        {
            "game": 26,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 26,
            "winnerPlayerNumber": "2",
            "looserNextGame": null,
            "looserPlayerNumber": null
        },
        {
            "game": 27,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 29,
            "winnerPlayerNumber": "1",
            "looserNextGame": 28,
            "looserPlayerNumber": "1"
        },
        {
            "game": 28,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": 29,
            "winnerPlayerNumber": "2",
            "looserNextGame": 28,
            "looserPlayerNumber": "2"
        },
        {
            "game": 29,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": "third",
            "winnerPlayerNumber": null,
            "looserNextGame": null,
            "looserPlayerNumber": null
        },
        {
            "game": 30,
            "player1": "",
            "player2": "",
            "player1Score": "",
            "player2Score": "",
            "winnerNextGame": "first",
            "winnerPlayerNumber": null,
            "looserNextGame": "second",
            "looserPlayerNumber": null
        }
    ]

    return games
}