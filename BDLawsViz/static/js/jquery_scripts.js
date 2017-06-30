/**
 * Created by pinku on 6/29/17.
 */

$(document).ready(function() {

    $("#searchText_form").submit(function(e) {
        e.preventDefault();
    });

    $('#sidePaneButton').click(function() {

        var id = document.getElementById('sT').value;

        if(id=="") {
            var q = document.getElementById('queryOutputBlock');
            q.innerHTML = "<a style='padding:7% 0% 0% 10%;font-size:18px;' href='#'>The query field is empty. Nothing to show.</a><br/>";
        }
        else {

            var ret = {
                'id': id,
                'name': "",
                'indegree': [],
                'outdegree': [],
                'is_error':false,
                'error':""
            }

            $.when( SearchByName(ret), SearchOutDegree(ret), SearchInDegree(ret) ).done( function( a1, a2, a3) {

                var p = "";
                var linkText = "http://bdlaws.minlaw.gov.bd/pdf_part.php?id=";

                if(ret['is_error']) {
                    p = "<a style='font-size:18px;padding:0% 0% 0% 0%;' href='#'>";
                    p += "Error occurred:</a><br/>";
                    p += "<a style='font-size:18px;padding:0% 0% 0% 6%;' href=''>";
                    p += ret['error']+"</a><br/>";
                }
                else {
                    p += "<a style='font-size:18px;padding:0% 0% 0% 0%;' href='#'>";
                    p += "The name of the searched law:</a><br/>";
                    p += "<a style='font-size:18px;padding:0% 0% 0% 6%;' href='";
                    p += linkText+id+"'>"
                    p += ret['name']+"</a><br/>";

                    var fnd = false;
                    var u = ret['outdegree'];
                    for (var i in u) {
                        if( fnd == false ) {
                            p += "<a style='font-size:18px;padding:0% 0% 0% 0%;' href='#'>";
                            p += "The searched law references the following laws:</a><br/>";
                            fnd = true;
                        }
                        p += "<a style='font-size:18px;padding:0% 0% 0% 6%;' href='";
                        p += linkText+[i]['idD']+"'>";
                        p += "( ID: "+u[i]['idD']+" ) "+u[i]['nameD']+"</a><br/>";
                    }
                    if( fnd == false ) {
                        p += "<a style='font-size:18px;padding:0% 0% 0% 0%;' href='#'>";
                        p += "This law does not reference any other law.</a><br/>";
                    }
                    p += "<br/>";


                    fnd = false;
                    u = ret['indegree'];
                    for (var i in u) {
                        if( fnd == false ) {
                            p += "<a style='font-size:18px;padding:0% 0% 0% 0%;' href='#'>";
                            p += "The searched law is referenced by the following laws:</a><br/>";
                            fnd = true;
                        }
                        p += "<a style='font-size:18px;padding:0% 0% 0% 6%;' href='";
                        p += linkText+[i]['idS']+"'>";
                        p += "( ID: "+u[i]['idS']+" ) "+u[i]['nameS']+"</a><br/>";
                    }
                    if( fnd == false ) {
                        p += "<a style='font-size:18px;padding:0% 0% 0% 0%;' href='#'>";
                        p += "This law is not referenced by any other law.</a><br/>";
                    }
                    p += "<br/>";
                }
                document.getElementById('queryOutputBlock').innerHTML = p ;

            });

        }
    });
});

function SearchByName(ret) {
     return $.ajax({
        url: '/searchname',
        data: $('form').serialize(),
        type: 'POST',
        success: function (response) {
            ret['name'] = response;
        },
        error: function (error) {
            ret['is_error'] = true;
            ret['error'] = error;
        }
    });
}

function SearchOutDegree(ret) {
    return $.ajax({
        url: '/searchoutdegree',
        data: $('form').serialize(),
        type: 'POST',
        success: function (response) {
            ret['outdegree'] = JSON.parse(response);
        },
        error: function (error) {
            ret['is_error'] = true;
            ret['error'] = error;
        }
    })
}

function SearchInDegree(ret) {
    return $.ajax({
        url: '/searchindegree',
        data: $('form').serialize(),
        type: 'POST',
        success: function (response) {
            ret['indegree'] = JSON.parse(response);
        },
        error: function (error) {
            ret['is_error'] = true;
            ret['error'] = error;
        }
    })
}