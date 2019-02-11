const removalRepository = require('../repositories/removal-repository')

module.exports.getClanRemovalHistory = async clanId => await removalRepository.findAllByClanId(clanId)

module.exports.addRemovalToHistory = async (clanId, removal) => await removalRepository.save(clanId, removal)
