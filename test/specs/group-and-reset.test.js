const config = require('../../test-server.config.js');
const utils = require('../utils/utils.js');

beforeEach(async () => {
    await page.goto(config.testURL + '/group-and-reset.html');
});


describe('page title', () => {
    it('should be "Test Group And Reset"', async () => {
        let title = await page.title();
        expect(title).toMatch('Test Group And Reset');
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


describe('provided text value grouped', () => {
    it('should not raise a failure message', async () => {
        await page.type('#required-text-input-grouped', 'hello world');
        await page.click('form input[type=submit]')
        let field = await page.$('#required-text-input-grouped');
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

    it('should be cleared', async () => {
        await page.click('form input[type=submit]')
        let field = await page.$('#required-text-input');
        let message = await page.evaluate(() => afova.getMessage('valueMissing', '#required-text-input'));
        await utils.verifyMessageText(page, field, message);
        await utils.verifyMessageElementHierarchy(page, field);
        await utils.verifyDerivedMessage(page, field);
        await page.type('#required-text-input', 'hello world');
        await page.click('form input[type=submit]')
        await utils.verifyClearance(page, field);
    });
});

describe('missing text value grouped', () => {
    it('should present validation message"', async () => {
        await page.type('#required-text-input', 'hello world');
        await page.click('form input[type=submit]')
        let field = await page.$('#required-text-input-grouped');
        let message = await page.evaluate(() => afova.getMessage('valueMissing', '#required-text-input-grouped'));
        await utils.verifyMessageText(page, field, message);
        await utils.verifyMessageElementHierarchy(page, field);
        await utils.verifyDerivedMessage(page, field);
    });

    it('should have the focus', async () => {
        await page.type('#required-text-input', 'hello world');
        await page.click('form input[type=submit]')
        let field = await page.$('#required-text-input-grouped');
        let focus = await page.$('input:focus');

        let fieldId = await page.evaluate(field => field.id, field);
        let focusId = await page.evaluate(focus => focus.id, focus);
        //the first errored field needs to have focus
        expect(fieldId).toBeTruthy();
        expect(fieldId).toBe(focusId);
    });

    it('should be cleared', async () => {
        await page.click('form input[type=submit]')
        let field = await page.$('#required-text-input-grouped');
        let message = await page.evaluate(() => afova.getMessage('valueMissing', '#required-text-input-grouped'));
        await utils.verifyMessageText(page, field, message);
        await utils.verifyMessageElementHierarchy(page, field);
        await utils.verifyDerivedMessage(page, field);
        await page.type('#required-text-input-grouped', 'hello world');
        await page.click('form input[type=submit]')
        await utils.verifyClearance(page, field);
    });
});












