const config = require('../../test-server.config.js');
const utils = require('../utils/utils.js');
require('../../js/afv.js'); //will provice the global AFV object


beforeEach(async () => {
    await page.goto(config.testURL + '/missing-text-value.html');
});


describe('page title', () => {
    it('title should be "Test Missing Value"', async () => {
        await expect(page.title()).resolves.toMatch('Test Missing Value');
    });
});

describe('default message for provided text value', () => {
    it('should not raise a failure message', async () => {
        await page.type('#required-text-input', 'hello world');
        await page.click('form input[type=submit]');
        let field = await page.$('#required-text-input');
        await utils.verifyClearance(page, field);
    });
});

describe('Custom message for provided text value', () => {
    it('should not raise a failure message', async () => {
        await page.type('#required-text-input-custom', 'hello world');
        await page.click('form input[type=submit]')
        let field = await page.$('#required-text-input-custom');
        await utils.verifyClearance(page, field);
    });
});

describe('test missing text value', () => {
    it('should present validation message"', async () => {
        await page.click('form input[type=submit]')
        let field = await page.$('#required-text-input');

        await utils.verifyMessageText(page, field, AFV.getDefaultMessage('valueMissing'));
    });

    it('should have the correct element hierarchy', async () => {
        await page.click('form input[type=submit]')
        let field = await page.$('#required-text-input');

        await utils.verifyMessageElementHierarchy(page, field);
        await utils.verifyDerivedMessage(page, field);
    });
});

describe('test custom message for missing text value', () => {
    it('sshould present validation message', async () => {
        await page.click('form input[type=submit]');
        let field = await page.$('#required-text-input-custom');
        let text = await page.evaluate(field => field.getAttribute('data-value-missing'), field);
        await expect(text).toBeTruthy();
        await utils.verifyMessageText(page, field, text);
    });
    it('should have the correct element hierarchy', async () => {
        await page.click('form input[type=submit]')
        let field = await page.$('#required-text-input-custom');

        await utils.verifyMessageElementHierarchy(page, field);
        await utils.verifyDerivedMessage(page, field);
    });
});











