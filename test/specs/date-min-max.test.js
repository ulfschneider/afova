const config = require('../../test-server.config.js');
const utils = require('../utils/utils.js');
const { format, subDays, addDays } = require('date-fns');

beforeEach(async () => {
    await page.goto(config.testURL + '/date-min-max.html');
});

describe('page title', () => {
    it('should be "Test Date Min Max"', async () => {
        let title = await page.title();
        expect(title).toMatch('Test Date Min Max');
    });
});

describe('empty date', () => {
    it('should not raise a failure message', async () => {
        await page.click('form input[type=submit]')
        let field = await page.$('#date-min-max');
        await utils.verifyClearance(page, field);
    });
});

describe('correct min date', () => {
    it('should not raise a failure message', async () => {
        let field = await page.$('#date-min-max');
        let min = await page.evaluate(field => field.getAttribute('min'), field);
        //set the value and do not use page.type because browsers have different ui´s for date
        await page.evaluate((field, min) => field.value = min, field, min);
        await page.click('form input[type=submit]')
        await utils.verifyClearance(page, field);
    });
});

describe('correct max date', () => {
    it('should not raise a failure message', async () => {
        let field = await page.$('#date-min-max');
        let max = await page.evaluate(field => field.getAttribute('max'), field);
        //set the value and do not use page.type because browsers have different ui´s for date
        await page.evaluate((field, max) => field.value = max, field, max);
        await page.click('form input[type=submit]')
        await utils.verifyClearance(page, field);
    });
});

describe('date too small', () => {
    it('should raise a failure message', async () => {
        let field = await page.$('#date-min-max');
        let min = await page.evaluate(field => field.getAttribute('min'), field);
        let minDate = new Date(min);
        let wrongMin = format(subDays(minDate, 1), 'yyyy-MM-dd'); //minus a day     
        //set the value and do not use page.type because browsers have different ui´s for date
        await page.evaluate((field, wrongMin) => field.value = wrongMin, field, wrongMin);
        await page.click('form input[type=submit]')
        let message = await page.evaluate(() => afova.getMessage('rangeUnderflow', '#date-min-max'));
        message = message.replaceAll('{{constraint}}', min);
        await utils.verifyMessageText(page, field, message);
        await utils.verifyMessageElementHierarchy(page, field);
        await utils.verifyDerivedMessage(page, field);
    });
});

describe('date too big', () => {
    it('should raise a failure message', async () => {
        let field = await page.$('#date-min-max');
        let max = await page.evaluate(field => field.getAttribute('max'), field);
        let maxDate = new Date(max);
        let wrongMax = format(addDays(maxDate, 1), 'yyyy-MM-dd'); //plus a day      
        //set the value and do not use page.type because browsers have different ui´s for date
        await page.evaluate((field, wrongMax) => field.value = wrongMax, field, wrongMax);
        await page.click('form input[type=submit]')
        let message = await page.evaluate(() => afova.getMessage('rangeOverflow', '#date-min-max'));
        message = message.replaceAll('{{constraint}}', max);
        await utils.verifyMessageText(page, field, message);
        await utils.verifyMessageElementHierarchy(page, field);
        await utils.verifyDerivedMessage(page, field);
    });
});


describe('not a date', () => {
    it('should not raise a failure message', async () => {
        let field = await page.$('#date-min-max');
        //set the value and do not use page.type because browsers have different ui´s for date
        //even if we set a totally wrong format, the browser will accept the value
        //see https://developer.mozilla.org/en-US/docs/Web/API/ValidityState/typeMismatch
        await page.evaluate(field => field.value = 'hello world', field);
        await page.click('form input[type=submit]')
        await utils.verifyClearance(page, field);
    });
});


describe('empty date', () => {
    it('should raise a failure message', async () => {
        let field = await page.$('#date-min-max-custom');
        await page.click('form input[type=submit]')
        let message = await page.evaluate(() => afova.getMessage('valueMissing', '#date-min-max-custom'));
        await utils.verifyMessageText(page, field, message);
        await utils.verifyMessageElementHierarchy(page, field);
    });
});

describe('correct min date', () => {
    it('should not raise a failure message', async () => {
        let hinderField = await page.$('#date-min-max'); //hinder the page from submitting
        let hinderMin = await page.evaluate(hinderField => hinderField.getAttribute('min'), hinderField);
        let hinderMinDate = new Date(hinderMin);
        let wrongMin = format(subDays(hinderMinDate, 1), 'yyyy-MM-dd'); //minus a day     
        //set the value and do not use page.type because browsers have different ui´s for date
        await page.evaluate((hinderField, wrongMin) => hinderField.value = wrongMin, hinderField, wrongMin);

        let field = await page.$('#date-min-max-custom');
        let min = await page.evaluate(field => field.getAttribute('min'), field);
        //set the value and do not use page.type because browsers have different ui´s for date
        await page.evaluate((field, min) => field.value = min, field, min);
        await page.click('form input[type=submit]')
        await utils.verifyClearance(page, field);
    });
});

describe('correct max date', () => {
    it('should not raise a failure message', async () => {
        let hinderField = await page.$('#date-min-max'); //hinder the page from submitting
        let hinderMin = await page.evaluate(hinderField => hinderField.getAttribute('min'), hinderField);
        let hinderMinDate = new Date(hinderMin);
        let wrongMin = format(subDays(hinderMinDate, 1), 'yyyy-MM-dd'); //minus a day     
        //set the value and do not use page.type because browsers have different ui´s for date
        await page.evaluate((hinderField, wrongMin) => hinderField.value = wrongMin, hinderField, wrongMin);

        let field = await page.$('#date-min-max-custom');
        let max = await page.evaluate(field => field.getAttribute('max'), field);
        //set the value and do not use page.type because browsers have different ui´s for date
        await page.evaluate((field, max) => field.value = max, field, max);
        await page.click('form input[type=submit]')
        await utils.verifyClearance(page, field);
    });
});

describe('date too small', () => {
    it('should raise a failure message', async () => {
        let field = await page.$('#date-min-max-custom');
        let min = await page.evaluate(field => field.getAttribute('min'), field);
        let minDate = new Date(min);
        let wrongMin = format(subDays(minDate, 1), 'yyyy-MM-dd'); //minus a day     
        //set the value and do not use page.type because browsers have different ui´s for date        
        await page.evaluate((field, wrongMin) => field.value = wrongMin, field, wrongMin);

        await page.click('form input[type=submit]')
        let message = await page.evaluate(field => field.getAttribute('data-range-underflow'), field);
        message = message.replaceAll('{{constraint}}', min);
        await utils.verifyMessageText(page, field, message);
        await utils.verifyMessageElementHierarchy(page, field);
    });
});

describe('date too big', () => {
    it('should raise a failure message', async () => {
        let field = await page.$('#date-min-max-custom');
        let max = await page.evaluate(field => field.getAttribute('max'), field);
        let maxDate = new Date(max);
        let wrongMax = format(addDays(maxDate, 1), 'yyyy-MM-dd'); //plus a day     
        //set the value and do not use page.type because browsers have different ui´s for date
        await page.evaluate((field, wrongMax) => field.value = wrongMax, field, wrongMax);
        await page.click('form input[type=submit]')
        let message = await page.evaluate(field => field.getAttribute('data-range-overflow'), field);
        message = message.replaceAll('{{constraint}}', max);
        await utils.verifyMessageText(page, field, message);
        await utils.verifyMessageElementHierarchy(page, field);
    });
});


describe('value missing', () => {
    it('should raise a failure message', async () => {
        field = await page.$('#date-min-max-custom');
        await page.click('form input[type=submit]');
        //this will raise data-value-missing error!
        let message = await page.evaluate(field => field.getAttribute('data-value-missing'), field);
        await utils.verifyMessageText(page, field, message);
        await utils.verifyMessageElementHierarchy(page, field);
    });
});





