export function extractOTP(text: string): string {
    const match = text.match(/\b(\d{4})\b/);
    return match ? match[1] : '';
}
