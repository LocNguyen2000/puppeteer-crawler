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
        "https://shp.ee/b6m4f6j",
        "https://shopee.vn/thoitrangtheone",
        "https://shopee.vn/minhnguyet997?smtt=0.0.9",
        "https://shopee.vn/product/37765734/3049279473?smtt=0.37767119-1622516940.9",
        "https://shopee.vn/product/37765734/2408929818?smtt=0.37767119-1622516978.9",
        "https://shopee.vn/product/37765734/4239764607?smtt=0.37767119-1622517027.9",
        "https://shopee.vn/shop/20777662/",
        "https://shopee.vn/gundamviet",
        "https://shp.ee/ucez4te",
        "https://shp.ee/jwu7dw9"
    ]

    const browser = await puppeteer.launch({
        headless: true,
    });
    const page = await browser.newPage();

    page.setDefaultNavigationTimeout(0);

    for (url of urls) {
        await page.goto(`${url}`, { waitUntil: "networkidle0" }).catch((error) => {
            console.log(error.message);
            return { url: "URL Error" };
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

    console.log("[Time run] ", (end - start) / 1000, " seconds");
})();
