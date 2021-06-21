const got = require('@/utils/got');
const parse = require('date-fns/parse');
const cheerio = require('cheerio');

const homeLink = 'https://zhangluyao.com/';

module.exports = async (ctx) => {
    const response = await got({
        method: 'get',
        url: `${homeLink}`,
    });

    const $ = cheerio.load(response.data);
    const items = [];
    $('main')
        .children()
        .slice(0, 15)
        .each(function () {
            const link = $(this).find('p:nth-child(1) a').attr('href');
            const title = $(this).find('p:nth-child(2) b').text();
            const description = $(this).html();
            const dateStr = $(this).find('p:nth-child(1) a i').text();
            const pubDate = parse(dateStr, 'y-MM-dd', new Date()).toUTCString();

            items.push({
                title,
                description,
                link,
                pubDate,
            });
        });

    ctx.state.data = {
        title: '张路遥的博客',
        link: homeLink,
        item: items,
        description: `Luyao's blog`,
        image: `https://zhangluyao.com/favicon.ico`,
    };
};
