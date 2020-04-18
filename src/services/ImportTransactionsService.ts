import csvReader from 'csvtojson';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';
import AppError from '../errors/AppError';

class ImportTransactionsService {
  private createTransaction: CreateTransactionService;

  constructor() {
    this.createTransaction = new CreateTransactionService();
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

        const transaction = await this.createTransaction.execute({
          title,
          type,
          value,
          category,
        });

        console.log(transaction);

        if (transaction.id) {
          transactions.push(transaction);
        }
      });

    return transactions;
  }
}

export default ImportTransactionsService;
