$(function () {

    var client_id = "af9b8f167a9402815013";//545b4972e16c6d7ac22c
    var client_secret = "255e90346c6e3bf6de23bcdebcc1fcebc5694c41";//443e8bcbe931f64f212882fc3d1e246aa416bdec
    var redirect_uri = "https://pyqt5.com/issues/index.html";//https://892768447.github.io/static/index.html
    var scope = "read:user";
    var access_token = localStorage.getItem("GT_ACCESS_TOKEN");

    function queryParse(name, content) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = content.match(reg) || encodeURI(window.location.search).substr(1).match(reg);
        if (r != null) return decodeURI(unescape(r[2]));
        return null;
    }

    function login() {
        window.location.href = "https://github.com/login/oauth/authorize?client_id=" + client_id +
            "&redirect_uri=" + redirect_uri + "&scope=" + scope;
    }

    function getIssues(current_page) {
        try {
            Pace.restart();
        } catch (error) {}
        $.ajax({
            type: "GET",
            url: "https://api.github.com/repos/PyQt5/PyQt/issues",
            data: { state: "all", sort: "created", direction: "desc", page: current_page },
            headers: { Authorization: "token " + access_token },
            dataType: "json",
            success: function (response, status, xhr) {
                var links = xhr.getResponseHeader('Link');
                var regPrev = /rel="prev"/g;
                var regNext = /rel="next"/g;
                var regLast = /rel="last"/g;
                var regPage = /page=(\d+)/g;
                var prev_page = 1;
                var next_page = 1;
                var total_page = 1;
                if (regPrev.test(links)) {
                    // 匹配到上一页
                    prev_page = parseInt(regPage.exec(links)[1]);
                }
                if (regNext.test(links)) {
                    // 匹配到下一页
                    next_page = parseInt(regPage.exec(links)[1]);
                } else {
                    //当前是最后一页时
                    next_page = null;
                    total_page = prev_page > 1 ? prev_page + 1 : 1;
                }
                if (regLast.test(links)) {
                    //匹配到最后一页
                    total_page = parseInt(regPage.exec(links)[1]);
                }
                // var reg = /page=(\d+)/g;
                // var next_page = reg.exec(links);
                // var total_page = reg.exec(links);
                // try {
                //     next_page = parseInt(next_page[1]);
                //     total_page = parseInt(total_page[1]);
                // } catch (error) {
                //     next_page = 2;
                //     total_page = 1;
                // }
                // 排除pull
                var new_response = [];
                response.forEach(element => {
                    if (element.html_url.indexOf("/pull/") === -1) {
                        new_response.push(element);
                    }
                });
                var infos = {
                    issues: new_response, pages: {
                        href: window.location.href.split("?")[0],
                        prev_page: prev_page,
                        next_page: next_page,
                        current_page: current_page || 1,
                        total_page: total_page,
                        pages: Array.from({ length: total_page }, (item, index) => index + 1)
                    }
                };
                console.log(infos);
                var html = template('tpl-issues', infos);
                $("#issues-list").html(html);
                try {
                    resetTags();
                } catch (error) {
                }
                try {
                    Pace.stop();
                } catch (error) {}
            },
            error: function (xhr, errorType, error) {
                console.error(xhr);
            }
        });
    }
    
    function getIssuesData() {
        // 获取issues列表
        var current_page = queryParse("page");
        if (current_page) {
            try {
                current_page = parseInt(current_page) || 1;
            } catch (error) {
                current_page = 1;
            }
        }
        getIssues(current_page);
    }

    var code = queryParse("code");
    if (code) {
        try {
            Pace.restart();
        } catch (error) {}
        $.ajax({
            type: "POST",
            timeout: 120000,
            url: "https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token",
            data: { client_id: client_id, client_secret: client_secret, code: code },
            success: function (response, status, xhr) {
                access_token = queryParse("access_token", response);
                if (access_token && access_token !== null && access_token.length > 6) {
                    localStorage.setItem("GT_ACCESS_TOKEN", access_token);
                    window.location.href = window.location.href.split("?")[0];
                }
            }
        });
    } else {
        if (access_token === null || access_token.length === 0) {
            // 未登录
            login();
            return;
        }
        getIssuesData();
    }
});