'use strict';
import { Model } from 'sequelize';  
export default (sequelize, DataTypes) => {
  class Testcase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Testcase.belongsTo(models.Question, {
        foreignKey: 'questionid',
        as: 'question'
      });
    }
  }
  Testcase.init({
    testcaseid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    questionid: DataTypes.INTEGER,
    ispublic: DataTypes.BOOLEAN,
    input: DataTypes.TEXT,
    expected_output: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Testcase',
    tableName: 'testcase',
    freezeTableName: true,
  });
  return Testcase;
};