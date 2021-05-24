$(function () {
    getUserInfo()
    var layer = layui.layer
    $('#loginout').on('click', function () {
        layer.confirm('是否退出？', { icon: 3, title: '提示' }, function (index) {
            localStorage.removeItem('token');
            location.href = '../../login.html'
            layer.close(index);
        });
    })
})
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            renderUserInfo(res)
        }
    })
}
function renderUserInfo(res) {
    var uname = res.data.nickname || res.data.username;
    $('.welcome').html('欢迎&nbsp;&nbsp;' + uname);
    if (res.data.user_pic) {
        $('.layui-nav-img').prop('src', res.data.user_pic).show().siblings('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide().siblings('.text-avatar').html(`${uname[0].toUpperCase()}`).show()
    }
}