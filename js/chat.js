$(function () {
    //make connection
    var socket = io.connect('http://localhost:3000');

    //buttons and inputs
    var cuontor_messages = 0;
    var cuontor_msg = $('#cuontor_msg');
    var contacts = $('#contacts');
    var message = $("#message");
    var username = $("#username");
    var username2;
    var send_message = $("#send_message");
    var edit_message = $("#edit_message");
    var saver_id_msg = $("#saver_id_msg");
    var saver_id_i_msg = $("#saver_id_i_msg");
    var send_username = $("#send_username");
    var chatroom = $("#chatroom");
    var feedback = $("#feedback");

    // get now Date
    function getdate() {
        var weekday = new Array(7);
        weekday[0] = "Sun";
        weekday[1] = "Mon";
        weekday[2] = "Tue";
        weekday[3] = "Wed";
        weekday[4] = "Thu";
        weekday[5] = "Fri";
        weekday[6] = "Sat";

        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var day = date.getDay();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = weekday[day] + " " + hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    // not null mesaage
    message.on('keyup',function () {
        if(this.value.length > 0) {
            send_message.prop("disabled", false);
        } else {
            send_message.prop("disabled", true);
        }
    });

    //Emit edit message
    edit_message.click(function () {
        document.getElementById('send_message').className = "btn btn-success d-inline";
        document.getElementById('edit_message').className = "d-none";
        //var id;
        var id_edit_msg = document.getElementById('saver_id_msg').value;
        var id_i_msg = document.getElementById('saver_id_i_msg').value;
        // console.log(id_edit_msg);
        socket.emit('edit_message', {message: message.val(), id:id_i_msg ,id_edit_msg: id_edit_msg});
    });

    //Emit send message
    send_message.click(function () {
        var id = username.val() + Date.now();
        var id_edit_msg = "edit_msg" + id ;
        socket.emit('new_message', {message: message.val(),id: id, id_edit_msg: id_edit_msg});
        send_message.prop('disabled', true);
    });

    // Listen on Edit_message
    socket.on('edit_message',(data)=>{
        feedback.html('');
        message.val('');
        var new_msg = data.message;
        var id = data.id;
        var id_edit_msg = data.id_edit_msg ;
        var id_edit_label = "edit_label"+id;
        $('#'+id_edit_msg).text(new_msg);
        var new_label = "Edited   " + getdate();
        $('#'+id_edit_label).text(new_label);

        setTimeout(function () {
            $('#'+id).fadeOut('slow');
        },15000);
        $('#'+id).fadeIn('fast');
    });

    //Listen on new_message
    socket.on("new_message", (data) => {
        feedback.html('');
        message.val('');

        cuontor_messages++;
        cuontor_msg.text(cuontor_messages + " Messages");

        var strTime = getdate();
        var id = data.id;
        var id_edit_msg = data.id_edit_msg ;
        var id_edit_label = "edit_label"+id;
        if (data.username == username.val()) {
            chatroom.append(
                "<div class='d-flex justify-content-end mb-4'>" +
                    "<div class='msg_cotainer_send' style='min-width: 100px'>" +
                        "<span id='"+id+"' onclick='edit_message("+ id +","+ id_edit_msg +")'><i class='far fa-edit' style='color: #007bff'></i></span>"+
                        "<p class='d-inline' id='"+ id_edit_msg +"'>"+
                            data.message +
                        "</p>"+
                        "<span class='msg_time_send' id='"+id_edit_label+"'>" + strTime + "</span>" +

                "</div>" +
                    "<div class='img_cont_msg msg_cotainer rounded-circle text-center bg-light'>" +
                        "<strong>" + data.username.charAt(0).toUpperCase() + "</strong>" +
                    "</div>" +
                "</div>"
            );
            setTimeout(function () {
                $('#'+id).fadeOut('slow');
            },15000);
        }
        else {
            chatroom.append(
                "<div class='d-flex justify-content-start mb-4'>" +
                    "<div class='img_cont_msg msg_cotainer rounded-circle text-center bg-light'>" +
                        "<strong>" + data.username.charAt(0).toUpperCase() + "</strong>" +
                    "</div>" +
                    "<div class='msg_cotainer' style='min-width: 100px'>" +
                        "<p class='d-inline' id='"+ id_edit_msg +"'>"+
                            data.message +
                        "</p>"+
                    "<span class='msg_time' id='"+id_edit_label+"'>" + strTime + "</span>" +
                    "</div>" +
                "</div>"
            );
        }

    });

    //Emit a username
    send_username.click(function () {
        //socket.emit('change_username', {username: username.val()});
        username2 = username.val();
        username.className += "disable";
        username.prop("disabled", true);
        send_username.prop("disabled", true);
        message.prop("disabled", false);

        socket.emit('username', username2);

        socket.on('is_online', function (username) {
            var isactive;
            if (username==username2)
                isactive = 'disabled';
            else
                isactive = '';
            contacts.append(
                "<li class='"+ isactive +"' id='"+username+"'>" +
                    "<div class='d-flex bd-highlight'>" +
                        "<div class='img_cont'>" +
                            "<img src='../img/profile.jpg' class='rounded-circle user_img'>" +
                            "<span class='online_icon'></span>" +
                        "</div>" +
                        "<div class='user_info'>" +
                            "<span>" + username + "</span>" +
                            "<p>" + username + " is online</p>" +
                        "</div>" +
                    "</div>" +
                "</li>"
            );
        });

        socket.on('left_chat', function (username) {
            console.log(document.getElementById(username));
            console.log(document.getElementById(username)==null);
            if(document.getElementById(username));{
                document.getElementById(username).remove();
                console.log('yes');
            }
            /*contacts.append(
                "<li>" +
                    "<div class='d-flex bd-highlight'>" +
                        "<div class='img_cont'>" +
                            "<img src='' class='rounded-circle user_img'>" +
                            "<span class='online_icon offline'></span>" +
                        "</div>" +
                        "<div class='user_info'>" +
                            "<span>" + username + "</span>" +
                            "<p>" + username + " Left CHat Room</p>" +
                        "</div>" +
                    "</div>" +
                "</li>"
            );*/
        });


    });

    //Emit typing
    message.bind("keypress", () => {
        socket.emit('typing');
    });

    //Listen on typing
    socket.on('typing', (data) => {
        $('#feedback').fadeIn('fast');
        feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>");
        setTimeout(function () {
            $('#feedback').fadeOut('slow');
        },3000);
    })

});

function edit_message(id_msg,id_edit_msg) {
    $('#message').val(document.getElementById(id_edit_msg.id).innerHTML);
    document.getElementById('saver_id_msg').value = id_edit_msg.id;
    document.getElementById('saver_id_i_msg').value = id_msg.id;
    document.getElementById('send_message').className = "d-none";
    document.getElementById('edit_message').className = "btn btn-primary d-inline";
    $('#'+id_msg.id).fadeOut('fast');
}
