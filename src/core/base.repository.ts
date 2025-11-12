import { DeepPartial, FindOptionsWhere, Repository, SelectQueryBuilder } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

export class BaseRepository<T extends { id?: number; order?: number }> {
  constructor(protected readonly repo: Repository<T>) { }



  // ✅ Hook: can be overridden by child repositories
  protected addCustomJoins(_qb: SelectQueryBuilder<T>): void {
    // default no-op
  }

  async findAll(
    filters?: FindOptionsWhere<T> & { page?: number; limit?: number },
    includeRelations = false,
  ): Promise<any[]> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;

    // Remove pagination params
    const whereFilters: Record<string, any> = { ...filters };
    delete whereFilters.page;
    delete whereFilters.limit;

    const qb = this.repo.createQueryBuilder('entity');

    // Apply filters
    Object.entries(whereFilters).forEach(([field, value], i) => {
      if (typeof value === 'string' && value.startsWith(':between')) {
        const match = value.match(/\[([^\]]+)\]/);
        if (match) {
          const [start, end] = match[1].split(',');
          qb.andWhere(`entity.${field} BETWEEN :start${i} AND :end${i}`, {
            [`start${i}`]: start.trim(),
            [`end${i}`]: end.trim(),
          });
        }
      } else {
        qb.andWhere(`entity.${field} = :val${i}`, { [`val${i}`]: value });
      }
    });

    // Select main entity columns
    const mainCols = this.repo.metadata.columns.map(
      col => `entity.${col.propertyName}`,
    );
    qb.select(mainCols);

    if (includeRelations) {
      // Join all direct relations dynamically (except password)
      this.repo.metadata.relations.forEach(relation => {
        const relName = relation.propertyName;

        const relCols = relation.inverseEntityMetadata.columns
          .filter(col => col.propertyName !== 'password')
          .map(col => `${relName}.${col.propertyName}`);

        qb.leftJoin(`entity.${relName}`, relName).addSelect(relCols);
      });

      // ✅ Call child-specific custom joins
      this.addCustomJoins(qb);
    }

    // Pagination
    qb.skip((page - 1) * limit).take(limit);

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


  async findAllByField<K extends keyof T>(
    field: K,
    value: T[K],
  ): Promise<T[] | null> {
    return this.repo.find({
      where: { [field]: value } as any,
    });
  }


  async findByJoin<J>(
    joinEntity: { new(): J },       // entity class to join
    joinAlias: string,              // alias for the join
    joinCondition: string,          // e.g., 'entity.id = questionnaire.assessmentId'
    filters?: Record<string, any>,  // allow string-based expressions
    joinType: 'inner' | 'left' = 'left',
  ): Promise<Array<T & { [key in typeof joinAlias]?: J }>> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;

    // Remove pagination keys
    const whereFilters: Record<string, any> = { ...filters };
    delete whereFilters.page;
    delete whereFilters.limit;

    const qb = this.repo.createQueryBuilder('entity');

    // Apply filters
    if (whereFilters) {
      Object.entries(whereFilters).forEach(([field, value], i) => {
        if (typeof value === 'string' && value.startsWith(':between')) {
          const match = value.match(/\[([^\]]+)\]/);
          if (match) {
            const [start, end] = match[1].split(',');
            qb.andWhere(`entity.${field} BETWEEN :start${i} AND :end${i}`, {
              [`start${i}`]: start.trim(),
              [`end${i}`]: end.trim(),
            });
          }
        } else {
          qb.andWhere(`entity.${field} = :val${i}`, { [`val${i}`]: value });
        }
      });
    }

    // Select base entity columns
    const mainCols = this.repo.metadata.columns.map(
      col => `entity.${col.propertyName}`,
    );
    qb.select(mainCols);

    // Add join
    if (joinType === 'inner') {
      qb.innerJoin(joinEntity, joinAlias, joinCondition);
    } else {
      qb.leftJoin(joinEntity, joinAlias, joinCondition);
    }

    // Select joined entity columns 
    const joinMeta = this.repo.manager.connection.getMetadata(joinEntity);
    const joinCols = joinMeta.columns
      .filter(col => col.propertyName !== 'password')
      .map(col => `${joinAlias}.${col.propertyName}`);
    qb.addSelect(joinCols);

    // ✅ Apply pagination
    qb.skip((page - 1) * limit).take(limit);

    // Use raw + entities to merge joined columns
    const results = await qb.getRawAndEntities();

    return results.entities.map((entity, index) => {
      const raw = results.raw[index];
      entity[joinAlias] = {} as J;

      joinMeta.columns.forEach(col => {
        const key = `${joinAlias}_${col.databaseName}`;
        if (raw[key] !== undefined) {
          entity[joinAlias][col.propertyName as keyof J] = raw[key];
        }
      });

      return entity as T & { [key in typeof joinAlias]?: J };
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


  async deleteById(id: number): Promise<void> {
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

  /**
 * Update an entity by ID
 * @param id - ID of the entity to update
 * @param data - Partial data to update
 * @returns updated entity
 */
  async update(id: number, data: DeepPartial<T>): Promise<T> {
    // find existing entity
    const entity = await this.findById(id);
    if (!entity) {
      throw new BadRequestException(`Entity with id ${id} not found`);
    }

    // merge new data
    const updatedEntity = this.repo.merge(entity, data);

    try {
      return await this.repo.save(updatedEntity);
    } catch (error: any) {
      // handle Postgres foreign key violation
      if (error?.code === '23503' && error.detail) {
        const match = error.detail.match(/\((.+)\)=/);
        const column = match ? match[1] : null;
        if (column) throw new BadRequestException(`${column} is invalid.`);
        throw new BadRequestException('Invalid foreign key value.');
      }

      // handle unique constraint violation
      if (error?.code === '23505' && error.detail) {
        const match = error.detail.match(/\((.+)\)=/);
        const column = match ? match[1] : 'value';
        throw new BadRequestException(`${column} already exists.`);
      }

      // rethrow other errors
      throw error;
    }
  }



  async findCount(
    filters?: FindOptionsWhere<T>,
    includeRelations = false,
  ): Promise<number> {
    const whereFilters: Record<string, any> = { ...filters };

    const qb = this.repo.createQueryBuilder('entity');

    // Apply filters (supports :between)
    Object.entries(whereFilters).forEach(([field, value], i) => {
      if (typeof value === 'string' && value.startsWith(':between')) {
        const match = value.match(/\[([^\]]+)\]/);
        if (match) {
          const [start, end] = match[1].split(',');
          qb.andWhere(`entity.${field} BETWEEN :start${i} AND :end${i}`, {
            [`start${i}`]: start.trim(),
            [`end${i}`]: end.trim(),
          });
        }
      } else {
        qb.andWhere(`entity.${field} = :val${i}`, { [`val${i}`]: value });
      }
    });

    // Include relations if needed (mainly for where conditions on relations later)
    if (includeRelations) {
      this.repo.metadata.relations.forEach(relation => {
        const relName = relation.propertyName;
        qb.leftJoin(`entity.${relName}`, relName);
      });
    }

    // Return count only
    return qb.getCount();
  }





}
