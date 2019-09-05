const express = require('express');
const app = express();

//middlewares
app.use(express.static(__dirname));

//routes
app.get('/', (req, res) => {
    res.sendfile('index.html');
});

//Listen on port 3000
server = app.listen(3000,function () {
    console.log('server is running on port ' + server.address().port + ' ...');
});

//socket.io instantiation
const io = require("socket.io")(server);

//listen on every connection
io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('username', function (username) {
        socket.username = username;
        io.emit('is_online', socket.username);
    });

    socket.on('disconnect', function (username) {
        io.emit('left_chat', socket.username);
    });

    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        io.sockets.emit('new_message', {
            message: data.message,
            username: socket.username,
            id: data.id,
            id_edit_msg: data.id_edit_msg
        });
    });

    //listen on edit_message
    socket.on('edit_message', (data) => {
        //broadcast the new message
        io.sockets.emit('edit_message', {
            message: data.message,
            username: socket.username,
            id: data.id,
            id_edit_msg: data.id_edit_msg
        });
    });

    //listen on typing
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', {username: socket.username})
    })
});
