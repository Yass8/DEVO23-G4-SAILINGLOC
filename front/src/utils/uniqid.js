
export const uniqid = (prefix = '', size = 4) => {
    const ramdomPart = Math.random().toString(36).substring(2, size + 2);
    const timestamp = Date.now().toString(36);
    return `${prefix}-${ramdomPart}-${timestamp}`;
}