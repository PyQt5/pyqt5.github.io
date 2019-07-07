'use strict';

var pagination = require('hexo-pagination');
var _pick = require('lodash.pick');
var _moment = require('moment');
var fs = require('fs');
var format = require('string-format');
var _path = require('path');
var _process = require('child_process');
var _host = '';
var thumbnailpath = 'source/images/';

function filterHTMLTags(str) {
    return str ? str
        .replace(/\<(?!img|br).*?\>/g, "")
        .replace(/\r?\n|\r/g, '')
        .replace(/<img(.*)>/g, ' [图片] ') : null
}

function fetchCovers(str) {
    var temp,
        imgURLs = [],
        rex = /<img[^>]+src="?([^"\s]+)"(.*)>/g;
    while (temp = rex.exec(str)) {
        /* if ( temp[1].startsWith("http") == false ) {
            if ( temp[1].startsWith("/") == false ) {
                temp[1] = _host + "/" + temp[1];
            } else {
                temp[1] = _host + temp[1];
            }
        } */
        imgURLs.push(temp[1]);
    }
    return imgURLs.length > 0 ? imgURLs : null;
}

function fetchCover(str) {
    var covers = fetchCovers(str);
    return covers ? covers[0] : null;
}

function runCommand(command) {
    _process.execSync(command, function (error, stdout, stderr) {
        if (error) {
            console.log(error.stack);
            console.log('Error code: ' + error.code);
            console.log('Signal received: ' + error.signal);
        }
    });
}

function createThumbnail(url) {
    // 生成缩略图
    var savePath = thumbnailpath + _path.basename(url).split('.')[0] + '_thumb.jpg' // 文件名
    try {
        // 如果缩略图已经存在则跳过
        fs.accessSync(savePath, fs.constants.R_OK | fs.constants.W_OK);
        console.log('跳过缩略图: ' + savePath);
        return savePath;
    } catch (err) {}

    if (url.startsWith("http") == false) {
        // 本地文件
        var srcPath = 'source' + url;
        try {
            // 生成缩略图
            fs.accessSync(srcPath, fs.constants.R_OK | fs.constants.W_OK);
            console.log('本地文件生成缩略图: ' + srcPath);
            runCommand(format('python createThumb.py {0} {1}', srcPath, savePath));
        } catch (err) {
            if (err)
                console.log(err);
        }
    } else {
        // 下载远程文件
        var srcPath = 'tmp/' + _path.basename(url) // 临时路径文件名
        try {
            // 如果缩略图已经存在则跳过
            fs.accessSync(srcPath, fs.constants.R_OK | fs.constants.W_OK);
            console.log('跳过已下载: ' + srcPath);
            runCommand(format('python createThumb.py {0} {1}', srcPath, savePath));
        } catch (err) {
            // 不存在则重新下载
            console.log('下载远程文件生成缩略图: ' + url);
            runCommand(format('python createThumb.py {0} {1} {2}', url, srcPath, savePath));
        }
    }

    // 检测结果
    try {
        fs.accessSync(savePath, fs.constants.R_OK | fs.constants.W_OK);
        return savePath;
    } catch (err) {
        return null;
    }
}

module.exports = function (cfg, site) {
    _host = cfg.url;
    var restful = cfg.hasOwnProperty('restful') ? cfg.restful : {
            site: true,
            posts_size: 10,
            posts_props: {
                title: true,
                slug: true,
                date: true,
                updated: true,
                comments: true,
                cover: true,
                path: true,
                raw: false,
                excerpt: false,
                content: false,
                categories: true,
                tags: true
            },
            categories: true,
            use_category_slug: false,
            tags: true,
            use_tag_slug: false,
            post: true,
            pages: false,
        },

        posts = site.posts.sort('-date').filter(function (post) {
            return post.published;
        }),

        posts_props = (function () {
            var props = restful.posts_props;

            return function (name, val) {
                return props[name] ? (typeof val === 'function' ? val() : val) : null;
            }
        })(),

        postMap = function (post) {
            // 获取图片并生成缩略图
            var cover = posts_props('cover', post.cover || fetchCover(post.content));
            if (cover != null) {
                cover = createThumbnail(cover);
                cover = cover ? cover.replace('source/', '') : 'images/default_thumb.jpg';
            } else {
                cover = 'images/default_thumb.jpg';
            }
            return {
                author: post.author,
                title: posts_props('title', post.title),
                slug: posts_props('slug', post.slug),
                date: posts_props('date', _moment(post.date).format('YYYY-MM-DD HH:mm:ss')),
                updated: posts_props('updated', post.updated),
                comments: posts_props('comments', post.comments),
                path: posts_props('path', 'api/articles/' + post.slug + '.json'),
                excerpt: posts_props('excerpt', filterHTMLTags(post.excerpt)),
                keywords: posts_props('keywords', cfg.keywords),
                // cover: posts_props('cover',  fetchCover(post.content)),
                cover: cover,
                // 去掉posts分页查询里面包含内容，只显示简介
                // content: posts_props('content', post.content),
                // raw: posts_props('raw', post.raw),
                categories: posts_props('categories', function () {
                    return post.categories.map(function (cat) {
                        const name = (
                            cfg.restful.use_category_slug && cat.slug
                        ) ? cat.slug : cat.name;
                        return {
                            name: name,
                            path: 'api/categories/' + name + '.json'
                        };
                    });
                }),
                tags: posts_props('tags', function () {
                    return post.tags.map(function (tag) {
                        const name = (
                            cfg.restful.use_tag_slug && tag.slug
                        ) ? tag.slug : tag.name;
                        return {
                            name: name,
                            path: 'api/tags/' + name + '.json'
                        };
                    });
                })
            };
        },

        cateReduce = function (cates, kind) {
            return cates.reduce(function (result, item) {
                if (!item.length) return result;

                let use_slug = null;
                switch (kind) {
                    case 'categories':
                        use_slug = cfg.restful.use_category_slug;
                        break;
                    case 'tags':
                        use_slug = cfg.restful.use_tag_slug;
                        break;
                }

                const name = (use_slug && item.slug) ? item.slug : item.name;

                return result.concat(pagination(item.path, posts, {
                    perPage: 0,
                    data: {
                        name: name,
                        path: 'api/' + kind + '/' + name + '.json',
                        postlist: item.posts.map(postMap)
                    }

                }));
            }, []);
        },

        catesMap = function (item) {
            return {
                name: item.data.name,
                path: item.data.path,
                count: item.data.postlist.length
            };
        },

        cateMap = function (item) {
            var itemData = item.data;
            return {
                path: itemData.path,
                data: JSON.stringify({
                    name: itemData.name,
                    postlist: itemData.postlist
                })
            };
        },

        apiData = [];


    if (restful.site) {
        apiData.push({
            path: 'api/site.json',
            data: JSON.stringify(restful.site instanceof Array ? _pick(cfg, restful.site) : cfg)
        });
    }

    if (restful.categories) {

        var cates = cateReduce(site.categories, 'categories');

        if (!!cates.length) {
            apiData.push({
                path: 'api/categories.json',
                data: JSON.stringify(cates.map(catesMap))
            });

            apiData = apiData.concat(cates.map(cateMap));
        }

    }

    if (restful.tags) {
        var tags = cateReduce(site.tags, 'tags');

        if (tags.length) {
            apiData.push({
                path: 'api/tags.json',
                data: JSON.stringify(tags.map(catesMap))
            });

            apiData = apiData.concat(tags.map(cateMap));
        }

    }

    var postlist = posts.map(postMap);

    if (restful.posts_size > 0) {

        var page_posts = [],
            i = 0,
            len = postlist.length,
            ps = restful.posts_size,
            pc = Math.ceil(len / ps);

        for (; i < len; i += ps) {
            page_posts.push({
                path: 'api/posts/' + Math.ceil((i + 1) / ps) + '.json',
                data: JSON.stringify({
                    total: len,
                    pageSize: ps,
                    pageCount: pc,
                    data: postlist.slice(i, i + ps)
                })
            });
        }

        apiData.push({
            path: 'api/posts.json',
            data: page_posts[0].data
        });

        apiData = apiData.concat(page_posts);

    } else {

        apiData.push({
            path: 'api/posts.json',
            data: JSON.stringify(postlist)
        });
    }

    if (restful.post) {
        apiData = apiData.concat(posts.map(function (post) {
            var path = 'api/articles/' + post.slug + '.json';
            return {
                path: path,
                data: JSON.stringify({
                    author: post.author,
                    title: post.title,
                    slug: post.slug,
                    date: _moment(post.date).format('YYYY-MM-DD HH:mm:ss'),
                    updated: post.updated,
                    comments: post.comments,
                    path: path,
                    url: post.permalink,
                    excerpt: filterHTMLTags(post.excerpt),
                    covers: fetchCovers(post.content),
                    keywords: cfg.keyword,
                    // content: post.content,
                    content: posts_props('content', post.content),
                    // more: post.more,
                    raw: posts_props('raw', post.raw),
                    categories: post.categories.map(function (cat) {
                        return {
                            name: cat.name,
                            path: 'api/categories/' + cat.name + '.json'
                        };
                    }),
                    tags: post.tags.map(function (tag) {
                        return {
                            name: tag.name,
                            path: 'api/tags/' + tag.name + '.json'
                        };
                    })
                })
            };
        }));
    }

    if (restful.pages) {
        apiData = apiData.concat(site.pages.data.map(function (page) {
            var safe_title = page.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()
            var path = 'api/pages/' + page.title + '.json';

            return {
                path: path,
                data: JSON.stringify({
                    title: page.title,
                    date: _moment(page.date).format('YYYY-MM-DD HH:mm:ss'),
                    updated: page.updated,
                    comments: page.comments,
                    path: path,
                    covers: fetchCovers(page.content),
                    excerpt: filterHTMLTags(page.excerpt),
                    content: posts_props('content', page.content),
                    raw: posts_props('raw', page.raw)
                })
            };
        }));
    }

    return apiData;
};
