import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Response {
  transactions: Transaction[];
  balance: Balance;
  count: number;
}

interface Query {
  take: any;
  skip: any;
}

class GetTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor() {
    this.transactionsRepository = getCustomRepository(TransactionsRepository);
  }

  public async execute({ take, skip }: Query): Promise<Response> {
    const [
      transactions,
      count,
    ] = await this.transactionsRepository.findAndCount({
      take,
      skip,
      order: {
        created_at: 'ASC',
      },
    });
    const response: Response = {
      transactions,
      balance: await this.transactionsRepository.getBalance(),
      count,
    };

    return response;
  }
}

export default GetTransactionService;
