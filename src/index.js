const fs = require('fs')
const puppeteer = require('puppeteer');

(async () => {

    const pageUrl = 'https://shopee.vn/M%C3%A1y-T%C3%ADnh-B%C3%A0n-cat.11035954.11035955'

    const browser = await puppeteer.launch({ headless: false, slowMo: 500 });
    const page = await browser.newPage();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });
    await page.setViewport({
        width: 1820,
        height: 1000
    });

    await autoScroll(page);

    const res = await page.evaluate(() => {
        let listHtml = document.querySelectorAll('.shopee-search-item-result__item')
        let products = []    

        listHtml.forEach((product) => {
            dataJson = {}
            try {
                dataJson.title = product.querySelector(".yQmmFK").innerText
                dataJson.price = product.querySelector("._32hnQt span._29R_un").innerText

                products.push(dataJson)
            } catch(error){
                console.log(error);
            }
        })
        return products
    })

    // // click next page
    // await page.click('button.shopee-icon-button.shopee-icon-button--right')

    console.log(res);
    console.log('data', res.length);

    // save data using file system
    fs.writeFileSync('data.json', JSON.stringify(res, null, 2))
    console.log('Save');

    await browser.close();
})();

// auto scroll event
async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {

            var totalHeight = 0;
            var distance = 100;0
            var endList = 4188

            var timer = setInterval(() => {
                // var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= endList){
                    clearInterval(timer);
                    resolve();
                }
            }, 250);
        });
    });
}