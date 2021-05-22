$(function () {
    $('#link_reg').on('click', function () {
        $('.login_section').hide()
        $('.reg_section').show()
    })
    $('#link_login').on('click', function () {
        $('.login_section').show()
        $('.reg_section').hide()
    })
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        psw: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格']
        ,
        repsw: function (value) {
            var val = $('.reg_section [name="password"]').val();
            if (val !== value) {
                return '两次密码不一致'
            } [23]
        }
    })
    // 注册表单监听事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        var data = $(this).serialize();
        data = data.split('&');
        data.splice(2);
        data = data.join('&')
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: data,
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                };
                layer.msg('注册成功，请登录');
                $('#link_login').trigger('click')
            }
        })
    })
    // 登录表单事件监听
    $('#form_login').on('submit', function (e) {
        console.log($(this).serialize());
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success(res, status, xhr) {
                if (res.status !== 0) return layer.msg(res.message);
                localStorage.setItem('token', res.token)
                layer.msg(res.message)
                location.href = '../../index.html';
            }
        })
    })
})