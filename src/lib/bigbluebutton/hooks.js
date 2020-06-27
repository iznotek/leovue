const util = require('./util')

function hooks (host, salt) {
  function create (callbackURL, kwparams) {
    kwparams = Object.assign({}, kwparams)
    kwparams.callbackURL = callbackURL

    return util.constructUrl(host, salt, 'hooks/create', kwparams)
  }
  function destroy (hookID, kwparams) {
    kwparams = Object.assign({}, kwparams)
    kwparams.hookID = hookID

    return util.constructUrl(host, salt, 'hooks/destroy', kwparams)
  }
  function list (kwparams) {
    kwparams = Object.assign({}, kwparams)
    return util.constructUrl(host, salt, 'hooks/list', kwparams)
  }
  return {
    create,
    destroy,
    list
  }
}

export {
  hooks
}
