const supertest = require('supertest')
const idRegex = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)

describe('Removals API', () => {
  let request

  beforeEach(() => {
    request = supertest(process.env.REMOVALS_BASE_URL)
  })

  describe('addRemovalToHistory', () => {
    let actual

    beforeEach(async () => {
      const removal = {
        adminMembershipId: 'admin-membership-id',
        adminMembershipType: 'bungienet',
        removalDate: '2019-02-12',
        removedGamertag: 'removed-gamertag',
        removedMembershipId: 'removed-membership-id'
      }
      const response = await request
        .post('/clan-id')
        .send(removal)
        .expect(201)

      actual = response.body
    })

    it('returns the logged removal', () => {
      expect(actual.adminMembershipId).toEqual('admin-membership-id')
      expect(actual.adminMembershipType).toEqual('bungienet')
      expect(actual.removalDate).toEqual('2019-02-12')
      expect(actual.removedGamertag).toEqual('removed-gamertag')
      expect(actual.removedMembershipId).toEqual('removed-membership-id')
      expect(idRegex.test(actual.id)).toBe(true)
    })
  })

  describe('addRemovalsToHistory', () => {
    let actual

    beforeEach(async () => {
      const removals = [
        {
          adminMembershipId: 'admin-membership-id',
          adminMembershipType: 'bungienet',
          removalDate: '2019-02-12',
          removedGamertag: 'removed-gamertag-1',
          removedMembershipId: 'removed-membership-id-1'
        },
        {
          adminMembershipId: 'admin-membership-id',
          adminMembershipType: 'bungienet',
          removalDate: '2019-02-12',
          removedGamertag: 'removed-gamertag-2',
          removedMembershipId: 'removed-membership-id-2'
        }
      ]
      const response = await request
        .post('/clan-id/batch')
        .send(removals)
        .expect(201)

      actual = response.body
    })

    it('returns the logged removals', () => {
      expect(actual.length).toEqual(2)

      expect(actual[0].adminMembershipId).toEqual('admin-membership-id')
      expect(actual[0].adminMembershipType).toEqual('bungienet')
      expect(actual[0].removalDate).toEqual('2019-02-12')
      expect(actual[0].removedGamertag).toEqual('removed-gamertag-1')
      expect(actual[0].removedMembershipId).toEqual('removed-membership-id-1')
      expect(idRegex.test(actual[0].id)).toBe(true)

      expect(actual[1].adminMembershipId).toEqual('admin-membership-id')
      expect(actual[1].adminMembershipType).toEqual('bungienet')
      expect(actual[1].removalDate).toEqual('2019-02-12')
      expect(actual[1].removedGamertag).toEqual('removed-gamertag-2')
      expect(actual[1].removedMembershipId).toEqual('removed-membership-id-2')
      expect(idRegex.test(actual[1].id)).toBe(true)
    })
  })

  describe('getRemovalHistory', () => {
    let actual

    beforeEach(async () => {
      const response = await request.get('/clan-id').expect(200)
      actual = response.body
    })

    it('returns the clan removal history', () => {
      expect(actual.length).toEqual(3)

      expect(actual[0].adminMembershipId).toEqual('admin-membership-id')
      expect(actual[0].adminMembershipType).toEqual('bungienet')
      expect(actual[0].removalDate).toEqual('2019-02-12')
      expect(actual[0].removedGamertag).toEqual('removed-gamertag')
      expect(actual[0].removedMembershipId).toEqual('removed-membership-id')
      expect(idRegex.test(actual[0].id)).toBe(true)

      expect(actual[1].adminMembershipId).toEqual('admin-membership-id')
      expect(actual[1].adminMembershipType).toEqual('bungienet')
      expect(actual[1].removalDate).toEqual('2019-02-12')
      expect(actual[1].removedGamertag).toEqual('removed-gamertag-1')
      expect(actual[1].removedMembershipId).toEqual('removed-membership-id-1')
      expect(idRegex.test(actual[1].id)).toBe(true)

      expect(actual[2].adminMembershipId).toEqual('admin-membership-id')
      expect(actual[2].adminMembershipType).toEqual('bungienet')
      expect(actual[2].removalDate).toEqual('2019-02-12')
      expect(actual[2].removedGamertag).toEqual('removed-gamertag-2')
      expect(actual[2].removedMembershipId).toEqual('removed-membership-id-2')
      expect(idRegex.test(actual[2].id)).toBe(true)
    })
  })
})
