"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const crawlee_1 = require("crawlee");
let scrapedText = [];
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 3000;
app.post("/scrape", async (req, res) => {
    const url = req.body.url;
    const result = await scraper(url);
    res.send(result);
});
app.get("/", (_, res) => {
    res.send("Hello World!");
});
app.listen(PORT, () => {
    console.log("Server is running on port 3000");
});
async function scraper(url) {
    const crawler = new crawlee_1.PlaywrightCrawler({
        launchContext: {
            launchOptions: {
                headless: true,
            },
        },
        maxRequestsPerCrawl: 20,
        // pushData, enqueueLinks
        async requestHandler({ request, page, log }) {
            log.info(`Processing ${request.url}...`);
            const data = await page.$$eval(".div_features_covered_main", async ($posts) => {
                const scrapedData = [];
                $posts.forEach(($post) => {
                    const titleElement = $post.querySelector(".span_feature_popup_heading");
                    const featureElement = $post.querySelector(".span_feature_popup_sub_heading");
                    const meaningfulData = {
                        title: titleElement.textContent || "",
                        description: featureElement.textContent || "",
                    };
                    scrapedData.push(meaningfulData);
                });
                return scrapedData;
            });
            // await pushData(data);
            scrapedText = data;
        },
        failedRequestHandler({ request, log }) {
            log.info(`Request ${request.url} failed too many times.`);
        },
    });
    await crawler.addRequests([url]);
    await crawler.run();
    //   console.log(scrapedText);
    console.log("Crawler finished.");
    return scrapedText;
}
// const url = `https://health.policybazaar.com/quotes?encenq=dE9wWVhIenlJVERSNHJFYUxNdmdnU0NKMGR0aDB0RFkvUk5TQTJMNkppRT0&enquiryid=NjUzMzMyNzU4&featurePlanId=80043&featureSumInsured=10000000&featureSupplierId=54&fpop=true&k=&new=1&pq=health0&profileid=129811548&utm_content=hp_signed_health_insurance_dom`;
// scraper(url);
//# sourceMappingURL=index.js.map