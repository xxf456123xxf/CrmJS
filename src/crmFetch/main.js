import soapXml from './util/soapXmlMessages'
import soapParser from './util/soapXmlParser'
import xrmHttpUtil from './util/xrmHttpRequestUtil'
import clientUtil from './util/xrmClientUtil'
// performs the post-http request against the soap endpoint
// based on the optional parameter 'opt_async' perform the method a
// synchronous or asynchronous operation
function executeRequest (xml, optAsync) {
    // default is 'true'
  const async = optAsync !== false
  const url = clientUtil.getSoapEndpointUrl()
  if (async) {
    return xrmHttpUtil.xrmHttpPostRequestAsync(url, xml)
  } else {
    return xrmHttpUtil.xrmHttpPostRequestSync(url, xml)
  }
}
// assigns synchronously a CRM reocrd to an user or team
function assignSync (targetId, targetEntity, assigneeId, assigneeEntity) {
  const xml = soapXml.getAssignXml(targetId, targetEntity,
        assigneeId, assigneeEntity)
  return executeRequest(xml, false)
}
// assigns asynchronously a CRM record (target) to an user or team
// and returns a promise
function assign (targetId, targetEntity, assigneeId, assigneeEntity) {
  const xml = soapXml.getAssignXml(targetId, targetEntity,
        assigneeId, assigneeEntity)
  return executeRequest(xml, true)
}
// executes synchronously an fetchxml-request and returns, beside
// of the records some meta data (e.g. total-record-count)
function fetchMoreSync (fetchxml) {
  const requestXml = soapXml.getFetchMoreXml(fetchxml)
  const response = executeRequest(requestXml, false)
  return soapParser.getFetchResult(response)
}
// executes asynchronously an fetchxml-request and returns, beside
// of the records some meta data (e.g. total-record-count) as promise
function fetchMore (fetchxml) {
  const request = soapXml.getFetchMoreXml(fetchxml)
  return executeRequest(request, true)
        .then(function (response) {
          return soapParser.getFetchResult(response)
        })
}
// allows the loading of record only for certain pages (e.g. only page 1 and 2)
function fetchByPage (fetchxml, pageNumber, optPagingCookie) {
  let xml = fetchxml
  if (pageNumber !== 1) {
        // add page-number & paging-cookie
    xml = soapParser.setPagingDetails(xml, pageNumber, optPagingCookie)
  }
  return fetchMore(xml)
}
// loads all records (recursive with paging cookie) and returns promise
function fetchAll (fetchxml, optPage, optAllRecords) {
  let allRecords = optAllRecords || []
  let pageNumber = optPage || 1
  return fetchMore(fetchxml).then(function (result) {
    let pagingFetchXml
        // add the elements to the collection
    allRecords = allRecords.concat(result.entities)
    if (!result.moreRecords) {
            // all records are loaded
      return allRecords
    } else {
            // more to load - increase the page-number
      pageNumber++
            // add page-number & paging-cookie
      pagingFetchXml = soapParser.setPagingDetails(
                                fetchxml, pageNumber, result.pagingCookie)
            // recursive call (returns another promise)
      return fetchAll(pagingFetchXml, pageNumber, allRecords)
    }
  })
}
// executes a fetch-request an returns a promies object in sync-mode
function fetchSync (fetchxml) {
  const result = fetchMoreSync(fetchxml)
  return result.entities
}
// performs a asynchronous fetch-request and returns a promies
function fetch (fetchxml) {
  return fetchMore(fetchxml).then(function (result) {
    return result.entities
  })
}
function getByIdSync (entityname, id, columns) {
  const fetchxml = soapXml.buildGetByIdFetchXml(id, entityname, columns)
  const entities = fetchSync(fetchxml)
  if (entities.length > 1) {
    throw new Error('Expected 1 record, found "' + entities.length + '"')
  }
    // should return "null" instead of "undefined"
  return entities[0] || null
}
function getById (entityname, id, columns) {
  const fetchxml = soapXml.buildGetByIdFetchXml(id, entityname, columns)
  return fetch(fetchxml).then(function (entities) {
    if (entities.length > 1) {
      throw new Error('Expected 1 record, found "' + entities.length + '"')
    }
        // should return "null" instead of "undefined"
    return entities[0] || null
  })
}
const CrmFetchKit = {
  GetById: getById,
  GetByIdSync: getByIdSync,
  Fetch: fetch,
  FetchSync: fetchSync,
  FetchMore: fetchMore,
  FetchMoreSync: fetchMoreSync,
  FetchAll: fetchAll,
  FetchByPage: fetchByPage,
  Assign: assign,
  AssignSync: assignSync
}
export default CrmFetchKit
