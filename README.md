# sql-nosql-crud-performance-poc

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
