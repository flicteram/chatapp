import truncateText from "../truncateText";

describe( "truncate text", ()=>{
  it( "test for when to be truncated", ()=>{
    const returnedText = truncateText( "askslaswdasw", 0, 10 )
    expect( returnedText ).toBe( "askslaswda..." )
  })
  it( "test for when not truncated", ()=>{
    const returnedText = truncateText( "askslaswdasw", 0, 13 )
    expect( returnedText ).toBe( "askslaswdasw" )
  })
})
