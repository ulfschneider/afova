const config = require('../../test-server.config.js');
const utils = require('../utils/utils.js');

beforeEach(async () => {
    await page.goto(config.testURL + '/number-min-max.html');
});

describe('page title', () => {
    it('should be "Test Number Min Max"', async () => {
        await expect(page.title()).resolves.toMatch('Test Number Min Max');
    });
});

describe('empty number', () => {
    it('should not raise a failure message', async () => {
        await page.click('form input[type=submit]')
        let field = await page.$('#number-min-max');
        await utils.verifyClearance(page, field);
    });
});

describe('correct min number', () => {
    it('should not raise a failure message', async () => {
        let field = await page.$('#number-min-max');
        let min = await page.evaluate(field => field.getAttribute('min'), field);
        await page.type('#number-min-max', min);
        await page.click('form input[type=submit]')
        await utils.verifyClearance(page, field);
    });
});

describe('correct max number', () => {
    it('should not raise a failure message', async () => {
        let field = await page.$('#number-min-max');
        let max = await page.evaluate(field => field.getAttribute('max'), field);
        await page.type('#number-min-max', max);
        await page.click('form input[type=submit]')
        await utils.verifyClearance(page, field);
    });
});

describe('number too small', () => {
    it('should raise a failure message', async () => {
        let field = await page.$('#number-min-max');
        let min = await page.evaluate(field => field.getAttribute('min'), field);
        let wrongMin = (parseInt(min) - 1).toString();
        await page.type('#number-min-max', wrongMin);
        await page.click('form input[type=submit]')
        let message = await page.evaluate(() => afova.getMessage('rangeUnderflow', '#number-min-max'));
        message = message.replaceAll('{{constraint}}', min);
        await utils.verifyMessageText(page, field, message);
        await utils.verifyMessageElementHierarchy(page, field);
        await utils.verifyDerivedMessage(page, field);
    });
});

describe('number too big', () => {
    it('should raise a failure message', async () => {
        let field = await page.$('#number-min-max');
        let max = await page.evaluate(field => field.getAttribute('max'), field);
        let wrongMax = (parseInt(max) + 1).toString();
        await page.type('#number-min-max', wrongMax);
        await page.click('form input[type=submit]')
        let message = await page.evaluate(() => afova.getMessage('rangeOverflow', '#number-min-max'));
        message = message.replaceAll('{{constraint}}', max);
        await utils.verifyMessageText(page, field, message);
        await utils.verifyMessageElementHierarchy(page, field);
        await utils.verifyDerivedMessage(page, field);
    });
});


describe('number wrong step', () => {
    it('should raise a failure message', async () => {
        let field = await page.$('#number-min-max');
        let max = await page.evaluate(field => field.getAttribute('max'), field);
        let wrongMax = (parseInt(max) - .5).toString();
        await page.type('#number-min-max', wrongMax);
        await page.click('form input[type=submit]')
        let message = await page.evaluate(() => afova.getMessage('stepMismatch', '#number-min-max'));
        let step = await page.evaluate(field => field.getAttribute('step'), field);
        message = message.replaceAll('{{constraint}}', step);
        await utils.verifyMessageText(page, field, message);
        await utils.verifyMessageElementHierarchy(page, field);
        await utils.verifyDerivedMessage(page, field);
    });
});

describe('not a number', () => {
    it('should raise a failure message', async () => {
        let field = await page.$('#number-min-max');
        await page.type('#number-min-max', 'hello world');
        await page.click('form input[type=submit]')
        let message = await page.evaluate(() => afova.getMessage('badInput', '#number-min-max'));
        await utils.verifyMessageText(page, field, message);
        await utils.verifyMessageElementHierarchy(page, field);
        await utils.verifyDerivedMessage(page, field);
    });
});

describe('number wrong step', () => {
    it('should have the focus', async () => {
        let field = await page.$('#number-min-max');
        let min = await page.evaluate(field => field.getAttribute('min'), field);
        let wrongMin = (parseInt(min) + .5).toString();
        await page.type('#number-min-max', wrongMin);
        await page.click('form input[type=submit]')
        let focus = await page.$('input:focus');

        let fieldId = await page.evaluate(field => field.id, field);
        let focusId = await page.evaluate(focus => focus.id, focus);
        //the first errored field (the second on the form) needs to have focus
        await expect(fieldId).toBeTruthy();
        await expect(fieldId).toBe(focusId);
    });

});


describe('empty number', () => {
    it('should raise a failure message', async () => {
        let field = await page.$('#number-min-max-custom');
        await page.click('form input[type=submit]')
        let message = await page.evaluate(() => afova.getMessage('valueMissing', '#number-min-max-custom'));
        await utils.verifyMessageText(page, field, message);
        await utils.verifyMessageElementHierarchy(page, field);
    });
});

describe('correct min number', () => {
    it('should not raise a failure message', async () => {
        await page.type('#number-min-max', 'hello world'); //hinder the form from submitting
        let field = await page.$('#number-min-max-custom');
        let min = await page.evaluate(field => field.getAttribute('min'), field);
        await page.type('#number-min-max-custom', min);
        await page.click('form input[type=submit]')
        await utils.verifyClearance(page, field);
    });
});

describe('correct max number', () => {
    it('should not raise a failure message', async () => {
        await page.type('#number-min-max', 'hello world'); //hinder the form from submitting
        let field = await page.$('#number-min-max-custom');
        let max = await page.evaluate(field => field.getAttribute('max'), field);
        await page.type('#number-min-max-custom', max);
        await page.click('form input[type=submit]')
        await utils.verifyClearance(page, field);
    });
});

describe('number too small', () => {
    it('should raise a failure message', async () => {
        field = await page.$('#number-min-max-custom');
        let min = await page.evaluate(field => field.getAttribute('min'), field);
        let wrongMin = (parseInt(min) - 1).toString();
        await page.type('#number-min-max-custom', wrongMin);
        await page.click('form input[type=submit]')
        let message = await page.evaluate(field => field.getAttribute('data-range-underflow'), field);
        message = message.replaceAll('{{constraint}}', min);
        await utils.verifyMessageText(page, field, message);
        await utils.verifyMessageElementHierarchy(page, field);
    });
});

describe('number too big', () => {
    it('should raise a failure message', async () => {
        field = await page.$('#number-min-max-custom');
        let max = await page.evaluate(field => field.getAttribute('max'), field);
        let wrongMax = (parseInt(max) + 1).toString();
        await page.type('#number-min-max-custom', wrongMax);
        await page.click('form input[type=submit]')
        let message = await page.evaluate(field => field.getAttribute('data-range-overflow'), field);
        message = message.replaceAll('{{constraint}}', max);
        await utils.verifyMessageText(page, field, message);
        await utils.verifyMessageElementHierarchy(page, field);
    });
});


describe('number wrong step', () => {
    it('should raise a failure message', async () => {
        field = await page.$('#number-min-max-custom');
        let max = await page.evaluate(field => field.getAttribute('max'), field);
        let wrongMax = (parseInt(max) - .5).toString();
        await page.type('#number-min-max-custom', wrongMax);
        await page.click('form input[type=submit]')
        let message = await page.evaluate(field => field.getAttribute('data-step-mismatch'), field);
        let step = await page.evaluate(field => field.getAttribute('step'), field);
        message = message.replaceAll('{{constraint}}', step);
        await utils.verifyMessageText(page, field, message);
        await utils.verifyMessageElementHierarchy(page, field);
    });
});

describe('not a number', () => {
    it('should raise a failure message', async () => {
        field = await page.$('#number-min-max-custom');
        await page.type('#number-min-max-custom', 'hello world');
        await page.click('form input[type=submit]');
        //this will raise data-value-missing error!
        let message = await page.evaluate(field => field.getAttribute('data-value-missing'), field);
        await utils.verifyMessageText(page, field, message);
        await utils.verifyMessageElementHierarchy(page, field);
    });
});

describe('number wrong step', () => {
    it('should have the focus', async () => {
        let field = await page.$('#number-min-max-custom');
        let min = await page.evaluate(field => field.getAttribute('min'), field);
        let wrongMin = (parseInt(min) + .5).toString();
        await page.type('#number-min-max-custom', wrongMin);
        await page.click('form input[type=submit]')
        let focus = await page.$('input:focus');

        let fieldId = await page.evaluate(field => field.id, field);
        let focusId = await page.evaluate(focus => focus.id, focus);
        //the first errored field (the second on the form) needs to have focus
        await expect(fieldId).toBeTruthy();
        await expect(fieldId).toBe(focusId);
    });

});



