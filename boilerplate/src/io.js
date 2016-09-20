import socketio from 'socket.io'

export default function listen (server) {
  const io = socketio(server)
  io.sockets.on('connection', (socket) => {
    console.log('connection')
    socket.on('create or join', (room) => {
      const ROOM = io.sockets.adapter.rooms[room]
      const numClients = ROOM ? ROOM.length : 0
      if (numClients === 0) {
        socket.join(room)
        socket.emit('created', room)
      } else if (numClients === 1) {
        io.sockets.in(room).emit('join', room)
        socket.join(room)
        socket.emit('joined', room)
      } else {
        socket.emit('full', room)
      }
      socket.emit('emit(): client ' + socket.id + ' joined room ' + room)
      socket.broadcast.emit('broadcast(): client ' + socket.id + ' joined room ' + room)
    })

    socket.on('message', (message) => socket.broadcast.emit('message', message))
    socket.on('disconnect', () => {
      io.to(socket.adapter.rooms).emit('PEERDISCONECT')
    })
  })

  return (req, res, next) => {
    req.io = io
    return next()
  }
}
