import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

export class BaseRepository<T extends { id?: number; order?: number }> {
  constructor(protected readonly repo: Repository<T>) { }




  async findAll(
    filters?: FindOptionsWhere<T> & { page?: number; limit?: number },
    includeRelations = false,
  ): Promise<any[]> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;

    // Remove page and limit from filters before using in where
    const whereFilters = { ...filters };
    delete whereFilters.page;
    delete whereFilters.limit;

    if (!includeRelations) {
      return this.repo.find({
        where: whereFilters,
        skip: (page - 1) * limit,
        take: limit,
      });
    }

    const qb = this.repo.createQueryBuilder('entity');

    // Apply filters if provided
    if (Object.keys(whereFilters).length > 0) {
      qb.where(whereFilters);
    }

    // Always select main entity columns
    const mainCols = this.repo.metadata.columns.map(
      col => `entity.${col.propertyName}`
    );
    qb.select(mainCols);

    // Include relations dynamically
    this.repo.metadata.relations.forEach(relation => {
      const relName = relation.propertyName;

      // Select only non-password columns from the relation
      const relCols = relation.inverseEntityMetadata.columns
        .filter(col => col.propertyName !== 'password')
        .map(col => `${relName}.${col.propertyName}`);

      qb.leftJoin(`entity.${relName}`, relName).addSelect(relCols);
    });

    // Apply pagination
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


  async findByJoin<J>(
    joinEntity: { new(): J },       // entity class to join
    joinAlias: string,               // alias for the join
    joinCondition: string,           // e.g., 'entity.id = questionnaire.assessmentId'
    filters?: FindOptionsWhere<T>,   // filters applied only on base entity
    joinType: 'inner' | 'left' = 'left',
  ): Promise<Array<T & { [key in typeof joinAlias]?: J }>> {  // <-- join optional
    const qb = this.repo.createQueryBuilder('entity');

    // Apply filters
    if (filters) {
      qb.where(filters);
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





}
