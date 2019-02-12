const removalRepository = require('../repositories/removal-repository')

module.exports.getClanRemovalHistory = async clanId => await removalRepository.findAllByClanId(clanId)

module.exports.addRemovalToHistory = async (clanId, removal) => await removalRepository.save(clanId, removal)

module.exports.addRemovalsToHistory = async (clanId, removals) => await removalRepository.saveAll(clanId, removals)
