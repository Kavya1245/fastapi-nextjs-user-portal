import validationsData from '../../../shared/validations.json';

export const rules = validationsData;

export function sanitizeName(value: string, maxLen: number = 20): string {
  let v = value.replace(/[^A-Za-z ]/g, "").slice(0, maxLen);
  return v.startsWith(" ") ? v.trimStart() : v;
}
