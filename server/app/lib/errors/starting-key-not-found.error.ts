export class StartingKeyNotFoundError extends Error {
  constructor(message?: string) {
    super('The provided key could not be found in the table');
    this.name = 'StartingKeyNotFoundException';
  }
}
