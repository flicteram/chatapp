import { renderHook, waitFor } from "@testing-library/react";
import useWindowSize from "Hooks/useWindowSize";

describe( 'test useWindowSize', ()=>{
  it( 'test width and height', async ()=>{

    const width = 500
    const height = 500

    await waitFor( async ()=>{
      window.innerWidth = width;
      window.innerHeight = height;
      window.dispatchEvent( new Event( 'resize' ) );
    })
    const { result } = renderHook( useWindowSize )

    expect( result.current ).toEqual({
      windowWidth: width,
      windowHeight: height
    })
  })

})
