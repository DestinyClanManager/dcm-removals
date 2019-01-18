const AWS = require('aws-sdk')
const uuid = require('uuid/v4')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

function handleError(error, callback) {
  callback(error, {
    statusCode: 500,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })
}

module.exports.getRemovalHistory = async function(event, context, callback) {
  const clanId = event.pathParameters.clanId
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

  const response = {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' }
  }

  if (!result.Item) {
    response.body = '[]'
  } else {
    response.body = JSON.stringify(result.Item.removals)
  }

  callback(null, response)
}

module.exports.addRemovalToHistory = async (event, context, callback) => {
  const clanId = event.pathParameters.clanId
  const newRemoval = JSON.parse(event.body)

  newRemoval.id = uuid()

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
        removals: [newRemoval]
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
  history.push(newRemoval)

  const saveQuery = {
    TableName: process.env.REMOVALS_TABLE,
    Item: {
      id: `${clanId}`,
      removals: history
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
    body: JSON.stringify(newRemoval)
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