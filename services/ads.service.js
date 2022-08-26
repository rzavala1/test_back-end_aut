const puppeteer = require('puppeteer');
const uuid = require('uuid');
const data = require("../data.json");

class AdsService {

  constructor() {

  }

  async createBrowser() {
    const width = 1024, height = 1600;
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width, height }
    });
    const page = await browser.newPage();
    await page.setViewport({ width, height });
    page.setUserAgent('UA-TEST');
    page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    return page;
  }

  async loginUser(page) {
    await page.goto('https://www.seminuevos.com/login', { 'waitUntil': 'networkidle2' });
    await page.type('#email_login', 'isc.rza@gmail.com');
    await page.type('#password_login', 'test_12345R');
    await page.click('.input__submit');
    await page.waitForTimeout(2000);
    await page.goto('https://www.seminuevos.com/wizard', { 'waitUntil': 'networkidle2' });
  }

  async createScreenshot(page) {
    await page.click('.nav > li:nth-child(3) > a');
    await page.waitForSelector('#aside', { display: true });
    await page.waitForTimeout(8000);
    await page.waitForSelector('#aside > .sidebar-content > .sidebar-my-vehicles > .sidebar-my-vehicles-antiscroll > .articles', { display: true });
    await page.click('#aside > .sidebar-content > .sidebar-my-vehicles > .sidebar-my-vehicles-antiscroll > .articles > div > .article:last-child');
    await page.waitForTimeout(4000);
    let nameImage = uuid.v1();
    await page.screenshot({
      path: "images/" + nameImage + '.png'
    });
    return nameImage;
  }


  async fillDataUser(page, body) {
    let i = 1;
    for (var obj in data) {
      await page.waitForTimeout(3000);
      if (i === 1) {
        await page.waitForSelector('.wizard-content > .container > .row > .col > .card:nth-child(1) > .card-content > .row > .col:nth-child(' + i + ') > .col > .latam-dropdown > .latam-dropdown-button', { display: true })
        await page.click('.wizard-content > .container > .row > .col > .card:nth-child(1) > .card-content > .row > .col:nth-child(' + i + ') > .col > .latam-dropdown > .latam-dropdown-button');
        await page.type('#' + obj + ' > .over-item-bg > .over-item > .search-input > input', data[obj]);
        await page.waitForSelector('#' + obj + ' > .over-item-bg > .over-item > ul > li > a', { display: true })
        await page.click('#' + obj + ' > .over-item-bg > .over-item > ul > li > a');
      }
      if (i > 1 && i < 8) {
        if (i === 7) {
          await page.waitForTimeout(5000);
        }
        await page.waitForSelector('.wizard-content > .container > .row > .col > .card:nth-child(1) > .card-content > .row > .col:nth-child(' + i + ') > .latam-dropdown > .latam-dropdown-button', { display: true });
        await page.click('.wizard-content > .container > .row > .col > .card:nth-child(1) > .card-content > .row > .col:nth-child(' + i + ') > .latam-dropdown > .latam-dropdown-button');
        await page.type('#' + obj + ' > .over-item-bg > .over-item > .search-input > input', data[obj]);

        await page.waitForSelector('#' + obj + ' > .over-item-bg > .over-item > ul > li:nth-child(1) > a', { display: true })
        await page.click('#' + obj + ' > .over-item-bg > .over-item > ul > li:nth-child(1) > a');

      } else if (i === 8) {
        await page.type('#' + obj, data[obj]);
      } else if (i === 9) {
        await page.waitForSelector('.wizard-content > .container > .row > .col > .card:nth-child(1) > .card-content > .row > .col:nth-child(' + (i - 1) + ') > .row > .col:nth-child(2) > .latam-dropdown > .latam-dropdown-button', { display: true });
        await page.click('.wizard-content > .container > .row > .col > .card:nth-child(1) > .card-content > .row > .col:nth-child(' + (i - 1) + ') > .row > .col:nth-child(2) > .latam-dropdown > .latam-dropdown-button');
        await page.type('#' + obj + ' > .over-item-bg > .over-item > .search-input > input', data[obj]);
        await page.waitForSelector('#' + obj + ' > .over-item-bg > .over-item > ul > li > a', { display: true });
        await page.waitForTimeout(1000);
        await page.click('#' + obj + ' > .over-item-bg > .over-item > ul > li > a');
      } else if (i === 10) {
        await page.type('#' + obj, body.price);
      } else if (i === 12) {
        await page.waitForTimeout('#' + obj, { display: true });
        await page.type('#' + obj, body.description);
      } else if (i === 11) {
        await page.click('.wizard-content > .container > .row > .col > .card:nth-child(2) > .card-content > .row > .col:nth-child(3) > .latam-dropdown > .latam-dropdown-button');
        await page.type('#' + obj + ' > .over-item-bg > .over-item > .search-input > input', data[obj]);
        await page.waitForSelector('#' + obj + ' > .over-item-bg > .over-item > ul > li > a', { display: true });
        await page.waitForTimeout(1000);
        await page.click('#' + obj + ' > .over-item-bg > .over-item > ul > li > a');
        await page.waitForSelector('.next-button', { display: true });
        await page.click('.next-button');
        await page.waitForSelector('#input_text_area_review', { display: true });
      } else if (i === 13) {
        const [fileChooser] = await Promise.all([
          page.waitForFileChooser(),
          page.click('#Uploader')
        ]);

        fileChooser.isMultiple();
        const arr = data[obj];
        let dirImages = [__dirname + "/" + arr[0], __dirname + "/" + arr[1], __dirname + "/" + arr[2]];
        await fileChooser.accept(dirImages);
      } else if (i === 14) {
        await page.waitForSelector('.footer-fixed > .wizard-footer > .footer-button > .next-button:nth-child(2)', { display: true });
        await page.click('.footer-fixed > .wizard-footer > .footer-button > .next-button:nth-child(2)');
        await page.waitForSelector('.plans-list > .Gold', { display: true });
      }
      i++;
    }
    return await this.createScreenshot(page);
  }

  async create(body) {
    const page = await this.createBrowser();
    try {
      await this.loginUser(page);
      let nameImage = await this.fillDataUser(page, body);
      return nameImage;
    } catch (e) {
      await page.screenshot({
        path: 'error.png'
      });
      console.info(e);
    }
    return false;
  }


}

module.exports = AdsService;
