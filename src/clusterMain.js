const { Cluster } = require('puppeteer-cluster');
const fs = require("fs");

(async () => {
    // variable for counting process run
    var start = new Date().getTime();

    let inputPath = "../data/Shopee_HaNoi.csv";

    let workers = 8
    let startFrom = 0
    let endAt = 200

    const data = fs.readFileSync(inputPath, "utf8").split("\n");

    // console.log(data.slice(startFrom, endAt).length);

    let urls = [];
    const shopUsername = [];
    
    urls = data.slice(startFrom, endAt);
    console.log("URLs: ", urls.length);        

    setTimeout(async () => {
        const cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_CONTEXT,
            maxConcurrency: workers,
            args: [
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                '--deterministic-fetch',
                '--disable-features=IsolateOrigins',
                '--disable-site-isolation-trials',
            ],
        });
    
        // Define a task
        await cluster.task(async ({ page, data: url }) => {
            page.setDefaultNavigationTimeout(0);
    
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
            console.log(spanHref);
            shopUsername.push(spanHref);
            console.log(shopUsername.length);
        });
    
        for (url of urls) {
            cluster.queue(url)
        }
    
        await cluster.idle();
        await cluster.close();

        // variable for counting process run
        var end = new Date().getTime();
        console.log("[Time run] ", (end - start) / 1000, " seconds");
        console.log("[Worker] ", workers);
        console.log("[Result] ", shopUsername.length);

    }, 1500)

})();
