import dotenv from 'dotenv';
dotenv.config();

import { connectToMongoDb } from '@/config/no-sql-db';
import { checkSequelizeConnection, sequelizeClient } from '@/config/sql-db';
import { UserMongooseModel } from '@/models/mongoose/user/user.model';
import { UserFileSequelizeModel } from '@/models/sequelize/user/user-file/user-file.model';
import { UserSequelizeModel } from '@/models/sequelize/user/user.model';
import mongoose from 'mongoose';
import { QueryTypes } from 'sequelize';

interface IStats {
  mongoose: number;
  mongooseAggregated: number;
  sequelize: number;
  sequelizeRaw: number;
}

async function comparePerformance() {
  try {
    await checkSequelizeConnection();
    await connectToMongoDb();

    let stats: IStats = {
      mongoose: 0,
      mongooseAggregated: 0,
      sequelize: 0,
      sequelizeRaw: 0
    };

    const testCases = [100, 1000, 10000, 100000, 400000];

    for (const count of testCases) {
      const justDocsStats = await testCaseJustDocs(count);
      const docsWithUserFilesStats = await testCaseDocsWithUserFiles(count);

      for (const key in stats) {
        stats[key as keyof IStats] += justDocsStats[key as keyof IStats] + docsWithUserFilesStats[key as keyof IStats];
      }
    }

    //convert to seconds
    for (const key in stats) {
      stats[key as keyof IStats] = stats[key as keyof IStats] / 1000;
    }

    console.table(stats);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelizeClient.close();
    await mongoose.connection.close();
  }
}

async function testCaseJustDocs(count: number) {
  console.log(`READING ${count} DOCUMENTS------------------------------`);

  const stats: IStats = {
    mongoose: 0,
    mongooseAggregated: 0,
    sequelize: 0,
    sequelizeRaw: 0
  };

  let startDate = Date.now();

  // Reading documents
  console.time(`Mongoose Reading ${count} documents`);
  await UserMongooseModel.find({}, { _id: 1, firstName: 1, lastName: 1, createdAt: 1, updatedAt: 1 }).limit(count);
  let endDate = Date.now();
  stats.mongoose += endDate - startDate;
  console.timeEnd(`Mongoose Reading ${count} documents`);

  console.time(`Sequelize Reading ${count} documents`);
  startDate = Date.now();
  await UserSequelizeModel.findAll({
    limit: count,
    attributes: ['_id', 'firstName', 'lastName', 'createdAt', 'updatedAt'],
    logging: false
  });
  endDate = Date.now();
  stats.sequelize += endDate - startDate;
  console.timeEnd(`Sequelize Reading ${count} documents`);

  // Reading documents Raw
  console.time(`Mongoose Reading ${count} documents Aggregated`);
  startDate = Date.now();
  await UserMongooseModel.aggregate([
    { $limit: count },
    { $project: { _id: 1, firstName: 1, lastName: 1, createdAt: 1, updatedAt: 1 } }
  ]);
  endDate = Date.now();
  stats.mongooseAggregated += endDate - startDate;
  console.timeEnd(`Mongoose Reading ${count} documents Aggregated`);

  console.time(`Sequelize Reading ${count} documents Raw`);
  startDate = Date.now();
  await sequelizeClient.query(
    `SELECT "_id", "firstName", "lastName", "createdAt", "updatedAt" FROM "Users" AS "User" LIMIT ?`,
    {
      replacements: [count],
      type: QueryTypes.SELECT,
      logging: false
    }
  );
  endDate = Date.now();
  stats.sequelizeRaw += endDate - startDate;
  console.timeEnd(`Sequelize Reading ${count} documents Raw`);

  console.log('---------------------------------------------------');

  return stats;
}

async function testCaseDocsWithUserFiles(count: number) {
  console.log(`READING ${count} DOCUMENTS WITH USER FILES------------------------------`);

  const stats: IStats = {
    mongoose: 0,
    mongooseAggregated: 0,
    sequelize: 0,
    sequelizeRaw: 0
  };

  let startDate = Date.now();

  // Reading documents
  console.time(`Mongoose Reading ${count} documents`);
  await UserMongooseModel.find({}, { _id: 1, firstName: 1, lastName: 1, createdAt: 1, updatedAt: 1, files: 1 })
    .limit(count)
    .populate('files', { _id: 1, fileName: 1, fileType: 1, createdAt: 1, updatedAt: 1 });
  let endDate = Date.now();
  stats.mongoose += endDate - startDate;
  console.timeEnd(`Mongoose Reading ${count} documents`);

  console.time(`Sequelize Reading ${count} documents`);
  startDate = Date.now();
  await UserSequelizeModel.findAll({
    limit: count,
    attributes: ['_id', 'firstName', 'lastName', 'createdAt', 'updatedAt'],
    include: {
      model: UserFileSequelizeModel,
      as: 'files',
      attributes: ['_id', 'fileName', 'fileType', 'createdAt', 'updatedAt']
    },
    logging: false
  });
  endDate = Date.now();
  stats.sequelize += endDate - startDate;
  console.timeEnd(`Sequelize Reading ${count} documents`);

  // Reading documents Raw
  console.time(`Mongoose Reading ${count} documents Aggregated`);
  startDate = Date.now();
  await UserMongooseModel.aggregate([
    { $limit: count },
    // {
    //   $lookup: {
    //     from: 'userfiles',
    //     localField: '_id',
    //     foreignField: 'userId',
    //     as: 'files'
    //   }
    // },
    // {
    //   $addFields: {
    //     files: {
    //       $map: {
    //         input: '$files',
    //         as: 'file',
    //         in: {
    //           _id: '$$file._id',
    //           fileName: '$$file.fileName',
    //           fileType: '$$file.fileType',
    //           createdAt: '$$file.createdAt',
    //           updatedAt: '$$file.updatedAt'
    //         }
    //       }
    //     }
    //   }
    // },
    {
      $lookup: {
        from: 'userfiles',
        let: { userId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$userId', { $ifNull: ['$$userId', null] }]
              }
            }
          },
          { $project: { _id: 1, fileName: 1, fileType: 1, createdAt: 1, updatedAt: 1 } }
        ],
        as: 'files'
      }
    },
    { $project: { _id: 1, firstName: 1, lastName: 1, files: 1, createdAt: 1, updatedAt: 1 } }
  ]);
  endDate = Date.now();
  stats.mongooseAggregated += endDate - startDate;
  console.timeEnd(`Mongoose Reading ${count} documents Aggregated`);

  console.time(`Sequelize Reading ${count} documents Raw`);
  startDate = Date.now();
  await sequelizeClient.query(
    `SELECT
	"User".*,
	(
		SELECT
			JSON_AGG("file")
		FROM
			"UserFiles" AS "file"
		WHERE
			"User"."_id" = "file"."userId"
	) AS "files"
FROM
	"Users" AS "User"
LIMIT
	?;`,
    {
      replacements: [count],
      type: QueryTypes.SELECT,
      logging: false
    }
  );
  endDate = Date.now();
  stats.sequelizeRaw += endDate - startDate;
  console.timeEnd(`Sequelize Reading ${count} documents Raw`);

  console.log('---------------------------------------------------');
  return stats;
}

comparePerformance();
