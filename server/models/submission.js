'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Submission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Submission.belongsTo(models.User, {
        foreignKey: 'userid',
        as: 'user'
      });
      Submission.belongsTo(models.Question, {
        foreignKey: 'questionid',
        as: 'question'
      });
    }
  }
  Submission.init({
    submissionid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    questionid: DataTypes.INTEGER,
    languageid: DataTypes.INTEGER,
    userid: DataTypes.INTEGER,
    codeText: DataTypes.TEXT,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Submission',
    tableName: 'submission',
    freezeTableName: true,
  });
  return Submission;
};