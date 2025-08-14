export const addLinkLabel = (canvasController, setDecorationTexts, decorationTexts, injectTextIntoDecoration, handleEditAction, linkId) => {
  if (!canvasController) return;
  
  const pipelineId = canvasController.getCurrentPipelineId();
  const decorationProperties = {
    app_data: {
      ui_data: {
        decorations: [
          {
            id: `label_${linkId}`,
            type: "label",
            text: "Link Label",
            position: "middle",
            editable: true,
            selectable: true,
            style: {
              fontSize: "14px",
              fill: "#1D3649",
              fontWeight: "bold",
              backgroundColor: "#FFFFFF",
              padding: "4px 8px",
              borderRadius: "4px",
              border: "2px solid #1D3649",
              textAnchor: "middle",
              dominantBaseline: "middle",
              cursor: "pointer"
            },
            offset: {
              x: 0,
              y: -5
            },
            action: "editDecorationLabel",
            data: {
              decorationId: `label_${linkId}`,
              linkId: linkId
            },
            width: 100,
            height: 30,
            textElement: {
              x: 50,
              y: 15,
              text: "Link Label",
              fontSize: "14px",
              fill: "#1D3649",
              fontWeight: "bold",
              textAnchor: "middle",
              dominantBaseline: "middle"
            }
          }
        ]
      }
    }
  };

  try {
    canvasController.setLinkProperties(linkId, decorationProperties, pipelineId);
  } catch (error) {
    console.error("Error adding decoration:", error);
  }
  
  setTimeout(() => {
    try {
      const link = canvasController.getLink(linkId, pipelineId);
      if (link && link.app_data && link.app_data.ui_data && link.app_data.ui_data.decorations) {
        try {
          canvasController.setPipelineFlow(canvasController.getPipelineFlow());
          setTimeout(() => {
            const decorationId = `label_${linkId}`;
            setDecorationTexts(prev => ({
              ...prev,
              [decorationId]: "Link Label"
            }));
            injectTextIntoDecoration(decorationId, "Link Label");
          }, 300);
        } catch (refreshError) {
          console.log("Error refreshing canvas:", refreshError);
        }
      } else {
        console.log("No decorations found on link");
      }
    } catch (error) {
      console.log("Error checking link decorations:", error);
    }
    
    const editAction = {
      editType: "editDecorationLabel",
      editSource: "click",
      editData: {
        decorationId: `label_${linkId}`,
        linkId: linkId
      }
    };
    
    handleEditAction(editAction);
    
    try {
      canvasController.setLinkDecorationLabelEditingMode(linkId, `label_${linkId}`);
    } catch (error) {
      console.log("Direct API failed, trying alternative:", error);
      try {
        canvasController.editDecorationLabel(`label_${linkId}`);
      } catch (error2) {
        console.error("Both API methods failed:", error2);
      }
    }
  }, 300);
};

export const makeLinksDashed = (canvasController) => {
  if (!canvasController) return;
  
  try {
    const selectedObjects = canvasController.getSelectedObjects();      
    const selectedLinks = selectedObjects.filter(obj => obj.type === "nodeLink");
    
    if (selectedLinks.length === 0) {
      return;
    }
    
    const pipelineId = canvasController.getCurrentPipelineId();
    
    selectedLinks.forEach(link => {
      try {
        const linkData = canvasController.getLink(link.id, pipelineId);
        if (linkData) {
          const updatedLink = {
            ...linkData,
            app_data: {
              ...linkData.app_data,
              ui_data: {
                ...linkData.app_data?.ui_data,
                style: {
                  strokeDasharray: "5,5",
                  strokeWidth: 2,
                  stroke: "#1D3649",
                  markerEnd: "url(#arrowhead)"
                }
              }
            }
          };
          
          canvasController.setLinkProperties(link.id, updatedLink, pipelineId);
        }
      } catch (error) {
        console.log("Error updating link:", link.id, error);
      }
    });
    
  } catch (error) {
    console.error("Error making links dashed:", error);
  }
};

export const handleEditAction = (e, canvasController, setShowRightFlyout, setShowLabelEditPanel, setShowNodeStyling, setSelectedNodeId, setNodeProperties, setDecorationTexts, decorationTexts, injectTextIntoDecoration, applyNodeStyleToAllNodes, applyTextStyleToAllNodes) => {
  const nodeId = e.selectedObjectIds?.[0];
  const pipelineId = canvasController?.getCurrentPipelineId();
  const node = nodeId ? canvasController?.getNode(nodeId, pipelineId) : null;

  if (e.editType === "editDecorationLabel") {
    const { decorationId, linkId } = e.editData || {};      
    if (decorationId && linkId) {
      try {
        canvasController.setLinkDecorationLabelEditingMode(linkId, decorationId);
      } catch (error) {
        console.log("Error activating decoration editing mode:", error);
      }
    }
  }

  if (e.editType === "deleteDecoration") {
    // Implementation for delete decoration
  }
  
  if (e.editType === "deleteLink") {      
    if (canvasController) {
      try {
        const selectedObjects = canvasController.getSelectedObjects();
        const selectedLinks = selectedObjects.filter(obj => obj.type === "nodeLink");
        
        if (selectedLinks.length > 0) {
          const pipelineId = canvasController.getCurrentPipelineId();
          const pipelineFlow = canvasController.getPipelineFlow();
          const pipeline = pipelineFlow.pipelines.find(p => p.id === pipelineId);
          
          if (pipeline && pipeline.links) {
            const selectedLinkIds = selectedLinks.map(link => link.id);
            const updatedLinks = pipeline.links.filter(link => !selectedLinkIds.includes(link.id));
            
            const updatedPipeline = {
              ...pipeline,
              links: updatedLinks
            };
            
            const updatedPipelineFlow = {
              ...pipelineFlow,
              pipelines: pipelineFlow.pipelines.map(p => 
                p.id === pipelineId ? updatedPipeline : p
              )
            };
            
            canvasController.setPipelineFlow(updatedPipelineFlow);
          }
        }
      } catch (error) {
        console.log("Error deleting selected links:", error);
      }
    }
  }
  
  if (e.editType === "myApp_Action1") {      
    if (e.selectedObjectIds && e.selectedObjectIds.length > 0 && node) {
      const nodeData = {
        ...node,
        label: node.app_data?.ui_data?.label || node.label || "Node",
        description: node.app_data?.ui_data?.description || "Node Description",
        op: node.op || node.type || "unknown",
        x_pos: node.x_pos || 0,
        y_pos: node.y_pos || 0
      };
      
      setSelectedNodeId(nodeId);
      setNodeProperties(nodeData);
      setShowRightFlyout(true);
      setShowLabelEditPanel(false);
      setShowNodeStyling(false);
    }
  }
  
  if (e.editType === "myApp_Action2") {      
    if (e.selectedObjectIds && e.selectedObjectIds.length > 0 && node) {
      const nodeData = {
        ...node,
        label: node.app_data?.ui_data?.label || node.label || "Node",
        description: node.app_data?.ui_data?.description || "Node Description",
        op: node.op || node.type || "unknown",
        x_pos: node.x_pos || 0,
        y_pos: node.y_pos || 0
      };
      
      setSelectedNodeId(nodeId);
      setNodeProperties(nodeData);
      setShowRightFlyout(true);
      setShowNodeStyling(true);
      setShowLabelEditPanel(false);
    }
  }
  
  if (e.editType === "makeLinksDashed") {
    return;
  }
  
  if (e.editType && (e.editType.includes("resize") || e.editType.includes("Resize"))) {
    if (e.selectedObjectIds && e.selectedObjectIds.length > 0) {
      e.selectedObjectIds.forEach(nodeId => {
        const pipelineId = canvasController.getCurrentPipelineId();
        const node = canvasController.getNode(nodeId, pipelineId);
        
        if (node && (node.op === "decision" || node.type === "polygon")) {
          let newWidth = 120;
          let newHeight = 80;
          
          if (e.objectsInfo && e.objectsInfo[nodeId]) {
            const objectInfo = e.objectsInfo[nodeId];
            newWidth = objectInfo.width || objectInfo.resizeWidth || 120;
            newHeight = objectInfo.height || objectInfo.resizeHeight || 80;
          }
          
          if (!node.app_data) node.app_data = {};
          if (!node.app_data.ui_data) node.app_data.ui_data = {};
          node.app_data.ui_data.currentWidth = newWidth;
          node.app_data.ui_data.currentHeight = newHeight;
          
          setTimeout(() => {
            canvasController.setPipelineFlow(canvasController.getPipelineFlow());
          }, 100);
        }
      });
    }
  }

  // Handle resize events for diamond nodes
  if (e.objectsInfo || e.data || e.width || e.height || e.selectedObjects) {
    if (e.selectedObjectIds && e.selectedObjectIds.length > 0) {
      const nodeId = e.selectedObjectIds[0];
      const pipelineId = canvasController.getCurrentPipelineId();
      const node = canvasController.getNode(nodeId, pipelineId);
      
      if (node && (node.op === "decision" || node.type === "polygon")) {
        const objectsInfo = e.objectsInfo?.[nodeId];
        if (objectsInfo && objectsInfo.isResized) {
          const newWidth = objectsInfo.width;
          const newHeight = objectsInfo.height;
          const diamondPath = `M ${newWidth/2} 0 L ${newWidth} ${newHeight/2} L ${newWidth/2} ${newHeight} L 0 ${newHeight/2} Z`;
          
          if (!node.app_data) node.app_data = {};
          if (!node.app_data.ui_data) node.app_data.ui_data = {};
          node.app_data.ui_data.currentWidth = newWidth;
          node.app_data.ui_data.currentHeight = newHeight;
          node.app_data.ui_data.diamondDimensions = {
            width: newWidth,
            height: newHeight,
            path: diamondPath
          };             
          
          setTimeout(() => {
            canvasController.setPipelineFlow(canvasController.getPipelineFlow());
          }, 100);             
          
          setTimeout(() => {
            const nodeElement = document.querySelector(`[data-id="${nodeId}"]`) || 
                              document.querySelector(`[id="${nodeId}"]`) ||
                              document.querySelector(`[data-node-id="${nodeId}"]`);
            
            if (nodeElement) {
              const pathElement = nodeElement.querySelector('path[d*="M"]');
              if (pathElement) {
                console.log("Found path element, updating to:", diamondPath);
                pathElement.setAttribute('d', diamondPath);
              } 
            } 
          }, 200);
        }
      }
    }
  }

  if (e.editType === "setNodeLabelEditingMode") {
    if (node) {
      const nodeData = {
        ...node,
        label: node.app_data?.ui_data?.label || node.label || "Node",
        description: node.app_data?.ui_data?.description || "Node Description",
        op: node.op || node.type || "unknown",
        x_pos: node.x_pos || 0,
        y_pos: node.y_pos || 0
      };
      
      setShowRightFlyout(true);
      setShowLabelEditPanel(true);
      setSelectedNodeId(nodeId);
      setNodeProperties(nodeData);
    }
  }

  if (e.editType === "DELETE_SELECTED_OBJECTS") {
    if (canvasController) {
      try {
        const selectedObjects = canvasController.getSelectedObjects();
        const selectedLinks = selectedObjects.filter(obj => obj.type === "nodeLink");
        
        if (selectedLinks.length > 0) {
          const pipelineId = canvasController.getCurrentPipelineId();
          const pipelineFlow = canvasController.getPipelineFlow();
          const pipeline = pipelineFlow.pipelines.find(p => p.id === pipelineId);
          
          if (pipeline && pipeline.links) {
            const selectedLinkIds = selectedLinks.map(link => link.id);
            const updatedLinks = pipeline.links.filter(link => !selectedLinkIds.includes(link.id));
            
            const updatedPipeline = {
              ...pipeline,
              links: updatedLinks
            };
            
            const updatedPipelineFlow = {
              ...pipelineFlow,
              pipelines: pipelineFlow.pipelines.map(p => 
                p.id === pipelineId ? updatedPipeline : p
              )
            };
            
            canvasController.setPipelineFlow(updatedPipelineFlow);
          }
        }
      } catch (error) {
        console.log("Error deleting selected links:", error);
      }
    }
  }
}; 