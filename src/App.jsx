import { useEffect, useState } from "react";
import Canvas from "./canvas"
import { CanvasController, CommonProperties } from "@elyra/canvas";
import PALETTE from "./pallette.json";
import PIPELINE from "./canvas.json";
import ExportCanvas from "./export";

const canvasConfig = {
enableParentClass: "flows",
			enableNodeFormatType: "Vertical",
      showRightFlyout :true,
			enableContextMenu: true,
			enableContextMenuOnSelection: true,
			enableContextMenuOnHover: true,
			enableContextMenuOnClick: true,
			enableContextMenuOnRightClick: true,
			enableContextMenuAfterInteraction: true,
			enableLinkType: "Straight",
			// enableLinkMethod: "Ports",
			enableLinkDirection: "LeftRight",
			enableSplitLinkDroppedOnNode: true,
			enableSaveZoom: "LocalStorage",
			enableSnapToGridType: "After",
			enableLinkSelection: "Handles",
			enableLinkReplaceOnNewConnection: true,
			paletteInitialState: true,
			enableDropZoneOnExternalDrag: true,
			enableContextToolbar: true,
			enableHighlightNodeOnNewLinkDrag: true,
      enableRaiseNodesToTopOnHover:true,
			enableRightFlyoutUnderToolbar: true,
      enableRightFlyoutDragToResize:true,
			enableKeyboardNavigation: true,
			enableDragAndDrop: true,
			enableExternalDragAndDrop: true,
			enableNodeDragAndDrop: true,
      enableEditingActions:true,
			tipConfig: {
				palette: true,
				nodes: true,
				ports: false,
				links: false,
        decorations: true,
			},
      enableMarkdownInComments:true,
			enableNodeLayout: {
				drawNodeLinkLineFromTo: "image_center",
				drawCommentLinkLineTo: "image_center",
				defaultNodeWidth: 200,
				defaultNodeHeight: 72,
				nodeShapeDisplay: true,
        nodeShape: "rectangle",
				enableContextMenu: true,
				selectionPath: "M 8 0 L 64 0 64 56 8 56 8 0",
				ellipsisWidth: 12,
				ellipsisHeight: 16,
				ellipsisPosY: -1,
				ellipsisPosX: 64.5,
				imageWidth: 48,
				imageHeight: 48,
				imagePosX: 12,
				imagePosY: 4,
        imagePosition: "topLeft",
				labelEditable: true,
				labelSingleLine: false,
				labelPosX: 36,
				labelPosY: 56,
				labelWidth: 180,
				labelHeight: 42,
				portRadius: 10,
				inputPortDisplay: true,
				outputPortRightPosX: 5,
				outputPortRightPosY: 30,
				outputPortObject: "image",
				outputPortImage: "/dragStateArrow.svg",
				outputPortWidth: 20,
				outputPortHeight: 20,
				outputPortGuideObject: "image",
				outputPortGuideImage: "/dragStateArrow.svg"
			},
      setNodeLabelEditingMode:true,
      displaySubPipeline	:true,
      expandSuperNodeInPlace	:true,
      enableResizableNodes: true,
      enableNodeResize: true,
      enableNodeResizeHandles: true,
      enableNodeResizeFromCorner: true,
      enableNodeResizeFromEdge: true,
      nodeResizeHandles: ["nw", "ne", "sw", "se", "n", "s", "e", "w"],
      enableNodeResizeFromAnyDirection: true,
      enableNodeResizeFromAnyHandle: true,
			enableCanvasLayout: {
				dataLinkArrowHead: true,
				linkGap: 4,
				displayGridType: "Dots",
				displayLinkOnOverlap: false,
				enableLinkDecorations: true,
				linkDecorationZIndex: 1000,
				enableDecorationInteractions: true,
				enableContextMenu: true,
				contextMenuZIndex: 10000,
				linkStyle: {
					strokeDasharray: "5,5",
					strokeWidth: 2,
					stroke: "#1D3649",
					markerEnd: "url(#arrowhead)"
				}
			}
};

 const canvasToolTipHandler = () => {
  return "Tooltip"
};

 const layoutHandler = (node) => {
   const nodeType = node.op || node.type || "unknown";
   
   const width = node.layout?.width || 
                 node.width || 
                 node.app_data?.ui_data?.currentWidth || 
                 node.app_data?.currentWidth || 
                 node.currentWidth || 
                 node.layout?.currentWidth || 120;
   const height = node.layout?.height || 
                  node.height || 
                  node.app_data?.ui_data?.currentHeight || 
                  node.app_data?.currentHeight || 
                  node.currentHeight || 
                  node.layout?.currentHeight || 80;
      

   const shapeMap = {
     "decision": "polygon", 
     "default": "rectangle"
   };
   const shape = shapeMap[nodeType] || shapeMap["default"];

   let bodyPath = null;
   let selectionPath = null;
   let inputPortPositions = undefined;
   let outputPortPositions = undefined;
            if (shape === "polygon") {
           const minWidth = 60;
           const minHeight = 40;
           const actualWidth = Math.max(width, minWidth);
           const actualHeight = Math.max(height, minHeight);
           
           bodyPath = `M ${actualWidth/2} 0 L ${actualWidth} ${actualHeight/2} L ${actualWidth/2} ${actualHeight} L 0 ${actualHeight/2} Z`;
           selectionPath = bodyPath;
           inputPortPositions = [{ x_pos: 0 - actualWidth / 2, y_pos: actualHeight / 2, pos: "leftCenter" }];
           outputPortPositions = [{ x_pos: actualWidth / 2, y_pos: actualHeight / 2 , pos: "rightCenter" }];
                      if (!node.app_data) node.app_data = {};
           if (!node.app_data.ui_data) node.app_data.ui_data = {};
           node.app_data.ui_data.currentWidth = width;
           node.app_data.ui_data.currentHeight = height;
           node.app_data.ui_data.diamondDimensions = {
             width: width,
             height: height,
             path: bodyPath
           };
           
           // Ensure the node is resizable
           return {
             nodeShape: shape,
             defaultNodeWidth: actualWidth,
             defaultNodeHeight: actualHeight,
             bodyPath,
             selectionPath,
             nodeShapeDisplay: true,
             autoSizeNode: false,
             class_name: shape === "polygon" ? "diamond-node" : "",
             nodeResizable: true,
             nodeMovable: true,
             bodyPathDisplay: true,
             labelDisplay: true,
             labelPosition: "center",
             labelPosX: width / 2,
             labelPosY: shape === "polygon" ? (height / 2 + 14) : (height / 2),
             labelAlign: "center",
             labelSingleLine: false,
             labelOutline: false,
             labelMaxCharacters: null,
             labelAllowReturnKey: false,
             labelWidth: width * 0.8,
             labelHeight: height * 0.6,
             inputPortPositions,
             outputPortPositions
           };
         }

   return {
     nodeShape: shape,
     defaultNodeWidth: width,
     defaultNodeHeight: height,
     bodyPath,
     selectionPath,
     nodeShapeDisplay: true,
     autoSizeNode: false,
     class_name: shape === "polygon" ? "diamond-node" : "",
     nodeResizable: true,
     nodeMovable: true,
     bodyPathDisplay: true,
     labelDisplay: true,
     labelPosition: "center",
     labelPosX: width / 2,
     labelPosY: shape === "polygon" ? (height / 2 + 10) : (height / 2),
     labelAlign: "center",
     labelSingleLine: false,
     labelOutline: false,
     labelMaxCharacters: null,
     labelAllowReturnKey: false,
     labelWidth: width * 0.8,
     labelHeight: height * 0.6,
     ...(shape === "polygon" && {
       inputPortPositions,
       outputPortPositions
     })
   };
 };
 
 const contextMenuHandler = (
  source,
  defaultMenu
) => {
  
  if (source.type === "node") {
    const isSubPipelineNode = source.targetObject && 
                             (source.targetObject.type === "super_node" || 
                              source.targetObject.app_data?.ui_data?.isSubPipeline);
        
    const nodeMenu= [
        { action: "deleteSelectedObjects", label: "Delete" },
        { divider: true},
        { action: "myApp_Action1", label: "Details" },
        { action: "makeLinksDashed", label: "Make Links Dashed" },
        { action: "paste", label: "Paste from clipboard", enable: false }
    ];
    
    if (isSubPipelineNode) {
      nodeMenu.push({ divider: true });
      nodeMenu.push({ action: "collapseNode", label: "Collapse Node" });
    }
    return nodeMenu;
  }
  
   if (source.type === "link") {
    const menu= [
      { action: "deleteSelectedObjects", label: "Delete"},
    ];
    return menu;
  }
  
  // Handle super nodes or sub-pipeline nodes
  if (source.type === "super_node" || source.type === "sub_pipeline") {
    const superNodeMenu = [
      { action: "deleteSelectedObjects", label: "Delete" },
      { divider: true},
      { action: "myApp_Action1", label: "Details" },
      { action: "paste", label: "Paste from clipboard", enable: false },
      { divider: true },
      { action: "collapseNode", label: "Collapse Node" }
    ];
    return superNodeMenu;
  }

  if (source.type === "port") {
    return [
      {
        action: "editDecorationLabel",
        label: "Add Label",
        toolbarItem: true,
        enable: true,
        editData: {
          decorationId: `label_${source.id}`,
          linkId: source.id
        }
      },
      {
        action: "deleteLink",
        label: "Delete",
        toolbarItem: true,
      },
    ];
  }
  
  if (source.type === "decoration") {
    return [
      {
        action: "editDecorationLabel",
        label: "Edit Label",
        toolbarItem: true,
        enable: true,
        editData: {
          decorationId: source.id,
          linkId: source.id.replace("label_", "")
        }
      },
      {
        action: "deleteDecoration",
        label: "Delete Label",
        toolbarItem: true,
        editData: {
          decorationId: source.id,
          linkId: source.id.replace("label_", "")
        }
      },
      { action: "", divider: true },
      {
        action: "deleteDecoration",
        label: "Delete",
        toolbarItem: false,
        editData: {
          decorationId: source.id,
          linkId: source.id.replace("label_", "")
        }
      },
    ];
  }

    
    if (source.targetObject && (source.targetObject.type === "node" || source.targetObject.nodeType === "node")) {
      const nodeMenu= [
          { action: "deleteSelectedObjects", label: "Delete" },
          { divider: true},
          { action: "myApp_Action1", label: "Details" },
          { action: "paste", label: "Paste from clipboard", enable: false }
      ];
      return nodeMenu;
    }
    return defaultMenu || [];

};

function App() {
  const [canvasController, setCanvasController] = useState();
  const [decorationTexts, setDecorationTexts] = useState({});
  const [showRightFlyout, setShowRightFlyout] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [nodeProperties, setNodeProperties] = useState({});

  useEffect(() => {
    const cc = new CanvasController();
    cc.setPipelineFlow(PIPELINE);
    cc.setPipelineFlowPalette(PALETTE);
    cc.openPalette();
    cc.openAllPaletteCategories();
    setCanvasController(cc);
  }, []);

  const addLinkLabel = (linkId) => {    
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

  const makeLinksDashed = () => {
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

  const handleEditAction = (e) => {    
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
      // const { decorationId, linkId } = e.editData || {};
      // if (decorationId && linkId) {
      //   deleteDecoration(linkId, decorationId);
      // }
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
              
              // Update pipeline flow
              const updatedPipelineFlow = {
                ...pipelineFlow,
                pipelines: pipelineFlow.pipelines.map(p => 
                  p.id === pipelineId ? updatedPipeline : p
                )
              };
              
              // Set updated pipeline flow
              canvasController.setPipelineFlow(updatedPipelineFlow);
            }
          }
        } catch (error) {
          console.log("Error deleting selected links:", error);
        }
      }
    }
    
    // Handle Details
    if (e.editType === "myApp_Action1") {      
      if (e.selectedObjectIds && e.selectedObjectIds.length > 0) {
        const nodeId = e.selectedObjectIds[0];
        const pipelineId = canvasController.getCurrentPipelineId();
        const node = canvasController.getNode(nodeId, pipelineId);
        if (node) {
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
        }
      }
    }
    
   if (e.editType === "makeLinksDashed") {return
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
   if (e.objectsInfo || e.data || e.width || e.height || e.selectedObjects) {
     if (e.selectedObjectIds && e.selectedObjectIds.length > 0) {
       const nodeId = e.selectedObjectIds[0];
       const pipelineId = canvasController.getCurrentPipelineId();
       const node = canvasController.getNode(nodeId, pipelineId);
                if (node && (node.op === "decision" || node.type === "polygon")) {
           const objectsInfo = e.objectsInfo[nodeId];
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
   if (e.objectsInfo && Object.keys(e.objectsInfo).length > 0) {
     Object.keys(e.objectsInfo).forEach(nodeId => {
       const objectInfo = e.objectsInfo[nodeId];       
       if (objectInfo && (objectInfo.isResized || objectInfo.width || objectInfo.height)) {
         const pipelineId = canvasController.getCurrentPipelineId();
         const node = canvasController.getNode(nodeId, pipelineId); 
         if (node && (node.op === "decision" || node.type === "polygon")) {
           const newWidth = objectInfo.width || objectInfo.resizeWidth || 120;
           const newHeight = objectInfo.height || objectInfo.resizeHeight || 80;
           if (!node.app_data) node.app_data = {};
           if (!node.app_data.ui_data) node.app_data.ui_data = {};
           node.app_data.ui_data.currentWidth = newWidth;
           node.app_data.ui_data.currentHeight = newHeight;
                      setTimeout(() => {
             canvasController.setPipelineFlow(canvasController.getPipelineFlow());
           }, 100);
         }
       }
     });
   }
   
   if (e.selectedObjects && e.selectedObjects.length > 0) {
     e.selectedObjects.forEach(selectedNode => {
       if (selectedNode.op === "decision" || selectedNode.type === "polygon") {
         if (selectedNode.width || selectedNode.height || selectedNode.layout?.width || selectedNode.layout?.height) {
           const newWidth = selectedNode.width || selectedNode.layout?.width || 120;
           const newHeight = selectedNode.height || selectedNode.layout?.height || 80;
           if (!selectedNode.app_data) selectedNode.app_data = {};
           if (!selectedNode.app_data.ui_data) selectedNode.app_data.ui_data = {};
           selectedNode.app_data.ui_data.currentWidth = newWidth;
           selectedNode.app_data.ui_data.currentHeight = newHeight;
           setTimeout(() => {
             canvasController.setPipelineFlow(canvasController.getPipelineFlow());
           }, 100);
         }
       }
     });
   }
   
   // Handle all possible resize events
   if (e.editType && (e.editType.includes("resize") || e.editType.includes("Resize"))) {
     if (e.selectedObjectIds && e.selectedObjectIds.length > 0) {
       const nodeId = e.selectedObjectIds[0];
       const pipelineId = canvasController.getCurrentPipelineId();
       const node = canvasController.getNode(nodeId, pipelineId);
       if (node && (node.op === "decision" || node.type === "polygon")) {
         let newWidth = 120;
         let newHeight = 80;
         if (e.objectsInfo && e.objectsInfo[nodeId]) {
           const objectInfo = e.objectsInfo[nodeId];
           newWidth = objectInfo.resizeWidth || objectInfo.width || 120;
           newHeight = objectInfo.resizeHeight || objectInfo.height || 80;
         } else if (e.data && e.data.width && e.data.height) {
           newWidth = e.data.width;
           newHeight = e.data.height;
         } else if (e.width && e.height) {
           newWidth = e.width;
           newHeight = e.height;
         } else if (e.selectedObjects && e.selectedObjects[0]) {
           const selectedNode = e.selectedObjects[0];
           newWidth = selectedNode.width || selectedNode.layout?.width || 120;
           newHeight = selectedNode.height || selectedNode.layout?.height || 80;
         } else {
           newWidth = node.layout?.width || node.width || 120;
           newHeight = node.layout?.height || node.height || 80;
         }       
         const diamondPath = `M ${newWidth/2} 0 L ${newWidth} ${newHeight/2} L ${newWidth/2} ${newHeight} L 0 ${newHeight/2} Z`;
         
         try {           
           const finalNode = {
             ...node,
             layout: {
               ...node.layout,
               width: newWidth,
               height: newHeight
             },
             app_data: {
               ...node.app_data,
               ui_data: {
                 ...node.app_data?.ui_data,
                 bodyPath: diamondPath,
                 selectionPath: diamondPath,
                 currentWidth: newWidth,
                 currentHeight: newHeight,
                 width: newWidth,
                 height: newHeight,
                 isResizedDiamond: true,
                 lastResizeTime: Date.now(),
                 diamondPath: diamondPath,
                 resizedDiamondPath: diamondPath
               },
               currentWidth: newWidth,
               currentHeight: newHeight,
               diamondDimensions: {
                 width: newWidth,
                 height: newHeight,
                 path: diamondPath
               }
             }
           };
           
           canvasController.setNodeProperties(nodeId, finalNode, pipelineId);
                      let updateCount = 0;
           const maxUpdates = 20;   
           const maintainDiamondShape = () => {
             let nodeElement = document.querySelector(`[data-id="${nodeId}"]`);  
             if (!nodeElement) {
               nodeElement = document.querySelector(`[id="${nodeId}"]`);
             }
             if (!nodeElement) {
               nodeElement = document.querySelector(`[data-node-id="${nodeId}"]`);
             }
             if (!nodeElement) {
               const allNodes = document.querySelectorAll('.d3-node');
               nodeElement = Array.from(allNodes).find(node => {
                 return node.textContent.includes('Decision') || 
                        node.getAttribute('data-id') === nodeId ||
                        node.getAttribute('id') === nodeId;
               });
             }
             if (nodeElement) {
               const allElements = nodeElement.querySelectorAll('.d3-node-body-outline, .d3-node-body, .d3-node-body-outline path, .d3-node-body path');               
               allElements.forEach((element) => {
                 if (element.tagName === 'path') {
                   const oldPath = element.getAttribute('d');                   
                   if (oldPath && oldPath.includes('M')) {
                     element.setAttribute('d', diamondPath);
                   }
                 } else {
                   element.style.width = `${newWidth}px`;
                   element.style.height = `${newHeight}px`;                 
                   const paths = element.querySelectorAll('path');
                   paths.forEach((path) => {
                     const oldPath = path.getAttribute('d');                     
                     if (oldPath && oldPath.includes('M')) {
                       path.setAttribute('d', diamondPath);
                     }
                   });
                 }
               });
               
               updateCount++;             
               if (updateCount < maxUpdates) {
                 setTimeout(maintainDiamondShape, 50);
               } else {
                 console.log(`Reached max updates (${maxUpdates}), stopping maintenance`);
               }
             } else {
               updateCount++;             
               if (updateCount < maxUpdates) {
                 setTimeout(maintainDiamondShape, 50);
               } else {
                 console.log(`Gave up after ${maxUpdates} attempts`);
               }
             }
           };
           
           setTimeout(maintainDiamondShape, 50);
           setTimeout(maintainDiamondShape, 200);
           setTimeout(maintainDiamondShape, 500);    
           setTimeout(() => {
             canvasController.setNodeProperties(nodeId, finalNode, pipelineId);      
             canvasController.setPipelineFlow(canvasController.getPipelineFlow());
           }, 800);          
         } catch (error) {
           console.error("Error updating diamond shape:", error);
         }
       }
       
       // Also check if any diamond nodes are in the selected objects
       if (e.selectedObjects && e.selectedObjects.length > 0) {
         e.selectedObjects.forEach(selectedNode => {
           if (selectedNode.op === "decision" || selectedNode.type === "polygon") {
             const objectsInfo = e.objectsInfo[selectedNode.id];
             if (objectsInfo && objectsInfo.isResized) {
               const newWidth = objectsInfo.width;
               const newHeight = objectsInfo.height;
               const diamondPath = `M ${newWidth/2} 0 L ${newWidth} ${newHeight/2} L ${newWidth/2} ${newHeight} L 0 ${newHeight/2} Z`;
               if (!selectedNode.app_data) selectedNode.app_data = {};
               if (!selectedNode.app_data.ui_data) selectedNode.app_data.ui_data = {};
               selectedNode.app_data.ui_data.currentWidth = newWidth;
               selectedNode.app_data.ui_data.currentHeight = newHeight;
               selectedNode.app_data.ui_data.diamondDimensions = {
                 width: newWidth,
                 height: newHeight,
                 path: diamondPath
               };
               
               setTimeout(() => {
                 canvasController.setPipelineFlow(canvasController.getPipelineFlow());
               }, 100);
               
               // Also try direct DOM manipulation to update the diamond shape
               setTimeout(() => {
                 const nodeElement = document.querySelector(`[data-id="${selectedNode.id}"]`) || 
                                   document.querySelector(`[id="${selectedNode.id}"]`) ||
                                   document.querySelector(`[data-node-id="${selectedNode.id}"]`);
                 
                 if (nodeElement) {
                   const pathElement = nodeElement.querySelector('path[d*="M"]');
                   if (pathElement) {
                     pathElement.setAttribute('d', diamondPath);
                   } else {
                     console.log("No path element found in selected node");
                   }
                 } else {
                   console.log("No selected node element found for DOM manipulation");
                 }
               }, 200);
             }
           }
         });
       }
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

  const triggerDecorationEdit = (linkId, decorationId) => {
    if (!canvasController) return;
    try {
      canvasController.setLinkDecorationLabelEditingMode(linkId, decorationId);
    } catch (error) {
      console.log("Method 1 failed:", error);    
      try {
        canvasController.editDecorationLabel(decorationId);
      } catch {
        const editEvent = {
          editType: "editDecorationLabel",
          editSource: "api",
          editData: { decorationId, linkId }
        };
        handleEditAction(editEvent);
      }
    }
  };

  const createTextInputForDecoration = (linkId, decorationId) => {
    const decorationElement = document.querySelector(`[data-id="link_dec_group_1_${decorationId}"]`);
    if (!decorationElement) {
      const alternativeElement = document.querySelector('.d3-link-dec-outline');
      if (!alternativeElement) {
        return;
      }
      const rect = alternativeElement.getBoundingClientRect();
      createTextInputOverlay(rect, linkId, decorationId);
      return;
    }
    
    const rect = decorationElement.getBoundingClientRect();
    createTextInputOverlay(rect, linkId, decorationId);
  };

  const createTextInputOverlay = (rect, linkId, decorationId) => {
    const existingInput = document.getElementById('decoration-text-input');
    if (existingInput) {
      existingInput.remove();
    }
    let currentText = decorationTexts[decorationId] || 'Link Label';
    const decorationGroup = document.querySelector(`[data-id="link_dec_group_1_${decorationId}"]`);
    if (decorationGroup) {
      const textElement = decorationGroup.querySelector('text');
      if (textElement && textElement.textContent) {
        currentText = textElement.textContent;
      }
    }
    
    if (decorationGroup) {
      const textElement = decorationGroup.querySelector('text');
      if (textElement) {
        textElement.style.display = 'none';
      }
    }
    
    const textInput = document.createElement('input');
    textInput.id = 'decoration-text-input';
    textInput.type = 'text';
    textInput.value = currentText;
    textInput.style.position = 'absolute';
    textInput.style.left = `${rect.left}px`;
    textInput.style.top = `${rect.top}px`;
    textInput.style.width = `${rect.width}px`;
    textInput.style.height = `${rect.height}px`;
    textInput.style.zIndex = '10000';
    textInput.style.border = '1px solid #1D3649';
    textInput.style.padding = '4px';
    textInput.style.fontSize = '12px';
    textInput.style.fontWeight = 'bold';
    textInput.style.backgroundColor = '#FFFFFF';
    textInput.style.color = '#1D3649';
    textInput.style.textAlign = 'center';   
    textInput.addEventListener('blur', () => {
      const newText = textInput.value.trim() || 'Link Label';
      setDecorationTexts(prev => ({
        ...prev,
        [decorationId]: newText
      }));
      
      updateDecorationText(linkId, decorationId, newText);
      textInput.remove();
      if (decorationGroup) {
        const textElement = decorationGroup.querySelector('text');
        if (textElement) {
          textElement.style.display = '';
          textElement.textContent = newText;
        }
      }
    });
    
    textInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const newText = textInput.value.trim() || 'Link Label';
        setDecorationTexts(prev => ({
          ...prev,
          [decorationId]: newText
        }));
        updateDecorationText(linkId, decorationId, newText);
        textInput.remove();
        if (decorationGroup) {
          const textElement = decorationGroup.querySelector('text');
          if (textElement) {
            textElement.style.display = '';
            textElement.textContent = newText;
          }
        }
      }
    });
    
    textInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        textInput.remove();
        if (decorationGroup) {
          const textElement = decorationGroup.querySelector('text');
          if (textElement) {
            textElement.style.display = '';
          }
        }
      }
    });
    document.body.appendChild(textInput);
    textInput.focus();
    textInput.select();
  };

  const injectTextIntoDecoration = (decorationId, text) => {
    const decorationGroup = document.querySelector(`[data-id="link_dec_group_1_${decorationId}"]`);
    if (decorationGroup) {
      const existingTexts = decorationGroup.querySelectorAll('text');
      existingTexts.forEach(textEl => textEl.remove());
      const displayText = decorationTexts[decorationId] || text;
      const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textElement.setAttribute('x', '50');
      textElement.setAttribute('y', '15');
      textElement.setAttribute('text-anchor', 'middle');
      textElement.setAttribute('dominant-baseline', 'middle');
      textElement.setAttribute('font-size', '14px');
      textElement.setAttribute('font-weight', 'bold');
      textElement.setAttribute('fill', '#1D3649');
      textElement.textContent = displayText;
      decorationGroup.appendChild(textElement);
    } else {
      console.log("Decoration group not found for text injection");
    }
  };

  const updateDecorationText = (linkId, decorationId, newText) => {
    if (!canvasController) return;
    
    try {
      // Update state first
      setDecorationTexts(prev => ({
        ...prev,
        [decorationId]: newText
      }));
      
      const pipelineId = canvasController.getCurrentPipelineId();
      const link = canvasController.getLink(linkId, pipelineId);
      
      if (link && link.app_data && link.app_data.ui_data && link.app_data.ui_data.decorations) {
        // Find and update the specific decoration
        const updatedDecorations = link.app_data.ui_data.decorations.map(dec => {
          if (dec.id === decorationId) {
            return { ...dec, text: newText };
          }
          return dec;
        });
        
        // Update link properties
        const updatedProperties = {
          app_data: {
            ui_data: {
              decorations: updatedDecorations
            }
          }
        };
        
        canvasController.setLinkProperties(linkId, updatedProperties, pipelineId);
        injectTextIntoDecoration(decorationId, newText);
        setTimeout(() => {
          const decorationGroup = document.querySelector(`[data-id="link_dec_group_1_${decorationId}"]`);
          if (decorationGroup) {
            const textElement = decorationGroup.querySelector('text');
            if (textElement) {
              textElement.textContent = newText;
              textElement.style.display = '';
            }
          }
        }, 50);
        
        // Force canvas refresh
        setTimeout(() => {
          canvasController.setPipelineFlow(canvasController.getPipelineFlow());
        }, 100);
      }
    } catch (error) {
      console.log("Error updating decoration text:", error);
    }
  };

  const handlePropertyChange = (propertyId, value) => {    
    if (selectedNodeId && canvasController) {
      const pipelineId = canvasController.getCurrentPipelineId();
      const node = canvasController.getNode(selectedNodeId, pipelineId);
      
      if (node) {
        const updatedNode = { ...node };
        
        if (propertyId === "label") {
          updatedNode.app_data = {
            ...updatedNode.app_data,
            ui_data: {
              ...updatedNode.app_data?.ui_data,
              label: value
            }
          };
        } else if (propertyId === "description") {
          updatedNode.app_data = {
            ...updatedNode.app_data,
            ui_data: {
              ...updatedNode.app_data?.ui_data,
              description: value
            }
          };
        }
                try {
          canvasController.setNodeProperties(selectedNodeId, updatedNode, pipelineId);
          setNodeProperties(updatedNode);
        } catch (error) {
          console.error("Error updating node properties:", error);
        }
      }
    }
  };

  const handleClosePropertiesPanel = () => {
    setShowRightFlyout(false);
    setSelectedNodeId(null);
    setNodeProperties({});
  };

  const rightFlyoutContent = showRightFlyout ? (
    <div style={{ display: 'flex', height: '100%', flexDirection: 'column', padding: '16px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '1px solid #ddd',
        paddingBottom: '16px',
        marginBottom: '16px'
      }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>Node Properties</h3>
        <button 
          onClick={handleClosePropertiesPanel}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '4px 8px'
          }}
        >
          ×
        </button>
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Label:</label>
          <input 
            type="text" 
            value={nodeProperties.label || ''} 
            onChange={(e) => handlePropertyChange('label', e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Description:</label>
          <textarea 
            value={nodeProperties.description || ''} 
            onChange={(e) => handlePropertyChange('description', e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '60px' }}
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Node Type:</label>
          <input 
            type="text" 
            value={nodeProperties.op || nodeProperties.type || 'unknown'} 
            readOnly
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f5f5f5' }}
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Position:</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="number" 
              value={nodeProperties.x_pos || 0} 
              readOnly
              style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f5f5f5' }}
              placeholder="X"
            />
            <input 
              type="number" 
              value={nodeProperties.y_pos || 0} 
              readOnly
              style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f5f5f5' }}
              placeholder="Y"
            />
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {canvasController && 
        <>
        <ExportCanvas/>
        <Canvas
          canvasController={canvasController}
          config={canvasConfig}
          rightFlyoutContent={rightFlyoutContent}
          showRightFlyout={showRightFlyout}
          layoutHandler={layoutHandler}
          editActionHandler={(e) => {
            handleEditAction(e);
          }}
          resizeHandler={(e) => {;
            handleEditAction(e);
          }}
          mouseHandler={(e) => {
            handleEditAction(e);
          }}
          contextMenuHandler={(source, defaultMenu) => contextMenuHandler(source, defaultMenu)}
          tipHandler={(toolTipType, data) => canvasToolTipHandler(toolTipType, data)}
          clickActionHandler={(e) => {
            if (e.objectType === "node") {
              setTimeout(() => {
                if (canvasController) {
                  canvasController.setPipelineFlow(canvasController.getPipelineFlow());
                }
              }, 100);
              return;
            }  
            if (e.objectType === "decoration" && e.id && e.id.startsWith("label_")) {
              try {
                const linkId = e.id.replace("label_", "");
                canvasController.setLinkDecorationLabelEditingMode(linkId, e.id);
                setTimeout(() => {
                  createTextInputForDecoration(linkId, e.id);
                }, 100);
              } catch (error) {
                console.log("Error making decoration editable:", error);
              }
              return;
            }
            
            if (e.objectType === "link") {
              const pipelineId = canvasController.getCurrentPipelineId();
              const link = canvasController.getLink(e.id, pipelineId);
              const hasDecoration = link && link.app_data && link.app_data.ui_data && 
                                 link.app_data.ui_data.decorations && 
                                 link.app_data.ui_data.decorations.length > 0;
              
              if (hasDecoration) {
                const decorationId = `label_${e.id}`;
                setTimeout(() => {
                  createTextInputForDecoration(e.id, decorationId);
                }, 100);
              } else {
                addLinkLabel(e.id);
                setTimeout(() => {
                  triggerDecorationEdit(e.id, `label_${e.id}`);
                }, 500);
              }
              makeLinksDashed()
            }
          }}
          decorationActionHandler={(e) => {
            if (e.action === "editDecorationLabel") {
              const { decorationId, linkId } = e.data || {};
              if (decorationId && linkId) {
                try {
                  canvasController.setLinkDecorationLabelEditingMode(linkId, decorationId);
                  setTimeout(() => {
                    createTextInputForDecoration(linkId, decorationId);
                  }, 100);
                } catch (error) {
                  console.log("Error in decorationActionHandler:", error);
                }
              }
            }
          }}
        />
        </>
}
    </>
  );
}

export default App;
