/**
 * Format a date to the format dd/mm/yyyy.
 * @param date Date or Date compatible string .
 * @returns The date formatted as "dd/mm/yyyy".
 */
export function formatDate(date: Date | string): string {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  /**
   * Remove extra spaces of a string, with only one space left between words.
   * @param text The string to be clean.
   * @returns The string without redundant spaces.
   */
  export function trimExtraSpaces(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }
  