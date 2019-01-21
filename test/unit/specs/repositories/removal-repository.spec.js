describe('removal repository', () => {
  let subject, dbProvider

  beforeEach(() => {
    dbProvider = td.replace('../../../../src/providers/database-provider')
    subject = require('../../../../src/repositories/removal-repository')
  })

  describe('findAllByClanId', () => {
    let actual, get

    beforeEach(async () => {
      const promise = td.func()
      get = td.func()

      td.when(get(td.matchers.anything())).thenReturn({ promise })
      td.when(promise()).thenResolve('removed-members')
      td.when(dbProvider.getInstance()).thenReturn({ get })

      actual = await subject.findAllByClanId('clan-id')
    })

    it('creates the correct query', () => {
      const expectedQuery = {
        TableName: 'removals_table',
        Key: { id: 'clan-id' }
      }
      td.verify(get(expectedQuery))
    })

    it('returns the removed members', () => {
      expect(actual).toEqual('removed-members')
    })
  })
})
