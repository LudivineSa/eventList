import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

export const Navbar = () => {

    const { user, disconnectUser } = useContext(UserContext);

    const disconnect = () => {
        disconnectUser();
    }

    return(
        <nav className='container'>
            {user.email && <Link to="/">Mes évènements</Link>}
            {user.email && <p className="link" onClick={disconnect}>Déconnexion</p>}
            {!user.email && <>
                <Link to="/login">Connexion</Link>
                <Link to="/register">Inscription</Link></>
            }
        </nav>
    )
}