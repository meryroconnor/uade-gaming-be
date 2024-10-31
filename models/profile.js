const Profile = sequelize.define('Profile', {
    image: { type: DataTypes.STRING, allowNull: true },
    name: { type: DataTypes.STRING, allowNull: true },
    lastName: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
    dateOfBirth: { type: DataTypes.DATE, allowNull: true }
});
  
module.exports = Profile;