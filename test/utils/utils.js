
module.exports = {
    verifyMessageText: async function (page, field, messageText) {
        let fieldId = await page.evaluate(field => field.id, field);
        let message = await page.$(`#${fieldId}\\:afv .afv-message`);
        let text = await page.evaluate(message => message.innerHTML, message);
        await expect(text).toBeTruthy();
        await expect(text).toBe(messageText);
    },

    verifyMessageElementHierarchy: async function (page, field) {

        let fieldId = await page.evaluate(field => field.id, field);
        let messageContainer = await page.evaluateHandle(field => field.previousSibling, field);
        let containerId = await page.evaluate(messageContainer => messageContainer.id, messageContainer);
        let message = await page.$(`#${fieldId}\\:afv .afv-message`);
        let messageId = await page.evaluate(message => message.id, message);

        //field must have aria-invalid attribute set to true and aria-errormessage attribute container the id of the message container
        let ariaError = await page.evaluate(field => field.getAttribute('aria-errormessage'), field);
        let ariaInvalid = await page.evaluate(field => field.getAttribute('aria-invalid'), field);
        await expect(ariaInvalid).toBe('true');
        await expect(ariaError).toBeTruthy();
        await expect(ariaError).toBe(containerId);

        let afvGroup = await page.evaluateHandle(field => field.closest('.afv-group'), field);
        let css = await page.evaluate(afvGroup => [...afvGroup.classList.values()], afvGroup);
        await expect(css).toContain('afv-group');
        await expect(css).toContain('afv-active');

        //message container must have css class afv-message-container
        css = await page.evaluate(messageContainer => [...messageContainer.classList.values()], messageContainer);
        await expect(css).toContain('afv-message-container');

        //child and message should be the same
        let child = await page.evaluateHandle(messageContainer => messageContainer.firstChild, messageContainer);
        let childId = await page.evaluate(child => child.id, child);
        await expect(childId).toBeTruthy();
        await expect(childId).toBe(messageId);

        //field must have css classes afv-field and afv-active
        css = await page.evaluate(field => [...field.classList.values()], field);
        await expect(css).toContain('afv-field');
        await expect(css).toContain('afv-active');
    },

    verifyDerivedMessage: async function (page, field) {
        let fieldId = await page.evaluate(field => field.id, field);
        let message = await page.$(`#${fieldId}\\:afv .afv-message`);
        let css = await page.evaluate(message => [...message.classList.values()], message);
        await expect(css).toContain('afv-message');
        await expect(css).toContain('derived');
    },

    verifyInjectedMessage: async function (page, field) {
        let fieldId = await page.evaluate(field => field.id, field);
        let message = await page.$(`#${fieldId}\\:afv .afv-message`);
        let css = await page.evaluate(message => [...message.classList.values()], message);
        await expect(css).toContain('afv-message');
        await expect(css).toContain('injected');
    },

    verifyClearance: async function (page, field) {
        let css = await page.evaluate(field => [...field.classList.values()], field);
        await expect(css.includes('afv-field')).toBeFalsy();
        await expect(css.includes('afv-active')).toBeFalsy();

        let ariaError = await page.evaluate(field => field.getAttribute('aria-errormessage'), field);
        let ariaInvalid = await page.evaluate(field => field.getAttribute('aria-invalid'), field);
        await expect(ariaInvalid).toBeNull()
        await expect(ariaError).toBeNull();

        let fieldId = await page.evaluate(field => field.id, field);
        let messageContainer = await page.$(`#${fieldId}\\:afv`);
        await expect(messageContainer).toBeNull();

        let message = await page.$(`#${fieldId}\\:afv .afv-message`);
        await expect(message).toBeNull();

        let afvGroup = await page.evaluateHandle(field => field.closest('.afv-group'), field);
        css = await page.evaluate(afvGroup => [...afvGroup.classList.values()], afvGroup);
        await expect(css).toContain('afv-group');
        await expect(css.includes('afv-active')).toBeFalsy();
    }
}