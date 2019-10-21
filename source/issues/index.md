---
title: PyQt5讨论
comments: false
date: 2019-10-20 23:24:25
share: false
description: PyQt5 Issues 论坛 讨论
home: true
---

<link rel="stylesheet" type="text/css" href="//cdn.bootcss.com/semantic-ui/0.19.3/css/semantic.min.css" data-no-instant>
<script src="//cdn.bootcss.com/semantic-ui/0.19.3/javascript/semantic.min.js" data-no-instant></script>
<script src="/js/template-web.js"></script>
<script>
	// 标准语法的界定符规则
	template.defaults.rules[1].test = /<<([@#]?)[ \t]*(\/?)([\w\W]*?)[ \t]*>>/;
	template.defaults.imports.dateFormat = function (value) {
		return value.split("T")[0];
	}
	template.defaults.imports.randomColor = function () {
		var color_map = ['black', 'green', 'red', 'blue', 'orange', 'purple', 'teal'];
		var color = 'teal';
		var color_index = Math.ceil(Math.random()*(color_map.length-1));
		color = color_map[color_index];
		if (!color) {
			color = 'teal';
		}
		return color;
	}
	template.defaults.imports.replaceLabelUrl = function (value) {
		return value.replace("api.", "").replace("/repos/", "/").replace("labels/", "issues?q=label%3A");
	}
</script>
<script src="/js/issues.min.js"></script>
<script id="tpl-issues" type="text/html">
	<<each issues>>
	<article id="post-<<$value.number>>" class="article article-type-post" itemscope itemprop="blogPost">
		<div class="article-meta">
			<a href="<<$value.html_url>>" class="article-date" target="_blank">
				<time datetime="<<$value.created_at>>" itemprop="datePublished"><<$value.created_at | dateFormat>></time>
			</a>
		</div>
		<div class="ui piled raised segment box-archive-item" itemscope itemtype="http://schema.org/Article"
			style="background-color:#fafafa !important">
			<input type="hidden" class="isFancy" />
			<div class="ui <<randomColor>> ribbon label" style="line-height: 1.3; min-width:100px; max-width:450px;">
				<span class="archive-item-title"
					style="display:block; height:100%; max-width:400px;white-space:nowrap; text-transform:capitalize;">
					<h1 itemprop="name">
						<a class="article-title" href="<<$value.html_url>>" target="_blank"><<$value.title>></a>
					</h1>
				</span>
			</div>
			<div onclick="window.open('<<$value.html_url>>','_blank')" id="id_description_div"
				style="margin-top:20px; line-height: 1.65em;cursor:pointer">
				<p style="display: -webkit-box;overflow: hidden;text-overflow: ellipsis;-webkit-line-clamp: 5;-webkit-box-orient: vertical;"><<$value.body>></p>
			</div>
			<div class="article-info article-info-index">
				<<set labels = $value.labels>>
                <<if labels && labels.length > 0>>
				<div class="article-tag tagcloud">
					<ul class="article-tag-list">
						<<each labels>>
						<li class="article-tag-list-item"><a class="article-tag-list-link"
								href="<<$value.url | replaceLabelUrl>>" target="_blank"><<$value.name>></a>
						</li>
						<</each>>
					</ul>
				</div>
				<</if>>
				<p class="article-more-link">
					<a href="<<$value.html_url>>" target="_blank"> <span class="link link--yaku">
							<span>发</span><span>现</span><span>更</span><span>多 >></span>
						</span>
					</a>
				</p>
				<div class="clearfix"></div>
			</div>
		</div>
	</article>
	<</each>>
	<<if pages>>
	<nav id="page-nav" >
		<<if pages.current_page && pages.prev_page !== pages.current_page>>
		<a class="extend prev" rel="prev" href="<<pages.href>>?page=<<pages.prev_page>>">&laquo; Prev</a>
		<</if>>
		<<each pages.pages>>
		<<if pages.current_page === $value>>
		<span class="page-number current"><<$value>></span>
		<<else>>
		<a class="page-number" href="<<pages.href>>?page=<<$value>>"><<$value>></a>
		<</if>>
		<</each>>
		<<if pages.next_page && pages.total_page !== pages.current_page>>
		<a class="extend next" rel="next" href="<<pages.href>>?page=<<pages.next_page>>">Next &raquo;</a>
		<</if>>
	</nav>
	<</if>>
</script>

<div id="issues-list" style=""></div>