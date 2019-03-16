// eslint-disable
// this is an auto generated file. This will be overwritten

export const getSc2Events = `query GetSc2Events($id: Int!) {
  getSc2Events(id: $id) {
    id
    eventId
    stage
    title
    Liquipedia
    AWSTimestamp
    up
    down
  }
}
`;
export const listSc2Events = `query ListSc2Events(
  $filter: TableSc2EventsFilterInput
  $limit: Int
  $nextToken: String
) {
  listSc2Events(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      eventId
      stage
      title
      Liquipedia
      AWSTimestamp
      up
      down
    }
    nextToken
    scannedCount
  }
}
`;
export const listRangeEvents = `query ListRangeEvents($start: AWSTimestamp, $end: AWSTimestamp) {
  listRangeEvents(start: $start, end: $end) {
    items {
      id
      eventId
      stage
      title
      Liquipedia
      AWSTimestamp
      up
      down
    }
    nextToken
    scannedCount
  }
}
`;
