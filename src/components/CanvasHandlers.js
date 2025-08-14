export const canvasToolTipHandler = () => {
  return "Tooltip";
};

export const layoutHandler = (node) => {
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

export const contextMenuHandler = (
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
       { action: "myApp_Action1", label: "Properties" },
       { action: "myApp_Action2", label: "Styling" },
       { action: "setNodeLabelEditingMode", label: "Label Formatting" },
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