import MessageInfoDialog from '../components/MessageInfoDialog';
import Wrapper from '__mocks__/Wrapper'
import { render } from '@testing-library/react'

describe( "Test MessageInfoDialog", ()=>{
  it( "Component should have DoneAllIcons", ()=>{
    const { getAllByTestId } = render( <Wrapper>
      <MessageInfoDialog
        isDialogOpen={true}
        toggleDialog={jest.fn()}
        messageInfo={
          {
            message: "mockMessage",
            sentAt: Date.now(),
            sentBy: {
              _id: "112",
              username: "alex"
            },
          }
        }
      />
    </Wrapper> )
    expect( getAllByTestId( /DoneAllIcon/i ) ).toHaveLength( 2 )
  })
  it( "Test message is not seen by anyone", ()=>{
    const {
      getByText, getAllByTestId
    } = render( <Wrapper>
      <MessageInfoDialog
        participantsNumber={1}
        isDialogOpen={true}
        toggleDialog={jest.fn()}
        messageInfo={
          {
            message: "mockMessage",
            sentAt: Date.now(),
            sentBy: {
              _id: "112",
              username: "alex"
            },
          }
        }
      />
    </Wrapper> )
    expect( getByText( /No one saw the message yet/i ) ).toBeInTheDocument()
    expect( getAllByTestId( "DoneAllIcon" )[0]).toHaveClass( "MuiSvgIcon-colorDisabled" )

  })
  it( "Test message seen", ()=>{
    const {
      getByText, getAllByTestId
    } = render( <Wrapper>
      <MessageInfoDialog
        isDialogOpen={true}
        participantsNumber={1}
        toggleDialog={jest.fn()}
        messageInfo={
          {
            message: "mockMessage",
            sentAt: Date.now(),
            sentBy: {
              _id: "112",
              username: "alex"
            },
            seenBy: [
              {
                _id: "113",
                seenAt: Date.now(),
                username: "alex2",
                lastLoggedIn: Date.now()
              }
            ],
            seenByIds: ["113"]
          }
        }
      />
    </Wrapper> )

    const date = new Date( Date.now() ).toLocaleTimeString( 'en-GB', {
      hour: 'numeric',
      minute: 'numeric'
    })
    expect( getByText( "mockMessage" ) ).toBeInTheDocument()
    expect( getByText( "alex2" ) ).toBeInTheDocument()
    expect( getByText( `Message seen today at ${date}` ) ).toBeInTheDocument()
    expect( getByText( date ) ).toBeInTheDocument()
    expect( getAllByTestId( "DoneAllIcon" )[0]).toHaveClass( "MuiSvgIcon-colorPrimary" )
  })
})
