import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import styles from './Home.module.css'
import { useNavigate } from 'react-router-dom'
import Layout from "Components/Layout";

function Home() {
  const navigate = useNavigate()

  const handleNavigate = ( route:string ) => ()=> navigate( route )

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
          {routes.map( ({
            route, routeName
          })=>(
            <button
              key={route}
              onClick={handleNavigate( route )}>{routeName}</button>
          ) )}
        </div>
      </div>
    </Layout>
  )
}

const routes = [
  {
    route: '/login',
    routeName: "Login"
  },
  {
    route: '/register',
    routeName: "Register"
  }
]

export default Home