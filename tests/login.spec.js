const  { test, expect } = require ('@playwright/test');
const { futimes } = require('fs');

// Read the test cases from the JSON file
const testCases = JSON.parse(JSON.stringify(require('../data/test-cases.json')));

// User credentials
const credentials = {
  email: 'admin',
  password: 'password123'
};

// Reusable login method
async function login(page) {
    await page.goto("https://animated-gingersnap-8cf7f2.netlify.app/")
    await page.getByLabel('Username').fill(credentials.email);
    await page.getByLabel('Password').fill(credentials.password);
    await page.getByRole('button', { name: 'Sign in' }).click();
  }


test.describe("Data Driven Test", function () {

    
    for (const testcase of testCases){

       //Going through each test case
        test.describe(`Execute test ${testcase.testName}`, function (){


              test('Login', async ({page}) => {
               // Login to the application
                    await login(page);

                // Navigate to the given application
                    await page.click(`text=${testcase.application}`);

                // Verify task is in the given column
                    const taskSelector = `//div[contains(@class, 'flex flex-col w-80 bg-gray-50 rounded-lg p-4') and .//h2[text()='${testcase.column}']]//div/h3[text()='${testcase.task}']`;
                    const taskElement = await page.locator(taskSelector);
                    await expect(taskElement).toBeVisible();

                
                // Verify task tags
               for (let tag of testcase.tags) {
                    
                        const tagSelector = `//div[contains(@class, 'flex flex-col w-80 bg-gray-50 rounded-lg p-4') and .//h2[text()='${testcase.column}']]//div/div/div/span[text()='${tag}']`;
                        const tagElement = await page.locator(tagSelector);
                        await expect(tagElement).toBeVisible();
              } 

              });
            
            })

    }

})


