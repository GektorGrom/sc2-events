// eslint-disable
// this is an auto generated file. This will be overwritten

export const onCreateSc2Events = `subscription OnCreateSc2Events($id: Int, $up: Int, $down: Int) {
  onCreateSc2Events(id: $id, up: $up, down: $down) {
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
export const onUpdateSc2Events = `subscription OnUpdateSc2Events($up: Int, $down: Int) {
  onUpdateSc2Events(up: $up, down: $down) {
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
export const onUpdateRate = `subscription OnUpdateRate {
  onUpdateRate {
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
