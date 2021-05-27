$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    function addZero(data) {
        if (data < 10) {
            return data = '0' + data
        }
        return data
    }
    template.defaults.imports.dateFilter = function (date) {
        date = new Date(date)
        var y = date.getFullYear()
        var m = date.getMonth() + 1
        var d = date.getDate()
        var hh = addZero(date.getHours())
        var mm = addZero(date.getMinutes())
        var ss = addZero(date.getSeconds())
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
    initTable()
    initSort()
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlstr = template('art_tableList', res)
                $('tbody').html(htmlstr)
                renderPage(res.total)
            }
        })
    }
    function initSort() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlstr1 = template('select_tips', res)
                $('[name=cate_id]').html(htmlstr1)
                form.render()
            }
        })
    }
    function renderPage(total) {
        laypage.render({
            elem: 'page',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['prev', 'limit', 'page', 'next', 'count', 'skip'],
            limits: [2, 4, 6, 8],
            jump(obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        });
    }
    $("#filtrate").on('submit', function (e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        console.log(cate_id);
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        initTable()
    })
    $('tbody').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length
        var id = $(this).attr('data-Id')
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message);
                    if (len <= 1) {
                        q.pagenum = q.pagenum === 1 ? q.pagenum : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })
})