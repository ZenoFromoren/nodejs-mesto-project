import statusCodes from '../constants';

class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string | undefined) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCodes.FORBIDDEN;
  }
}

export default ForbiddenError;
