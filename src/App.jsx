import { useEffect, useState } from "react";
import Canvas from "./canvas"
import { CanvasController } from "@elyra/canvas";
import PALETTE from "./pallette.json";
import PIPELINE from "./canvas.json";

const canvasConfig = {
enableParentClass: "flows",
			enableNodeFormatType: "Vertical",
			enableLinkType: "Straight",
			enableLinkMethod: "Freeform",
			enableLinkDirection: "LeftRight",
			enableSplitLinkDroppedOnNode: true,
			enableSaveZoom: "LocalStorage",
			enableSnapToGridType: "After",
			enableLinkSelection: "None",
			enableLinkReplaceOnNewConnection: true,
			paletteInitialState: true,
			enableDropZoneOnExternalDrag: true,
			enableContextToolbar: true,
			enableHighlightNodeOnNewLinkDrag: true,
			enableRightFlyoutUnderToolbar: true,
			enableKeyboardNavigation: true,
			tipConfig: {
				palette: true,
				nodes: true,
				ports: false,
				links: false
			},
			enableNodeLayout: {
				drawNodeLinkLineFromTo: "image_center",
				drawCommentLinkLineTo: "image_center",
				defaultNodeWidth: 72,
				defaultNodeHeight: 72,
				nodeShapeDisplay: false,
				selectionPath: "M 8 0 L 64 0 64 56 8 56 8 0",
				ellipsisWidth: 12,
				ellipsisHeight: 16,
				ellipsisPosY: -1,
				ellipsisPosX: 64.5,
				imageWidth: 48,
				imageHeight: 48,
				imagePosX: 12,
				imagePosY: 4,
				labelEditable: true,
				labelSingleLine: false,
				labelPosX: 36,
				labelPosY: 56,
				labelWidth: 180,
				labelHeight: 42,
				portRadius: 10,
				inputPortDisplay: false,
				outputPortRightPosX: 5,
				outputPortRightPosY: 30,
				outputPortObject: "image",
				outputPortImage: "/dragStateArrow.svg",
				outputPortWidth: 20,
				outputPortHeight: 20,
				outputPortGuideObject: "image",
				outputPortGuideImage: "/dragStateArrow.svg"
			},
			enableCanvasLayout: {
				dataLinkArrowHead: true,
				linkGap: 4,
				displayGridType: "Dots",
				displayLinkOnOverlap: false
			}
};


//Method will return the tooltip content that is displayed on hovering nodes
 const canvasToolTipHandler = () => {
  return "Tooltip"
};

 const contextMenuHandler = (
  source,
) => {

  if (source.type === "node") {
    return [
      {
        action: "setNodeLabelEditingMode",
        label: "Edit",
        toolbarItem: true,
        enable: true,
      },
      {
        action: "rename",
        label: "Rename",
        toolbarItem: false,
      },
      { action: "", divider: true },
      {
        action: "DELETE_SELECTED_OBJECTS",
        label: "Delete",
        toolbarItem: true,
      },
    ];
  }
  
    return [
      {
        action: "deleteLink",
        label: "Delete",
        toolbarItem: true,
      },
    ];

};

// const toolbarConfig = {
//   leftBar: [], // Replacing the default toolbar contents on the left as empty
//   overrideAutoEnableDisable: false,
// };

// const keyboardConfig = {
//   actions: {
//     delete: true,
//     undo: true,
//     redo: true,
//     selectAll: false,
//     cutToClipboard: false,
//     copyToClipboard: false,
//     pasteFromClipboard: false,
//   },
// };


function App() {
  const [canvasController, setCanvasController] = useState();

  useEffect(() => {
    const cc = new CanvasController();
    cc.setPipelineFlow(PIPELINE);
    cc.setPipelineFlowPalette(PALETTE);
    cc.openPalette();
    cc.openAllPaletteCategories();
    setCanvasController(cc);
  }, []);


  return (
    <>
      {canvasController && (
        <Canvas
          canvasController={canvasController}
          config={canvasConfig}
          editActionHandler={(e) => {
            console.log(e)
          }}
          // keyboardConfig={keyboardConfig}
          contextMenuHandler={(source) => contextMenuHandler(source)}
          // toolbarConfig={toolbarConfig}
          // layoutHandler={layoutHandler}
          tipHandler={(toolTipType, data) => canvasToolTipHandler(toolTipType, data)}
          clickActionHandler={(e) => {
            console.log(e)
          }}
        />
      )}
    </>
  );
}

export default App;
