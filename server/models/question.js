'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Question.hasMany(models.Submission, {
        foreignKey: 'questionid',
        as: 'submissions'
      });
      Question.hasMany(models.Testcase, {
        foreignKey: 'questionid',
        as: 'testcases'
      });
    }
  }
  Question.init({
    questionid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    input_type: DataTypes.TEXT,
    output_type: DataTypes.TEXT,
    example: DataTypes.TEXT,
    ques_constraint: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Question',
    tableName: 'question',
    freezeTableName: true,
  });
  return Question;
};