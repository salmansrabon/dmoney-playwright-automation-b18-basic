import { APIRequestContext } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();


export async function getMessageId(request: APIRequestContext) {
    const response = await request.get('https://gmail.googleapis.com/gmail/v1/users/me/messages', {
        headers: {
            Authorization: `Bearer ${process.env.GMAIL_ACCESS_TOKEN}`,
        },
    });

    const body = await response.json();
    return body.messages?.[0]?.id ?? null;
}
export async function readLatestEmail(request: APIRequestContext) {
    const messageId=await getMessageId(request);
    const response = await request.get(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`, {
        headers: {
            Authorization: `Bearer ${process.env.GMAIL_ACCESS_TOKEN}`,
        },
    });

    const body = await response.json();
    return body.snippet;
}
