import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router';

export default function  NoInternetConnection(props) {
    // state variable holds the state of the internet connection
    const [isOnline, setOnline] = useState(true);
    const navigate = useNavigate()
    // On initization set the isOnline state.
    useEffect(()=>{
        setOnline(navigator.onLine)
    },[])

    // event listeners to update the state 
    window.addEventListener('online', () => {
        setOnline(true);
        navigate("/")
    });

    window.addEventListener('offline', () => {
        setOnline(false)
        window.location.reload()
    });

    // if user is online, return the child component else return a custom component
    if(isOnline){
    return(
        props.children
    )
    } else {
        return(<h1>No Internet Connection</h1>)
    }
}
