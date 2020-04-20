import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';

class ValidateBalanceService {
  private transactionsRepository: TransactionsRepository;

  constructor() {
    this.transactionsRepository = getCustomRepository(TransactionsRepository);
  }

  public async execute(
    { type, value }: TransactionDTO,
    comingIncome = 0,
  ): Promise<boolean> {
    if (type === 'outcome') {
      const balance = await this.transactionsRepository.getBalance();

      if (value > balance.total + comingIncome) {
        return false;
      }
    }

    return true;
  }
}

export default ValidateBalanceService;
