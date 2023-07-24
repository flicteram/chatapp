import { useNavigate } from 'react-router-dom'
import styles from "../styles/NavBar.module.css"
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LoginIcon from '@mui/icons-material/Login';
import { Link } from 'react-router-dom';

function NavBar(){
  const navigate = useNavigate()
  return (
    <nav className={styles.container}>
      <Link to='/'>
        <WhatsAppIcon
          style={{ color: 'white' }}
          fontSize="large"/>
      </Link>
      <button
        onClick={() => navigate( '/login' )}
        data-testid="navigateToLoginButton">
        <LoginIcon style={{ color: 'white' }}/>
      </button>
    </nav>
  )
}

export default NavBar