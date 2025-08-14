import Canvas from "./canvas";
import ModifyLabel from "./modifyLabel";
import NodeProperties from "./NodeProperties";
import NodeStyling from "./NodeStyling";
import ExportCanvas from "./export";
import { canvasConfig } from "./components/CanvasConfig";
import { canvasToolTipHandler, layoutHandler, contextMenuHandler } from "./components/CanvasHandlers";
import { useCanvasState } from "./components/CanvasState";
import { useCanvasEffects } from "./components/CanvasEffects";
import { 
  addLinkLabel, 
  makeLinksDashed, 
  handleEditAction 
} from "./components/CanvasActions";
import { 
  applyTextStyleToCanvas, 
  applyTextStyleToAllNodes, 
  applyNodeStyleToAllNodes, 
  applyTextStyleToAllLabels, 
  applyNodeStyleToCanvas 
} from "./components/CanvasStyling";
import { 
  triggerDecorationEdit, 
  createTextInputForDecoration, 
  injectTextIntoDecoration
} from "./components/CanvasDecorations";

function App() {
  const {
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
    resetState
  } = useCanvasState();

  // Use the effects hook
  useCanvasEffects(
    canvasController, 
    setCanvasController, 
    () => applyTextStyleToAllNodes(canvasController), 
    () => applyNodeStyleToAllNodes(canvasController)
  );

  const handlePropertyChange = (propertyId, value) => {        
    if (selectedNodeId && canvasController) {
      const pipelineId = canvasController.getCurrentPipelineId();
      const node = canvasController.getNode(selectedNodeId, pipelineId);
      
      if (node) {
        const updatedNode = { ...node };
        
        if (propertyId === "label") {
          updatedNode.label = value;
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
        } else if (propertyId === "hyperlink") {
          updatedNode.app_data = {
            ...updatedNode.app_data,
            ui_data: {
              ...updatedNode.app_data?.ui_data,
              hyperlink: value
            }
          };
        } else if (propertyId === "nodeStyle") {
          const newNodeStyle = {
            ...updatedNode.app_data?.ui_data,
            ...value
          };          
          updatedNode.app_data = {
            ...updatedNode.app_data,
            ui_data: newNodeStyle
          };
          
          applyNodeStyleToCanvas(selectedNodeId, value);
          
          try {
            if (canvasController) {
              const pipelineId = canvasController.getCurrentPipelineId();              
              canvasController.setNodeProperties(selectedNodeId, updatedNode, pipelineId);
            }
          } catch (error) {
            console.log('Error updating node through controller:', error);
          }
          
          setTimeout(() => {
            applyNodeStyleToAllNodes(canvasController);
          }, 100);
        } else if (propertyId === "textStyle") {
          const newTextStyle = {
            ...updatedNode.app_data?.ui_data?.textStyle,
            ...value
          };
          
          updatedNode.app_data = {
            ...updatedNode.app_data,
            ui_data: {
              ...updatedNode.app_data?.ui_data,
              textStyle: newTextStyle
            }
          };
          applyTextStyleToCanvas(selectedNodeId, newTextStyle);
          applyTextStyleToAllLabels(newTextStyle);
        }
        
        try {
          canvasController.setNodeProperties(selectedNodeId, updatedNode, pipelineId);
          setNodeProperties(updatedNode);     
          if (propertyId === "textStyle") {
            setTimeout(() => {
              applyTextStyleToAllNodes(canvasController);
            }, 100);
          }
        } catch (error) {
          console.error("Error updating node properties:", error);
        }
      }
    }
  };

  const handleClosePropertiesPanel = () => {
    resetState();
  };

  const getRightFlyoutContent = () => {
    if (showRightFlyout) {
      if (showLabelEditPanel) {
        return (
          <ModifyLabel 
            nodeProperties={nodeProperties}
            onClose={handleClosePropertiesPanel}
            onPropertyChange={handlePropertyChange}
          />
        );
      } else if (showNodeStyling) {
        return (
          <NodeStyling
            nodeProperties={nodeProperties}
            onPropertyChange={handlePropertyChange}
            onClose={handleClosePropertiesPanel}
          />
        );
      } else {
        return (
          <NodeProperties
            nodeProperties={nodeProperties}
            onPropertyChange={handlePropertyChange}
            onClose={handleClosePropertiesPanel}
          />
        );
      }
    } else {
      return null;
    }
  };

  const rightFlyoutContent = getRightFlyoutContent();

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
            handleEditAction(
              e, 
              canvasController, 
              setShowRightFlyout, 
              setShowLabelEditPanel, 
              setShowNodeStyling, 
              setSelectedNodeId, 
              setNodeProperties, 
              setDecorationTexts, 
              decorationTexts, 
              injectTextIntoDecoration, 
              () => applyNodeStyleToAllNodes(canvasController), 
              () => applyTextStyleToAllNodes(canvasController)
            );
          }}
          resizeHandler={(e) => {
            handleEditAction(
              e, 
              canvasController, 
              setShowRightFlyout, 
              setShowLabelEditPanel, 
              setShowNodeStyling, 
              setSelectedNodeId, 
              setNodeProperties, 
              setDecorationTexts, 
              decorationTexts, 
              injectTextIntoDecoration, 
              () => applyNodeStyleToAllNodes(canvasController), 
              () => applyTextStyleToAllNodes(canvasController)
            );
          }}
          mouseHandler={(e) => {
            handleEditAction(
              e, 
              canvasController, 
              setShowRightFlyout, 
              setShowLabelEditPanel, 
              setShowNodeStyling, 
              setSelectedNodeId, 
              setNodeProperties, 
              setDecorationTexts, 
              decorationTexts, 
              injectTextIntoDecoration, 
              () => applyNodeStyleToAllNodes(canvasController), 
              () => applyTextStyleToAllNodes(canvasController)
            );
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
                addLinkLabel(
                  canvasController, 
                  setDecorationTexts, 
                  decorationTexts, 
                  injectTextIntoDecoration, 
                  (editAction) => handleEditAction(
                    editAction, 
                    canvasController, 
                    setShowRightFlyout, 
                    setShowLabelEditPanel, 
                    setShowNodeStyling, 
                    setSelectedNodeId, 
                    setNodeProperties, 
                    setDecorationTexts, 
                    decorationTexts, 
                    injectTextIntoDecoration, 
                    () => applyNodeStyleToAllNodes(canvasController), 
                    () => applyTextStyleToAllNodes(canvasController)
                  ),
                  e.id
                );
                setTimeout(() => {
                  triggerDecorationEdit(canvasController, e.id, `label_${e.id}`);
                }, 500);
              }
              makeLinksDashed(canvasController);
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
