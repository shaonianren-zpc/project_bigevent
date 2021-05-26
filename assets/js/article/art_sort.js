$(function () {
    const layer = layui.layer
    const form = layui.form
    let index_sortAdd = null
    let index_sortEdit = null
    initArticleSort();
    function initArticleSort() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success(res) {
                var htmlstr = template('art_sort', res);
                $('tbody').html(htmlstr)
            }
        })
    }
    $('#btn_add').on('click', function () {
        index_sortAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $('#tip_contentAdd').html(),
            area: ['500px', '250px']
        });
    })
    $('body').on('submit', '#form_add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                initArticleSort();
                layer.close(index_sortAdd)
            }
        })
    })
    $('tbody').on('click', '#btn_edit', function () {
        index_sortEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            content: $('#tip_contentEdit').html(),
            area: ['500px', '250px']
        });
        var id = $(this).attr('data-Id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success(res) {
                form.val('filter', res.data);
            }
        })
    })
    $('body').on('submit', '#form_edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                layer.close(index_sortEdit);
                initArticleSort();
            }
        })
    })
    $('tbody').on('click', '#btn_del', function () {
        var id = $(this).attr('data-Id')
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message);
                    layer.close(index);
                    initArticleSort();
                }
            })
        });

    })
})