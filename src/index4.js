const fs = require('fs')
// const stringify = require('csv-stringify')
const parse = require('csv-parse')
const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const fs = require('fs')

    let inputPath = './test.csv'
    let urls = []

    const data = fs.readFileSync(inputPath, 'utf8' ).split('\r\n')

    data.shift()
    data.pop()

    urls = (data);

    const shopUsername = []

    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        await page.goto(`${url}`, { waitUntil: 'networkidle2' });
        await page.setViewport({
            width: 1820,
            height: 1000
        });
        const spanHref = await page.evaluate(() => {
            let selector = '.navbar-with-more-menu__item.navbar-with-more-menu__item--active'
            try {
                var html = document.querySelector(selector).href
            } catch (error) {
                console.log(error);
            }
            return { "url": html }
        })
        shopUsername.push(spanHref);
    }
    console.log(shopUsername);

    // stringify(shopUsername, { header: true}, (err, output) => {
    //     if (err) throw err
    //     fs.writeFileSync('data.csv', output, (err) =>  {
    //         if (err) throw err;
    //         console.log('data.csv saved.');
    //     })
    // })

    await browser.close();
})();