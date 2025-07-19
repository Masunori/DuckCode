import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';
import config from '../config/database.js';

// Import models directly
import User from './user.js';
import Question from './question.js';
import Testcase from './testcase.js';
import Submission from './submission.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];
const db = {};

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

// Initialize models
db.User = User(sequelize, Sequelize.DataTypes);
db.Question = Question(sequelize, Sequelize.DataTypes);
db.Testcase = Testcase(sequelize, Sequelize.DataTypes);
db.Submission = Submission(sequelize, Sequelize.DataTypes);

// Set up associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
