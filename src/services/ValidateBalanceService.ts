import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class ValidateBalanceService {
  private transactionsRepository: TransactionsRepository;

  constructor() {
    this.transactionsRepository = getCustomRepository(TransactionsRepository);
  }

  public async execute({ type, value }: TransactionDTO): Promise<void> {
    if (type === 'outcome') {
      const balance = await this.transactionsRepository.getBalance();

      if (value > balance.total) {
        throw new AppError('Outcome is higher than balance');
      }
    }
  }
}

export default ValidateBalanceService;
