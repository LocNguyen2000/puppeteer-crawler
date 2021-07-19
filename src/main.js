const fs = require("fs");
const stringify = require("csv-stringify");
// const parse = require('csv-parse');
const puppeteer = require("puppeteer");

(async () => {
  let inputPath = "../data/data_urls.csv";

  let urls = [];
  const data = fs.readFileSync(inputPath, "utf8").split("\n");

  data.pop();
  data.shift();

  console.log(data[1250]);
  console.log(data[data.length - 1]);

  urls = data;
  const shopUsername = [];

  setTimeout(async () => {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();

    page.setDefaultNavigationTimeout(0);

    for (let i = 1290; i < urls.length; i++) {
      const url = urls[i];

      try {
        await page.goto(`${url}`, { waitUntil: "networkidle0" });
      } catch (error) {
        console.log(error.message);
        return { url: "URL Error" };
      }

      await page.setViewport({
        width: 1820,
        height: 1000,
      });
      const spanHref = await page.evaluate(() => {
        let selector_shop =
          "#main > div > div._193wCc > div > div.shop-page > div > div.shop-page-menu > div > div > div > a.navbar-with-more-menu__item.navbar-with-more-menu__item--active";
        let selector_product =
          "#main > div > div._193wCc > div.page-product > div.container > div._2G_fvP > div._34c6X6.page-product__shop > div._3-NiSV > div > div._3uf2ae";
        try {
          var html;
          if (document.querySelector(selector_shop) != null) {
            html = document.querySelector(selector_shop).href;
          } else {
            html = document.querySelector(selector_product).innerHTML;
          }
        } catch (error) {
          console.log(error);
        }
        if (html instanceof Error) {
          return { url: "URL Error" };
        }
        return { url: html };
      });

      shopUsername.push(spanHref);

      console.log(spanHref);
      console.log(shopUsername.length);

      stringify(shopUsername, { header: true }, (err, output) => {
        if (err) throw err;
        fs.writeFileSync("data_user.csv", output, (err) => {
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