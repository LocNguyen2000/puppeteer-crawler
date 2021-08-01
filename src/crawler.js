const puppeteer = require("puppeteer");


(async () => {
    var start = new Date().getTime();

    const urls = [
        "https://shopee.vn/vansvietnam",
        "https://shopee.vn/dbshop52d",
        "https://shp.ee/2rsmmbd",
        "https://shp.ee/rg8sh8h",
        "https://shopee.vn/naturerepublic_officialstore",
        "https://shopee.vn/giay.authentic",
        "https://shp.ee/3exttrz",
        "https://shopee.vn/caobacsilver",
        "https://shopee.vn/huyentrang8610?smtt=0.0.9",
        "https://shp.ee/522qqf5",
    ]

    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();

    page.setDefaultNavigationTimeout(0);

    for (url of urls) {
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

        console.log(spanHref)
    }

    await browser.close();
        
    var end = new Date().getTime();

    console.log("[Time run] ", (end-start)/1000, " seconds" );
})();
