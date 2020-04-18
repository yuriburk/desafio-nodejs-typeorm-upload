import { isUuid } from 'uuidv4';
import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor() {
    this.transactionsRepository = getCustomRepository(TransactionsRepository);
  }

  public async execute(id: string): Promise<void> {
    if (!isUuid(id)) {
      throw new AppError('This id is not valid');
    }

    const transaction = await this.transactionsRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new AppError("This transaction doesn't exist");
    }

    await this.transactionsRepository.delete(transaction.id);
  }
}

export default DeleteTransactionService;
