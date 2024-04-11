export class Viewer {
  elements: Readonly<Record<string, string>> = {
    appbarResourceNameSelector: '#app-top-bar-resource [data-test-resource-name="%s"]',
    appTopBar: '.oc-app-top-bar .oc-resource',
    appTopBarResourceBasename: '.oc-resource-basename',
    appTopBarResourceExtension: '.oc-resource-extension',
    modelViewport: '#preview .model-viewport',
    modelViewportWrapper: '#preview #scene-wrapper',
    modelViewportWrapperFullscreen: '#scene-wrapper:fullscreen',
    modelViewportDescription: '#preview h1.oc-invisible-sr', // 'oc-hidden-announcer',
    modelViewportCanvas: '#preview .model-viewport canvas',
    controlButtonPrev: '.preview-controls-previous',
    controlButtonNext: '.preview-controls-next',
    controlButtonFullscreen: '.preview-controls-fullscreen',
    controlButtonReset: '.preview-controls-reset'
  }

  async getViewportDescription(): Promise<string> {
    return await global.page.locator(this.elements.modelViewportDescription).innerText()
  }

  async getTopbarResourceName(): Promise<string> {
    const topbarResourceBasename = await global.page
      .locator(this.elements.appTopBarResourceBasename)
      .innerText()
    const topbarResourceExtension = await global.page
      .locator(this.elements.appTopBarResourceExtension)
      .innerText()
    return topbarResourceBasename + topbarResourceExtension
  }

  async getViewportWrapperSize(): Promise<[string, string]> {
    const element = await global.page.waitForSelector(this.elements.modelViewportWrapper)
    const viewportHeight = await element.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('height')
    })
    const viewportWidth = await element.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('width')
    })
    // slice removes 'px' at the end of value
    return [viewportHeight.slice(0, -2), viewportWidth.slice(0, -2)]
  }

  async getWindowInnerSize(): Promise<[string, string]> {
    const windowInnerHeight = await global.page.evaluate(() => window.innerHeight)
    const windowInnerWidth = await global.page.evaluate(() => window.innerWidth)
    return [windowInnerHeight.toString(), windowInnerWidth.toString()]
  }

  async toggleFullscreenMode(): Promise<void> {
    await global.page.locator(this.elements.controlButtonFullscreen).click()
  }

  async resetViewport(): Promise<void> {
    await global.page.locator(this.elements.controlButtonReset).click()
  }

  async displayNextModel(): Promise<void> {
    await global.page.locator(this.elements.controlButtonNext).click()
  }

  async displayPreviousModel(): Promise<void> {
    await global.page.locator(this.elements.controlButtonPrev).click()
  }

  async modifyModelRotation(): Promise<void> {
    await global.page.locator(this.elements.modelViewportCanvas).focus()

    // defining some values for mouse movement that will certainly be within viewport
    const viewportBoundingBox = await global.page
      .locator(this.elements.modelViewportCanvas)
      .boundingBox()
    const spacing = 180
    const xMouseStartCoordinate = viewportBoundingBox.x + spacing
    const xMouseEndCoordinate = viewportBoundingBox.x + viewportBoundingBox.width - 2 * spacing
    const yMouseCoordinate = viewportBoundingBox.y + viewportBoundingBox.height / 2

    await global.page.mouse.move(xMouseStartCoordinate, yMouseCoordinate)
    await global.page.mouse.down()
    await global.page.mouse.move(xMouseEndCoordinate, yMouseCoordinate)
    await global.page.mouse.up()
  }

  async modifyModelZoom(): Promise<void> {
    // to be implemented
    // modify camera.position.z with random value
    await global.page.locator(this.elements.modelViewportCanvas).mouse.wheel()
  }

  async modifyModel(): Promise<void> {
    // select viewport
    // locator.focus()	Focus the element
    // move or wheel mouse interaction
    // await global.page.locator(this.elements.??).mouse.move()
    // mousewheel?
    // https://www.lambdatest.com/automation-testing-advisor/javascript/playwright-internal-mouseWheel
    /*
        https://playwright.dev/python/docs/api/class-mouse
        mouse.wheel(delta_x, delta_y)
        - delta_x (float#): Pixels to scroll horizontally
        - delta_y (float#): Pixels to scroll vertically

        await global.page.locator(this.elements.??).mouse.wheel()
        */
    /*
        https://webscraping.ai/faq/playwright/how-to-handle-mouse-actions-using-playwright
        await global.page.locator().mouse.move(startX, startY)
        await global.page.mouse.down()
        await global.page.mouse.move(endX, endY)
        await global.page.mouse.up()
        */
    /*
        https://playwright.dev/docs/input#mouse-click
        await page.locator('#item-to-be-dragged').hover();
        await page.mouse.down();
        await page.locator('#item-to-drop-at').hover();
        await page.mouse.up();
        */
  }

  // helper function (so far not used)
  async getComputedStyleForSelector(selector: string, cssAttribute: string): Promise<string> {
    const element = await global.page.waitForSelector(selector)
    const value = await element.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue(cssAttribute)
    })
    return value // return value is Promise object
  }
}
