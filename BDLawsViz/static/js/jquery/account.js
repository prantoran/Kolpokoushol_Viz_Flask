/**
 * Created by pinku on 7/12/17.
 */

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
                setCookie("bdlawuser",res.response['name'],7,["home","showsignup","showsignin"])
                processHomePage();
            },
            error: function (error) {
                console.log(error);
                window.location.href = "error";
            }
        });

        function processHomePage() {
            window.location.href = "home";
        }
    });



});
