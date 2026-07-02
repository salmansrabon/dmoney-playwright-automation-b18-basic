import { APIRequestContext } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();


export async function getMessageId(request: APIRequestContext) {
    if (!process.env.GMAIL_ACCESS_TOKEN) {
        throw new Error('GMAIL_ACCESS_TOKEN environment variable is not set');
    }

    const response = await request.get('https://gmail.googleapis.com/gmail/v1/users/me/messages', {
        headers: {
            Authorization: `Bearer ${process.env.GMAIL_ACCESS_TOKEN}`,
        },
    });

    if (!response.ok()) {
        throw new Error(`Gmail API error: ${response.status()} ${response.statusText()}`);
    }

    const body = await response.json();
    return body.messages?.[0]?.id ?? null;
}
export async function readLatestEmail(request: APIRequestContext) {
    if (!process.env.GMAIL_ACCESS_TOKEN) {
        throw new Error('GMAIL_ACCESS_TOKEN environment variable is not set');
    }

    const messageId = await getMessageId(request);
    if (!messageId) {
        throw new Error('Failed to get message ID from Gmail - check if GMAIL_ACCESS_TOKEN has proper permissions');
    }

    const response = await request.get(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`, {
        headers: {
            Authorization: `Bearer ${process.env.GMAIL_ACCESS_TOKEN}`,
        },
    });

    if (!response.ok()) {
        throw new Error(`Gmail API error: ${response.status()} ${response.statusText()}`);
    }

    const body = await response.json();
    return body.snippet;
}
