const config = require('../../test-server.config.js');
const utils = require('../utils/utils.js');

beforeEach(async () => {
    await page.goto(config.testURL + '/text-pattern.html');
});

describe('Page title', () => {
    it('should be "Test Text Pattern"', async () => {
        await expect(page.title()).resolves.toMatch('Test Text Pattern');
    });
});

describe('empty text pattern', () => {
    it('should not raise a failure message', async () => {
        await Promise.all([
            page.waitForNavigation(), //form will be submitted, therefore we wait for the new form
            page.click('form input[type=submit]')
        ]);
    });
});

describe('correct text pattern', () => {
    it('should not raise a failure message', async () => {
        await page.type('#pattern-text-input', "AbC");
        await Promise.all([
            page.waitForNavigation(),//form will be submitted, therefore we wait for the new form
            page.click('form input[type=submit]')
        ]);
    });
});

describe('custom message for correct text pattern', () => {
    it('should not raise a failure message', async () => {
        await page.type('#pattern-text-input-custom', "AbC");
        await Promise.all([
            page.waitForNavigation(),//form will be submitted, therefore we wait for the new form
            page.click('form input[type=submit]')
        ]);
    });
});

describe('text pattern mismatch', () => {
    it('should present validation message"', async () => {
        await page.type('#pattern-text-input', "wrong pattern");
        await page.click('form input[type=submit]')        
        let field = await page.$('#pattern-text-input');
        let message = await page.evaluate(() => afova.getMessage('patternMismatch', '#pattern-text-input'));
        await utils.verifyMessageText(page, field, message);
        await utils.verifyMessageElementHierarchy(page, field);
        await utils.verifyDerivedMessage(page, field);
    });

    it('should have the focus', async () => {
        await page.type('#pattern-text-input', "wrong pattern");
        await page.click('form input[type=submit]')
        let field = await page.$('#pattern-text-input');
        let focus = await page.$('input:focus');

        let fieldId = await page.evaluate(field => field.id, field);
        let focusId = await page.evaluate(focus => focus.id, focus);
        //the first errored field needs to have focus
        await expect(fieldId).toBeTruthy();
        await expect(fieldId).toBe(focusId);
    });
});


describe('custom message for text pattern mismatch', () => {
    it('should present validation message', async () => {
        await page.type('#pattern-text-input-custom', "wrong pattern");
        await page.click('form input[type=submit]');
        let field = await page.$('#pattern-text-input-custom');
        let message = await page.evaluate(field => field.getAttribute('data-pattern-mismatch'), field);
        let pattern = await page.evaluate(field => field.getAttribute('pattern'), field);
        message = message.replaceAll('{{constraint}}', pattern);        
        await utils.verifyMessageText(page, field, message);
        await utils.verifyMessageElementHierarchy(page, field);
        await utils.verifyDerivedMessage(page, field);
    });

    it('should have the focus', async () => {
        await page.type('#pattern-text-input', 'AbC');
        await page.type('#pattern-text-input-custom', "wrong pattern");
        await page.click('form input[type=submit]')        
        okField = await page.$('#pattern-text-input');
        await utils.verifyClearance(page, okField);
        let field = await page.$('#pattern-text-input-custom');
        let focus = await page.$('input:focus');

        let fieldId = await page.evaluate(field => field.id, field);
        let focusId = await page.evaluate(focus => focus.id, focus);
        //the first errored field (the second on the form) needs to have focus
        await expect(fieldId).toBeTruthy();
        await expect(fieldId).toBe(focusId);
    });
});









