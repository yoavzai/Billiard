
import './App.css';
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import HomeComp from './components/homepage';
import AllPlayersComp from './components/allPlayers';
import { addArrivedParticipantsFromExcel, addParticipantsFromExcel, addRoundFromExcel, addRoundResultsFromExcel, init, loadFromExcel } from './components/utils';
import TournamentComp from './components/tournament';
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore'


function App() {

  const dispatch = useDispatch()
  const [userName, setUserName] = useState("guest")
  const [isUserSelected, setIsUserSelected] = useState(false)

  async function login() {

    const firebaseConfig = 
      userName === "elad" ? 
      {
        apiKey: "AIzaSyD9jkA6n0biszuAosJJ8d6IP9t8GVG5Dbw",
        authDomain: "billiard-8b75c.firebaseapp.com",
        projectId: "billiard-8b75c",
        storageBucket: "billiard-8b75c.appspot.com",
        messagingSenderId: "985245793237",
        appId: "1:985245793237:web:af1ed3a1d432fa2bce1b5c"
      }
      :
      {
        apiKey: "AIzaSyBoqwwS5yftzU26vbTcDKP4xXuDj3t8PHE",
        authDomain: "billiard-demo-b021d.firebaseapp.com",
        projectId: "billiard-demo-b021d",
        storageBucket: "billiard-demo-b021d.appspot.com",
        messagingSenderId: "693900636125",
        appId: "1:693900636125:web:bd20b367a7a4f6c0755034"
      }
    
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore()
    await init(dispatch, db)
    setIsUserSelected(true)
  }

  return (
    <div className="App">

      {isUserSelected ?
        <Routes>
          <Route path='/' element={<HomeComp></HomeComp>}></Route>
          <Route path='/tournament/:id' element={<TournamentComp></TournamentComp>}></Route>
          <Route path='/players' element={<AllPlayersComp></AllPlayersComp>}></Route>
        </Routes>
      :
      <div>
        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)}></input>
        <div className='buttons_container'>
          <button className='button' onClick={login}>התחבר</button>
        </div>
      </div>
      }
    </div>
  );
}

export default App;
