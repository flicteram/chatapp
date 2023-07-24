import MessageInput from "../MessageInput";
import { fireEvent, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
const handleSendMessage = jest.fn().mockResolvedValue( true )
const sendButtonId = "sendMessageButton"
const messageInputId = "messageInput"

describe( "Test Message Input", ()=>{
  it( "test toggle sendMessageLoading", ()=>{
    const {
      getByPlaceholderText, rerender
    } = render( <MessageInput
      handleSendMessage={handleSendMessage}
      sendMessageLoading={true}/> )
    const sendButton = screen.getByTestId( sendButtonId )
    const messageInput = screen.getByTestId( messageInputId ) as HTMLInputElement
    let messageInputPlaceholder = getByPlaceholderText( "Sending message..." )
    expect( sendButton ).toBeDisabled()
    expect( messageInput ).toBeDisabled()
    expect( messageInputPlaceholder ).toBeVisible()

    rerender( <MessageInput
      handleSendMessage={handleSendMessage}
      sendMessageLoading={false}/> )
    messageInputPlaceholder = getByPlaceholderText( "Type a message" )
    expect( messageInput ).toBeEnabled()
    expect( messageInputPlaceholder ).toBeVisible()
  })

  it( "test message input", ()=>{
    render( <MessageInput
      handleSendMessage={handleSendMessage}
      sendMessageLoading={false}/> )
    const messageInput = screen.getByTestId( messageInputId ) as HTMLInputElement

    fireEvent.change( messageInput, { target: { value: 'marcaz' } })

    expect( messageInput.value ).toEqual( 'marcaz' )
  })

  it( "test submit event", ()=>{
    render( <MessageInput
      handleSendMessage={handleSendMessage}
      sendMessageLoading={false}/> )
    const sendButton = screen.getByTestId( sendButtonId )
    const messageInput = screen.getByTestId( messageInputId ) as HTMLInputElement

    fireEvent.change( messageInput, { target: { value: 'marcaz' } })
    fireEvent.click( sendButton )

    expect( messageInput.value ).toEqual( "" )
  })
})