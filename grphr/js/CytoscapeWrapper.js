function CytoscapeWrapper() {
  this.cyto;
  this.cytoLayout;
  this.cytoEdgeHandler;
  this.nodeIndex = 0;
  this.initCytoscape = function() {
    this.cyto = cytoscape({
      container: $("#cytoscape"),
      wheelSensitivity: 0.25,
      style: cytoscape.stylesheet()
        .selector('node').css({
          'content': 'data(name)',
          'text-valign': 'center',
          'color': 'black',
          'text-outline-width': 0,
          'font-size': 15,
          'font-family': 'Tahoma',
          'border-color': '#000000',
          'width': 50,
          'height' : 50
        }).selector('node:unselected').css({
          'border-color': '#000000',
          'border-width': '1'
        }).selector('node:selected').css({
          'border-color': '#0008FF',
          'border-width': '3'
        }).selector('edge').css({
          'label': 'data(label)',
          'curve-style': 'bezier',
          'font-size': 8
        }).selector('.faded').css({
          'opacity': 0.25,
          'text-opacity': 0
        }).selector('.eh-handle').css({
          'background-color': 'red',
          'width': 12,
          'height': 12,
          'shape': 'ellipse',
          'overlay-opacity': 0,
          'border-width': 12, // makes the handle easier to hit
          'border-opacity': 0
        }).selector('.eh-hover').css({
          'background-color': 'red'
        }).selector('.eh-source').css({
          'border-width': 2,
          'border-color': 'red'
        }).selector('.eh-target').css({
          'border-width': 2,
          'border-color': 'red'
        }).selector('.eh-preview, .eh-ghost-edge').css({
          'background-color': 'red',
          'line-color': 'red',
          'target-arrow-color': 'red',
          'source-arrow-color': 'red'
        }),
        elements: { nodes: [], edges: [] }
    });
    this.doLayout();
    this.cytoEdgeHandler = this.cyto.edgehandles({
      edgeType: function(sourceNode, targetNode) {
        return "flat";
      },
    });
    this.cyto.cxtmenu({
      selector: 'node',
      openMenuEvents: 'cxttapstart',
      commands: [
        {
          content: '-> o new',
          select: function(ele) {
            var newNodeId = "node-" + cytoscapeWrapper.nodeIndex;
            cytoscapeWrapper.addNode(newNodeId, {});
            cytoscapeWrapper.addEdge(newNodeId, ele.id(), "");
            cytoscapeWrapper.doLayout();
          }
        },
        {
          content: 'new o <-',
          select: function(ele) {
            var newNodeId = "node-" + cytoscapeWrapper.nodeIndex;
            cytoscapeWrapper.addNode(newNodeId, {});
            cytoscapeWrapper.addEdge(ele.id(), newNodeId, "");
            cytoscapeWrapper.doLayout();
          }
        },
        {
          content: 'delete',
          select: function(ele) {
            cytoscapeWrapper.cyto.remove(ele);
          }
        },
        {
          content: 'name',
          select: function(ele) {
            var newName = prompt("New name for node:", ele.data("name"));
            if (newName != null) {
              ele.data("name", newName);
            }
          }
        }
      ]
    });
    this.cyto.on("click", function(evt) {
      if (typeof evt.target.data != "function") {
        // click on background
      } else if (evt.target.data().hasOwnProperty("name")) {
        // click on node
        evt.target.data("address");
      } else if (evt.target.data().hasOwnProperty('source') && evt.target.data().hasOwnProperty('target')) {
        // click on edge
      }
    });
    $("#createNewNode").click(function() {
      var newNodeId = "node-" + cytoscapeWrapper.nodeIndex;
      cytoscapeWrapper.addNode(newNodeId, {});
      cytoscapeWrapper.doLayout();
    });
  };
  this.layoutOptions = {
    name: "cola",
    directed: false,
    nodeDimensionsIncludeLabels: true,
    refresh: 1,
    maxSimulationTime: 500,
    fit: true
  };
  this.addEdge = function(sourceNodeId, destinationNodeId, value) {
    var existingEdges = this.cyto.$('edge[source="' + sourceNodeId + 
        '"][target="' + destinationNodeId + '"]');
    if (existingEdges.length == 0) {
      this.cyto.add({ data: { 
        source: sourceNodeId, 
        target: destinationNodeId, 
        label: value 
      } });
    }
  };
  this.addNode = function(nodeId, css) {
    var existingNodes = this.cyto.$('node[id="' + nodeId + '"]');
    if (existingNodes.length == 0) {
      this.cyto.add({ group: "nodes" , data: {
        id: nodeId, 
        name: nodeId,
      }}).css(css);
      this.nodeIndex++;
    }
  };
  this.doLayout = function() {
    this.cytoLayout = this.cyto.layout(this.layoutOptions).run();
  };
}
