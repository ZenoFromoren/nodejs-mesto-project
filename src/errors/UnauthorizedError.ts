import statusCodes from '../constants';

class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string | undefined) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCodes.UNAUTHORIZED;
  }
}

export default UnauthorizedError;
