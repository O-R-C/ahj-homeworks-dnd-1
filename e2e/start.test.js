import puppeteer from 'puppeteer'

jest.setTimeout(600000)

describe('test', () => {
  let browser
  let page

  beforeEach(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 300,
      devtools: true,
    })

    page = await browser.newPage()
    await page.goto('http://localhost:8080')
  })

  test('app should render on page', async () => {
    await page.waitForSelector('[class*="app"]')
  })

  afterEach(async () => {
    await browser.close()
  })
})
