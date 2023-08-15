const Sequelize=require('sequelize');


module.exports = class Map extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
            storeId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type:Sequelize.INTEGER,
                allowNull:true,
                references: {
                    model: {
                        tableName:'user_table',
                        key:'user_id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE',
                }
            },
            name: {
                type: Sequelize.STRING(225),
                allownNull:true,
            },
            lng: {
                type: Sequelize.DOUBLE,
                allownNull:false
            },
            lat: {
                type: Sequelize.DOUBLE,
                allownNull: false,
            },
            create_data: {
                type: Sequelize.DATE,
                allownNull:false,
                defaultValue: Sequelize.NOW,
            },
        }, 
        {
            sequelize,
            timestamps: false,
            modelName: 'Map',
            tableName: 'user_map',
            paranoid : false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db) {
        db.Map.belongsTo(db.User, { foreignKey: 'userId', as:'user'});
    }
};