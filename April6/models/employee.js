"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Employee.belongsTo(models.Company, {
        foreignKey: "companyId",
        onDelete: "CASCADE",
      });
    }
  }
  Employee.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      designation: {
        type: DataTypes.STRING,
        defaultValue: false,
      },
      salary: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Employee",
    }
  );
  return Employee;
};
