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
  sort: any;
  order: any;
}

class GetTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor() {
    this.transactionsRepository = getCustomRepository(TransactionsRepository);
  }

  public async execute({ take, skip, sort, order }: Query): Promise<Response> {
    const transactions = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .innerJoinAndSelect('transaction.category', 'category')
      .where('category.id = transaction.category_id')
      .orderBy(sort, order)
      .skip(skip)
      .take(take)
      .getMany();

    const response: Response = {
      transactions,
      balance: await this.transactionsRepository.getBalance(),
      count: await this.transactionsRepository.count(),
    };

    return response;
  }
}

export default GetTransactionService;
