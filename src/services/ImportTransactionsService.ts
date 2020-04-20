import csvReader from 'csvtojson';
import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import CreateCategoryService from './CreateCategoryService';
import ValidateBalanceService from './ValidateBalanceService';
import CreateTransactionService from './CreateTransactionService';
import TransactionsRepository from '../repositories/TransactionsRepository';

class ImportTransactionsService {
  private createCategory: CreateCategoryService;

  private validateBalance: ValidateBalanceService;

  private createTransaction: CreateTransactionService;

  private transactionsRepository: TransactionsRepository;

  constructor() {
    this.createCategory = new CreateCategoryService();
    this.validateBalance = new ValidateBalanceService();
    this.createTransaction = new CreateTransactionService();
    this.transactionsRepository = getCustomRepository(TransactionsRepository);
  }

  async execute(csvString: string): Promise<Transaction[]> {
    const transactions: Transaction[] = [];

    await csvReader({
      headers: ['title', 'type', 'value', 'category'],
    })
      .fromString(csvString)
      .subscribe(async ({ title, type, value, category }: TransactionDTO) => {
        if (!title || !type || !value || !category) {
          throw new AppError('All fields must have a value');
        }

        await this.validateBalance.execute({ type, value } as TransactionDTO);

        const { id } = await this.createCategory.execute(category);

        const transaction = {
          title,
          type,
          value,
          category_id: id,
        } as Transaction;

        transactions.push(transaction);
      });

    this.transactionsRepository.create(transactions);
    await this.transactionsRepository.save(transactions);

    return transactions;
  }
}

export default ImportTransactionsService;
