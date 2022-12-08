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
import NoInternetComp from './components/noInternet';


function App() {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [userName, setUserName] = useState("אורח")
  const [isUserSelected, setIsUserSelected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    navigate("/")
  },[])

  async function login() {
    setIsLoading(true)
    const firebaseConfig = 
      userName === "elad" ? 
      {
        apiKey: "AIzaSyCV2_rKpzO8laOQ65kcKO2hxgS5L7ptdsI",
        authDomain: "billiard-new.firebaseapp.com",
        projectId: "billiard-new",
        storageBucket: "billiard-new.appspot.com",
        messagingSenderId: "882918973819",
        appId: "1:882918973819:web:12ed9445aa367c7b5eddde"
      }
      :
      {
        apiKey: "AIzaSyAvqh4HhjrSUTU0R9FFbli0xXP4orFCNtA",
        authDomain: "billiard-demo-new.firebaseapp.com",
        projectId: "billiard-demo-new",
        storageBucket: "billiard-demo-new.appspot.com",
        messagingSenderId: "923597368857",
        appId: "1:923597368857:web:af7ec39e97a23814a84488"
      }
    
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore()
    await init(dispatch, db)
    setIsLoading(false)
    dispatch({type: "userName", payload: {userName: userName}})
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
          <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)}></input>
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
