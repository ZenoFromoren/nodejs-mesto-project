import statusCodes from '../constants';

class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string | undefined) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCodes.BAD_REQUEST;
  }
}

export default BadRequestError;
