const removalRepository = require('../repositories/removal-repository')

module.exports.getClanRemovalHistory = async clanId => await removalRepository.findAllByClanId(clanId)
