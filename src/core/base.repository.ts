import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

export class BaseRepository<T extends { id?: number; order?: number }> {
  constructor(protected readonly repo: Repository<T>) { }




  async findAll(
    filters?: FindOptionsWhere<T>,
    includeRelations = false,
  ): Promise<any[]> {
    if (!includeRelations) {
      return this.repo.find({ where: filters });
    }

    const qb = this.repo.createQueryBuilder('entity');

    // Apply filters if provided
    if (filters) {
      qb.where(filters);
    }

    // Always select main entity columns
    const mainCols = this.repo.metadata.columns.map(col => `entity.${col.propertyName}`);
    qb.select(mainCols);

    // Include relations dynamically
    this.repo.metadata.relations.forEach(relation => {
      const relName = relation.propertyName;

      // Select only non-password columns from the relation
      const relCols = relation.inverseEntityMetadata.columns
        .filter(col => col.propertyName !== 'password')
        .map(col => `${relName}.${col.propertyName}`);

      qb.leftJoin(`entity.${relName}`, relName)
        .addSelect(relCols);
    });

    const results = await qb.getMany();
    return JSON.parse(JSON.stringify(results));
  }




  findById(id: number): Promise<T | null> {
    return this.repo.findOne({ where: { id } as any });
  }

  async findByField<K extends keyof T>(
    field: K,
    value: T[K],
  ): Promise<T | null> {
    return this.repo.findOne({
      where: { [field]: value } as any,
    });
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repo.create(data);
    try {
      return await this.repo.save(entity);
    } catch (error: any) {
      // Handle Postgres foreign key violation dynamically
      if (error?.code === '23503' && error.detail) {
        // Example detail: Key (patientId)=(12) is not present in table "patient".
        const match = error.detail.match(/\((.+)\)=/);
        const column = match ? match[1] : null;

        if (column) {
          throw new BadRequestException(`${column} is invalid.`);
        }

        // fallback generic message
        throw new BadRequestException('Invalid foreign key value.');
      }

      // Handle unique constraint violation dynamically
      if (error?.code === '23505' && error.detail) {
        // Example detail: Key (email)=(test@example.com) already exists.
        const match = error.detail.match(/\((.+)\)=/);
        const column = match ? match[1] : 'value';
        throw new BadRequestException(`${column} already exists.`);
      }

      // rethrow other errors
      throw error;
    }
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
