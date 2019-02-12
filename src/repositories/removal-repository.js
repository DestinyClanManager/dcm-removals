const uuid = require('uuid/v4')
const dbProvider = require('../providers/database-provider')

module.exports.findAllByClanId = async clanId => {
  const db = dbProvider.getInstance()
  const query = {
    TableName: process.env.REMOVALS_TABLE,
    Key: { id: clanId }
  }

  return await db.get(query).promise()
}

module.exports.save = async (clanId, removal) => {
  const db = dbProvider.getInstance()
  const getQuery = {
    TableName: process.env.REMOVALS_TABLE,
    Key: { id: clanId }
  }

  const result = await db.get(getQuery).promise()

  removal.id = uuid()

  const removalHistory = !result.Item ? [removal] : [...result.Item.removals, removal]

  const putQuery = {
    TableName: process.env.REMOVALS_TABLE,
    Item: {
      id: clanId,
      removals: removalHistory
    }
  }

  await db.put(putQuery).promise()

  return removal
}

module.exports.saveAll = async (clanId, removals) => {
  const db = dbProvider.getInstance()
  const getQuery = {
    TableName: process.env.REMOVALS_TABLE,
    Key: { id: clanId }
  }

  const result = await db.get(getQuery).promise()

  removals.forEach(r => (r.id = uuid()))

  const removalHistory = !result.Item ? removals : [...result.Item.removals, ...removals]

  const putQuery = {
    TableName: process.env.REMOVALS_TABLE,
    Item: {
      id: clanId,
      removals: removalHistory
    }
  }

  await db.put(putQuery).promise()

  return removals
}
