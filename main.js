const { app, BrowserWindow } = require('electron')

const { Builder, By } = require('selenium-webdriver')

const path = require('path')

const chromedriver = require('chromedriver').path

const isPackaged = app.isPackaged

const driverPath = isPackaged

? path.join(process.resourcesPath, 'app.asar.unpacked', 'node_modules', 'chromedriver', 'lib', 'chromedriver', 'chromedriver')
  : chromedriver.path;

app.whenReady().then(() => {
  createWindow()
})

function createWindow() {

  const win = new BrowserWindow({
      fullscreen: true,
      webPreferences: {
        nodeIntegration:true,
        contextIsolation: false,
      }
    }
  )

  win.loadFile('index.html')

  selenium()
    
  async function getlistItems(driver, list) {
    return await list.findElements(By.css('li'))
  }

  async function getItemContext(item) {
    return await item.getText()
  }

  function listsAreEqual(list1, list2){
    if(list1.length !== list2.length){
      return false
    }

    for(let i = 0; i < list1.length; i++){
      if(list1[i] !== list2[i]){
        return false
      }
    }

    return true
  }

  async function selenium() {

    const chrome = require('selenium-webdriver/chrome')

    const chromeOptions = new chrome.Options()

    chromeOptions.addArguments('--incognito')

    const driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).setChromeService(new chrome.ServiceBuilder(driverPath)).build()

    driver.get('url')

    let list = await driver.findElement(By.id('__jsview1--listItems-listUl'))

    let previousList = await getlistItems(driver, list)
    let itemsList = await Promise.all(previousList.map(getItemContext))

    win.webContents.send("send_data", itemsList)

    let counterREMOVELATER = 0

    while(true) {

      await driver.sleep(5000)

      const refresh = await driver.findElement(By.id('__jsview1--butRefresh-img'))

      refresh.click()

      const currentListItems = await getlistItems(driver, list)
      const currentListConents = await Promise.all(currentListItems.map(getItemContext))

      if(!listsAreEqual(currentListConents, itemsList)) {

        console.log('List Changed')

        win.webContents.send("refresh_data", currentListConents)

        itemsList = currentListConents
      }
      else {

        console.log("ingen endring: ", counterREMOVELATER)
      }

      counterREMOVELATER++

    }
  }
}
