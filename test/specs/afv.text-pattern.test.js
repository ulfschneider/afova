const config = require('../../test-server.config.js');

beforeEach(async () => {
    await page.goto(config.testURL + '/text-pattern.html');
});

describe('Page title', () => {
    it('Title should be "Test Text pattern"', async () => {
        await expect(page.title()).resolves.toMatch('Test Text Pattern');
    });
});

describe('Default message for empty text pattern', () => {
    it('should not raise a failure message', async () => {
        await Promise.all([
            page.waitForNavigation(), //form will be submitted, therefore we wait for the new form
            page.click('form input[type=submit]')
        ]);
    });
});

describe('Custom message for empty text pattern', () => {
    it('should not raise a failure message', async () => {
        await Promise.all([
            page.waitForNavigation(), //form will be submitted, therefore we wait for the new form
            page.click('form input[type=submit]')
        ]);
    });
});

describe('Default message for correct text pattern', () => {
    it('should not raise a failure message', async () => {
        await page.type('#patternTextInput', "AbC");
        await Promise.all([
            page.waitForNavigation(),//form will be submitted, therefore we wait for the new form
            page.click('form input[type=submit]')
        ]);
    });
});

describe('Custom message for correct text pattern', () => {
    it('should not raise a failure message', async () => {
        await page.type('#patternCustomTextInput', "AbC");
        await Promise.all([
            page.waitForNavigation(),//form will be submitted, therefore we wait for the new form
            page.click('form input[type=submit]')
        ]);
    });
});

describe('Default message for invalid text pattern', () => {
    it('should say "The value does not match the required pattern of [A-Za-z]{3}"', async () => {
        await page.type('#patternTextInput', "AbCC");
        await page.click('form input[type=submit]')
        let element = await page.$('#patternTextInput\\:afv-error .afv-message');
        let text = await page.evaluate(element => element.innerHTML, element);
        await expect(text).toBe('The value does not match the required pattern of [A-Za-z]{3}');
    });
});


describe('Custom message for invalid text pattern', () => {
    it('should say "The value is not in the correct format. Correct formats are AbC or xyz for example."', async () => {
        await page.type('#patternCustomTextInput', "AbCC");
        await page.click('form input[type=submit]')
        let element = await page.$('#patternCustomTextInput\\:afv-error .afv-message');
        let text = await page.evaluate(element => element.innerHTML, element);
        await expect(text).toBe('The value is not in the correct format. Correct formats are AbC or xyz for example.');
    });
});











