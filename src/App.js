import './App.css';
import { useDispatch } from "react-redux"
import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import HomeComp from './components/homepage';
import AllPlayersComp from './components/allPlayers';
import { init } from './components/utils';
import TournamentComp from './components/tournament';
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore'
import getDb from './components/firestore';
import NoInternetComp from './components/noInternet';


function App() {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [password, setPassword] = useState("אורח")
  const [isUserSelected, setIsUserSelected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    navigate("/")
  },[])


  async function login() {
    setIsLoading(true)
    const res = getDb(password)
    firebase.initializeApp(res.firebaseConfig);
    const db = firebase.firestore()
    await init(dispatch, db)
    setIsLoading(false)
    dispatch({type: "userName", payload: {userName: res.userName}})
    setIsUserSelected(true)
  }

  return (
    <div className="App">
      <NoInternetComp>
        {isUserSelected ?
          <Routes>
            <Route path='/' element={<HomeComp></HomeComp>}></Route>
            <Route path='/tournament/:id' element={<TournamentComp></TournamentComp>}></Route>
            <Route path='/players' element={<AllPlayersComp></AllPlayersComp>}></Route>
          </Routes>
        :
        isLoading ?
        <div>
          <span>מתחבר...</span>
        </div>
        :
        <div>
          <input type="text" value={password} onChange={(e) => setPassword(e.target.value)}></input>
          <div className='buttons_container'>
            <button className='button' onClick={login}>התחבר</button>
          </div>
        </div>
        }
      </NoInternetComp>
    </div>
  );
}

export default App;
