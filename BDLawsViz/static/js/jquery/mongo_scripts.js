/**
 * Created by pinku on 7/7/17.
 */

function searchByKeyword(ret, queryParams) {
    console.log("queryParams:" + queryParams);
    return $.ajax({
        url: '/search'+queryParams,
        type: 'GET',
        success: function (response) {
            ret['response'] = response;
        },
        error: function (error) {
            ret['is_error'] = true;
            ret['error'] = error;
        }
    });
}