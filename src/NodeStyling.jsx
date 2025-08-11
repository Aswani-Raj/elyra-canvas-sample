import React, { useState, useEffect } from 'react';

const NodeStyling = ({ nodeProperties, onPropertyChange, onClose }) => {
  const [fillColor, setFillColor] = useState('#ffffff');
  const [borderColor, setBorderColor] = useState('#000000');
  const [borderWidth, setBorderWidth] = useState(1);
  const [previewFillColor, setPreviewFillColor] = useState('#ffffff');
  const [previewBorderColor, setPreviewBorderColor] = useState('#000000');
  const [previewBorderWidth, setPreviewBorderWidth] = useState(1);

  useEffect(() => {
    if (nodeProperties && nodeProperties.app_data && nodeProperties.app_data.ui_data) {
      const uiData = nodeProperties.app_data.ui_data;
      if (uiData.fillColor) {
        setFillColor(uiData.fillColor);
        setPreviewFillColor(uiData.fillColor);
      }
      if (uiData.borderColor) {
        setBorderColor(uiData.borderColor);
        setPreviewBorderColor(uiData.borderColor);
      }
      if (uiData.borderWidth) {
        setBorderWidth(uiData.borderWidth);
        setPreviewBorderWidth(uiData.borderWidth);
      }
    }
  }, [nodeProperties]);

  const handleFillColorChange = (color) => {
    setFillColor(color);
    setPreviewFillColor(color);
  };

  const handleBorderColorChange = (color) => {
    setBorderColor(color);
    setPreviewBorderColor(color);
  };

  const handleBorderWidthChange = (width) => {
    setBorderWidth(width);
    setPreviewBorderWidth(width);
  };

  const handleApplyStyles = () => {    
    onPropertyChange('nodeStyle', {
      fillColor: previewFillColor,
      borderColor: previewBorderColor,
      borderWidth: previewBorderWidth
    });
    setFillColor(previewFillColor);
    setBorderColor(previewBorderColor);
    setBorderWidth(previewBorderWidth);
  };

  const handleResetStyles = () => {
    setPreviewFillColor(fillColor);
    setPreviewBorderColor(borderColor);
    setPreviewBorderWidth(borderWidth);
  };

  const predefinedColors = [
    '#ffffff', '#f0f0f0', '#e0e0e0', '#d0d0d0', '#c0c0c0',
    '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff',
    '#00ffff', '#ffa500', '#800080', '#008000', '#ffc0cb',
    '#000000', '#333333', '#666666', '#999999', '#cccccc'
  ];

  return (
    <div style={{ display: 'flex', height: '100%', flexDirection: 'column', padding: '16px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '1px solid #ddd',
        paddingBottom: '16px',
        marginBottom: '16px'
      }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>Node Styling</h3>
        <button 
          onClick={onClose}
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
      
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Fill Color:</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
            {predefinedColors.map(color => (
              <button
                key={color}
                onClick={() => handleFillColorChange(color)}
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: color,
                  border: color === previewFillColor ? '2px solid #333' : '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                title={color}
              />
            ))}
          </div>
          <input
            type="color"
            value={previewFillColor}
            onChange={(e) => handleFillColorChange(e.target.value)}
            style={{
              width: '100%',
              height: '40px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Border Color:</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
            {predefinedColors.map(color => (
              <button
                key={color}
                onClick={() => handleBorderColorChange(color)}
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: color,
                  border: color === previewBorderColor ? '2px solid #333' : '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                title={color}
              />
            ))}
          </div>
          <input
            type="color"
            value={previewBorderColor}
            onChange={(e) => handleBorderColorChange(e.target.value)}
            style={{
              width: '100%',
              height: '40px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Border Width:</label>
          <input
            type="range"
            min="0"
            max="10"
            value={previewBorderWidth}
            onChange={(e) => handleBorderWidthChange(Number(e.target.value))}
            style={{
              width: '100%',
              height: '6px',
              borderRadius: '3px',
              background: '#ddd',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
            <span>0px</span>
            <span>{previewBorderWidth}px</span>
            <span>10px</span>
          </div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Preview:</label>
          <div
            style={{
              width: '100px',
              height: '60px',
              backgroundColor: previewFillColor,
              border: `${previewBorderWidth}px solid ${previewBorderWidth > 0 ? previewBorderColor : 'transparent'}`,
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#333'
            }}
          >
            Node
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
          <button
            onClick={handleResetStyles}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Reset
          </button>
          <button
            onClick={handleApplyStyles}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Apply Styles
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeStyling; 