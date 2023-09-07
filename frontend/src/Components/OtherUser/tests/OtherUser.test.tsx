import OtherUser from "..";
import Wrapper from "__mocks__/Wrapper";
import { mockParticipants } from "__mocks__/mockData";
import { render } from "@testing-library/react";

const mockConnectedUsers = [
  {
    userId: '112',
    username: "alex",
    socketId: '123'
  }
]
describe( 'Test OtherUser Component', ()=>{
  it( "Should display loading skeleton if isUserLoading prop is true", ()=>{
    const { getByTestId } = render( <Wrapper>
      <OtherUser
        isUserLoading={true}
        otherUserData={mockParticipants[0]}
      />
    </Wrapper> )
    expect( getByTestId( "otherUserLoadingSkeleton" ) ).toBeInTheDocument()
    expect( getByTestId( "loadingSkeleton" ) ).toBeInTheDocument()

  })
  it( "Should not display loading skeleton if isUserLoading prop is false", ()=>{
    const { queryByTestId } = render( <Wrapper>
      <OtherUser
        isUserLoading={false}
        otherUserData={mockParticipants[0]}
      />
    </Wrapper> )
    expect( queryByTestId( "otherUserLoadingSkeleton" ) ).toBeFalsy()
  })
  it( "Should display other user username", ()=>{
    const { getByText } = render( <Wrapper>
      <OtherUser
        isUserLoading={false}
        otherUserData={mockParticipants[0]}
      />
    </Wrapper> )
    expect( getByText( mockParticipants[0].username ) ).toBeInTheDocument()
  })
  it( "Should display (You) if is current user", ()=>{
    const { getByText } = render( <Wrapper>
      <OtherUser
        isSelf={true}
        isUserLoading={false}
        otherUserData={mockParticipants[0]}
      />
    </Wrapper> )
    expect( getByText( "(You)" ) ).toBeInTheDocument()
  })
  it( "Should display Active now if not currentUser and if user is online", ()=>{
    const { getByText } = render( <Wrapper>
      <OtherUser
        connectedUsers={mockConnectedUsers}
        isUserLoading={false}
        otherUserData={mockParticipants[0]}
      />
    </Wrapper> )
    expect( getByText( "Active now" ) ).toBeInTheDocument()
  })
  it( "Should display correct time when user was last online today", ()=>{
    const { getByText } = render( <Wrapper>
      <OtherUser
        isUserLoading={false}
        otherUserData={mockParticipants[0]}
      />
    </Wrapper> )
    const date = new Date( Date.now() ).toLocaleTimeString( 'en-GB', {
      hour: 'numeric',
      minute: 'numeric'
    })
    expect( getByText( `Last seen today at ${date}` ) ).toBeInTheDocument()
  })
  it( "Should display correct time when user was last online", ()=>{
    const mockDate = 1688733831845

    const { getByText } = render( <Wrapper>
      <OtherUser
        isUserLoading={false}
        otherUserData={
          {
            _id: '123',
            username: 'plm',
            lastLoggedIn: mockDate
          }
        }
      />
    </Wrapper> )
    const date = new Date( mockDate ).toLocaleTimeString( 'en-GB', {
      hour: 'numeric',
      minute: 'numeric',
      month: '2-digit',
      day: 'numeric',
      year: 'numeric'
    })

    expect( getByText( `Last seen ${date}` ) ).toBeInTheDocument()
  })
  it( "Should display time if user saw the message today", ()=>{
    const { getByText } = render( <Wrapper>
      <OtherUser
        seenAt={Date.now()}
        isUserLoading={false}
        otherUserData={mockParticipants[0]}
      />
    </Wrapper> )
    const date = new Date( Date.now() ).toLocaleTimeString( 'en-GB', {
      hour: 'numeric',
      minute: 'numeric'
    })
    expect( getByText( `Message seen today at ${date}` ) ).toBeInTheDocument()
  })
  it( "Should display correct time when user saw the message", ()=>{
    const mockDate = 1688733831845
    const { getByText } = render( <Wrapper>
      <OtherUser
        seenAt={mockDate}
        isUserLoading={false}
        otherUserData={
          {
            _id: '123',
            username: 'plm',
            lastLoggedIn: mockDate
          }
        }
      />
    </Wrapper> )
    const date = new Date( mockDate ).toLocaleTimeString( 'en-GB', {
      hour: 'numeric',
      minute: 'numeric',
      month: '2-digit',
      day: 'numeric',
      year: 'numeric'
    })

    expect( getByText( `Message seen ${date}` ) ).toBeInTheDocument()
  })
  it( "Test dispalyed time if seenAt and lastLoggedIn are undefined", ()=>{
    const { getByTestId } = render( <Wrapper>
      <OtherUser
        isUserLoading={false}
        otherUserData={
          {
            _id: '123',
            username: 'plm',
          }
        }
      />
    </Wrapper> )
    expect( getByTestId( "userStatus" ) ).toHaveTextContent( "" )
  })
  it( "Test if user has profile picture", ()=>{
    const { getByTestId } = render( <Wrapper>
      <OtherUser
        isUserLoading={false}
        otherUserData={
          {
            _id: '123',
            username: 'plm',
            picture: "mockPicture"
          }
        }
      />
    </Wrapper> )
    expect( getByTestId( "imgTest" ) ).toHaveAttribute( "src", "mockPicture" )
  })
  it( "Test if user does not have profile picture", ()=>{
    const { getByText } = render( <Wrapper>
      <OtherUser
        isUserLoading={false}
        otherUserData={
          {
            _id: '123',
            username: 'plm',
          }
        }
      />
    </Wrapper> )
    expect( getByText( "PL" ) ).toBeInTheDocument()
  })
})
