const config = require('../../test-server.config.js');
const utils = require('../utils/utils.js');

beforeEach(async () => {
    await page.goto(config.testURL + '/clear-form-and-inject.html');
});


describe('page title', () => {
    it('should be "Test Clear Form And Inject"', async () => {
        await expect(page.title()).resolves.toMatch('Test Clear Form And Inject');
    });
});

describe('missing text value', () => {
    it('should present validation message"', async () => {
        await page.click('form input[type=submit]')
        let field = await page.$('#required-text-input');
        let message = await page.evaluate(() => afova.getMessage('valueMissing', '#required-text-input'));
        await utils.verifyMessageText(page, field, message);
        await utils.verifyMessageElementHierarchy(page, field);
        await utils.verifyDerivedMessage(page, field);
    });

    it('should have the focus', async () => {
        await page.click('form input[type=submit]')
        let field = await page.$('#required-text-input');
        let focus = await page.$('input:focus');

        let fieldId = await page.evaluate(field => field.id, field);
        let focusId = await page.evaluate(focus => focus.id, focus);
        //the first errored field needs to have focus
        await expect(fieldId).toBeTruthy();
        await expect(fieldId).toBe(focusId);
    });

    it('should be cleared', async () => {
        await page.click('form input[type=submit]')
        let field = await page.$('#required-text-input');
        let message = await page.evaluate(() => afova.getMessage('valueMissing', '#required-text-input'));
        await utils.verifyMessageText(page, field, message);
        await utils.verifyMessageElementHierarchy(page, field);
        await utils.verifyDerivedMessage(page, field);
        await page.type('#required-text-input', 'hello world');
        await page.click('#clear-form')
        await utils.verifyClearance(page, field);
    });
});


describe('inject message', () => {
    it('should present validation message"', async () => {
        await page.click('form input[type=submit]')
        let field = await page.$('#required-text-input');
        let message = await page.evaluate(() => afova.getMessage('valueMissing', '#required-text-input'));
        await utils.verifyMessageText(page, field, message);
        await utils.verifyMessageElementHierarchy(page, field);
        await utils.verifyDerivedMessage(page, field);
    });

    it('should have the focus', async () => {
        await page.click('form input[type=submit]')
        let field = await page.$('#required-text-input');
        let focus = await page.$('input:focus');

        let fieldId = await page.evaluate(field => field.id, field);
        let focusId = await page.evaluate(focus => focus.id, focus);
        //the first errored field needs to have focus
        await expect(fieldId).toBeTruthy();
        await expect(fieldId).toBe(focusId);
    });

    it('should be cleared', async () => {
        await page.click('form input[type=submit]')
        let field = await page.$('#required-text-input');
        let message = await page.evaluate(() => afova.getMessage('valueMissing', '#required-text-input'));
        await utils.verifyMessageText(page, field, message);
        await utils.verifyMessageElementHierarchy(page, field);
        await utils.verifyDerivedMessage(page, field);
        await page.type('#required-text-input', 'hello world');
        await page.click('#clear-form')
        await utils.verifyClearance(page, field);
    });
});

describe('missing text value custom', () => {
    it('should present validation message"', async () => {
        await page.type('#required-text-input', 'hello world');
        await page.click('form input[type=submit]')
        let field = await page.$('#required-text-input-custom');
        let message = await page.evaluate(() => afova.getMessage('valueMissing', '#required-text-input-custom'));
        await utils.verifyMessageText(page, field, message);
        await utils.verifyMessageElementHierarchy(page, field);
        await utils.verifyDerivedMessage(page, field);
    });

    it('should have the focus', async () => {
        await page.type('#required-text-input', 'hello world');
        await page.click('form input[type=submit]')
        let field = await page.$('#required-text-input-custom');
        let focus = await page.$('input:focus');

        let fieldId = await page.evaluate(field => field.id, field);
        let focusId = await page.evaluate(focus => focus.id, focus);
        //the first errored field needs to have focus
        await expect(fieldId).toBeTruthy();
        await expect(fieldId).toBe(focusId);
    });

    it('should be cleared', async () => {
        await page.click('form input[type=submit]')
        let field = await page.$('#required-text-input-custom');
        let message = await page.evaluate(() => afova.getMessage('valueMissing', '#required-text-input-custom'));
        await utils.verifyMessageText(page, field, message);
        await utils.verifyMessageElementHierarchy(page, field);
        await utils.verifyDerivedMessage(page, field);
        await page.click('#clear-form')
        await utils.verifyClearance(page, field);
    });
});












