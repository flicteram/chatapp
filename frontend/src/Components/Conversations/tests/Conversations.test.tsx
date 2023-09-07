import Conversations from "..";
import Wrapper from "__mocks__/Wrapper";
import { render, act, waitFor } from "@testing-library/react"
import MultipleConvs from "@Interfaces/MulltipleConvs";
import { mockParticipants, mockConnectedUsers } from "__mocks__/mockData";
import userEvent from "@testing-library/user-event";
jest.mock( 'Components/User/useUserSelector', () => ({
  __esModule: true,
  default: () => ({
    username: "alex",
    _id: '112'
  })
}) )
jest.mock( "react-router-dom", ()=>({
  ...jest.requireActual( 'react-router-dom' ),
  useParams: ()=>({ id: "123" })
}) )

const date = Date.now()
const mockDataConversations:MultipleConvs[]=[
  {
    _id: '1',
    groupName: 'PLM',
    messages: [
      {
        message: 'slbz',
        sentAt: date,
        sentBy: {
          username: 'alex',
          _id: '112'
        }
      }
    ],
    lastMessage: {
      message: 'slbz',
      sentAt: date,
      sentBy: {
        username: 'alex',
        _id: '112'
      },
      seenByIds: ['112', '113']
    },
    participants: mockParticipants
  }
]
const ConvsComponent =
  <Wrapper>
    <Conversations
      dataConversations={mockDataConversations}
      connectedUsers={mockConnectedUsers}/>
  </Wrapper>
describe( "Test Conversations Component", ()=>{
  it( "Should show message if dataConversations array is empty", ()=>{
    const { getByText }= render( <Wrapper>
      <Conversations
        dataConversations={[]}
        connectedUsers={mockConnectedUsers}/>
    </Wrapper> )
    expect( getByText( /no conversations/i ) ).toBeInTheDocument()
  })
  it( "Should display group name", ()=>{
    const { getByText }= render( ConvsComponent )
    expect( getByText( "PLM" ) ).toBeInTheDocument()
  })
  it( "Should display username for 1-1 conversation", ()=>{
    const { getByText }= render( <Wrapper>
      <Conversations
        dataConversations={[
          {
            _id: '1',
            groupName: 'PLM',
            messages: [],
            participants: [mockParticipants[1]]
          }
        ]}
        connectedUsers={mockConnectedUsers}/>
    </Wrapper> )
    expect( getByText( mockParticipants[1].username ) ).toBeInTheDocument()
  })
  it( "Should show today's date", ()=>{
    const { getByText }= render( ConvsComponent )
    const date = new Date( Date.now() ).toLocaleTimeString( 'en-GB', {
      hour: 'numeric',
      minute: 'numeric'
    })
    expect( getByText( date ) ).toBeInTheDocument()
  })
  it( "Should show some date in the past", ()=>{
    const mockDate = 1688733831845
    const { getByText }= render( <Wrapper>
      <Conversations
        dataConversations={  [{
          _id: '1',
          groupName: 'PLM',
          messages: [
            {
              message: 'slbz',
              sentAt: mockDate,
              sentBy: {
                username: 'alex',
                _id: '112'
              }
            }
          ],
          lastMessage: {
            message: 'slbz',
            sentAt: mockDate,
            sentBy: {
              username: 'alex',
              _id: '112'
            }
          },
          participants: mockParticipants
        }]}
        connectedUsers={mockConnectedUsers}/>
    </Wrapper> )
    const date = new Date( mockDate ).toLocaleDateString( 'en-GB' )
    expect( getByText( date ) ).toBeInTheDocument()
  })
  it( "Should not show date if there is no last message", ()=>{
    const mockDate = 1688733831845
    const { queryByText }= render( <Wrapper>
      <Conversations
        dataConversations={  [{
          _id: '1',
          groupName: 'PLM',
          messages: [
            {
              message: 'slbz',
              sentAt: mockDate,
              sentBy: {
                username: 'alex',
                _id: '112'
              }
            }
          ],
          participants: mockParticipants
        }]}
        connectedUsers={mockConnectedUsers}/>
    </Wrapper> )
    const date = new Date( mockDate ).toLocaleDateString( 'en-GB' )
    expect( queryByText( date ) ).toBeFalsy()
  })
  it( "Should display GroupIcon for group chat", ()=>{
    const { getByTestId }= render( ConvsComponent )
    expect( getByTestId( /groupIcon/i ) ).toBeInTheDocument()
  })
  it( "Should display Frist 2 letters from username if 1-1 chat and no profile picture", ()=>{
    const { getByText }= render( <Wrapper>
      <Conversations
        dataConversations={[
          {
            _id: '1',
            groupName: 'PLM',
            messages: [
              {
                message: 'slbz',
                sentAt: date,
                sentBy: {
                  username: 'alex',
                  _id: '112'
                }
              }
            ],
            lastMessage: {
              message: 'slbz',
              sentAt: date,
              sentBy: {
                username: 'alex',
                _id: '112'
              }
            },
            participants: mockParticipants.slice( 0, 1 )
          }
        ]}
        connectedUsers={mockConnectedUsers}/>
    </Wrapper> )
    expect( getByText( mockParticipants[0].username.slice( 0, 2 ).toUpperCase() ) ).toBeInTheDocument()
  })
  it( "Should display Profile picture for 1-1 chat", ()=>{
    const { getByTestId }= render( <Wrapper>
      <Conversations
        dataConversations={[
          {
            _id: '1',
            groupName: 'PLM',
            messages: [
              {
                message: 'slbz',
                sentAt: date,
                sentBy: {
                  username: 'alex',
                  _id: '112'
                }
              }
            ],
            lastMessage: {
              message: 'slbz',
              sentAt: date,
              sentBy: {
                username: 'alex',
                _id: '112'
              }
            },
            participants: [{
              ...mockParticipants[0],
              picture: 'pcitureadev'
            }
            ]
          }
        ]}
        connectedUsers={mockConnectedUsers}/>
    </Wrapper> )
    expect( getByTestId( 'imgTest' ) ).toBeInTheDocument()
  })
  it( "Should display You if last message is sent by current user", ()=>{
    const { getByText }= render( ConvsComponent )
    expect( getByText( /You:/ ) ).toBeInTheDocument()
  })
  it( "Should display name of user who sent the message if not self", ()=>{
    const { getByText }= render( <Wrapper>
      <Conversations
        dataConversations={[
          {
            _id: '1',
            groupName: 'PLM',
            messages: [],
            lastMessage: {
              message: 'slbz',
              sentAt: date,
              sentBy: {
                username: 'alex1',
                _id: '112'
              },
              seenByIds: ['112', '113']
            },
            participants: mockParticipants
          }
        ]}
        connectedUsers={mockConnectedUsers}/>
    </Wrapper> )
    expect( getByText( /alex1:/i ) ).toBeInTheDocument()
  })
  it( "Should display doneAllIcon if message is seen by everyone", ()=>{
    const { getByTestId }= render( ConvsComponent )
    expect( getByTestId( "doneAllIcon" ) ).toBeInTheDocument()
  })
  it( "Should not display doneAllIcon if message is not seen by everyone", ()=>{
    const { queryByTestId }= render( <Wrapper>
      <Conversations
        dataConversations={[
          {
            _id: '1',
            groupName: 'PLM',
            messages: [],
            lastMessage: {
              message: 'slbz',
              sentAt: date,
              sentBy: {
                username: 'alex1',
                _id: '112'
              },
              seenByIds: ['112']
            },
            participants: mockParticipants
          }
        ]}
        connectedUsers={mockConnectedUsers}/>
    </Wrapper> )
    expect( queryByTestId( "doneAllIcon" ) ).toBeFalsy()
  })
  it( "Should display new message icon if last message is not seen by currentUser", ()=>{
    const { queryByTestId }= render( <Wrapper>
      <Conversations
        dataConversations={[
          {
            _id: '1',
            groupName: 'PLM',
            messages: [],
            lastMessage: {
              message: 'slbz',
              sentAt: date,
              sentBy: {
                username: 'alex1',
                _id: '112'
              },
              seenByIds: ['113']
            },
            participants: mockParticipants
          }
        ]}
        connectedUsers={mockConnectedUsers}/>
    </Wrapper> )
    expect( queryByTestId( "newMessage" ) ).toHaveStyle({ display: 'unset' })
  })
  it( "Should not display new message icon if last message is seen by currentUser", ()=>{
    const { queryByTestId }= render( <Wrapper>
      <Conversations
        dataConversations={[
          {
            _id: '1',
            groupName: 'PLM',
            messages: [],
            lastMessage: {
              message: 'slbz',
              sentAt: date,
              sentBy: {
                username: 'alex1',
                _id: '112'
              },
              seenByIds: ['112']
            },
            participants: mockParticipants
          }
        ]}
        connectedUsers={mockConnectedUsers}/>
    </Wrapper> )
    expect( queryByTestId( "newMessage" ) ).toHaveStyle({ display: 'none' })
  })
  it( "Should show online icon when user is online", ()=>{
    const { getByTestId }= render( <Wrapper>
      <Conversations
        dataConversations={[
          {
            _id: '1',
            groupName: 'PLM',
            messages: [],
            participants: [mockParticipants[1]]
          }
        ]}
        connectedUsers={[
          {
            userId: '113',
            username: "alex1",
            socketId: '123'
          }
        ]}/>
    </Wrapper> )
    expect( getByTestId( "statusProfile" ) ).toHaveStyle({ display: 'unset' })
  })
  it( "Should not show online icon when user is offline", ()=>{
    const { getByTestId }= render( <Wrapper>
      <Conversations
        dataConversations={[
          {
            _id: '1',
            groupName: 'PLM',
            messages: [],
            participants: [mockParticipants[1]]
          }
        ]}
        connectedUsers={[]}/>
    </Wrapper> )
    expect( getByTestId( "statusProfile" ) ).toHaveStyle({ display: 'none' })
  })
  it( "Should have different backgroud color if conversation is selected", async()=>{
    const { getByTestId }= render( <Wrapper>
      <Conversations
        dataConversations={[
          {
            _id: '123',
            groupName: 'PLM',
            messages: [],
            participants: [mockParticipants[1]]
          }
        ]}
        connectedUsers={[]}/>
    </Wrapper> )
    expect( getByTestId( "convContainer" ) ).toHaveStyle({ background: "var(--gray)" })
  })
  it( "Should not have different background if conv is not selected", async()=>{
    const { getByTestId }= render( <Wrapper>
      <Conversations
        dataConversations={[
          {
            _id: '1',
            groupName: 'PLM',
            messages: [],
            participants: [mockParticipants[1]]
          }
        ]}
        connectedUsers={[]}/>
    </Wrapper> )
    expect( getByTestId( "convContainer" ) ).not.toHaveStyle({})
  })
  it( "Test click on conversation", async()=>{
    const { getByTestId }= render( <Wrapper>
      <Conversations
        dataConversations={[
          {
            _id: '1',
            groupName: 'PLM',
            messages: [],
            participants: [mockParticipants[1]]
          }
        ]}
        connectedUsers={[]}/>
    </Wrapper> )
    const convContainer = getByTestId( "convContainer" )
    await act( async()=>{
      userEvent.click( convContainer )
    })
    await waitFor( ()=>{
      expect( convContainer ).toHaveStyle({ background: "var(--gray)" })
    })
  })
})
