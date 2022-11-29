import styles from './Footer.module.css'
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
export default function Footer(){
  return(
    <footer className={styles.container}>
      <h3>Made by Alex Flicter</h3>
      <div>
        <a
          href='https://www.linkedin.com/in/alexandru-flicter-3b70ab220/'
          target="_blank"
          rel="noreferrer"><LinkedInIcon/></a>
        <a
          href="https://github.com/flicteram"
          target="_blank"
          rel="noreferrer"
        ><GitHubIcon/></a>
      </div>
    </footer>
  )
}