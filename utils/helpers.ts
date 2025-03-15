  /**
   * Remove extra spaces of a string, with only one space left between words.
   * @param text The string to be clean.
   * @returns The string without redundant spaces.
   */
  export function trimExtraSpaces(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }
  