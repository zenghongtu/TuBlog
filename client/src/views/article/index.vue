/**
* Created by zenghongtu on 07/09/2018
* Desc: article
*/

<template>
    <div class="article-wrap">
        <div class="article-content" v-if="article">
            <h2 class="article-title">{{article.title}}</h2>
            <div class="article-meta">
                <div class="date">发布于:{{article.createdAt.slice(0,10)}}</div>
                <div class="category">| # {{article.category}}</div>
                <div class="comment">{{article.commentCount}}</div>
            </div>
            <div class="content">
                {{article.content}}
            </div>
            <p>-- EOF --</p>
            <div class="tags"># {{article.tag[0]}}</div>
            <p class="article-url">
                <span>本文链接:{{url}} </span>
            </p>
            <div class="update">最后更新于: {{article.updatedAt.slice(0,10)}}</div>
        </div>
        <div class="article-nav">
            <div class="pre"> < 上一篇</div>
            <div class="next"> 下一篇 ></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "article",
        data() {
            return {
                article: null,
            }
        },
        computed: {
            url() {
                return window.location.href
            }
        },
        methods: {
            async fetchArticle() {
                const id = this.$route.params.id;
                const rsp = await this.$ajax(`/article?id=${id}`);
                this.article = rsp.data[0]
            }
        },
        created() {
            this.fetchArticle()
        }
    };
</script>

<style scoped lang="scss">
    @import "../../assets/style/index";

    .article-wrap {
        padding-top: 1.25em;
        box-sizing: border-box;
        .article-content {
            padding: 1.5625em 0 0.9375em;
            text-align: left;
            .article-title {
                margin: 0;
                color: $title;
                font: bold 1.5625em/1.1 ff-tisa-web-pro, Cambria, "Times New Roman", Georgia, Times, sans-serif;
            }
            .article-meta {
                width: 100%;
                padding: 0;
                margin: 0.9375em 0;
                color: $date;
                text-indent: .15em;
                display: inline-block;
                line-height: 1.3em;
                overflow: hidden;
                .date {
                    display: inline-block;
                }
                .category {
                    display: inline-block;
                }
                .comment {
                    display: inline-block;
                    float: right;
                    margin-right: 5em;
                    text-indent: .15em;
                }

            }
            .content {
                font-size: 0.9375em;
                line-height: 1.5em;
                color: $word;
                padding-top: .9375em;
                word-break: keep-all;
                text-indent: 2em;
            }
        }
        .article-nav {
            margin-bottom: 1.25em;
            padding: 1em 0.625em;
            white-space: nowrap;
            border-top: 1px solid $block;
            display: flex;
            justify-content: space-between;
            .pre, .next {
                display: inline-block;
                line-height: 1.5625em;
                font-size: 0.9375em;
                color: $title;
            }
        }
    }
</style>