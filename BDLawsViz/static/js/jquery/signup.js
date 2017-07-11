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
});