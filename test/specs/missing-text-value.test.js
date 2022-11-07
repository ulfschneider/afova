const config = require('../../test-server.config.js');
const utils = require('../utils/utils.js');

beforeEach(async () => {
    await page.goto(config.testURL + '/missing-text-value.html');
});

//check validate on change

describe('page title', () => {
    it('should be "Test Missing Value"', async () => {
        let title = await page.title();
        expect(title).toMatch('Test Missing Value');
    });
});

describe('provided text value', () => {
    it('should not raise a failure message', async () => {
        await page.type('#required-text-input', 'hello world');
        await page.click('form input[type=submit]');
        let field = await page.$('#required-text-input');
        await utils.verifyClearance(page, field);
    });
});

describe('custom message for provided text value', () => {
    it('should not raise a failure message', async () => {
        await page.type('#required-text-input-custom', 'hello world');
        await page.click('form input[type=submit]')
        let field = await page.$('#required-text-input-custom');
        await utils.verifyClearance(page, field);
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
        expect(fieldId).toBeTruthy();
        expect(fieldId).toBe(focusId);
    });
});

describe('custom message for missing text value', () => {
    it('should present validation message', async () => {
        await page.type('#required-text-input', 'hello world');
        await page.click('form input[type=submit]');
        let field = await page.$('#required-text-input-custom');
        let message = await page.evaluate(field => field.getAttribute('data-value-missing'), field);
        expect(message).toBeTruthy();
        await utils.verifyMessageText(page, field, message);
        await utils.verifyMessageElementHierarchy(page, field);
        await utils.verifyDerivedMessage(page, field);
    });
    it('should have the focus', async () => {
        await page.type('#required-text-input', 'hello world');
        okField = await page.$('#required-text-input');
        await utils.verifyClearance(page, okField);

        await page.click('form input[type=submit]')
        let field = await page.$('#required-text-input-custom');
        let focus = await page.$('input:focus');

        let fieldId = await page.evaluate(field => field.id, field);
        let focusId = await page.evaluate(focus => focus.id, focus);
        //the first errored field (the second on the form) needs to have focus
        expect(fieldId).toBeTruthy();
        expect(fieldId).toBe(focusId);
    });
});











