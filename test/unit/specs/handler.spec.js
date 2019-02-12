describe('handler', () => {
  let subject, removalService, callback, event

  beforeEach(() => {
    callback = td.func()
    event = {
      pathParameters: { clanId: 'clan-id' }
    }

    removalService = td.replace('../../../src/services/removal-service')
    subject = require('../../../src/handler')
  })

  describe('getRemovalHistory', () => {
    describe('when everything goes ok', () => {
      beforeEach(async () => {
        td.when(removalService.getClanRemovalHistory('clan-id')).thenResolve('clan-removal-history')
        await subject.getRemovalHistory(event, null, callback)
      })

      it('responds with the removal history', () => {
        const expectedResponse = {
          statusCode: 200,
          body: JSON.stringify('clan-removal-history')
        }
        td.verify(callback(null, expectedResponse))
      })
    })

    describe('when there is an error', () => {
      let error

      beforeEach(async () => {
        error = new Error('oh no')
        td.when(removalService.getClanRemovalHistory('clan-id')).thenReject(error)

        await subject.getRemovalHistory(event, null, callback)
      })

      it('sends an error response', () => {
        const expectedResponse = {
          statusCode: 500,
          body: JSON.stringify(error)
        }
        td.verify(callback(error, expectedResponse))
      })
    })
  })

  describe('addRemovalToHistory', () => {
    describe('when everything goes ok', () => {
      beforeEach(async () => {
        const removal = {
          gamertag: 'removed-member'
        }
        event.body = JSON.stringify(removal)

        td.when(removalService.addRemovalToHistory('clan-id', removal)).thenResolve({
          gamertag: 'removed-member',
          id: 'generated-id'
        })

        await subject.addRemovalToHistory(event, null, callback)
      })

      it('responds with the added removal', () => {
        const expectedResponse = {
          statusCode: 201,
          body: JSON.stringify({
            gamertag: 'removed-member',
            id: 'generated-id'
          })
        }
        td.verify(callback(null, expectedResponse))
      })
    })

    describe('when there is an error', () => {
      let error

      beforeEach(async () => {
        const removal = {
          gamertag: 'removed-member'
        }
        event.body = JSON.stringify(removal)

        error = new Error('oh no')

        td.when(removalService.addRemovalToHistory('clan-id', removal)).thenReject(error)

        await subject.addRemovalToHistory(event, null, callback)
      })

      it('responds with an error response', () => {
        const expectedResponse = {
          statusCode: 500,
          body: JSON.stringify(error)
        }
        td.verify(callback(error, expectedResponse))
      })
    })
  })

  describe('addRemovalsToHistory', () => {
    describe('when everything goes ok', () => {
      beforeEach(async () => {
        const removals = [
          {
            gamertag: 'removed-member-1'
          },
          {
            gamertag: 'removed-member-2'
          }
        ]
        event.body = JSON.stringify(removals)

        td.when(removalService.addRemovalsToHistory('clan-id', removals)).thenResolve([
          {
            gamertag: 'removed-member-1',
            id: 'generated-id'
          },
          {
            gamertag: 'removed-member-2',
            id: 'generated-id'
          }
        ])

        await subject.addRemovalsToHistory(event, null, callback)
      })

      it('responds with the added removal', () => {
        const expectedResponse = {
          statusCode: 201,
          body: JSON.stringify([
            {
              gamertag: 'removed-member-1',
              id: 'generated-id'
            },
            {
              gamertag: 'removed-member-2',
              id: 'generated-id'
            }
          ])
        }
        td.verify(callback(null, expectedResponse))
      })
    })

    describe('when there is an error', () => {
      let error

      beforeEach(async () => {
        const removals = [
          {
            gamertag: 'removed-member'
          }
        ]
        event.body = JSON.stringify(removals)

        error = new Error('oh no')

        td.when(removalService.addRemovalsToHistory('clan-id', removals)).thenReject(error)

        await subject.addRemovalsToHistory(event, null, callback)
      })

      it('responds with an error response', () => {
        const expectedResponse = {
          statusCode: 500,
          body: JSON.stringify(error)
        }
        td.verify(callback(error, expectedResponse))
      })
    })
  })
})
