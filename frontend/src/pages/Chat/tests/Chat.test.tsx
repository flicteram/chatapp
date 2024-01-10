import Wrapper from "__mocks__/Wrapper";
import { mockParticipants } from "__mocks__/mockData";
import Chat from "../Chat";
import { render } from "@testing-library/react";
import "setimmediate"
import * as useConversations from "../hooks/useConversations";
import * as routerDom from "react-router-dom"
import MultipleConvs from "@Interfaces/MulltipleConvs"

jest.mock( "react-router-dom", ()=>({
  __esModule: true,
  ...jest.requireActual( 'react-router-dom' ),
}) )
jest.mock( 'Components/User/useUserSelector', () => ({
  __esModule: true,
  default: () => ({
    username: "alexGod",
    _id: '777'
  })
}) )
const ChatComponent = <Wrapper><Chat/></Wrapper>

const mockMessage = "Ce faci?"

const dataConversations: MultipleConvs[] =[
  {
    _id: "123",
    groupName: "testGroup",
    messages: [
      {
        message: mockMessage,
        sentAt: Date.now(),
        sentBy: mockParticipants[0],
      }
    ],
    participants: mockParticipants,
    lastMessage: {
      message: mockMessage,
      sentAt: Date.now(),
      sentBy: mockParticipants[0],
    }
  }
]

const useConversationMokedReturn = {
  addLastMessageAndSortConversations: jest.fn(),
  getConversationsError: "",
  getConversationsLoading: false,
  handleCreateConv: jest.fn(),
  handleSeenLastMessage: jest.fn(),
  handleUpdateLastMessageConversations: jest.fn(),
  dataConversations
}

describe( "Test Chat Component", ()=>{
  beforeEach( ()=>{
    jest.spyOn( routerDom, "useParams" ).mockImplementation( ()=>({ id: '12345' }) )
    jest.spyOn( useConversations, "default" ).mockImplementation( ()=>( useConversationMokedReturn ) )
  })
  afterAll( ()=>{
    jest.clearAllMocks()
  })
  it( "Should show message accordingly if there is no conversation selected", ()=>{
    jest.spyOn( routerDom, "useParams" ).mockImplementation( ()=>({}) )
    const { getByText } = render( ChatComponent )
    expect( getByText( "Select or create a new conversation!" ) ).toBeInTheDocument()
  })
  it( "Should show loader when fetching conversations", ()=>{
    jest.spyOn( useConversations, "default" ).mockImplementation( ()=>({
      ...useConversationMokedReturn,
      getConversationsLoading: true
    }) )
    const { getByTestId } = render( ChatComponent )
    expect( getByTestId( "getConvsLoading" ) ).toBeInTheDocument()
  })
  it( "Should display conversations", ()=>{
    const { getByText } = render( ChatComponent )
    expect( getByText( "testGroup" ) ).toBeInTheDocument()
    expect( getByText( `${mockParticipants[0].username}: ${mockMessage}` ) ).toBeInTheDocument()
  })
})