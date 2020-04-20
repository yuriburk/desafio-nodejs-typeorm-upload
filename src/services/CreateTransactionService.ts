import { getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import CreateCategoryService from './CreateCategoryService';
import ValidateBalanceService from './ValidateBalanceService';
import TransactionsRepository from '../repositories/TransactionsRepository';

class CreateTransactionService {
  private createCategory: CreateCategoryService;

  private validateBalance: ValidateBalanceService;

  private transactionsRepository: TransactionsRepository;

  constructor() {
    this.createCategory = new CreateCategoryService();
    this.validateBalance = new ValidateBalanceService();
    this.transactionsRepository = getCustomRepository(TransactionsRepository);
  }

  public async execute({
    title,
    value,
    type,
    category,
  }: TransactionDTO): Promise<Transaction> {
    await this.validateBalance.execute({ type, value } as TransactionDTO);

    const { id } = await this.createCategory.execute(category);

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
      category_id: id,
    });

    await this.transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
