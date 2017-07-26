/**
 * Created by pinku on 7/7/17.
 */

function searchByKeyword(ret, queryParams) {
    return $.ajax({
        url: '/search'+queryParams,
        type: 'GET',
        success: function (res) {
            ret['response'] = res;
        },
        error: function (err) {
            ret['is_error'] = true;
            ret['error'] = err;
        }
    });
}

function searchLawNetworkID(ret, id) {
    return $.ajax({
        url: '/law_network'+'?id='+id,
        type: 'GET',
        success: function(res) {
            ret.response = res;
            console.log(res);
        },
        error: function (err) {
            ret.is_error = true;
            ret.error = err;
        }
    });
}
