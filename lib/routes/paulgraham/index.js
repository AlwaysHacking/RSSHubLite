const got = require('@/utils/got');
const cheerio = require('cheerio');

const homeLink = 'http://www.paulgraham.com/';

module.exports = async (ctx) => {
    const response = await got({
        method: 'get',
        url: `${homeLink}articles.html`,
    });

    const $ = cheerio.load(response.data);
    let items = [];
    $('body table tbody tr td:nth-child(3) table:nth-child(6) tbody tr td font a')
        .slice(0, 15)
        .each(function () {
            const link = `${homeLink}${$(this).attr('href')}`;
            const title = $(this).text();

            items.push({
                title,
                link,
            });
        });

    items = await Promise.all(
        items.map(
            (item) =>
                new Promise((resolve) => {
                    got({
                        method: 'get',
                        url: item.link,
                    }).then((response) => {
                        const $ = cheerio.load(response.data);
                        const description = $('body table tbody tr td:nth-child(3) table tbody tr td font').html();
                        resolve({
                            ...item,
                            description,
                        });
                    });
                })
        )
    );

    ctx.state.data = {
        title: 'Paul Graham',
        link: homeLink,
        item: items,
        description: `Paul Graham's Essay`,
        image: 'http://ycombinator.com/arc/arc.png',
    };
};
