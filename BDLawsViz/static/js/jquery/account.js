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
                setCookie("bdlawuser",res.response['name'],7,['home','showsignup','showsignin','logout','index'])

                var d = new Date();
                setCookie("starttime", d.getSeconds(), 7, allPaths);

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

    var reslogout = {
        response: "",
        is_error: false,
        error: ""
    }

    $('#btnSignOut').click(function() {
        $.when(logoutPOST(reslogout)).done(function(a1) {
                deleteAllCookies();
                if(reslogout.is_error) {
                    window.location.href='error';
                }
                else {
                    window.location.href='index';
                }
            });
    });

    function logoutPOST(res) {
        $.ajax({
            url: '/logout',
            type: 'POST',
            data: $('form').serialize(),
            success: function (response) {
                res.response = JSON.parse(response);
                window.alert(res);
            },
            error: function (error) {
                res.is_error = true;
                res.error = JSON.parse(error);
                console.log(error);
            }
        });
    }
});
