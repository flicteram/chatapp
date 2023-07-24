import handleHelperText from '../hadleHelperText'

describe( "test handleHelperText function", ()=>{

  test( "arguments are undefined", ()=>{
    expect( handleHelperText() ).toEqual( '' )
  })

  test( "both arguments are defined", ()=>{
    expect( handleHelperText( "da", true ) ).toBe( 'da' )
  })

})