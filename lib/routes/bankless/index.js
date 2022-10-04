const got = require('@/utils/got');
const parse = require('date-fns/parse');
const sub = require('date-fns/sub');
const cheerio = require('cheerio');

const homeLink = 'https://newsletter.banklesshq.com/archive';

module.exports = async (ctx) => {
    const response = await got({
        method: 'get',
        url: `${homeLink}archive?sort=new`,
    });

    const $ = cheerio.load(response.data);
    const items = [];
    $('.portable-archive-list')
        .children('.post-preview')
        .each(function () {
            const link = $(this).find('.post-preview-title').attr('href');
            const title = $(this).find('.post-preview-title').text();

            let description = `<a href="${link}">${$(this).find('.post-preview-description').text()}</a>`;
            if ($(this).find('.post-preview-image').length > 0) {
                const postImage = $(this)
                    .find('.post-preview-image')
                    .css('background-image')
                    .replace(/url\("(.*)"\)/, '$1');
                description += `<br><a href="${link}"><img src=${postImage}></a>`;
            }

            let pubDate;
            const dateStr = $(this).find('.post-date').text();
            if (/(\d+) hr ago/.test(dateStr)) {
                pubDate = sub(new Date(), { hours: /(\d+) hr ago/.exec(dateStr)[1] }).toUTCString();
            } else if (dateStr.indexOf(',') === -1) {
                pubDate = parse(dateStr, 'MMM dd', new Date()).toUTCString();
            } else {
                pubDate = parse(dateStr, 'MMM dd, y', new Date()).toUTCString();
            }

            items.push({
                title,
                description,
                link,
                pubDate,
            });
        });

    ctx.state.data = {
        title: 'Bankless',
        link: homeLink,
        item: items,
        description: 'Go Bankless.',
        image:
            'https://cdn.substack.com/image/fetch/w_96,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F00d1682c-3489-474b-8ae5-75d3f3178e33_800x800.png',
    };
};
