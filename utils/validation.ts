/**
 * Verifica se um valor é fornecido e não consiste apenas de espaços.
 * @param value - O valor a ser verificado.
 * @returns True se o valor não for vazio, caso contrário, false.
 */
export function isRequired(value: string): boolean {
    return value.trim() !== '';
  }
  
  /**
   * Valida se o formato de um e-mail é válido.
   * @param email - O e-mail a ser validado.
   * @returns True se o e-mail tiver um formato válido, caso contrário, false.
   */
  export function isValidEmail(email: string): boolean {
    // Expressão regular simples para validar e-mails
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
  }
  
  /**
   * Verifica se um valor numérico (em formato de string) representa um número positivo.
   * @param value - A string a ser convertida e verificada.
   * @returns True se o número for positivo, caso contrário, false.
   */
  export function isPositiveNumber(value: string): boolean {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  }
  