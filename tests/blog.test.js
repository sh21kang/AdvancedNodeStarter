const Page = require('./helpers/page');

let page;

beforeEach(async ()=>{
    page= await Page.build();
    await page.goto('localhost:3000');
});

afterEach(async ()=>{
    await page.close();
});




describe('when logged in', async ()=>{
    beforeEach(async ()=>{
        await page.login();
        await page.click('a.btn-floating');
    });
    test('Can see blog creat form', async () => {
    
        const label = await page.getContentOf('form label');
    
        expect(label).toEqual('Blog Title');
    });
    
    describe('when using valid inputs', async () =>{
        beforeEach(async ()=>{
            await page.type('.title input', 'My Title');
            await page.type('.content input', 'My Content');
            await page.click('form button');
          });

        test('submittting takes user to review screen ', async ()=>{
            const text = await page.getContentOf('h5');
            expect(text).toEqual('Please confirm your entries');
        });
        test('submittting then saving adds blog to index page ', async ()=>{
            await page.click('button.green');
            await page.waitFor('.card');
            const title = await page.getContentOf('.card-title');
            const content = await page.getContentOf('p');

            expect(title).toEqual('My Title');
            expect(content).toEqual('My Content');
        });
    });

    describe('and using invalid input', async () =>{
        beforeEach(async ()=>{
            await page.click('form button');
          });
        test('the form shows an error message', async ()=>{
            const titleError = await page.getContentOf('.title .red-text');
            const contentError = await page.getContentOf('.content .red-text');

            expect(titleError).toEqual('You must provide a value');
            expect(contentError).toEqual('You must provide a value');
        });
    });
});

describe('User is not logged in',async ()=>{
    test("user Cannot create blog posts", async ()=>{
        const result = await page.evaluate((()=>{
            return fetch('/api/blogs',{
                method : 'POST',
                credentials : 'same-origin',
                headers :{
                    'Content-Type' : 'application/json'
                },
                body :JSON.stringify({title : 'My Title', content : 'My Content'})
            }).then(res=> res.json());
        }));
       expect(result).toEqual({error: 'You must log in!'});
    });

    test('User cannot get a list of posts', async ()=>{
        const result = await page.evaluate((()=>{
            return fetch('/api/blogs',{
                method : 'GET',
                credentials : 'same-origin',
                headers :{
                    'Content-Type' : 'application/json'
                }
            }).then(res => res.json());
        }));
        expect(result).toEqual({error: 'You must log in!'});

    })
})