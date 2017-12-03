var cytoscapeWrapper = new CytoscapeWrapper();
cytoscapeWrapper.initCytoscape();
cytoscapeWrapper.addNode("node-" + cytoscapeWrapper.nodeIndex, {});
function intersect(array1, array2) {
  var result = new Array();
  for (var index1 = 0; index1 < array1.length; index1++) {
    for (var index2 = 0; index2 < array2.length; index2++) {
      if (array1[index1] == array2[index2]) {
        result.push(array1[index1]);
      }
    }
  }
  return result;
}
function openFile(event) {
  var input = event.target;
  var reader = new FileReader();
  var nodesData = new Array();
  var nodesId = new Array;
  reader.onload = function() {
    var text = reader.result;
    var nodeLines = text.split("\n");
    var nodesToAdd = new Array();
    var edgesToAdd = new Array();
    for (var nodeLineIndex = 0; nodeLineIndex < nodeLines.length; nodeLineIndex++) {
      var nodeData = new Array();
      var nodeLine = nodeLines[nodeLineIndex].trim();
      if (nodeLine != "") {
        var splits = nodeLine.split(";");
        for (var dataIndex = 1; dataIndex < splits.length; dataIndex++) {
          nodeData.push(splits[dataIndex].trim());
        }
        nodesData.push(nodeData);
        nodesId.push(splits[0].trim());
      }
    }
    for (var index1 = 0; index1 < nodesData.length; index1++) {
      for (var index2 = index1 + 1; index2 < nodesData.length; index2++) {
        var intersection = intersect(nodesData[index1], nodesData[index2]);
        if (intersection.length > 0) {
          if ($.inArray(nodesId[index1], nodesToAdd) == -1) {
            nodesToAdd.push(nodesId[index1]);
          }
          if ($.inArray(nodesId[index2], nodesToAdd) == -1) {
            nodesToAdd.push(nodesId[index2]);
          }
          edgesToAdd.push([nodesId[index1], nodesId[index2], intersection]);
        }
      }
    }
    for (var nodeIndex = 0; nodeIndex < nodesToAdd.length; nodeIndex++) {
      cytoscapeWrapper.addNode(nodesToAdd[nodeIndex]);
    }
    for (var edgeIndex = 0; edgeIndex < edgesToAdd.length; edgeIndex++) {
      cytoscapeWrapper.addEdge(edgesToAdd[edgeIndex][0], edgesToAdd[edgeIndex][1], edgesToAdd[edgeIndex][2].toString());
    }
    cytoscapeWrapper.doLayout();
  };
  reader.readAsText(input.files[0]);
}
