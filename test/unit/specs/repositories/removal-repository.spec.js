describe('removal repository', () => {
  let subject, dbProvider, uuid

  beforeEach(() => {
    dbProvider = td.replace('../../../../src/providers/database-provider')
    uuid = td.replace('uuid/v4')
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

  describe('save', () => {
    let actual, get, put

    beforeEach(() => {
      td.when(uuid()).thenReturn('generated-id')
    })

    describe('when there are no existing removals for the clan', () => {
      beforeEach(async () => {
        const getPromise = td.func()
        const putPromise = td.func()
        get = td.func()
        put = td.func()

        td.when(get(td.matchers.anything())).thenReturn({ promise: getPromise })
        td.when(getPromise()).thenResolve({})
        td.when(put(td.matchers.anything())).thenReturn({ promise: putPromise })
        td.when(dbProvider.getInstance()).thenReturn({ get, put })

        const removal = {
          adminMembershipId: 'admin-membership-id',
          adminMembershipType: 'bungienet',
          removalDate: '2019-01-01',
          removedGamertag: 'removed-gamertag',
          removedMembershipId: 'removed-membership-id'
        }
        actual = await subject.save('clan-id', removal)
      })

      it('looks for existing removals', () => {
        const expectedGetQuery = {
          TableName: 'removals_table',
          Key: { id: 'clan-id' }
        }
        td.verify(get(expectedGetQuery))
      })

      it('returns the saved removal with a generated id', () => {
        expect(actual).toEqual({
          adminMembershipId: 'admin-membership-id',
          adminMembershipType: 'bungienet',
          removalDate: '2019-01-01',
          removedGamertag: 'removed-gamertag',
          removedMembershipId: 'removed-membership-id',
          id: 'generated-id'
        })
      })

      it('creates removal history for the clan', () => {
        const expectedPutQuery = {
          TableName: 'removals_table',
          Item: {
            id: 'clan-id',
            removals: [actual]
          }
        }
        td.verify(put(expectedPutQuery))
      })
    })

    describe('when there are existing removals for the clan', () => {
      beforeEach(async () => {
        const getPromise = td.func()
        const putPromise = td.func()
        get = td.func()
        put = td.func()

        td.when(get(td.matchers.anything())).thenReturn({ promise: getPromise })
        td.when(getPromise()).thenResolve({
          Item: {
            clanId: 'clan-id',
            removals: [{ id: 1 }]
          }
        })
        td.when(put(td.matchers.anything())).thenReturn({ promise: putPromise })
        td.when(dbProvider.getInstance()).thenReturn({ get, put })

        const removal = {
          adminMembershipId: 'admin-membership-id',
          adminMembershipType: 'bungienet',
          removalDate: '2019-01-01',
          removedGamertag: 'removed-gamertag',
          removedMembershipId: 'removed-membership-id'
        }
        actual = await subject.save('clan-id', removal)
      })

      it('looks for existing removals', () => {
        const expectedGetQuery = {
          TableName: 'removals_table',
          Key: { id: 'clan-id' }
        }
        td.verify(get(expectedGetQuery))
      })

      it('returns the saved removal with a generated id', () => {
        expect(actual).toEqual({
          adminMembershipId: 'admin-membership-id',
          adminMembershipType: 'bungienet',
          removalDate: '2019-01-01',
          removedGamertag: 'removed-gamertag',
          removedMembershipId: 'removed-membership-id',
          id: 'generated-id'
        })
      })

      it('adds the new removal to the existing history', () => {
        const expectedPutQuery = {
          TableName: 'removals_table',
          Item: {
            id: 'clan-id',
            removals: [{ id: 1 }, actual]
          }
        }
        td.verify(put(expectedPutQuery))
      })
    })
  })

  describe('saveAll', () => {
    let actual, get, put

    beforeEach(() => {
      td.when(uuid()).thenReturn('generated-id')
    })

    describe('when there are no existing removals for the clan', () => {
      beforeEach(async () => {
        const getPromise = td.func()
        const putPromise = td.func()
        get = td.func()
        put = td.func()

        td.when(get(td.matchers.anything())).thenReturn({ promise: getPromise })
        td.when(getPromise()).thenResolve({})
        td.when(put(td.matchers.anything())).thenReturn({ promise: putPromise })
        td.when(dbProvider.getInstance()).thenReturn({ get, put })

        const removals = [
          {
            adminMembershipId: 'admin-membership-id',
            adminMembershipType: 'bungienet',
            removalDate: '2019-01-01',
            removedGamertag: 'removed-gamertag-1',
            removedMembershipId: 'removed-membership-id-1'
          },
          {
            adminMembershipId: 'admin-membership-id',
            adminMembershipType: 'bungienet',
            removalDate: '2019-01-01',
            removedGamertag: 'removed-gamertag-2',
            removedMembershipId: 'removed-membership-id-2'
          }
        ]
        actual = await subject.saveAll('clan-id', removals)
      })

      it('looks for existing removals', () => {
        const expectedGetQuery = {
          TableName: 'removals_table',
          Key: { id: 'clan-id' }
        }
        td.verify(get(expectedGetQuery))
      })

      it('returns the saved removals with generated ids', () => {
        expect(actual).toEqual([
          {
            adminMembershipId: 'admin-membership-id',
            adminMembershipType: 'bungienet',
            removalDate: '2019-01-01',
            removedGamertag: 'removed-gamertag-1',
            removedMembershipId: 'removed-membership-id-1',
            id: 'generated-id'
          },
          {
            adminMembershipId: 'admin-membership-id',
            adminMembershipType: 'bungienet',
            removalDate: '2019-01-01',
            removedGamertag: 'removed-gamertag-2',
            removedMembershipId: 'removed-membership-id-2',
            id: 'generated-id'
          }
        ])
      })

      it('creates removal history for the clan', () => {
        const expectedPutQuery = {
          TableName: 'removals_table',
          Item: {
            id: 'clan-id',
            removals: [
              {
                adminMembershipId: 'admin-membership-id',
                adminMembershipType: 'bungienet',
                removalDate: '2019-01-01',
                removedGamertag: 'removed-gamertag-1',
                removedMembershipId: 'removed-membership-id-1',
                id: 'generated-id'
              },
              {
                adminMembershipId: 'admin-membership-id',
                adminMembershipType: 'bungienet',
                removalDate: '2019-01-01',
                removedGamertag: 'removed-gamertag-2',
                removedMembershipId: 'removed-membership-id-2',
                id: 'generated-id'
              }
            ]
          }
        }
        td.verify(put(expectedPutQuery))
      })
    })

    describe('when there are existing removals for the clan', () => {
      beforeEach(async () => {
        const getPromise = td.func()
        const putPromise = td.func()
        get = td.func()
        put = td.func()

        td.when(get(td.matchers.anything())).thenReturn({ promise: getPromise })
        td.when(getPromise()).thenResolve({
          Item: {
            clanId: 'clan-id',
            removals: [{ id: 1 }]
          }
        })
        td.when(put(td.matchers.anything())).thenReturn({ promise: putPromise })
        td.when(dbProvider.getInstance()).thenReturn({ get, put })

        const removals = [
          {
            adminMembershipId: 'admin-membership-id',
            adminMembershipType: 'bungienet',
            removalDate: '2019-01-01',
            removedGamertag: 'removed-gamertag-1',
            removedMembershipId: 'removed-membership-id-1'
          },
          {
            adminMembershipId: 'admin-membership-id',
            adminMembershipType: 'bungienet',
            removalDate: '2019-01-01',
            removedGamertag: 'removed-gamertag-2',
            removedMembershipId: 'removed-membership-id-2'
          }
        ]
        actual = await subject.saveAll('clan-id', removals)
      })

      it('looks for existing removals', () => {
        const expectedGetQuery = {
          TableName: 'removals_table',
          Key: { id: 'clan-id' }
        }
        td.verify(get(expectedGetQuery))
      })

      it('returns the saved removals with generated ids', () => {
        expect(actual).toEqual([
          {
            adminMembershipId: 'admin-membership-id',
            adminMembershipType: 'bungienet',
            removalDate: '2019-01-01',
            removedGamertag: 'removed-gamertag-1',
            removedMembershipId: 'removed-membership-id-1',
            id: 'generated-id'
          },
          {
            adminMembershipId: 'admin-membership-id',
            adminMembershipType: 'bungienet',
            removalDate: '2019-01-01',
            removedGamertag: 'removed-gamertag-2',
            removedMembershipId: 'removed-membership-id-2',
            id: 'generated-id'
          }
        ])
      })

      it('adds the new removal to the existing history', () => {
        const expectedPutQuery = {
          TableName: 'removals_table',
          Item: {
            id: 'clan-id',
            removals: [{ id: 1 }, ...actual]
          }
        }
        td.verify(put(expectedPutQuery))
      })
    })
  })
})
