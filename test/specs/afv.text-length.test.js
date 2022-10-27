const config = require('../../test-server.config.js');
const utils = require('../utils/utils.js');

beforeEach(async () => {
    await page.goto(config.testURL + '/text-length.html');
});

describe('Page title', () => {
    it('Title should be "Test Text Length"', async () => {
        await expect(page.title()).resolves.toMatch('Test Text Length');
    });
});

describe('Default message for empty text length', () => {
    it('should not raise a failure message', async () => {
        await Promise.all([
            page.waitForNavigation(), //form will be submitted, therefore we wait for the new form
            page.click('form input[type=submit]')
        ]);
    });
});

describe('Default message for correct min text length', () => {
    it('should not raise a failure message', async () => {
        await page.type('#min-text-length', "12345");
        await Promise.all([
            page.waitForNavigation(),//form will be submitted, therefore we wait for the new form
            page.click('form input[type=submit]')
        ]);
    });
});

describe('Custom message for correct min text length', () => {
    it('should not raise a failure message', async () => {
        await page.type('#min-text-length-custom', "12345");
        await Promise.all([
            page.waitForNavigation(),//form will be submitted, therefore we wait for the new form
            page.click('form input[type=submit]')
        ]);
    });
});

describe('Default message for correct max text length', () => {
    it('should not raise a failure message', async () => {
        await page.type('#max-text-length', "12345");
        await Promise.all([
            page.waitForNavigation(),//form will be submitted, therefore we wait for the new form
            page.click('form input[type=submit]')
        ]);
    });
});

describe('Custom message for correct max text length', () => {
    it('should not raise a failure message', async () => {
        await page.type('#max-text-length-custom', "12345");
        await Promise.all([
            page.waitForNavigation(),//form will be submitted, therefore we wait for the new form
            page.click('form input[type=submit]')
        ]);
    });
});

describe('wrong min text length', () => {
    it('should present validation message"', async () => {
        await page.type('#min-text-length', "123");
        await page.click('form input[type=submit]')
        let field = await page.$('#min-text-length');
        let message = await page.evaluate(() => AFV.getMessage('tooShort', '#min-text-length'));

        await utils.verifyMessageText(page, field, message);
    });

    it('should present validation message"', async () => {
        await page.type('#min-text-length', "1234");
        await page.click('form input[type=submit]')
        let field = await page.$('#min-text-length');
        let message = await page.evaluate(() => AFV.getMessage('tooShort', '#min-text-length'));

        await utils.verifyMessageText(page, field, message);
    });

    it('should have the correct element hierarchy', async () => {
        await page.type('#min-text-length', "123");
        await page.click('form input[type=submit]')
        let field = await page.$('#min-text-length');

        await utils.verifyMessageElementHierarchy(page, field);
        await utils.verifyDerivedMessage(page, field);
    });

    it('should have the focus', async () => {
        await page.type('#min-text-length', "123");
        await page.click('form input[type=submit]')
        let field = await page.$('#min-text-length');
        let focus = await page.$('input:focus');

        let fieldId = await page.evaluate(field => field.id, field);
        let focusId = await page.evaluate(focus => focus.id, focus);
        //the first errored field needs to have focus
        await expect(fieldId).toBeTruthy();
        await expect(fieldId).toBe(focusId);
    });
});

describe('wrong custom min text length', () => {
    it('should present validation message', async () => {
        await page.type('#min-text-length-custom', "123");
        await page.click('form input[type=submit]');
        let field = await page.$('#min-text-length-custom');
        let message = await page.evaluate(field => field.getAttribute('data-too-short'), field);
        let length = await page.evaluate(field => field.getAttribute('minlength'), field);
        message = message.replaceAll('{{constraint}}', length);
        
        await utils.verifyMessageText(page, field, message);
    });
    it('should present validation message', async () => {
        await page.type('#min-text-length-custom', "1234");
        await page.click('form input[type=submit]');
        let field = await page.$('#min-text-length-custom');
        let message = await page.evaluate(field => field.getAttribute('data-too-short'), field);
        let length = await page.evaluate(field => field.getAttribute('minlength'), field);
        message = message.replaceAll('{{constraint}}', length);

        await utils.verifyMessageText(page, field, message);
    });
    it('should have the correct element hierarchy', async () => {
        await page.type('#min-text-length-custom', "123");
        await page.click('form input[type=submit]')
        let field = await page.$('#min-text-length-custom');

        await utils.verifyMessageElementHierarchy(page, field);
        await utils.verifyDerivedMessage(page, field);
    });
    it('should have the focus', async () => {
        await page.type('#min-text-length', '12345');
        await page.type('#min-text-length-custom', "123");
        await page.click('form input[type=submit]')
        okField = await page.$('#min-text-length');
        await utils.verifyClearance(page, okField);

        let field = await page.$('#min-text-length-custom');
        let focus = await page.$('input:focus');

        let fieldId = await page.evaluate(field => field.id, field);
        let focusId = await page.evaluate(focus => focus.id, focus);
        //the first errored field (the second on the form) needs to have focus
        await expect(fieldId).toBeTruthy();
        await expect(fieldId).toBe(focusId);
    });
});


describe('wrong max text length', () => {
    it('should present validation message"', async () => {
        let field = await page.$('#max-text-length');
        //trick: type number allows to set a value that is too long
        await page.evaluate(field => field.setAttribute('type', 'number'), field);
        await page.type('#max-text-length', "1234567");
        //switch back to the correct type text
        await page.evaluate(field => field.setAttribute('type', 'text'), field);
        await page.click('form input[type=submit]');

        let message = await page.evaluate(() => AFV.getMessage('tooLong', '#max-text-length'));
        
        await utils.verifyMessageText(page, field, message);
    });

    it('should present validation message"', async () => {
        let field = await page.$('#max-text-length');
        //trick: type number allows to set a value that is too long
        await page.evaluate(field => field.setAttribute('type', 'number'), field);
        await page.type('#max-text-length', "123456");
        //switch back to the correct type text
        await page.evaluate(field => field.setAttribute('type', 'text'), field);
        await page.click('form input[type=submit]')

        let message = await page.evaluate(() => AFV.getMessage('tooLong', '#max-text-length'));

        await utils.verifyMessageText(page, field, message);
    });

    it('should have the correct element hierarchy', async () => {
        let field = await page.$('#max-text-length');
        //trick: type number allows to set a value that is too long
        await page.evaluate(field => field.setAttribute('type', 'number'), field);
        await page.type('#max-text-length', "1234567");
        //switch back to the correct type text
        await page.evaluate(field => field.setAttribute('type', 'text'), field);
        await page.click('form input[type=submit]')


        await utils.verifyMessageElementHierarchy(page, field);
        await utils.verifyDerivedMessage(page, field);
    });

    it('should have the focus', async () => {
        let field = await page.$('#max-text-length');
        //trick: type number allows to set a value that is too long
        await page.evaluate(field => field.setAttribute('type', 'number'), field);
        await page.type('#max-text-length', "1234567");
        //switch back to the correct type text
        await page.evaluate(field => field.setAttribute('type', 'text'), field);
        await page.click('form input[type=submit]')
        let focus = await page.$('input:focus');

        let fieldId = await page.evaluate(field => field.id, field);
        let focusId = await page.evaluate(focus => focus.id, focus);
        //the first errored field needs to have focus
        await expect(fieldId).toBeTruthy();
        await expect(fieldId).toBe(focusId);
    });
});


describe('wrong custom max text length', () => {
    it('should present validation message"', async () => {
        let field = await page.$('#max-text-length-custom');
        //trick: type number allows to set a value that is too long
        await page.evaluate(field => field.setAttribute('type', 'number'), field);
        await page.type('#max-text-length-custom', "1234567");
        //switch back to the correct type text
        await page.evaluate(field => field.setAttribute('type', 'text'), field);
        await page.click('form input[type=submit]');

        let message = await page.evaluate(field => field.getAttribute('data-too-long'), field);
        let length = await page.evaluate(field => field.getAttribute('maxlength'), field);
        message = message.replaceAll('{{constraint}}', length);

        await utils.verifyMessageText(page, field, message);
    });

    it('should present validation message"', async () => {
        let field = await page.$('#max-text-length-custom');
        //trick: type number allows to set a value that is too long
        await page.evaluate(field => field.setAttribute('type', 'number'), field);
        await page.type('#max-text-length-custom', "123456");
        //switch back to the correct type text
        await page.evaluate(field => field.setAttribute('type', 'text'), field);
        await page.click('form input[type=submit]')

        let message = await page.evaluate(field => field.getAttribute('data-too-long'), field);
        let length = await page.evaluate(field => field.getAttribute('maxlength'), field);
        message = message.replaceAll('{{constraint}}', length);

        await utils.verifyMessageText(page, field, message);
    });

    it('should have the correct element hierarchy', async () => {
        let field = await page.$('#max-text-length-custom');
        //trick: type number allows to set a value that is too long
        await page.evaluate(field => field.setAttribute('type', 'number'), field);
        await page.type('#max-text-length-custom', "1234567");
        //switch back to the correct type text
        await page.evaluate(field => field.setAttribute('type', 'text'), field);
        await page.click('form input[type=submit]')


        await utils.verifyMessageElementHierarchy(page, field);
        await utils.verifyDerivedMessage(page, field);
    });

    it('should have the focus', async () => {
        let field = await page.$('#max-text-length-custom');
        //trick: type number allows to set a value that is too long
        await page.evaluate(field => field.setAttribute('type', 'number'), field);
        await page.type('#max-text-length-custom', "1234567");
        //switch back to the correct type text
        await page.evaluate(field => field.setAttribute('type', 'text'), field);
        await page.click('form input[type=submit]')
        let focus = await page.$('input:focus');

        let fieldId = await page.evaluate(field => field.id, field);
        let focusId = await page.evaluate(focus => focus.id, focus);
        //the first errored field needs to have focus
        await expect(fieldId).toBeTruthy();
        await expect(fieldId).toBe(focusId);
    });
});

