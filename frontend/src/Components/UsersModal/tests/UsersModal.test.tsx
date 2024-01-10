import Wrapper from "__mocks__/Wrapper";
import UsersModal from "../UsersModal";
import { render, act, waitFor } from "@testing-library/react";
import { mockParticipants } from "__mocks__/mockData";
import userEvent from "@testing-library/user-event";
import * as useAxiosRequest from "Hooks/useAxiosRequest";

const mockedUsedNavigate = jest.fn();

jest.mock( 'react-router-dom', () => ({
  ...jest.requireActual( 'react-router-dom' ),
  useNavigate: () => mockedUsedNavigate,
}) );

const dataUsers = [
  {
    _id: "123",
    username: "test1",
    picture: "testPic"
  },
  {
    _id: "2",
    username: "tast2"
  }
]
describe( "Test UsersModal", ()=>{
  it( "Loading spinner should be visible if loadingUsers is true", ()=>{
    jest.spyOn( useAxiosRequest, "default" ).mockImplementation( ()=>(
      [
        [],
        true,
        "",
        jest.fn()
      ]
    ) )
    const { getByTestId } = render( <Wrapper>
      <UsersModal
        openModal={true}
        onCloseModal={jest.fn()}
        handleCreateConv={jest.fn()}
        dataConversations={
          [
            {
              _id: '1',
              groupName: "test",
              messages: [],
              participants: mockParticipants
            }
          ]
        }
      />
    </Wrapper> )
    expect( getByTestId( 'loadingUsers' ) ).toBeInTheDocument()
  })
  it( "If dataUsers is empty should show text acordingly", ()=>{
    jest.spyOn( useAxiosRequest, "default" ).mockImplementation( ()=>(
      [
        [],
        false,
        "",
        jest.fn()
      ]
    ) )
    const { getByText } = render( <Wrapper>
      <UsersModal
        openModal={true}
        onCloseModal={jest.fn()}
        handleCreateConv={jest.fn()}
        dataConversations={
          [
            {
              _id: '1',
              groupName: "test",
              messages: [],
              participants: mockParticipants
            }
          ]
        }
      />
    </Wrapper> )
    expect( getByText( 'No users available' ) ).toBeInTheDocument()
  })
  it( "Should display users acordingly", ()=>{
    jest.spyOn( useAxiosRequest, "default" ).mockImplementation( ()=>(
      [
        dataUsers,
        false,
        "",
        jest.fn()
      ]
    ) )
    const {
      getByText, getByTestId
    } = render( <Wrapper>
      <UsersModal
        openModal={true}
        onCloseModal={jest.fn()}
        handleCreateConv={jest.fn()}
        dataConversations={
          [
            {
              _id: '1',
              groupName: "test",
              messages: [],
              participants: mockParticipants
            }
          ]
        }
      />
    </Wrapper> )
    //first user
    expect( getByTestId( 'imgTest' ) ).toHaveAttribute( "src", "testPic" )
    expect( getByText( 'test1' ) ).toBeInTheDocument()
    //second user
    expect( getByText( "TA" ) ).toBeInTheDocument()
    expect( getByText( 'tast2' ) ).toBeInTheDocument()
  })
  it( "Test selecting user", async ()=>{
    jest.spyOn( useAxiosRequest, "default" ).mockImplementation( ()=>(
      [
        dataUsers,
        false,
        "",
        jest.fn()
      ]
    ) )
    const { getByText } = render( <Wrapper>
      <UsersModal
        openModal={true}
        onCloseModal={jest.fn()}
        handleCreateConv={jest.fn()}
        dataConversations={
          [
            {
              _id: '1',
              groupName: "test",
              messages: [],
              participants: mockParticipants
            }
          ]
        }
      />
    </Wrapper> )
    const firstUser = getByText( dataUsers[0].username )
    await act( async()=>{
      userEvent.click( firstUser )
    })
    await waitFor( ()=>{
      expect( firstUser ).toHaveStyle( "background: green" )
    })
  })
  it( "Test unselecting user", async ()=>{
    jest.spyOn( useAxiosRequest, "default" ).mockImplementation( ()=>(
      [
        dataUsers,
        false,
        "",
        jest.fn()
      ]
    ) )
    const { getByText } = render( <Wrapper>
      <UsersModal
        openModal={true}
        onCloseModal={jest.fn()}
        handleCreateConv={jest.fn()}
        dataConversations={
          [
            {
              _id: '1',
              groupName: "test",
              messages: [],
              participants: mockParticipants
            }
          ]
        }
      />
    </Wrapper> )
    const firstUser = getByText( dataUsers[0].username )
    await act( async()=>{
      //select
      userEvent.click( firstUser )
    })
    await act( async()=>{
      //deselect
      userEvent.click( firstUser )
    })
    await waitFor( ()=>{
      expect( firstUser ).not.toHaveStyle( "background: green" )
    })
  })
  it( "Should show error message if groupName field is empty for group chat", async ()=>{
    jest.spyOn( useAxiosRequest, "default" ).mockImplementation( ()=>(
      [
        dataUsers,
        false,
        "",
        jest.fn()
      ]
    ) )
    const { getByText } = render( <Wrapper>
      <UsersModal
        openModal={true}
        onCloseModal={jest.fn()}
        handleCreateConv={jest.fn()}
        dataConversations={
          [
            {
              _id: '1',
              groupName: "test",
              messages: [],
              participants: mockParticipants
            }
          ]
        }
      />
    </Wrapper> )
    const firstUser = getByText( dataUsers[0].username )
    const secondUser = getByText( dataUsers[1].username )
    await act( async()=>{
      userEvent.click( firstUser )
    })
    await act( async()=>{
      userEvent.click( secondUser )
    })
    await act( async()=>{
      userEvent.click( getByText( "Create conversation" ) )
    })
    await waitFor( ()=>{
      expect( firstUser ).toHaveStyle( "background: green" )
      expect( secondUser ).toHaveStyle( "background: green" )
      expect( getByText( "Please add a group name" ) ).toBeInTheDocument()
    })
  })
  it( "Submit button should be disabled if no user is selected", async ()=>{
    jest.spyOn( useAxiosRequest, "default" ).mockImplementation( ()=>(
      [
        dataUsers,
        false,
        "",
        jest.fn()
      ]
    ) )
    const { getByText } = render( <Wrapper>
      <UsersModal
        openModal={true}
        onCloseModal={jest.fn()}
        handleCreateConv={jest.fn()}
        dataConversations={
          [
            {
              _id: '1',
              groupName: "test",
              messages: [],
              participants: mockParticipants
            }
          ]
        }
      />
    </Wrapper> )
    const firstUser = getByText( dataUsers[0].username )
    const secondUser = getByText( dataUsers[1].username )
    expect( firstUser ).not.toHaveStyle( "background: green" )
    expect( secondUser ).not.toHaveStyle( "background: green" )
    expect( getByText( "Create conversation" ) ).toBeDisabled()
  })
  it( "If single conv exists, user should be redirected to that specific url path", async ()=>{
    jest.spyOn( useAxiosRequest, "default" ).mockImplementation( ()=>(
      [
        dataUsers,
        false,
        "",
        jest.fn()
      ]
    ) )
    const onCloseModalMocked = jest.fn()
    const { getByText } = render( <Wrapper>
      <UsersModal
        openModal={true}
        onCloseModal={onCloseModalMocked}
        handleCreateConv={jest.fn()}
        dataConversations={
          [
            {
              _id: '112',
              groupName: "",
              messages: [],
              participants: [dataUsers[0]]
            }
          ]
        }
      />
    </Wrapper> )
    const firstUser = getByText( dataUsers[0].username )
    await act( async()=>{
      userEvent.click( firstUser )
    })
    await act( async()=>{
      userEvent.click( getByText( "Go to conversation" ) )
    })
    await waitFor( ()=>{
      expect( onCloseModalMocked ).toBeCalledTimes( 1 )
      expect( mockedUsedNavigate ).toBeCalledWith( "112" )
    })
  })
  it( "Test create group chat", async ()=>{
    jest.spyOn( useAxiosRequest, "default" ).mockImplementation( ()=>(
      [
        dataUsers,
        false,
        "",
        jest.fn()
      ]
    ) )
    const mockedHandleCreateConv = jest.fn()
    const {
      getByText, getByLabelText
    } = render( <Wrapper>
      <UsersModal
        openModal={true}
        onCloseModal={jest.fn()}
        handleCreateConv={mockedHandleCreateConv}
        dataConversations={
          [
            {
              _id: '112',
              groupName: "",
              messages: [],
              participants: dataUsers
            }
          ]
        }
      />
    </Wrapper> )
    const firstUser = getByText( dataUsers[0].username )
    const secondUser = getByText( dataUsers[1].username )
    const groupNameInput = getByLabelText( "Group Name" )
    await act( async()=>{
      userEvent.click( firstUser )
    })
    await act( async()=>{
      userEvent.click( secondUser )
    })
    await act( async()=>{
      userEvent.type( groupNameInput, "testGroupName" )
    })
    await act( async()=>{
      userEvent.click( getByText( "Create conversation" ) )
    })
    await waitFor( ()=>{
      expect( mockedHandleCreateConv ).toBeCalledWith({
        groupName: "testGroupName",
        usersIds: ["123", "2"]
      })
    })
  })
  it( "Test create single chat", async ()=>{
    jest.spyOn( useAxiosRequest, "default" ).mockImplementation( ()=>(
      [
        dataUsers,
        false,
        "",
        jest.fn()
      ]
    ) )
    const mockedHandleCreateConv = jest.fn()
    const { getByText } = render( <Wrapper>
      <UsersModal
        openModal={true}
        onCloseModal={jest.fn()}
        handleCreateConv={mockedHandleCreateConv}
        dataConversations={
          [
            {
              _id: '112',
              groupName: "",
              messages: [],
              participants: dataUsers
            }
          ]
        }
      />
    </Wrapper> )
    const firstUser = getByText( dataUsers[0].username )
    await act( async()=>{
      userEvent.click( firstUser )
    })
    await act( async()=>{
      userEvent.click( getByText( "Create conversation" ) )
    })
    await waitFor( ()=>{
      expect( mockedHandleCreateConv ).toBeCalledWith({
        groupName: "",
        usersIds: ["123"]
      })
    })
  })
})