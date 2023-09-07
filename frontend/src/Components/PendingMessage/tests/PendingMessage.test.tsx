import PendingMessage from "..";
import Wrapper from "__mocks__/Wrapper";
import { render } from '@testing-library/react'

describe( "Test Pending Message", ()=>{
  it( "Should display message plus loading when pending message is defined", ()=>{
    const mockMessage = "mockMessage"
    const {
      getByTestId, getByText
    } = render(
      <Wrapper>
        <PendingMessage
          pendingMessage={{
            message: mockMessage,
            sentAt: Date.now(),
            sentBy: {
              username: '1lex',
              _id: '123'
            }
          }}
        />
      </Wrapper>
    )
    expect( getByTestId( "loadingPendingMessage" ) ).toBeInTheDocument()
    expect( getByText( "mockMessage" ) ).toBeInTheDocument()
  })
  it( "Should display not display anything when there is no pendingMessage", ()=>{
    const {
      queryByTestId, queryByText
    } = render(
      <Wrapper>
        <PendingMessage/>
      </Wrapper>
    )
    expect( queryByTestId( "loadingPendingMessage" ) ).toBeFalsy()
    expect( queryByText( "mockMessage" ) ).toBeFalsy()
  })
})