export function extractOTP(text: string | null | undefined): string {
    if (!text) {
        throw new Error('Failed to extract OTP: email content is empty or undefined. Check if GMAIL_ACCESS_TOKEN is valid.');
    }
    const match = text.match(/\b(\d{4})\b/);
    return match ? match[1] : '';
}
