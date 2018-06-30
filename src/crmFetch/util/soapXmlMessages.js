import xmlEncode from 'xml-escape'
// transforms an collection of attributes into an attribute element string
function buildFetchAttributeXml (columns) {
  var attributes = []
  for (var i = 0, max = columns.length; i < max; i++) {
    attributes.push('<attribute name="' + columns[i] + '" />')
  }
  return attributes.join('')
}
// generates the fetchxml query for the "GetById" method
function buildGetByIdFetchXml (id, entityname, columns) {
  var idAttribute = entityname + 'id'
  return [
    `<fetch version="1.0">
      <entity name="${entityname}">
    buildFetchAttributeXml(columns)
        <filter type="and">
          <condition attribute="${idAttribute}"
              operator="eq" value="${id} " />
        </filter>
      </entity>
    </fetch>`
  ].join('')
}
// generates the soap-xml message for the fetch-rquest
function getFetchMoreXml (fetchxml) {
  return [
    `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
     <s:Body>
      <Execute xmlns="http://schemas.microsoft.com/xrm/2011/Contracts/Services">
         <request i:type="b:RetrieveMultipleRequest" xmlns:b="http://schemas.microsoft.com/xrm/2011/Contracts" 
             xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
                 <b:Parameters xmlns:c="http://schemas.datacontract.org/2004/07/System.Collections.Generic">
                 <b:KeyValuePairOfstringanyType>
                     <c:key>Query</c:key>
                     <c:value i:type="b:FetchExpression">
                         <b:Query>
                            ${xmlEncode(fetchxml)}
                         </b:Query>
                     </c:value>
                 </b:KeyValuePairOfstringanyType>
             </b:Parameters>
             <b:RequestId i:nil="true"/>
             <b:RequestName>RetrieveMultiple</b:RequestName>
         </request>
     </Execute>
    </s:Body></s:Envelope>`
  ].join('')
}
// generates the soap-xml message for the assign-rquest
function getAssignXml (id, entityname, assigneeId, assigneeEntityName) {
  return [
    `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
      <s:Body>
        <Execute xmlns="http://schemas.microsoft.com/xrm/2011/Contracts/Services" 
               xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
          <request i:type="b:AssignRequest" xmlns:a="http://schemas.microsoft.com/xrm/2011/Contracts" 
               xmlns:b="http://schemas.microsoft.com/crm/2011/Contracts">
            <a:Parameters xmlns:c="http://schemas.datacontract.org/2004/07/System.Collections.Generic">
              <a:KeyValuePairOfstringanyType>
                <c:key>Target</c:key>
                <c:value i:type="a:EntityReference">
                  <a:Id> ${id} </a:Id>
                  <a:LogicalName> ${entityname} </a:LogicalName>
                  <a:Name i:nil="true" />
                </c:value>
              </a:KeyValuePairOfstringanyType>
              <a:KeyValuePairOfstringanyType>
                <c:key>Assignee</c:key>
                <c:value i:type="a:EntityReference">
                  <a:Id> + assigneeId + </a:Id>
                  <a:LogicalName> ${assigneeEntityName} </a:LogicalName>
                  <a:Name i:nil="true" />
                </c:value>
              </a:KeyValuePairOfstringanyType>
            </a:Parameters>
            <a:RequestId i:nil="true" />
            <a:RequestName>Assign</a:RequestName>
          </request>
        </Execute>
      </s:Body>
    </s:Envelope>`
  ].join('')
}
// /
// / Public API of the module
// /
export default {
  getFetchMoreXml: getFetchMoreXml,
  buildFetchAttributeXml: buildFetchAttributeXml,
  getAssignXml: getAssignXml,
  buildGetByIdFetchXml: buildGetByIdFetchXml
}
