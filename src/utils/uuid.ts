/**
 * UUID v4 generator compatible with all React Native environments.
 *
 * The global `crypto.randomUUID()` API is NOT available in Hermes (React Native's
 * JS engine) in older SDK versions, causing a ReferenceError at runtime.
 * This utility provides a RFC 4122-compliant v4 UUID using Math.random() as
 * a safe, universal fallback.
 */
export const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
