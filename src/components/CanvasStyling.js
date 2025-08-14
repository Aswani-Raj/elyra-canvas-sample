export const applyTextStyleToCanvas = (nodeId, textStyle) => {
  setTimeout(() => {
    let nodeElement = document.querySelector(`[data-id="${nodeId}"]`);
    if (!nodeElement) {
      nodeElement = document.querySelector(`[id="${nodeId}"]`);
    }
    if (!nodeElement) {
      nodeElement = document.querySelector(`[data-node-id="${nodeId}"]`);
    }
    if (!nodeElement) {
      return;
    }

    const labelElements = nodeElement.querySelectorAll('.d3-node-label');
    
    if (labelElements.length === 0) {
      return;
    }

    const applyStyleToElement = (element) => {
      if (textStyle.fontSize) {
        element.style.fontSize = `${textStyle.fontSize}px`;
        element.setAttribute('font-size', `${textStyle.fontSize}px`);
      }
      if (textStyle.fontColor) {
        element.style.fill = textStyle.fontColor;
        element.style.color = textStyle.fontColor;
        element.setAttribute('fill', textStyle.fontColor);
      }
      if (textStyle.fontWeight) {
        element.style.fontWeight = textStyle.fontWeight;
        element.setAttribute('font-weight', textStyle.fontWeight);
      }
      if (textStyle.fontStyle) {
        element.style.fontStyle = textStyle.fontStyle;
        element.setAttribute('font-style', textStyle.fontStyle);
      }
      if (textStyle.textDecoration) {
        element.style.textDecoration = textStyle.textDecoration;
        element.setAttribute('text-decoration', textStyle.textDecoration);
      }
      if (textStyle.textAlign) {
        element.style.textAlign = textStyle.textAlign;
        element.setAttribute('text-anchor', textStyle.textAlign === 'center' ? 'middle' : 
                            textStyle.textAlign === 'right' ? 'end' : 'start');
      }
    };

    labelElements.forEach(labelElement => {
      applyStyleToElement(labelElement);
      const childTextElements = labelElement.querySelectorAll('text, tspan');
      childTextElements.forEach(childElement => {
        applyStyleToElement(childElement);
      });        
      const foreignObjects = labelElement.querySelectorAll('foreignObject');
      foreignObjects.forEach(foreignObj => {
        const textElements = foreignObj.querySelectorAll('text, tspan, div');
        textElements.forEach(textElement => {
          applyStyleToElement(textElement);
        });
      });
    });
  }, 200);
};

export const applyTextStyleToAllNodes = (canvasController) => {
  if (!canvasController) return;
  
  setTimeout(() => {
    const pipelineId = canvasController.getCurrentPipelineId();
    const nodes = canvasController.getNodes(pipelineId);
    
    nodes.forEach(node => {
      if (node.app_data?.ui_data?.textStyle) {
        applyTextStyleToCanvas(node.id, node.app_data.ui_data.textStyle);
      }
    });
  }, 300);
};

export const applyNodeStyleToAllNodes = (canvasController) => {
  if (!canvasController) return;
  
  setTimeout(() => {
    const pipelineId = canvasController.getCurrentPipelineId();
    const nodes = canvasController.getNodes(pipelineId);
    
    nodes.forEach(node => {
      if (node.app_data?.ui_data) {
        const uiData = node.app_data.ui_data;
        const nodeStyle = {
          fillColor: uiData.fillColor,
          borderColor: uiData.borderColor,
          borderWidth: uiData.borderWidth
        };
        
        if (nodeStyle.fillColor || nodeStyle.borderColor || nodeStyle.borderWidth) {
          applyNodeStyleToCanvas(node.id, nodeStyle);
        }
      }
    });
  }, 300);
};

export const applyTextStyleToAllLabels = (textStyle) => {
  setTimeout(() => {
    const allLabelElements = document.querySelectorAll('.d3-node-label');
    
    allLabelElements.forEach(labelElement => {
      if (textStyle.fontSize) {
        labelElement.style.fontSize = `${textStyle.fontSize}px`;
        labelElement.setAttribute('font-size', `${textStyle.fontSize}px`);
      }
      if (textStyle.fontColor) {
        labelElement.style.fill = textStyle.fontColor;
        labelElement.style.color = textStyle.fontColor;
        labelElement.setAttribute('fill', textStyle.fontColor);
      }
      if (textStyle.fontWeight) {
        labelElement.style.fontWeight = textStyle.fontWeight;
        labelElement.setAttribute('font-weight', textStyle.fontWeight);
      }
      if (textStyle.fontStyle) {
        labelElement.style.fontStyle = textStyle.fontStyle;
        labelElement.setAttribute('font-style', textStyle.fontStyle);
      }
      if (textStyle.textDecoration) {
        labelElement.style.textDecoration = textStyle.textDecoration;
        labelElement.setAttribute('text-decoration', textStyle.textDecoration);
      }
      if (textStyle.textAlign) {
        labelElement.style.textAlign = textStyle.textAlign;
        labelElement.setAttribute('text-anchor', textStyle.textAlign === 'center' ? 'middle' : 
                                textStyle.textAlign === 'right' ? 'end' : 'start');
      }
      
      const childTextElements = labelElement.querySelectorAll('text, tspan');
      childTextElements.forEach(childElement => {
        if (textStyle.fontSize) {
          childElement.style.fontSize = `${textStyle.fontSize}px`;
          childElement.setAttribute('font-size', `${textStyle.fontSize}px`);
        }
        if (textStyle.fontColor) {
          childElement.style.fill = textStyle.fontColor;
          childElement.style.color = textStyle.fontColor;
          childElement.setAttribute('fill', textStyle.fontColor);
        }
        if (textStyle.fontWeight) {
          childElement.style.fontWeight = textStyle.fontWeight;
          childElement.setAttribute('font-weight', textStyle.fontWeight);
        }
        if (textStyle.fontStyle) {
          childElement.style.fontStyle = textStyle.fontStyle;
          childElement.setAttribute('font-style', textStyle.fontStyle);
        }
        if (textStyle.textDecoration) {
          childElement.style.textDecoration = textStyle.textDecoration;
          childElement.setAttribute('text-decoration', textStyle.textDecoration);
        }
        if (textStyle.textAlign) {
          childElement.style.textAlign = textStyle.textAlign;
          childElement.setAttribute('text-anchor', textStyle.textAlign === 'center' ? 'middle' : 
                                  textStyle.textAlign === 'right' ? 'end' : 'start');
        }
      });
    });   
  }, 200);
};

export const applyNodeStyleToCanvas = (nodeId, nodeStyle) => {
  let nodeElement = document.querySelector(`[data-id="${nodeId}"]`);
  if (!nodeElement) {
    nodeElement = document.querySelector(`[data-id="node_grp_1_${nodeId}"]`);
  }
  if (!nodeElement) {
    nodeElement = document.querySelector(`[id="${nodeId}"]`);
  }
  if (!nodeElement) {
    nodeElement = document.querySelector(`[data-node-id="${nodeId}"]`);
  }
  if (!nodeElement) {
    console.log(`Node element not found for ID: ${nodeId}`);
    return;
  }
  
  if (nodeStyle.fillColor) {
    const bodyOutlineElements = nodeElement.querySelectorAll('.d3-node-body-outline');    
    bodyOutlineElements.forEach(element => {
      element.style.fill = nodeStyle.fillColor;
      element.setAttribute('fill', nodeStyle.fillColor);          
      element.style.setProperty('--fill-color', nodeStyle.fillColor);         
    });
  }

  // Apply border color and width to d3-node-body-outline specifically
  if (nodeStyle.borderColor || nodeStyle.borderWidth) {
    const bodyOutlineElements = nodeElement.querySelectorAll('.d3-node-body-outline');        
    bodyOutlineElements.forEach(borderElement => {
      if (nodeStyle.borderColor) {
        borderElement.style.stroke = nodeStyle.borderColor;
        borderElement.setAttribute('stroke', nodeStyle.borderColor);
      }
      if (nodeStyle.borderWidth) {
        borderElement.style.strokeWidth = `${nodeStyle.borderWidth}px`;
        borderElement.setAttribute('stroke-width', nodeStyle.borderWidth);
      }
    });
  }

  const styleId = `node-style-${nodeId}`;
  let existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    existingStyle.remove();
  }
  
  if (nodeStyle.fillColor || nodeStyle.borderColor || nodeStyle.borderWidth) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Target both the direct node ID and the group-prefixed version */
      [data-id="${nodeId}"] .d3-node-body-outline,
      [data-id="node_grp_1_${nodeId}"] .d3-node-body-outline {
        ${nodeStyle.fillColor ? `fill: ${nodeStyle.fillColor} !important;` : ''}
        ${nodeStyle.borderColor ? `stroke: ${nodeStyle.borderColor} !important;` : ''}
        ${nodeStyle.borderWidth ? `stroke-width: ${nodeStyle.borderWidth}px !important;` : ''}
      }
      
      /* Override any CSS custom properties the canvas might be using */
      [data-id="${nodeId}"] .d3-node-body-outline,
      [data-id="node_grp_1_${nodeId}"] .d3-node-body-outline {
        ${nodeStyle.fillColor ? `--cds-layer-selected-inverse: ${nodeStyle.fillColor} !important;` : ''}
        ${nodeStyle.fillColor ? `--cds-layer: ${nodeStyle.fillColor} !important;` : ''}
        ${nodeStyle.fillColor ? `--cds-layer-accent: ${nodeStyle.fillColor} !important;` : ''}
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => {
    const event = new Event('resize');
    window.dispatchEvent(event);
    
    setTimeout(() => {
      const refreshedNodeElement = document.querySelector(`[data-id="${nodeId}"]`);
      if (refreshedNodeElement) {
        const refreshedBodyOutlineElements = refreshedNodeElement.querySelectorAll('.d3-node-body-outline');
        
        refreshedBodyOutlineElements.forEach(element => {
          if (nodeStyle.fillColor) {
            element.style.setProperty('fill', nodeStyle.fillColor, 'important');
            element.setAttribute('fill', nodeStyle.fillColor);
          }
          if (nodeStyle.borderColor) {
            element.style.setProperty('stroke', nodeStyle.borderColor, 'important');
            element.setAttribute('stroke', nodeStyle.borderColor);
          }
          if (nodeStyle.borderWidth) {
            element.style.setProperty('stroke-width', `${nodeStyle.borderWidth}px`, 'important');
            element.setAttribute('stroke-width', nodeStyle.borderWidth);
          }
        });
      }
    }, 150);
  }, 100);
}; 