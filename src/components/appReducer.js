
const appReducer = (state = {
                              currentTournament: {},
                              tables:[],
                              tournaments:[],
                              players:[],
                              participants:[],
                              rounds:[],
                              currentRound: {},
                              standings: [],
                              allResults: [],
                              rankings: ['D', 'C', 'B', 'A', 'A+', 'A++'],
                              months: ["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"],
                              userName: ""
                            },
                            action) => 
{
  const data = action.payload
  switch(action.type)
  {
    case "userName" :
      return {...state, userName: data.userName}

    case "startGame" :
      return {...state, tables: data.newTables, currentRound: data.newCurrentRound}

    case "init" :
      return {...state, tournaments: data.tournaments, players: data.players, tables: data.tables}

    case "deleteResult" :
      return {...state, participants: data.newParticipants,
                        currentRound: data.newCurrentRound}

    case "endGame" :
      return {...state, tables: data.newTables, 
                        participants: data.newParticipants, 
                        currentRound: data.newCurrentRound}

    case "cancelGame" :
      return {...state, tables: data.newTables, currentRound: data.newCurrentRound}

    case "endRound" :
      return {...state, rounds: data.newRounds, currentRound: data.newCurrentRound, tables: data.newTables}

    case "endTournament" :
      return {...state, tournaments: data.newTournaments, currentTournament: data.newCurrentTournament}

    case "newRound" :
      return {...state, rounds: data.newRounds, 
                        currentRound: data.newRound}

    case "participantRemoved" :
      return {...state, participants: data.newParticipants, 
                        currentRound: data.newCurrentRound,
                        tables: data.newTables}

    case "participantReturned" :
      return {...state, participants: data.newParticipants, 
                        currentRound: data.newCurrentRound,
                        tables: data.newTables}

    case "tournamentSelected" :
      return {...state, currentTournament: data.currentTournament,
                        participants: data.participants, 
                        rounds: data.rounds,
                        currentRound: data.currentRound,
                        standings: data.standings,
                        allResults: data.allResults}
                                               
    case "tables" :
      return {...state, tables: data}

    case "currentRound" :
      return {...state, currentRound: data}
    
    case "currentTournament" :
      return {...state, currentTournament: data}
    
    case "tournaments" :
      return {...state, tournaments: data}

    case "players" :
      return {...state, players: data}

    case "rounds" :
    return {...state, rounds: data}

    case "rankings" :
      return {...state, rankings: data}

    case "standings" :
      return {...state, standings: data.standings, allResults: data.allResults}
    
    case "participants" :
      return {...state, participants: data}

    default:
      return state
  }
}

export default appReducer