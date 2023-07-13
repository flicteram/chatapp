import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import styles from './Home.module.css'
import { useNavigate } from 'react-router-dom'
import Layout from "../../components/Layout/Layout";
import { Drawer } from '@mui/material';
import { useState, useEffect } from 'react'

function Home() {
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState( false )

  const toggleModal = ()=> setIsOpen( prev=>!prev )

  const requestStorageAccess = () =>{
    if( typeof document.requestStorageAccess === 'function' ){
      document.requestStorageAccess().then(
        () => {
          toggleModal()
        },
        () => {
          console.log( "access denied" );
        },
      );
    }
  }
  useEffect( ()=>{
    if( typeof document.hasStorageAccess === 'function' ){
      document.hasStorageAccess().then( ( hasAccess )=>{
        if( !hasAccess ){
          toggleModal()
        }
      })
    }
  }, [])
  return (
    <Layout>
      <div className={styles.homeContainer}>
        <Drawer
          open={isOpen}
          anchor='bottom'
        >
          <h1>Accept cookies?</h1>
          <button onClick={requestStorageAccess}>Yes</button>
          <button >No</button>
        </Drawer>
        <h1>Connect with people around the world!</h1>
        <WhatsAppIcon
          style={{
            fontSize: '5rem',
            color: "var(--tealGreen)"
          }}/>
        <div className={styles.buttonsContainer}>
          <button onClick={()=>navigate( '/login' )}>Login</button>
          <button onClick={()=>navigate( '/register' )}>Register</button>
        </div>
      </div>
    </Layout>
  )
}

export default Home