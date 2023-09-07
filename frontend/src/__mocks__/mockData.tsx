import OtherUser from "@Interfaces/OtherUser"
import ConnectedUser from "@Interfaces/ConnectedUser"
const mockConnectedUsers:ConnectedUser[] = [
  {
    username: "plm",
    userId: "12345",
    socketId: "123"
  }
]

const mockParticipants:OtherUser[]=[
  {
    _id: '112',
    username: "alex",
    lastLoggedIn: Date.now()
  },
  {
    _id: '113',
    username: "alex1",
  }
]

export { mockConnectedUsers, mockParticipants }