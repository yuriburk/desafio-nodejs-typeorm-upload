import csvReader from 'csvtojson';
import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import CreateCategoryService from './CreateCategoryService';
import ValidateBalanceService from './ValidateBalanceService';
import TransactionsRepository from '../repositories/TransactionsRepository';

class ImportTransactionsService {
  private createCategory: CreateCategoryService;

  private validateBalance: ValidateBalanceService;

  private transactionsRepository: TransactionsRepository;

  constructor() {
    this.createCategory = new CreateCategoryService();
    this.validateBalance = new ValidateBalanceService();
    this.transactionsRepository = getCustomRepository(TransactionsRepository);
  }

  async execute(csvString: string): Promise<Transaction[]> {
    const transactions: Transaction[] = [];

    await csvReader({
      headers: ['title', 'type', 'value', 'category'],
    })
      .fromString(csvString)
      .subscribe(async ({ title, type, value, category }: TransactionCSV) => {
        if (!title || !type || !value || !category) {
          throw new AppError('All fields must have a value');
        }

        const { id } = await this.createCategory.execute(category);

        const transaction = {
          title,
          type,
          value: parseFloat(value),
          category_id: id,
        } as Transaction;

        transactions.push(transaction);
      });

    if (transactions.length === 0) {
      throw new AppError('No transactions found to import');
    }

    const validateOutcome = await this.validateOutcome(transactions);
    if (!validateOutcome) {
      throw new AppError(
        "Can't import transactions because balance would be negative",
      );
    }

    this.transactionsRepository.create(transactions);
    await this.transactionsRepository.save(transactions);

    return transactions;
  }

  private async validateOutcome(transactions: Transaction[]): Promise<boolean> {
    const incomeValue = await this.getBalanceValues('income', transactions);
    const outcomeValue = await this.getBalanceValues('outcome', transactions);

    const validateOutcomeObject = {
      type: 'outcome',
      value: outcomeValue,
    } as TransactionDTO;

    const validateBalance = await this.validateBalance.execute(
      validateOutcomeObject,
      incomeValue,
    );

    return validateBalance;
  }

  private async getBalanceValues(
    type: 'income' | 'outcome',
    transactions: Transaction[],
  ): Promise<number> {
    const initialValue = 0;
    const transactionsFilter = transactions.filter(t => t.type === type);

    return transactionsFilter?.length > 0
      ? transactionsFilter.reduce(
          (accumulator, currentTransaction) =>
            accumulator + currentTransaction.value,
          initialValue,
        )
      : initialValue;
  }
}

export default ImportTransactionsService;
