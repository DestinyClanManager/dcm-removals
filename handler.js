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

module.exports.getRemovalHistory = (event, context, callback) => {
  const clanId = event.pathParameters.clanId
  const query = {
    TableName: process.env.REMOVALS_TABLE,
    Key: { id: clanId }
  }

  dynamoDb.get(query, (error, result) => {
    if (error) {
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
  })
}

module.exports.addRemovalToHistory = (event, context, callback) => {
  const clanId = event.pathParameters.clanId
  const newRemoval = JSON.parse(event.body)

  newRemoval.id = uuid()

  const query = {
    TableName: process.env.REMOVALS_TABLE,
    Key: { id: clanId }
  }

  dynamoDb.get(query, (error, result) => {
    if (error) {
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

      dynamoDb.put(createProfileQuery, error => {
        if (error) {
          handleError(error, callback)
        }

        const response = {
          statusCode: 201,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: newRemoval
        }

        callback(null, response)
      })
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

    dynamoDb.put(saveQuery, error => {
      if (error) {
        handleError(error, callback)
      }

      const response = {
        statusCode: 201,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(newRemoval)
      }

      callback(null, response)
    })
  })
}
