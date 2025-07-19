'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Submission, {
        foreignKey: 'userid',
        as: 'submissions'
      });
    }
  }
  User.init({
    userid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    exp: DataTypes.INTEGER,
    rankPoint: DataTypes.INTEGER,
    provider: DataTypes.STRING,
    providerId: DataTypes.STRING,
    isAuthenticated: DataTypes.BOOLEAN,
    bio: DataTypes.TEXT,
    isTwoFactored: DataTypes.BOOLEAN,
    profilePicture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    freezeTableName: true,
  });
  return User;
};