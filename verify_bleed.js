const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 3000 });
    await page.goto('file:///Users/hajeera/Documents/portfolio%20copy/projects.html');
    
    // Expand all projects
    await page.evaluate(() => {
        document.querySelectorAll('.project-head-neutral').forEach(h => h.click());
    });
    
    await new Promise(r => setTimeout(r, 1000)); // Wait for animation
    await page.screenshot({ path: 'bleed_final_verify.png', fullPage: true });
    await browser.close();
})();
