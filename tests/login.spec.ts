import { test, expect } from '@playwright/test';
import { getMessageId, readLatestEmail } from '../services/gmailAuth';
import { extractOTP } from '../utils/extractOTP';

test("Agent login",async({page,request})=>{
    const previousMessageId= await getMessageId(request);

    await page.goto("https://dmoneyportal.roadtocareer.net/login");
    await page.getByRole("textbox",{name:"Email or Phone Number"}).fill("01686606901");
    await page.getByRole("textbox",{name:"Password"}).fill("1234");
    await page.getByRole("button",{name:"Login →"}).click();
    // await page.waitForTimeout(5000);

    let newMessageId:string='';
    for(let i=0;i<10;i++){
        await page.waitForTimeout(1000);
        const currentMessageId = await getMessageId(request);
        if (currentMessageId!== previousMessageId) {
            newMessageId = currentMessageId;
            break;
        }
    }
    const email=await readLatestEmail(request, newMessageId);
    const otp=extractOTP(email);
    console.log(otp);
    await page.getByRole("textbox",{name:"Enter 4-Digit OTP"}).fill(otp);
    await page.getByRole("button",{name:"Verify OTP →"}).click();

    await page.waitForURL(/profile\/*/);
    await page.context().storageState({path:'auth.json'})

    await page.pause();

})