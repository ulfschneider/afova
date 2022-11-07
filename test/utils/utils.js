
module.exports = {
    verifyMessageText: async function (page, field, messageText) {
        let fieldId = await page.evaluate(field => field.id, field);
        let message = await page.$(`#${fieldId}\\:afova .afova-message`);
        let text = await page.evaluate(message => message.innerHTML, message);
        expect(text).toBeTruthy();
        expect(text).toBe(messageText);
    },

    verifyMessageElementHierarchy: async function (page, field) {

        let fieldId = await page.evaluate(field => field.id, field);
        let messageContainer = await page.evaluateHandle(field => field.previousSibling, field);
        let containerId = await page.evaluate(messageContainer => messageContainer.id, messageContainer);
        let message = await page.$(`#${fieldId}\\:afova .afova-message`);
        let messageId = await page.evaluate(message => message.id, message);

        //field must have aria-invalid attribute set to true and aria-errormessage attribute container the id of the message container
        let ariaError = await page.evaluate(field => field.getAttribute('aria-errormessage'), field);
        let ariaInvalid = await page.evaluate(field => field.getAttribute('aria-invalid'), field);
        expect(ariaInvalid).toBe('true');
        expect(ariaError).toBeTruthy();
        expect(ariaError).toBe(containerId);

        let afvGroup = await page.evaluateHandle(field => field.closest('.afova-group'), field);
        let css = await page.evaluate(afvGroup => [...afvGroup.classList.values()], afvGroup);
        expect(css.includes('afova-group')).toBeTruthy();
        expect(css.includes('afova-active')).toBeTruthy();

        //message container must have css class afova-message-container
        css = await page.evaluate(messageContainer => [...messageContainer.classList.values()], messageContainer);
        expect(css).toContain('afova-message-container');

        //child and message should be the same
        let child = await page.evaluateHandle(messageContainer => messageContainer.firstChild, messageContainer);
        let childId = await page.evaluate(child => child.id, child);
        expect(childId).toBeTruthy();
        expect(childId).toBe(messageId);

        //field must have css classes afova-field and afova-active
        css = await page.evaluate(field => [...field.classList.values()], field);
        expect(css.includes('afova-field')).toBeTruthy();
        expect(css.includes('afova-active')).toBeTruthy();
    },

    verifyDerivedMessage: async function (page, field) {
        let fieldId = await page.evaluate(field => field.id, field);
        let message = await page.$(`#${fieldId}\\:afova .afova-message`);
        let css = await page.evaluate(message => [...message.classList.values()], message);
        expect(css.includes('afova-message')).toBeTruthy();
        expect(css.includes('derived')).toBeTruthy();
    },

    verifyInjectedMessage: async function (page, field) {
        let fieldId = await page.evaluate(field => field.id, field);
        let message = await page.$(`#${fieldId}\\:afova .afova-message`);
        let css = await page.evaluate(message => [...message.classList.values()], message);
        expect(css.inlcudes('afova-message')).toBeTruthy();
        expect(css.includes('injected')).toBeTruthy();
    },

    verifyClearance: async function (page, field) {
        let css = await page.evaluate(field => [...field.classList.values()], field);

        expect(css.includes('afova-field')).toBeTruthy();
        expect(css.includes('afova-active')).toBeFalsy();

        let ariaError = await page.evaluate(field => field.getAttribute('aria-errormessage'), field);
        let ariaInvalid = await page.evaluate(field => field.getAttribute('aria-invalid'), field);
        expect(ariaInvalid).toBeNull()
        expect(ariaError).toBeNull();

        let fieldId = await page.evaluate(field => field.id, field);
        let messageContainer = await page.$(`#${fieldId}\\:afova`);
        expect(messageContainer).toBeNull();

        let message = await page.$(`#${fieldId}\\:afova .afova-message`);
        expect(message).toBeNull();

        let afvGroup = await page.evaluateHandle(field => field.closest('.afova-group'), field);
        css = await page.evaluate(afvGroup => [...afvGroup.classList.values()], afvGroup);
        expect(css.includes('afova-group')).toBeTruthy();
        expect(css.includes('afova-active')).toBeFalsy();
    },

    preventFormSubmit: async function (page) {
        await page.evaluate(() => {
            let form = document.querySelector('form');
            form.addEventListener('submit', event => event.preventDefault())
        });
    }
}