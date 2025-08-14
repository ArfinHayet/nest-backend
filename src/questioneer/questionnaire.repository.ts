import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Questionnaire } from '../questioneer/questioneer.entity';
import { BaseRepository } from '../core/base.repository';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';
import { DeepPartial } from 'typeorm';

@Injectable()
export class QuestionnaireRepository extends BaseRepository<Questionnaire> {
  constructor(
    @InjectRepository(Questionnaire)
    private readonly questionnaireRepo: Repository<Questionnaire>,
  ) {
    super(questionnaireRepo);
  }


  async create(newData: Partial<CreateQuestionnaireDto>, desiredOrder?: number): Promise<Questionnaire> {
    const repo = this.repo;
    const tableName = repo.metadata.tableName;

    // Get current max order
    const maxOrderRow = await repo
      .createQueryBuilder(tableName)
      .select('MAX("order")', 'max')
      .getRawOne<{ max: number }>();

    const maxOrder = maxOrderRow?.max ?? 0;
    const newOrder = desiredOrder ?? maxOrder + 1;

    // Shift existing rows if inserting in the middle
    if (newOrder <= maxOrder) {
      await repo
        .createQueryBuilder()
        .update(tableName)
        .set({ order: () => `"order" + 1` } as any)
        .where('"order" >= :newOrder', { newOrder })
        .execute();
    }

    // Create and save new item
    const newItem = repo.create({ ...newData, order: newOrder } as DeepPartial<Questionnaire>) as Questionnaire;
    return repo.save(newItem);
  }


  /**
 * Update an entity and shift orders if needed
 */
  async update(
    id: number,
    updateData: Partial<UpdateQuestionnaireDto>,
    newOrder?: number
  ): Promise<Questionnaire> {
    const repo = this.repo;
    const tableName = repo.metadata.tableName;

    // 1️⃣ Find the existing item
    const item = await repo.findOneByOrFail({ id } as any);
    const oldOrder = item.order ?? 0;

    // 2️⃣ Only shift orders if newOrder is provided
    if (newOrder !== undefined && newOrder !== oldOrder) {
      if (newOrder < oldOrder) {
        // Shift up items between newOrder and oldOrder - 1
        await repo
          .createQueryBuilder()
          .update(tableName)
          .set({ order: () => `"order" + 1` } as any)
          .where('"order" >= :newOrder AND "order" < :oldOrder', { newOrder, oldOrder })
          .execute();
      } else {
        // Shift down items between oldOrder + 1 and newOrder
        await repo
          .createQueryBuilder()
          .update(tableName)
          .set({ order: () => `"order" - 1` } as any)
          .where('"order" <= :newOrder AND "order" > :oldOrder', { newOrder, oldOrder })
          .execute();
      }

      // Update the item's order
      item.order = newOrder;
    }

    // 3️⃣ Update other fields
    Object.assign(item, updateData);

    // 4️⃣ Save and return
    return repo.save(item);
  }


}
