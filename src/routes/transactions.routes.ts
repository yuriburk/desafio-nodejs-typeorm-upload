import { Router } from 'express';
import multer from 'multer';

import CreateTransactionService from '../services/CreateTransactionService';
import GetTransactionsService from '../services/GetTransactionsService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer();

transactionsRouter.get('/', async (request, response) => {
  const { skip, take } = request.query;

  const transactions = await new GetTransactionsService().execute({
    skip,
    take,
  });

  return response.status(200).json(transactions);
});

transactionsRouter.post('/', async (request, response) => {
  const createTransaction = new CreateTransactionService();

  const { title, value, type, category } = request.body;

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.status(200).json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  await new DeleteTransactionService().execute(id);

  return response.status(200).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const transactions = await new ImportTransactionsService().execute(
      request.file.buffer.toString(),
    );

    return response.status(200).json(transactions);
  },
);

export default transactionsRouter;
