import dotenv from 'dotenv';
dotenv.config();

import { connectToMongoDb } from '@/config/no-sql-db';
import { checkSequelizeConnection, sequelizeClient } from '@/config/sql-db';
import { generateUniqueIdSnowflake } from '@/helpers/unique-id-generator.helper';
import { UserFileMongooseModel } from '@/models/mongoose/user/user-file/user-file.model';
import { UserMongooseModel } from '@/models/mongoose/user/user.model';
import { UserFileSequelizeModel } from '@/models/sequelize/user/user-file/user-file.model';
import { UserSequelizeModel } from '@/models/sequelize/user/user.model';
import { BaseUserFileZodSchema } from '@/schemas/zod/user-file.schema';
import { BaseUserZodSchema } from '@/schemas/zod/user.schema';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import { z } from 'zod';
import * as cliProgress from 'cli-progress';

async function seedUsers(count: number) {
  try {
    await checkSequelizeConnection();
    await connectToMongoDb();

    await UserFileSequelizeModel.destroy({ where: {} });
    await Promise.all([
      UserSequelizeModel.destroy({ where: {} }),
      UserMongooseModel.deleteMany({}),
      UserFileMongooseModel.deleteMany({})
    ]);

    const bar = new cliProgress.SingleBar({}, cliProgress.Presets.legacy);

    bar.start(count, 0);

    let batchSize = 10000;
    let totalSeeded = 0;
    let userFilesPerUser = 5;

    while (totalSeeded < count) {
      const users: z.infer<typeof BaseUserZodSchema>[] = [];
      const currentBatchSize = Math.min(batchSize, count - totalSeeded);

      for (let i = 0; i < currentBatchSize; i++) {
        users.push({
          _id: generateUniqueIdSnowflake(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName()
        });
      }

      await Promise.all([
        UserSequelizeModel.bulkCreate(users, { logging: false }),
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

      const userFiles: z.infer<typeof BaseUserFileZodSchema>[] = [];

      for (const user of users) {
        for (let i = 0; i < userFilesPerUser; i++) {
          userFiles.push({
            _id: generateUniqueIdSnowflake(),
            userId: user._id,
            fileName: faker.system.fileName(),
            fileType: faker.system.fileType()
          });
        }
      }

      await Promise.all([
        UserFileSequelizeModel.bulkCreate(userFiles, { logging: false }),
        UserFileMongooseModel.bulkWrite(
          userFiles.map((u) => {
            return {
              insertOne: {
                document: u
              }
            };
          })
        )
      ]);

      totalSeeded += currentBatchSize;
      bar.update(totalSeeded);
    }

    bar.stop();
    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelizeClient.close();
    await mongoose.connection.close();
  }
}

seedUsers(1000000);
