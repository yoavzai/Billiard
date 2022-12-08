import TournamentsComp from "./tournaments";
import { Link } from "react-router-dom";
import { loadFromJson, saveToJson } from "./utils";
import { useState } from "react";
import { useSelector } from "react-redux";


export default function HomeComp() {

  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState("")
  const userName = useSelector((state) => state.userName)

  async function saveToComputer() {
    setIsSaving(true)
    await saveToJson()
    setIsSaving(false)
  }

  async function loadFromComputer(e) {
    setFile(e.target.files[0])
  }

  async function openFile() {
    if (file == "") {
      return
    }
    setIsLoading(true)
    await loadFromJson(file)
    setIsLoading(false)
  }

  return (
    <div className="homepage_container">
      <span>{`שם משתמש: ${userName}`}</span>
      <div className="buttons_container">
        {userName === "אלעד קצוני" &&
          <button className="button" onClick={saveToComputer}>שמור מסד נתונים</button>
        }
        <button className="button" onClick={() => window.location.reload()}>התנתק</button>
        {/* <input type="file" onChange={loadFromComputer}></input>
        <button className="button" type="submit" onClick={openFile}>פתח</button> */}
      </div>
      {isSaving &&
      <div>
        <span>שומר...</span>  
      </div>}
      {isLoading &&
      <div>
        <span>טוען...</span>  
      </div>}
      <div className="navigation_menu_container">
        <Link to="/">בית</Link>
        <Link to="/players">שחקנים</Link>
      </div>

      <TournamentsComp></TournamentsComp>
    </div>
  );
}
