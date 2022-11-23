import TournamentsComp from "./tournaments";
import { Link } from "react-router-dom";
import { loadFromJson, saveToJson } from "./utils";
import { useState } from "react";


export default function HomeComp() {

  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState("")

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
      <div className="navigation_menu_container">
        <Link to="/">בית</Link>
        <Link to="/players">שחקנים</Link>
      </div>

      <TournamentsComp></TournamentsComp>
      <div className="buttons_container">
        <button className="button" onClick={saveToComputer}>שמור</button>
        <input type="file" onChange={loadFromComputer}></input>
        <button className="button" type="submit" onClick={openFile}>פתח</button>
      </div>
      {isSaving &&
      <div>
        <span>שומר...</span>  
      </div>}
      {isLoading &&
      <div>
        <span>טוען...</span>  
      </div>}
    </div>
  );
}
