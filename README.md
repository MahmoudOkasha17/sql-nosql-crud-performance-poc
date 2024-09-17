# Sql-Nosql-Crud-Performance-Poc

This document outlines a proof of concept (POC) designed to compare the performance of SQL(Postgres + Sequelize) and NoSQL(MongoDB + Mongoose) databases in handling basic CRUD (Create, Read, Update, Delete) operations. The goal is to provide insights into the strengths and weaknesses of each database paradigm for various data manipulation tasks.

This Project was based on [@takuyadev](https://github.com/takuyadev) template project [node-express-typescript](https://github.com/takuyadev/node-express-typescript)

# Setup

## Environment Variables

1. Copy `.env.example`, and rename to `.env`
2. Configure newly copied `.env` file

## Development

> This project was setup using Node.js v18.18.2. Please use specified version for best experience.

1. Install dependencies with `npm ci`
2. Run the user seed process `npm run seed-users`
3. Start development server with `npm run dev` or run the compare performance script `npm run compare-performance`

## Adding extra path aliases

If you add extra folders to this template and would like to use them with aliases, then go through following:

1. Go into `tsconfig.json`
2. Add extra paths inside of `{ paths: ... }` (for tsconfig-paths)
3. Go into `package.json`
4. Add extra paths inside of `{_moduleAliases: ... }` (for production build)

# Findings

The following are the findings from the POC:

| Type               | Time     |
| ------------------ | -------- |
| mongoose           | 72.058s  |
| mongooseLeaned     | 42.773s  |
| mongooseAggregated | 114.947s |
| sequelize          | 41.905s  |
| sequelizeLeaned    | 21.441s  |
| sequelizeRaw       | 10.924s  |

I ran two tests each on 100 ,1000,10000,100000,400000 user record

1. read all the user records
2. read all the records and populate all user file records (5 total for each)

## SQL (Postgres + Sequelize)

On average, Sequelize outperforms Mongoose across various document read operations, both with and without user files. The performance improvement is particularly notable in operations that involve raw data access or 'leaned' document reads, where less data processing is required.

### Observations:

- **Raw Data Access**: Accessing data in its raw form ( raw sql ) using Sequelize shows the fastest response times.

- **Lean Queries**: It is to note that sequelize would max out my 32gb memory and crash v8 garbage collection even with leaned `raw:true` when I ran the query on 1 million record which suggests sequelize does a lot of processing to the data in memory even when only the raw data is required.

## NoSQL (MongoDB + Mongoose)

While Sequelize shows superior performance in the scenarios tested, Mongoose with MongoDB still offers certain advantages that can be beneficial depending on the application's needs.

### Observations:

- **Raw Data Access**: Accessing data in its raw form ( aggregated ) using mongoose was generally faster but it ended up being slower when adding $lookup ,I tested with $lookup using the pipeline field and foreignField , localField , the latter was way faster , but i choose to stick with pipeline as in general it is the most used way in bigger apps.

- **Lean Queries**: Unlike sequelize ,mongoose lean option didn't crash or overuse my memory when I ran tests at 1 million record , it was the same as aggregations.

### Conclusion

As the number of documents increases, the gap in performance between Sequelize and Mongoose widens, especially when user files are involved, though high throughput tests would be better suited to see which one would scale better.
