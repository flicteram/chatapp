import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import styles from './Home.module.css'
import { useNavigate } from 'react-router-dom'
import Layout from "../../components/Layout/Layout";

function Home() {
  const navigate = useNavigate()

  return (
    <Layout>
      <div className={styles.homeContainer}>
        <h1>Connect with people around the world!</h1>
        <WhatsAppIcon
          style={{
            fontSize: '5rem',
            color: "var(--tealGreen)"
          }}/>
        <div className={styles.buttonsContainer}>
          <button onClick={()=>navigate('/login')}>Login</button>
          <button onClick={()=>navigate('/register')}>Register</button>
        </div>
      </div>
    </Layout>
  )
}

export default Home