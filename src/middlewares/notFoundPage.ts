import NotFoundError from '../errors/NotFoundError';

const notFoundPage = () => {
  throw new NotFoundError('Страница не найдена');
};

export default notFoundPage;
