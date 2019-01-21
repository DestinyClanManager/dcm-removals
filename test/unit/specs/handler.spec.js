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
})
