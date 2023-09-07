import Messages from '../components/Messages'
import Wrapper from '__mocks__/Wrapper'
import { render, act, waitFor } from '@testing-library/react'
import { SocketServerMock } from 'socket.io-mock-ts';
import { Socket } from 'socket.io-client';
import userEvent from '@testing-library/user-event';
jest.mock( 'Components/User/useUserSelector', () => ({
  __esModule: true,
  default: () => ({
    username: "alex",
    _id: '112'
  })
}) )

const socket = new SocketServerMock();

const client = socket.clientMock as unknown;

const mockConvUsersData = [
  {
    _id: '1',
    username: 'alex',
    lastLoggedIn: Date.now()
  },
  {
    _id: '2',
    username: 'alex2',
    lastLoggedIn: Date.now()
  }
]

describe( "Test Messages Component", ()=>{
  it( "Should display DoneAllIcon if currentUser and message seen by all", ()=>{
    const message = "first"
    const { getByTestId }= render(
      <Wrapper>
        <Messages
          handleSeenLastMessage={jest.fn()}
          socket={{ current: client as Socket }}
          convUsersData={mockConvUsersData}
          data={{
            _id: '1234',
            groupName: "mockName",
            participants: ["1", "2"],
            messages: [
              {
                message,
                sentAt: Date.now(),
                sentBy: {
                  username: "alex",
                  _id: '112'
                },
                seenByIds: ["1", "2"]
              }
            ]
          }}
        />
      </Wrapper>
    )
    expect( getByTestId( "DoneAllIcon" ) ).toBeInTheDocument()
    expect( getByTestId( "DoneAllIcon" ) ).toHaveClass( "MuiSvgIcon-colorDisabled" )

  })
  it( "Should not display DoneAllIcon if not currentUser and message seen by all", ()=>{
    const message = "first"
    const { queryByTestId }= render(
      <Wrapper>
        <Messages
          handleSeenLastMessage={jest.fn()}
          socket={{ current: client as Socket }}
          convUsersData={mockConvUsersData}
          data={{
            _id: '1234',
            groupName: "mockName",
            participants: ["1", "2"],
            messages: [
              {
                message,
                sentAt: Date.now(),
                sentBy: {
                  username: "alex2",
                  _id: '1123'
                },
                seenByIds: ["1", "2"]
              }
            ]
          }}
        />
      </Wrapper>
    )
    expect( queryByTestId( "DoneAllIcon" ) ).toBeFalsy()
  })
  it( "Should display multiple messages", ()=>{
    const message = "first"
    const message2 = "second"
    const { getByText }= render(
      <Wrapper>
        <Messages
          handleSeenLastMessage={jest.fn()}
          socket={{ current: client as Socket }}
          convUsersData={mockConvUsersData}
          data={{
            _id: '1234',
            groupName: "mockName",
            participants: ["1", "2"],
            messages: [
              {
                message,
                sentAt: Date.now(),
                sentBy: {
                  username: "alex2",
                  _id: '1123'
                },
                seenByIds: ["1", "2"]
              },
              {
                message: message2,
                sentAt: Date.now(),
                sentBy: {
                  username: "alex2",
                  _id: '1123'
                },
                seenByIds: ["1", "2"]
              }
            ]
          }}
        />
      </Wrapper>
    )
    expect( getByText( message ) ).toBeInTheDocument()
    expect( getByText( message2 ) ).toBeInTheDocument()
  })
  it( "Should show seen message icon for currentUser message", ()=>{
    const message = "first"
    const { getByTestId }= render(
      <Wrapper>
        <Messages
          handleSeenLastMessage={jest.fn()}
          socket={{ current: client as Socket }}
          convUsersData={mockConvUsersData}
          data={{
            _id: '1234',
            groupName: "mockName",
            participants: ["1", "2"],
            messages: [
              {
                message,
                sentAt: Date.now(),
                sentBy: {
                  username: "alex",
                  _id: '112'
                },
                seenBy: [
                  {
                    username: "alex1",
                    _id: '1',
                    seenAt: Date.now()
                  }
                ],
                seenByIds: ["1"]
              }
            ]
          }}
        />
      </Wrapper>
    )
    expect( getByTestId( 'DoneAllIcon' ) ).toBeInTheDocument()
    expect( getByTestId( 'DoneAllIcon' ) ).toHaveClass( "MuiSvgIcon-colorPrimary" )
  })
  it( "Should show username + message for group chat if not currentUser", ()=>{
    const message = "first"
    const { getByText }= render(
      <Wrapper>
        <Messages
          handleSeenLastMessage={jest.fn()}
          socket={{ current: client as Socket }}
          convUsersData={mockConvUsersData}
          data={{
            _id: '1234',
            groupName: "mockName",
            participants: ["1", "2", "3"],
            messages: [
              {
                message,
                sentAt: Date.now(),
                sentBy: {
                  username: "alex1",
                  _id: '1'
                },
                seenByIds: ["1"]
              }
            ]
          }}
        />
      </Wrapper>
    )
    expect( getByText( "alex1" ) ).toBeInTheDocument()
    expect( getByText( message ) ).toBeInTheDocument()
  })
  it( "Clicking on my message should open a modal with info about message", async ()=>{
    const message = "first"
    const { getByText }= render(
      <Wrapper>
        <Messages
          handleSeenLastMessage={jest.fn()}
          socket={{ current: client as Socket }}
          convUsersData={mockConvUsersData}
          data={{
            _id: '1234',
            groupName: "mockName",
            participants: ["1", "2"],
            messages: [
              {
                message,
                sentAt: Date.now(),
                sentBy: {
                  username: "alex",
                  _id: '112'
                },
                seenBy: [
                  {
                    username: "alex1",
                    _id: '1',
                    seenAt: Date.now()
                  }
                ],
                seenByIds: ["1"]
              }
            ]
          }}
        />
      </Wrapper>
    )
    await act( async()=>{
      userEvent.click( getByText( message ) )
    })
    await waitFor( ()=>{
      expect( getByText( 'Seen by' ) ).toBeInTheDocument()
      expect( getByText( 'AL' ) ).toBeInTheDocument()
    })
  })
})