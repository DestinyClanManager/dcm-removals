describe('removal service', () => {
  let subject, removalRepository

  beforeEach(() => {
    removalRepository = td.replace('../../../../src/repositories/removal-repository')
    subject = require('../../../../src/services/removal-service')
  })

  describe('getClanRemovalHistory', () => {
    let actual

    beforeEach(async () => {
      td.when(removalRepository.findAllByClanId('clan-id')).thenResolve('removed-members')

      actual = await subject.getClanRemovalHistory('clan-id')
    })

    it('returns the removed members', () => {
      expect(actual).toEqual('removed-members')
    })
  })

  describe('addRemovalToHistory', () => {
    let actual

    beforeEach(async () => {
      td.when(removalRepository.save('clan-id', 'removal')).thenResolve('removal-with-id')
      actual = await subject.addRemovalToHistory('clan-id', 'removal')
    })

    it('returns the added removal', () => {
      expect(actual).toEqual('removal-with-id')
    })
  })
})
