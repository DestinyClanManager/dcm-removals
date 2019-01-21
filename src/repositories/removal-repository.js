const dbProvider = require('../providers/database-provider')

module.exports.findAllByClanId = async clanId => {
  const db = dbProvider.getInstance()
  const query = {
    TableName: process.env.REMOVALS_TABLE,
    Key: { id: clanId }
  }

  return await db.get(query).promise()
}
