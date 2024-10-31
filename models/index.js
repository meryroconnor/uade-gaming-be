const Cart = require('./cart');
const CartItem = require('./cartItem');
const Game = require('./game');
const Comment = require('./comment');
const User = require('./user');
const Company = require('./company');
const Order = require('./order');
const OrderItem = require('./orderItem');
const PaymentMethod = require('./paymentMethod');
const Wishlist = require('./wishlist');

// Relaciones
Cart.hasMany(CartItem, { foreignKey: 'cartId', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

Game.hasMany(CartItem, { foreignKey: 'gameId' });
CartItem.belongsTo(Game, { foreignKey: 'gameId' });


// Relaciones entre Comment y Game
Game.hasMany(Comment, { foreignKey: 'gameId', onDelete: 'CASCADE' });
Comment.belongsTo(Game, { foreignKey: 'gameId' });

// Relaciones entre Comment y User
User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId' });

// Relación entre Company y Game
Company.hasMany(Game, { foreignKey: 'companyId', onDelete: 'CASCADE' });
Game.belongsTo(Company, { foreignKey: 'companyId' });

// Relación entre Order y User
User.hasMany(Order, { foreignKey: 'userId', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'userId' });

// Relación entre Order y OrderItem
Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

// Relación entre Game y OrderItem
Game.hasMany(OrderItem, { foreignKey: 'gameId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Game, { foreignKey: 'gameId' });

// Relación entre User y PaymentMethod
User.hasMany(PaymentMethod, { foreignKey: 'userId', onDelete: 'CASCADE' });
PaymentMethod.belongsTo(User, { foreignKey: 'userId' });

// Relación entre User y Wishlist
User.hasMany(Wishlist, { foreignKey: 'userId', onDelete: 'CASCADE' });
Wishlist.belongsTo(User, { foreignKey: 'userId' });

// Relación entre Game y Wishlist
Game.hasMany(Wishlist, { foreignKey: 'gameId', onDelete: 'CASCADE' });
Wishlist.belongsTo(Game, { foreignKey: 'gameId' });

User.belongsToMany(Game, { through: Wishlist, foreignKey: 'userId' });
Game.belongsToMany(User, { through: Wishlist, foreignKey: 'gameId' });