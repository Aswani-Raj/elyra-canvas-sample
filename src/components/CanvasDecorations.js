export const triggerDecorationEdit = (canvasController, linkId, decorationId) => {
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
      // handleEditAction(editEvent);
    }
  }
};

export const createTextInputForDecoration = (linkId, decorationId) => {
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

export const createTextInputOverlay = (rect, linkId, decorationId, decorationTexts, setDecorationTexts, updateDecorationText) => {
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

export const injectTextIntoDecoration = (decorationId, text, decorationTexts) => {
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

export const updateDecorationText = (canvasController, linkId, decorationId, newText, setDecorationTexts, decorationTexts, injectTextIntoDecoration) => {
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
      injectTextIntoDecoration(decorationId, newText, decorationTexts);
      
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