/**
 * i18n Utility Module
 * Provides convenient access to localized strings
 */

import ptBR from '@i18n/pt-BR.json';

type I18nKeys = typeof ptBR;

/**
 * Get a localized string by key path
 * @param key - Dot-separated key (e.g., 'common.yes')
 * @param defaultValue - Fallback string if key not found
 * @returns Localized string
 */
export function t(key: string, defaultValue: string = key): string {
  try {
    const keys = key.split('.');
    let value: any = ptBR;

    for (const k of keys) {
      value = value[k];
      if (value === undefined) {
        return defaultValue;
      }
    }

    return typeof value === 'string' ? value : defaultValue;
  } catch (error) {
    return defaultValue;
  }
}

/**
 * Get a translated string with interpolation
 * @param key - Dot-separated key
 * @param variables - Object with variable values {name: 'John'}
 * @returns Interpolated string
 *
 * @example
 * // i18n file: { hello: 'Hello {{name}}' }
 * ti('hello', { name: 'John' }) // => 'Hello John'
 */
export function ti(key: string, variables: Record<string, string | number>): string {
  let str = t(key);

  Object.entries(variables).forEach(([variable, value]) => {
    str = str.replace(new RegExp(`{{${variable}}}`, 'g'), String(value));
  });

  return str;
}

/**
 * Get the full i18n object
 * Useful for component libraries or custom implementations
 */
export function getI18n(): I18nKeys {
  return ptBR;
}

export default {
  t,
  ti,
  getI18n,
};
