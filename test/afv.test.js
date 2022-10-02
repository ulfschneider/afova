describe('Page title', () => {

    beforeAll(async () => {
        await page.goto(`http://localhost:${process.env.PORT}`);
    });

    it('should be titled "Accessible Form Validation"', async () => {
        await expect(page.title()).resolves.toMatch('Accessible Form Validation');
    });
});

