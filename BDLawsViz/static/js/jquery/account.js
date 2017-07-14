/**
 * Created by pinku on 7/12/17.
 */

 var signin_token = "";
 var signin_flag = false;

 $(document).ready(function() {


    $('#btnSignUp').click(function () {

        $.ajax({
            url: '/signup',
            data: $('form').serialize(),
            type: 'POST',
            success: function (response) {
                console.log(response);
            },
            error: function (error) {
                console.log(error);
            }
        });
    });


    $('#btnSignIn').click(function () {

        var res = {
            response: "",
            is_error: false,
            error: ""
        }

        $.ajax({
            url: '/validatelogin',
            data: $('form').serialize(),
            type: 'POST',
            success: function (response) {
                res.response = JSON.parse(response);
                signin_flag = true;
                signin_token = res.response;
                signin_token = response;
                console.log(signin_token);
                processHomePage();
            },
            error: function (error) {
                console.log(error);
                window.location.href = "error";
            }
        });

        function processHomePage() {
            window.location.href = "home";
            // $.ajax({
            //     url: '/home',
            //     data: {token: signin_token},
            //     type: 'POST',
            //     data: 'html',
            //     success: function (response) {
            //         var tp = JSON.parse(response);
            //         console.log(tp);
            //         if (1 == tp) {
            //             window.location.href = "home";
            //         }
            //         else if(2 == tp) {
            //             window.location.href = "error";
            //
            //         }
            //     },
            //     error: function (error) {
            //         $("html").html(error);
            //     }
            // });
        }
    });



});
