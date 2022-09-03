
import './App.css';
import { useDispatch } from "react-redux"
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomeComp from './components/homepage';
import AllPlayersComp from './components/allPlayers';
import { init } from './components/utils';
import TournamentComp from './components/tournament';

function App() {

  const dispatch = useDispatch()

  useEffect(() => {
    async function initData(){
      await init(dispatch)
    }
    initData()
  },[])

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<HomeComp></HomeComp>}></Route>
        <Route path='/tournament/:id' element={<TournamentComp></TournamentComp>}></Route>
        <Route path='/players' element={<AllPlayersComp></AllPlayersComp>}></Route>
      </Routes>
    </div>
  );
}

export default App;
