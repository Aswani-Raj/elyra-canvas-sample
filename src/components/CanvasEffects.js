import { useEffect } from 'react';
import { CanvasController } from "@elyra/canvas";
import PIPELINE from "../canvas.json";
import PALETTE from "../pallette.json";

export const useCanvasEffects = (canvasController, setCanvasController, applyTextStyleToAllNodes, applyNodeStyleToAllNodes) => {
  useEffect(() => {
    const cc = new CanvasController();
    cc.setPipelineFlow(PIPELINE);
    cc.setPipelineFlowPalette(PALETTE);
    cc.openPalette();
    cc.openAllPaletteCategories();
    setCanvasController(cc);
  }, [setCanvasController]);
  useEffect(() => {
    if (canvasController) {
      applyTextStyleToAllNodes();
      applyNodeStyleToAllNodes();
      
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            setTimeout(() => {
              applyTextStyleToAllNodes();
              applyNodeStyleToAllNodes();
            }, 50);
          }
        });
      });
      
      const canvasContainer = document.querySelector('.d3-node-container, .canvas-container, [data-id="canvas"]');
      if (canvasContainer) {
        observer.observe(canvasContainer, {
          childList: true,
          subtree: true
        });
      }
      
      return () => {
        observer.disconnect();
      };
    }
  }, [canvasController, applyTextStyleToAllNodes, applyNodeStyleToAllNodes]);
}; 