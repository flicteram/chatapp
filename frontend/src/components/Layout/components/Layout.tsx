import NavBar from "./NavBar"
import Footer from "./Footer"

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