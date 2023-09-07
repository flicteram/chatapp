import { useSeenMessage } from "../MessagesApi"
import { renderHook, act } from "@testing-library/react"
import wrapper from "__mocks__/Wrapper"
import axios from "Utils/axios"

jest.mock( "Utils/axios" )
const mockedAxios = axios as jest.Mocked<typeof axios>
jest.mock( 'Hooks/useInterceptor', () => ({
  __esModule: true,
  default: () => mockedAxios
}) )

describe( "Test useSeenMessages", ()=>{
  it( "Test resolved case", async()=>{
    mockedAxios.post.mockResolvedValueOnce({ data: "test" })
    const { result } = renderHook( useSeenMessage, { wrapper })
    await act( async()=>{
      await result.current.seenMessageRequest()
    })
    expect( result.current.seenMessageData ).toBe( "test" )
  })
  it( "Test error case", async()=>{
    mockedAxios.post.mockRejectedValue({ response: { data: { message: "test" } } })
    const { result } = renderHook( useSeenMessage, { wrapper })
    await act( async()=>{
      await result.current.seenMessageRequest()
    })
    expect( result.current.seenMessageError ).toBe( "test" )
  })
})