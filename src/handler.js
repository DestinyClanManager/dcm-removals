const removalService = require('./services/removal-service')

function handleError(error, callback) {
  if (process.env.ENABLE_LOGGING === true || process.env.ENABLE_LOGGING === 'true') {
    console.error(error)
  }

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
    handleError(error, callback)
    return
  }

  const response = {
    statusCode: 201,
    body: JSON.stringify(createdRemoval)
  }

  callback(null, response)
}

module.exports.addRemovalsToHistory = async (event, _context, callback) => {
  const { clanId } = event.pathParameters
  const removals = JSON.parse(event.body)

  let createdRemovals
  try {
    createdRemovals = await removalService.addRemovalsToHistory(clanId, removals)
  } catch (error) {
    handleError(error, callback)
    return
  }

  const response = {
    statusCode: 201,
    body: JSON.stringify(createdRemovals)
  }

  callback(null, response)
}
