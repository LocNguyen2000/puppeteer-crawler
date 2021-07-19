const fs = require('fs')
const stringify = require('csv-stringify')
const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    let inputPath = '../data/data_urls.csv'
    let urls = []

    const data = fs.readFileSync(inputPath, 'utf8' ).split('\r\n')
    data.shift()
    data.pop()

    urls = (data);

    // await page.setDefaultNavigationTimeout(0);

    const shopUsername = [];

    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        try {
            await page.goto(`${url}`, { waitUntil: 'networkidle2' });
        } catch (error) {
            return {"url": ""}
        }
        await page.setViewport({
            width: 1820,
            height: 1000
        });
        const spanHref = await page.evaluate(() => {
            let selector_shop = '.navbar-with-more-menu__item.navbar-with-more-menu__item--active';
            let selector_product = "._3uf2ae";
            try {
                var html;
                if (document.querySelector(selector_shop) != null) {
                    html = document.querySelector(selector_shop).href;
                }
                else {
                    html = document.querySelector(selector_product).innerHTML;
                }
                
            } catch (error) {
                console.log(error);
                return {"url": ""}
            }
            return { "url": html }
        })
        shopUsername.push(spanHref);
        console.log(shopUsername[i]);
    }
    

    // stringify(shopUsername, { header: true}, (err, output) => {
    //     if (err) throw err
    //     fs.writeFileSync('data_username.csv', output, (err) =>  {
    //         if (err) throw err;
    //         console.log('data saved.');
    //     })
    // })

    await browser.close();
})();