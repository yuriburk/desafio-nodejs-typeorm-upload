import { getRepository, getCustomRepository, Repository } from 'typeorm';

import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

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
  }: Request): Promise<Transaction> {
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
}

export default CreateTransactionService;
