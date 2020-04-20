import { Repository, getRepository } from 'typeorm';

import Category from '../models/Category';

class CreateCategoryService {
  private categoriesRepository: Repository<Category>;

  constructor() {
    this.categoriesRepository = getRepository(Category);
  }

  public async execute(categoryTitle: string): Promise<Category> {
    let category = await this.categoriesRepository.findOne({
      where: { title: categoryTitle },
    });

    if (!category) {
      category = this.categoriesRepository.create({
        title: categoryTitle,
      });

      await this.categoriesRepository.save(category);
    }

    return category;
  }
}

export default CreateCategoryService;
