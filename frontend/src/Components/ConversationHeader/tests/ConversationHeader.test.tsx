import ConversationHeader from "..";
import { render, act } from "@testing-library/react";
import ConnectedUser from "@Interfaces/ConnectedUser";
import OtherUser from "@Interfaces/OtherUser";
import Wrapper from "__mocks__/Wrapper";
import userEvent from "@testing-library/user-event";

const mockConnectedUsers:ConnectedUser[] = [
  {
    username: "plm",
    userId: "12345",
    socketId: "123"
  }
]
const mockConvUsersData:OtherUser[]=[
  {
    _id: '112',
    username: "user",
  },
  {
    _id: '113',
    username: "user2",
  }
]
const mockUsersIds = ["12345", "123456"]

describe( "Test Conversation Header Component", ()=>{
  it( "Test if is group chat", ()=>{
    const { getByText } = render( <Wrapper>
      <ConversationHeader
        connectedUsers={mockConnectedUsers}
        convUsersLoading={false}
        groupName="Group"
        otherUsersIds={mockUsersIds}
        convUsersData={mockConvUsersData}
      />
    </Wrapper> )
    expect( getByText( "Group" ) ).toBeInTheDocument()
  })
  it( "Test if is single chat", ()=>{
    const { getByText } = render(
      <Wrapper>
        <ConversationHeader
          connectedUsers={mockConnectedUsers}
          convUsersLoading={false}
          groupName="Group"
          otherUsersIds={["PLM"]}
          convUsersData={mockConvUsersData}
        />
      </Wrapper>
    )
    expect( getByText( "user" ) ).toBeInTheDocument()
  })
  it( "Test go back button", async()=>{
    const { getByTestId } = render(
      <Wrapper>
        <ConversationHeader
          connectedUsers={mockConnectedUsers}
          convUsersLoading={false}
          groupName="Group"
          otherUsersIds={["PLM"]}
          convUsersData={mockConvUsersData}
        />
      </Wrapper>
    )
    const goBackButton = getByTestId( "goBackButton" )

    await act( async()=>{
      userEvent.click( goBackButton )
    })
    expect( goBackButton ).toBeInTheDocument()
  })
})