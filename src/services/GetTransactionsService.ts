import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Response {
  transactions: Transaction[];
  balance: Balance;
}

class GetTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor() {
    this.transactionsRepository = getCustomRepository(TransactionsRepository);
  }

  public async execute(): Promise<Response> {
    const response: Response = {
      transactions: await this.transactionsRepository.find(),
      balance: await this.transactionsRepository.getBalance(),
    };

    return response;
  }
}

export default GetTransactionService;
