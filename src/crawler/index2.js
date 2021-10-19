const pptr = require('puppeteer');
const fs = require('fs')

const saveFile = async (data) => {
   let output = JSON.stringify(data, null, 2)
   const outputPath = `./selectors.json`
   console.log('Saving to file...');
   await fs.promises.writeFile(outputPath, output, 'utf-8')
}

// await page.exposeFunction('generateSelector', (context) => {
// })

(async () => {
   let selectorsData = []

   try {
      const browser = await pptr.launch({ headless: false });

      const page = await browser.newPage();
      await page.setViewport({
         width: 1560,
         height: 1000,
      })

      // add function in the page that will log
      await page.exposeFunction('reportEvent', info => {
         console.log(info)
         selectorsData.push(info)
      });

      // Hook document with capturing event listeners that capture selectors
      await page.evaluateOnNewDocument(() => {
         function generateSelector(context) {
            let pathSelector = []
                if (context == 'null') throw 'not an dom reference'
                while (context.tagName) {
                    // selector path
                    const className = context.className
                    const idName = context.id
                    const tagName = context.tagName

                    if (tagName === 'BODY') pathSelector.push('body')
                    else {
                        pathSelector.push(
                            tagName.toLowerCase() +
                            (className ? `.${className}` : '') +
                            (idName ? `#${idName}` : '')
                        )
                    }
                    context = context.parentNode
                }
                if (pathSelector.length > 3) {
                    pathSelector = pathSelector.slice(0, 3)
                }
                pathSelector.reverse()
                let result = pathSelector.join('>')
                return result
         }
         // load document
         document.addEventListener("DOMContentLoaded", () => {
            // let delay = 1000
            // let timer
            // // hover on element for 3s to generate selectors
            // document.body.addEventListener("mouseover", (e) => {
            //    timer = setInterval(() => {
            //       output = generateSelector(e.target);
            //       selectors.push({ "selector": output })
            //       reportEvent({ "selector": output });
            //    }, delay)
            // });
            // document.body.addEventListener("mouseout", (e) => {
            //    clearInterval(timer)
            // })
            document.body.addEventListener("click", (e) => {
               let output = generateSelector(e.target);
               reportEvent({ "selector": output });
            });
         });
      });
      await page.goto('https://tiki.vn/may-tinh-xach-tay-laptop-huawei-matebook-d15-8gb-256gb-share-man-hinh-huawei-fullview-huawei-phim-nguon-ket-hop-bao-mat-van-tay-hang-chinh-hang-p74556865.html');
      await page.waitForNavigation().then(async () => {
         await browser.close()
      }).catch(error => {
         console.log('Navigation done');
      })
   } catch (error) {
      console.log(error);
   } finally {
      await saveFile(selectorsData);
   }

})();