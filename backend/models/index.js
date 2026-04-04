const User = require('./User');
const Earning = require('./Earning');
const Claim = require('./Claim');
const Subscription = require('./Subscription');

User.hasMany(Earning, { foreignKey: 'user_id' });
Earning.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Claim, { foreignKey: 'user_id' });
Claim.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Subscription, { foreignKey: 'user_id' });
Subscription.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
    User,
    Earning,
    Claim,
    Subscription
};
