const fs = require('fs')
const stringify = require('csv-stringify')
const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    const urls = [ "https://shp.ee/82r9k2f", "https://shp.ee/7s76r4s", "https://shp.ee/66t2jbv", 
                    "https://shp.ee/67axqfh", "https://shp.ee/6bgiuii" ]

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
            }catch(error){
                console.log(error);
            }
            return {"url": html} 
        })
        shopUsername.push(spanHref);
    }
    console.log(shopUsername);

    stringify(shopUsername, { header: true}, (err, output) => {
        if (err) throw err
        fs.writeFileSync('data.csv', output, (err) =>  {
            if (err) throw err;
            console.log('data.csv saved.');
        })
    })

    await browser.close();
})();