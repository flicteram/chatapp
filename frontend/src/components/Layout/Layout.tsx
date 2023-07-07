import NavBar from "../NavBar/NavBar"
import Footer from "../Footer/Footer"

interface PropTypes {
  children:JSX.Element
}

export default function Layout({ children }: PropTypes ){
  return(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        minHeight: '100vh',
        gap: '2em'
      }}>
      <NavBar/>
      {children}
      <Footer/>
    </div>
  )
}