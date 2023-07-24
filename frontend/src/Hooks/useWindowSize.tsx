import { useEffect, useState } from "react";
export default function useWindowSize() {
  const [windowWidth, setWindowWidth] = useState( window.innerWidth )
  const [windowHeight, setWindowHeight] = useState( window.innerHeight )

  const handleDebounce = ( cb: () => void ) => {
    let timer: ReturnType<typeof setTimeout>;

    return () => {
      clearTimeout( timer );
      timer = setTimeout( () => {
        cb()
      }, 500 )
    }
  }
  useEffect( () => {
    window.addEventListener( "resize", handleDebounce( () => {
      setWindowWidth( window.innerWidth )
      setWindowHeight( window.innerHeight )
    }) )
    return () => {
      window.removeEventListener( 'resize', handleDebounce( () => console.log( 'removed' ) ) )
    }
  }, [])
  return {
    windowWidth,
    windowHeight
  }
}