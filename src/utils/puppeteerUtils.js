const puppeteer = require('puppeteer');
const path = require('path');
const resultDir = path.join(__dirname, '..', 'ScreenShots');

async function analyzeYoutubeVideo(url) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    let screenShot = '';
    let title = '';

    try{    
        const { nanoid } = await import('nanoid');
        //Wait for the page load
        await page.goto(url, { waitUntil: 'networkidle2' });
        //Wait for video element to present
        await page.waitForSelector('video', { timeout: 10000 });

        title = await page.title();
        const videoId = nanoid(10);
        const screenShotFileName = `${videoId}-${title}-screenshot.jpg`;
        screenShot = path.join(resultDir, screenShotFileName);

        await page.screenshot({ path: screenShot, type: 'jpeg' });
        console.log('Screenshot save at: ' + screenShot);
        await browser.close();
        return {videoId, title, screenShot, screenShotUrl: `/ScreenShots/${screenShotFileName}`};
    }catch(e){
        console.error('Error:', e);
    }
}

module.exports = analyzeYoutubeVideo;