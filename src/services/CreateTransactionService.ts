import { getRepository, getCustomRepository, Repository } from 'typeorm';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class CreateTransactionService {
  private categoriesRepository: Repository<Category>;

  private transactionsRepository: TransactionsRepository;

  constructor() {
    this.categoriesRepository = getRepository(Category);
    this.transactionsRepository = getCustomRepository(TransactionsRepository);
  }

  public async execute({
    title,
    value,
    type,
    category,
  }: TransactionDTO): Promise<Transaction> {
    const validBalance = await this.validateOutcome({
      value,
      type,
    } as TransactionDTO);
    if (!validBalance) {
      throw new AppError('Outcome is higher than balance');
    }

    let categorySaved = await this.categoriesRepository.findOne({
      where: { title: category },
    });

    if (!categorySaved) {
      categorySaved = this.categoriesRepository.create({
        title: category,
      });

      await this.categoriesRepository.save(categorySaved);
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
      category_id: categorySaved.id,
    });

    await this.transactionsRepository.save(transaction);

    return transaction;
  }

  private async validateOutcome({
    value,
    type,
  }: TransactionDTO): Promise<boolean> {
    if (type === 'outcome') {
      const balance = await this.transactionsRepository.getBalance();

      if (value > balance.total) {
        return false;
      }
    }

    return true;
  }
}

export default CreateTransactionService;
