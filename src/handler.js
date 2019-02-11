const AWS = require('aws-sdk')
const uuid = require('uuid/v4')
const dynamoDb = new AWS.DynamoDB.DocumentClient()
const removalService = require('./services/removal-service')

function handleError(error, callback) {
  callback(error, {
    statusCode: 500,
    body: JSON.stringify(error)
  })
}

module.exports.getRemovalHistory = async function(event, _context, callback) {
  const { clanId } = event.pathParameters

  let clanRemovalHistory
  try {
    clanRemovalHistory = await removalService.getClanRemovalHistory(clanId)
  } catch (error) {
    console.error(error)
    handleError(error, callback)
    return
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(clanRemovalHistory)
  }

  callback(null, response)
}

module.exports.addRemovalToHistory = async (event, _context, callback) => {
  const { clanId } = event.pathParameters
  const removal = JSON.parse(event.body)

  let createdRemoval
  try {
    createdRemoval = await removalService.addRemovalToHistory(clanId, removal)
  } catch (error) {
    console.error(error)
    handleError(error, callback)
    return
  }

  const response = {
    statusCode: 201,
    body: JSON.stringify(createdRemoval)
  }

  callback(null, response)
}

module.exports.addRemovalsToHistory = async (event, context, callback) => {
  const clanId = event.pathParameters.clanId
  const newRemovals = JSON.parse(event.body)

  newRemovals.forEach(removal => {
    removal.id = uuid()
  })

  const query = {
    TableName: process.env.REMOVALS_TABLE,
    Key: { id: clanId }
  }

  let result
  try {
    result = await dynamoDb.get(query).promise()
  } catch (error) {
    console.error(error)
    handleError(error, callback)
  }

  if (!result.Item) {
    const createProfileQuery = {
      TableName: process.env.REMOVALS_TABLE,
      Item: {
        id: clanId,
        removals: newRemovals
      }
    }

    try {
      await dynamoDb.put(createProfileQuery).promise()
    } catch (error) {
      console.error(error)
      handleError(error, callback)
    }

    const response = {
      statusCode: 201,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(newRemoval)
    }

    callback(null, response)
    return
  }

  const history = result.Item.removals

  const saveQuery = {
    TableName: process.env.REMOVALS_TABLE,
    Item: {
      id: `${clanId}`,
      removals: history.concat(newRemovals)
    }
  }

  try {
    await dynamoDb.put(saveQuery).promise()
  } catch (error) {
    console.error(error)
    handleError(error, callback)
  }

  const response = {
    statusCode: 201,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(newRemovals)
  }

  callback(null, response)
}
