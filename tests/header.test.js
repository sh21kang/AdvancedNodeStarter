

const Page = require('./helpers/page')
let page;

beforeEach(async ()=>{
    page= await Page.build();
    await page.goto('localhost:3000');

    

});

afterEach(async ()=>{
    await page.close();
})

test('the header has correct test', async ()=>{
    const text = await page.getContentOf('a.brand-logo');
    expect(text).toEqual('Blogster');
});

test('clicking login', async()=>{
 await page.click('.right a');
 const url = await page.url();

 expect(url).toMatch(/accounts\.google\.com/);
});

test('when siged in, shows logout button', async ()=>{
    await page.login();
    const text = await page.$eval('a[href="/auth/logout"]', el=> el.innerHTML);

    expect(text).toEqual('Logout');
});
