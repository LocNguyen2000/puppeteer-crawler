const fs = require('fs')
const puppeteer = require('puppeteer');

(async () => {
    const pageUrl = 'https://shopee.vn/madelaclothing?categoryId=100017&itemId=9427184730&page=4&pdpL3Category=0&sortBy=pop'

    const browser = await puppeteer.launch({ headless: false, slowMo: 500 });
    const page = await browser.newPage();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });
    await page.setViewport({
        width: 1820,
        height: 1000
    });

    const res = await page.evaluate(() => {
        let listSelector = 'div.shopee-header-section__content > .row'
        let listHtml = document.querySelectorAll(listSelector)
        
        console.log(listHtml);

        let products = []

        listHtml.forEach((product) => {
            jsonData = {}
            try {
                jsonData.title = product.querySelector('.PFM7lj > div').innerText
                jsonData.price = product.querySelector('.WTFwws > ._29R_un').innerText

                products.push(jsonData)
            } catch (error) {
                console.log(error);
            }
        })        
        return products
    })

    console.log(res);
    console.log('data length', res.length);

    // // save data using file system
    // fs.writeFileSync('data_2.json', JSON.stringify(res, null, 2))
    // console.log('Save');

    await browser.close();


})()

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