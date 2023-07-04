
import { updateUserDisconnect } from './controllers/users.js'
import ConnectedUser from './interfaces/connectedUser.js'
import { Server } from 'socket.io';

export default function handleWebSocket( io: Server ){
  let users: ConnectedUser[] = [];
  io.on( "connection", ( socket ) => {
    socket.on( "userConnected", ( args ) => {
      const user = {
        ...args,
        socketId: socket.id
      }
      users.push( user )
      io.emit( "connectedUsers", users )
    })
    socket.on( 'sendMessage', ( message ) => {
      const sentToUsers = users.reduce( ( acc:string[], currentVal )=>{
        if( message.sentToIds.includes( currentVal.userId ) ){
          return [...acc, currentVal.socketId]
        }
        return acc
      }, [])
      if ( sentToUsers.length ) {
        io.to( sentToUsers ).emit( 'gotNewMessage', message )
      }
    })
    socket.on( "seenMessages", ( data ) => {
      const seenToIds = users.reduce( ( acc:string[], currentVal )=>{
        if( data.seenToId.includes( currentVal.userId ) ){
          return [...acc, currentVal.socketId]
        }
        return acc
      }, [])

      if ( seenToIds.length ) {
        io.to( seenToIds ).emit( 'gotSeenMessages', data )
      }
    })
    socket.on( "disconnect", async () => {
      let disconnectedUser = <ConnectedUser>{}
      const connectedUsers: ConnectedUser[] = []
      users.forEach( ( user )=>{
        if( user.socketId === socket.id ){
          disconnectedUser = user
        }else{
          connectedUsers.push( user )
        }
      })
      if ( disconnectedUser !== undefined ) {
        await updateUserDisconnect( disconnectedUser )
      }
      users = connectedUsers
      io.emit( "connectedUsers", users )
    })
  });
}