import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

export class BaseRepository<T extends { id?: number; order?: number }> {
  constructor(protected readonly repo: Repository<T>) { }

  findAll(): Promise<T[]> {
    return this.repo.find();
  }

  findById(id: number): Promise<T | null> {
    return this.repo.findOne({ where: { id } as any });
  }

  create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }


  deleteById(id: number): Promise<void> {
    return this.repo.delete(id).then(() => undefined);
  }

  /**
   * Find multiple entities by condition (AND / OR)
   */
  findByCondition(
    conditions: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  ): Promise<T[]> {
    return this.repo.find({
      where: conditions,
    });
  }

  /**
   * Find a single entity by condition (AND / OR)
   */
  findOneByCondition(
    condition: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    orderByDesc?: keyof T,
  ): Promise<T | null> {
    const options: any = {
      where: condition,
    };

    if (orderByDesc) {
      options.order = {
        [orderByDesc]: 'DESC',
      };
    }

    return this.repo.findOne(options);
  }


  /**
   * Update the order of an item and shift other items accordingly
   */





}
