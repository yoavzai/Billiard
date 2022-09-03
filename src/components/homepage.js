import TournamentsComp from './tournaments';
import { Link } from 'react-router-dom';
  
// enter tables and maybe all other data to current tournament
// playoffs
// add participant autocomplete to pause for a little while after completion

export default function HomeComp() {

    return (
        <div className='homepage_container'>
            <div className='navigation_menu_container'>
                <Link to="/">בית</Link>
                <Link to="/players">שחקנים</Link>
            </div>
            <TournamentsComp></TournamentsComp>
        </div>
    )
}