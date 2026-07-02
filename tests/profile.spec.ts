import {test} from '@playwright/test'
test("Visit profile page",async({page})=>{
    await page.goto("/profile");
})