import CircularProgress from '@mui/material/CircularProgress'
export default function CustomLoader({ ...props }) {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white',
        margin: '0 auto',
      }}>
      <CircularProgress
        {...props}
        style={{ color: 'var(--lightGreen)' }}
        thickness={5} />
    </div>
  )
}