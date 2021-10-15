const pptr = require('puppeteer');
const fs = require('fs')

const saveFile =  async () => {
   let output = JSON.stringify(data, null, 2)
   const outputPath = `./output/selectors.json`

   await fs.promises.writeFile(outputPath, output, 'utf-8')
}

// await page.exposeFunction('generateSelector', (context) => {
//     let pathSelector;
//     if (context == "null") throw "not an dom reference";
//     while (context.tagName) {
//         // selector path
//         const className = context.className
//         const idName = context.id
//         pathSelector = context.localName +
//             (className ? `.${className}` : "") +
//             (idName ? `#${idName}` : "") +
//             (pathSelector ? ">" + pathSelector : "");

//         context = context.parentNode;
//     }
//     return pathSelector;
// })

// return data
// add close tab event

(async () => {
   const timeToLive = 30000

   const browser = await pptr.launch({ headless: false });

   const page = await browser.newPage();
   await page.setViewport({
      width: 1560,
      height: 1000,
   })

   // add function in the page that will log
   await page.exposeFunction('reportEvent', info => console.log(info));

   // Hook document with capturing event listeners that capture selectors
   const response = await page.evaluateOnNewDocument(() => {
      var output

      function generateSelector(context) {
         let pathSelector;
         if (context == "null") throw "not an dom reference";
         while (context.tagName) {
            // selector path
            const className = context.className
            const idName = context.id
            pathSelector = context.localName +
               (className ? `.${className}` : "") +
               (idName ? `#${idName}` : "") +
               (pathSelector ? ">" + pathSelector : "");
            context = context.parentNode;
         }
         return pathSelector;
      }
      // load document
      document.addEventListener("DOMContentLoaded", () => {
         let delay = 1000
         let timer
         
         // // hover on element for 3s to generate selectors
         // document.body.addEventListener("mouseover", (e) => {
         //    timer = setTimeout(() => {
         //       output = generateSelector(e.target);
         //       selectors.push({ "selector": output })
         //       reportEvent(output);
         //    }, delay)
         // });
         // document.body.addEventListener("mouseout", (e) => {
         //    clearTimeout(timer)
         // })

         document.body.addEventListener("click", (e) => {
            output = generateSelector(e.target);
            reportEvent({ "selector": output });
         });
      });
   });

   await page.goto('https://tiki.vn/laptop/c8095?page=1');

})();