$(function () {
    var layer = layui.layer
    var form = layui.form
    initsort()
    function initsort() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlstr = template('art_sortChoose', res)
                $('[name=cate_id]').html(htmlstr)
                form.render()
            }
        })
    }
    initEditor()
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#btnchooseimage').on('click', function () {
        $('#coverfile').click()
    })
    $('#coverfile').on('change', function (e) {
        var files = e.target.files
        var file = e.target.files[0]
        if (files.length <= 0) {
            return layer.msg('请选择封面')
        }
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })
    var art_state = '已发布'
    $('#savato').on('click', function () {
        art_state = '草稿'
    })

    $('#form_pub').on('submit', function (e) {
        e.preventDefault()
        var formdata = new FormData(this)
        formdata.append('state', art_state);
        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        }).toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            formdata.append('cover_img', blob);
            publishArticle(formdata)
        })
    })
    function publishArticle(formdata) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: formdata,
            contentType: false,
            processData: false,
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message, { time: 1000 }, function () {
                    window.parent.$('#target').click()
                    // location.href = '../../../article/art_list.html'
                });

            }
        })
    }
})
