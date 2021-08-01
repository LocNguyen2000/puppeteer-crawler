const fs = require("fs");
const stringify = require("csv-stringify");
const puppeteer = require("puppeteer");


(async () => {
    let inputPath = "../data/Shopee_HaNoi.csv";

    let startFrom = 4201
    let endAt = 4500

    const data = fs.readFileSync(inputPath, "utf8").split("\n");

    let urls = [];
    const shopUsername = [];
    
    urls = data;
    
    setTimeout(async () => {
        const browser = await puppeteer.launch({
            headless: false,
        });
        const page = await browser.newPage();

        page.setDefaultNavigationTimeout(0);

        for (let i = startFrom - 1; i < endAt; i++) {
            const url = urls[i];

            await page.goto(`${url}`, { waitUntil: "networkidle0" }).catch((error) => {
                console.log(error.message);
                return { url: "URL Error" };
            });

            await page.setViewport({
                width: 1560,
                height: 1000
            });

            const spanHref = await page.evaluate(() => {
                let selector_shop =
                    "#main > div > div._193wCc > div > div.shop-page > div > div.shop-page-menu > div > div > div > a.navbar-with-more-menu__item.navbar-with-more-menu__item--active";
                let selector_product =
                    "#main > div > div._193wCc > div.page-product > div.container > div._2G_fvP > div._34c6X6.page-product__shop > div._3-NiSV > div > div._3uf2ae";

                var html;
                if (document.querySelector(selector_shop) != null) {
                    html = document.querySelector(selector_shop).href;
                } else if (document.querySelector(selector_product) != null) {
                    html = document.querySelector(selector_product).innerHTML;
                } else {
                    html = url;
                }

                return { url: html };
            }).catch(error => {
                console.log(error.message);
                return { url: "" }
            });

            shopUsername.push(spanHref);

            console.log(spanHref);
            console.log(shopUsername.length);

            const fileOutputPath = `./ouput/data_user-${startFrom}-${endAt}.csv`

            stringify(shopUsername, { header: true }, (err, output) => {
                if (err) throw err;
                fs.writeFileSync( fileOutputPath, output, (err) => {
                    if (err) throw err;
                    console.log("data saved.");
                });
            });
        }

        await browser.close();
    }, 2000);
    console.log(shopUsername.length);
    console.log(shopUsername);
})();
