describe('addItemForm',()=>{
    it('base example, visually looks correct', async ()=>{
        await page.goto('http://localhost:9009/iframe.html?args=&id=additemform-component--add-item-form-base-example&viewMode=story');
        const image =await page.screenshot();

        expect(image).toMatchImageSnapshot();
    })
})