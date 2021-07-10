const got = require('@/utils/got');
const parse = require('date-fns/parse');
const cheerio = require('cheerio');

const homeLink = 'https://www.matthewball.vc';

module.exports = async (ctx) => {
    const response = await got({
        method: 'get',
        url: `${homeLink}/all`,
    });

    const $ = cheerio.load(response.data);
    const items = [];
    $('.blog-item')
        .each(function () {
            const link = $(this).find('.blog-title a').attr('href');
            const title = $(this).find('.blog-title a').text().replace(/\n/g, '').trim();
            const description = $(this).find('.blog-excerpt-wrapper p').text().trim();
            const dateStr = $(this).find('.blog-date').last().text();
            const pubDate = parse(dateStr, 'M/dd/yy', new Date()).toUTCString();

            items.push({
                title,
                description,
                link,
                pubDate,
            });
        });

    ctx.state.data = {
        title: 'MatthewBall.vc',
        link: homeLink,
        item: items,
        description: 'MatthewBall.vc',
        image:
            'http://static1.squarespace.com/static/5d8e9007bc3d0e18a4c49673/t/5dbee30d6b4e151dedcd9b0f/1572791055698/MBVC+Icon.PNG?format=300w',
    };
};
