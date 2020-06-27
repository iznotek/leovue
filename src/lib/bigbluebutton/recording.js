const util = require('./util')

function recording (host, salt) {
  function getRecordings (kwparams) {
    kwparams = Object.assign({}, kwparams)

    return util.constructUrl(host, salt, 'getRecordings', kwparams)
  }
  function publishRecordings (recordID, publish) {
    let qparams = {
      recordID: recordID,
      publish: publish
    }

    return util.constructUrl(host, salt, 'publishRecordings', qparams)
  }
  function deleteRecordings (recordID) {
    let qparams = {
      recordID: recordID
    }

    return util.constructUrl(host, salt, 'deleteRecordings', qparams)
  }
  function updateRecordings (recordID, kwparams) {
    kwparams = Object.assign({}, kwparams)

    kwparams.recordID = recordID

    return util.constructUrl(host, salt, 'updateRecordings', kwparams)
  }
  return {
    getRecordings,
    publishRecordings,
    deleteRecordings,
    updateRecordings
  }
}

export {
  recording
}
