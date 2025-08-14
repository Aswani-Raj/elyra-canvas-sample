import { useState } from 'react';

export const useCanvasState = () => {
  const [canvasController, setCanvasController] = useState();
  const [decorationTexts, setDecorationTexts] = useState({});
  const [showRightFlyout, setShowRightFlyout] = useState(false);
  const [showLabelEditPanel, setShowLabelEditPanel] = useState(false);
  const [showNodeStyling, setShowNodeStyling] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [nodeProperties, setNodeProperties] = useState({});

  const resetState = () => {
    setShowRightFlyout(false);
    setShowLabelEditPanel(false);
    setShowNodeStyling(false);
    setSelectedNodeId(null);
    setNodeProperties({});
  };

  const setNodeData = (nodeId, node) => {
    const nodeData = {
      ...node,
      label: node.app_data?.ui_data?.label || node.label || "Node",
      description: node.app_data?.ui_data?.description || node.description || "Node Description",
      op: node.op || node.type || "unknown",
      x_pos: node.x_pos || 0,
      y_pos: node.y_pos || 0
    };
    
    setSelectedNodeId(nodeId);
    setNodeProperties(nodeData);
  };

  return {
    canvasController,
    decorationTexts,
    showRightFlyout,
    showLabelEditPanel,
    showNodeStyling,
    selectedNodeId,
    nodeProperties,
    setCanvasController,
    setDecorationTexts,
    setShowRightFlyout,
    setShowLabelEditPanel,
    setShowNodeStyling,
    setSelectedNodeId,
    setNodeProperties,
    resetState,
    setNodeData
  };
}; 