import { test, expect } from '@playwright/test';
import { readLatestEmail } from '../services/gmailAuth';
import { extractOTP } from '../utils/extractOTP';
import { mkdirSync, unlinkSync, existsSync } from 'fs';
import { dirname } from 'path';

test("Agent login",async({page,request,context})=>{
    const authPath = 'auth.json';
    if (existsSync(authPath)) {
        unlinkSync(authPath);
        context.clearCookies();
        console.log(`✓ Removed existing auth.json for fresh login`);
    }

    const previousOTP= extractOTP(await readLatestEmail(request));

    await page.goto("/login");
    await page.getByRole("textbox",{name:"Email or Phone Number"}).fill("01686606901");
    await page.getByRole("textbox",{name:"Password"}).fill("1234");
    await page.getByRole("button",{name:"Login →"}).click();
    // await page.waitForTimeout(5000);

    let newOTP:string='';
    for(let i=0;i<10;i++){
        await page.waitForTimeout(1000);
        const currentOTP = extractOTP(await readLatestEmail(request));
        if (previousOTP!== currentOTP) {
            newOTP = currentOTP;
            break;
        }
    }
    await page.getByRole("textbox",{name:"Enter 4-Digit OTP"}).fill(newOTP);
    await page.getByRole("button",{name:"Verify OTP →"}).click();

    await page.waitForURL(/profile\/*/);
    try {
        mkdirSync(dirname(authPath), { recursive: true });
        await page.context().storageState({ path: authPath });
        console.log(`✓ Authentication state saved to ${authPath}`);
    } catch (error) {
        console.error(`✗ Failed to save auth.json: ${error}`);
        throw error;
    }

})