import statusCodes from '../constants';

class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string | undefined) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCodes.notFound;
  }
}

export default NotFoundError;
