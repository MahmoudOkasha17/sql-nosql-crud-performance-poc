import dotenv from 'dotenv';
dotenv.config();

import { connectToMongoDb } from '@/config/no-sql-db';
import { checkSequelizeConnection, sequelizeClient } from '@/config/sql-db';
import { UserFileMongooseModel } from '@/models/mongoose/user/user-file/user-file.model';
import { UserMongooseModel } from '@/models/mongoose/user/user.model';
import { UserFileSequelizeModel } from '@/models/sequelize/user/user-file/user-file.model';
import { UserSequelizeModel } from '@/models/sequelize/user/user.model';
import {
  BaseUserFileZodSchema,
  MongooseUserFileZodSchema,
  SequelizeUserFileZodSchema
} from '@/schemas/zod/user-file.schema';
import { BaseUserZodSchema } from '@/schemas/zod/user.schema';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import { z } from 'zod';

async function seedUsers(count: number) {
  try {
    await checkSequelizeConnection();
    await connectToMongoDb();

    await Promise.all([UserSequelizeModel.drop(), UserMongooseModel.deleteMany({})]);
    await UserSequelizeModel.sync();

    let batchSize = 10000;
    let totalSeeded = 0;

    while (totalSeeded < count) {
      const users: z.infer<typeof BaseUserZodSchema>[] = [];
      const currentBatchSize = Math.min(batchSize, count - totalSeeded);

      for (let i = 0; i < currentBatchSize; i++) {
        users.push({
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName()
        });
      }

      await Promise.all([
        UserSequelizeModel.bulkCreate(users),
        UserMongooseModel.bulkWrite(
          users.map((u) => {
            return {
              insertOne: {
                document: u
              }
            };
          })
        )
      ]);

      totalSeeded += currentBatchSize;
      console.log(`Seeded ${totalSeeded} users`);
    }

    let userFilesPerUser = 5;
    batchSize = batchSize / userFilesPerUser;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const [seqUsers, monUsers] = await Promise.all([
        UserSequelizeModel.findAll({
          limit: batchSize,
          offset: offset
        }),
        UserMongooseModel.find({}).limit(batchSize).skip(offset)
      ]);

      if (seqUsers.length === 0) {
        hasMore = false;
      } else {
        const seqUserFiles: z.infer<typeof SequelizeUserFileZodSchema>[] = [];
        const monUserFiles: z.infer<typeof MongooseUserFileZodSchema>[] = [];

        for (const [index, seqUser] of seqUsers.entries()) {
          for (let i = 0; i < userFilesPerUser; i++) {
            const baseData: z.infer<typeof BaseUserFileZodSchema> = {
              fileName: faker.system.fileName(),
              fileType: faker.system.fileType()
            };

            seqUserFiles.push({
              userId: seqUser._id as number,
              ...baseData
            });

            monUserFiles.push({
              userId: monUsers[index]._id,
              ...baseData
            });
          }
        }

        await Promise.all([
          UserFileSequelizeModel.bulkCreate(seqUserFiles),
          UserFileMongooseModel.bulkWrite(
            monUserFiles.map((u) => {
              return {
                insertOne: {
                  document: u
                }
              };
            })
          )
        ]);

        offset += batchSize;
      }
    }

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelizeClient.close();
    await mongoose.connection.close();
  }
}

seedUsers(1000000);
