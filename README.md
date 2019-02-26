# dcm-removals

[![Build status](https://dev.azure.com/heymrcarter/Destiny%20Clan%20Manager/_apis/build/status/DCM-Removals)](https://dev.azure.com/heymrcarter/Destiny%20Clan%20Manager/_build/latest?definitionId=-1)
![Deployment status](https://vsrm.dev.azure.com/heymrcarter/_apis/public/Release/badge/7e5f3784-dda9-4bf0-9c99-7bde292990b9/8/22)

> Removal history microservice for Destiny Clan Manager

## Endpoints

### `getRemovalHistory`

Returns the full removal history for a given clan

|                    |                                 |
| ------------------ | ------------------------------- |
| **Trigger**        | `GET /removal/{clanId}`         |
| **Request body**   | none                            |
| **Response body**  | [`[ClanRemoval]`](#ClanRemoval) |
| **Success status** | `200`                           |
| **Error status**   | `500`                           |

### `addRemovalToHistory`

Adds a member to the clan removal history

|                    |                               |
| ------------------ | ----------------------------- |
| **Trigger**        | `POST /removal/{clanId}`      |
| **Request body**   | [`ClanRemoval`](#ClanRemoval) |
| **Response body**  | [`ClanRemoval`](#ClanRemoval) |
| **Success status** | `201`                         |
| **Error status**   | `500`                         |

### `addRemovalsToHistory`

Adds multiple members to the clan removal history

|                    |                                 |
| ------------------ | ------------------------------- |
| **Trigger**        | `POST /removal/{clanId}/batch`  |
| **Request body**   | [`[ClanRemoval]`](#ClanRemoval) |
| **Response body**  | [`[ClanRemoval]`](#ClanRemoval) |
| **Success status** | `201`                           |
| **Error status**   | `500`                           |

## Resources

### `ClanRemoval`

| Property              | Type     | Description                                                             |
| --------------------- | -------- | ----------------------------------------------------------------------- |
| `adminMembershipId`   | `String` | The Bungie.net membership id of the admin removing the member           |
| `adminMembershipType` | `String` | Identifies the membership id as the Bungie.net membership id            |
| `id`                  | `String` | A server generated GUID to identifiy the `ClanRemoval`                  |
| `removalDate`         | `Date`   | The date the admin removed the member from the clan                     |
| `removedGamertag`     | `String` | The display name of the member that was removed from the clan           |
| `removedMembershipId` | `String` | The platform membership id of the member that was removed from the clan |
