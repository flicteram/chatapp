import GroupHeader from "..";
import Wrapper from "__mocks__/Wrapper";
import { render, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockConnectedUsers, mockParticipants } from "__mocks__/mockData";

const groupName = "PLM"

const GroupHeaderComponent = <Wrapper>
  <GroupHeader
    isLoading={false}
    groupName={groupName}
    participants={mockParticipants}
    connectedUsers={mockConnectedUsers}
  />
</Wrapper>

describe( "Test Group Header", ()=>{
  it( "Test Group Name is Displayed", ()=>{
    const { getByText }= render( GroupHeaderComponent )
    expect( getByText( groupName ) ).toBeInTheDocument()
  })
  it( "Should display all users usernames", ()=>{
    const { getByText } = render( GroupHeaderComponent )
    const participantsUsernames = [{
      username: "You",
      _id: "111"
    }, ...mockParticipants].map( ( p )=>p.username ).join( ", " )

    expect( getByText( participantsUsernames ) ).toBeInTheDocument()
  })
  it( "Should open users details modal on click displayed usernames", async ()=>{
    const { getByText } = render( GroupHeaderComponent )
    const participantsUsernames = [{
      username: "You",
      _id: "111"
    }, ...mockParticipants].map( ( p )=>p.username ).join( ", " )

    const triggerButton = getByText( participantsUsernames )
    await act( async()=>{
      userEvent.click( triggerButton )
    })

    await waitFor( ()=>{
      expect( getByText( `${groupName}'s participants` ) ).toBeInTheDocument()
    })
  })
  it( "Should show loading fallback when loading is true", async ()=>{
    const { getByTestId } = render(
      <Wrapper>
        <GroupHeader
          isLoading={true}
          groupName={groupName}
          participants={mockParticipants}
          connectedUsers={mockConnectedUsers}
        />
      </Wrapper>
    )
    expect( getByTestId( "skeletonGroupTest" ) ).toBeInTheDocument()
  })
})