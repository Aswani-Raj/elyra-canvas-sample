import { useState, useEffect } from 'react';

const ModifyLabel = ({ nodeProperties, onClose, onPropertyChange }) => {
  const [fontSize, setFontSize] = useState(14);
  const [fontColor, setFontColor] = useState('#000000');
  const [fontWeight, setFontWeight] = useState('normal');
  const [fontStyle, setFontStyle] = useState('normal');
  const [textDecoration, setTextDecoration] = useState('none');
  const [textAlign, setTextAlign] = useState('left');
  const [labelText, setLabelText] = useState('');
  const [hyperlinkUrl, setHyperlinkUrl] = useState('');
  const [hyperlinkText, setHyperlinkText] = useState('');
  const [isHyperlinkEnabled, setIsHyperlinkEnabled] = useState(false);

  useEffect(() => {
    if (nodeProperties && nodeProperties.label) {
      setLabelText(nodeProperties.label);
    }
    
    // Load existing text styling if available
    if (nodeProperties && nodeProperties.app_data && nodeProperties.app_data.ui_data && nodeProperties.app_data.ui_data.textStyle) {
      const textStyle = nodeProperties.app_data.ui_data.textStyle;
      if (textStyle.fontSize) setFontSize(textStyle.fontSize);
      if (textStyle.fontColor) setFontColor(textStyle.fontColor);
      if (textStyle.fontWeight) setFontWeight(textStyle.fontWeight);
      if (textStyle.fontStyle) setFontStyle(textStyle.fontStyle);
      if (textStyle.textDecoration) setTextDecoration(textStyle.textDecoration);
      if (textStyle.textAlign) setTextAlign(textStyle.textAlign);
    }

    // Load existing hyperlink data if available
    if (nodeProperties && nodeProperties.app_data && nodeProperties.app_data.ui_data && nodeProperties.app_data.ui_data.hyperlink) {
      const hyperlink = nodeProperties.app_data.ui_data.hyperlink;
      if (hyperlink.url) {
        setHyperlinkUrl(hyperlink.url);
        setIsHyperlinkEnabled(true);
      }
      if (hyperlink.text) {
        setHyperlinkText(hyperlink.text);
      }
    }
  }, [nodeProperties]);

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    applyTextStyle('fontSize', size);
  };

  const handleFontColorChange = (color) => {
    setFontColor(color);
    applyTextStyle('color', color);
  };

  const handleBoldToggle = () => {
    const newWeight = fontWeight === 'bold' ? 'normal' : 'bold';
    setFontWeight(newWeight);
    applyTextStyle('fontWeight', newWeight);
  };

  const handleItalicToggle = () => {
    const newStyle = fontStyle === 'italic' ? 'normal' : 'italic';
    setFontStyle(newStyle);
    applyTextStyle('fontStyle', newStyle);
  };

  const handleUnderlineToggle = () => {
    const newDecoration = textDecoration === 'underline' ? 'none' : 'underline';
    setTextDecoration(newDecoration);
    applyTextStyle('textDecoration', newDecoration);
  };

  const handleTextAlignChange = (align) => {
    setTextAlign(align);
    applyTextStyle('textAlign', align);
  };

  const applyTextStyle = (property, value) => {
    // Update the node's text styling properties
    if (onPropertyChange) {
      onPropertyChange('textStyle', {
        fontSize,
        fontColor,
        fontWeight,
        fontStyle,
        textDecoration,
        textAlign,
        [property]: value
      });
    }
  };

  const handleLabelChange = (text) => {
    setLabelText(text);
    if (onPropertyChange) {
      onPropertyChange('label', text);
    }
  };

  const handleHyperlinkToggle = () => {
    const newEnabled = !isHyperlinkEnabled;
    setIsHyperlinkEnabled(newEnabled);
    if (!newEnabled) {
      // Clear hyperlink data when disabling
      setHyperlinkUrl('');
      setHyperlinkText('');
      applyHyperlinkData(null);
    }
  };

  const handleHyperlinkUrlChange = (url) => {
    setHyperlinkUrl(url);
    applyHyperlinkData({ url, text: hyperlinkText });
  };

  const handleHyperlinkTextChange = (text) => {
    setHyperlinkText(text);
    applyHyperlinkData({ url: hyperlinkUrl, text });
  };

  const applyHyperlinkData = (hyperlinkData) => {
    if (onPropertyChange) {
      onPropertyChange('hyperlink', hyperlinkData);
    }
  };

  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#FFC0CB'
  ];

  return (
    <div style={{ display: 'flex', height: '100%', flexDirection: 'column', padding: '16px' ,overflow:"auto"}}>
            {/* Text Input */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Label Text:</label>
        <textarea
          value={labelText}
          onChange={(e) => handleLabelChange(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            minHeight: '60px',
            resize: 'vertical'
          }}
          placeholder="Enter label text..."
        />
      </div>

      {/* Font Size */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Font Size:</label>
        <select
          value={fontSize}
          onChange={(e) => handleFontSizeChange(Number(e.target.value))}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        >
          {fontSizes.map(size => (
            <option key={size} value={size}>{size}px</option>
          ))}
        </select>
      </div>

      {/* Font Color */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Font Color:</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {colors.map(color => (
            <button
              key={color}
              onClick={() => handleFontColorChange(color)}
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: color,
                border: color === fontColor ? '2px solid #333' : '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              title={color}
            />
          ))}
          <input
            type="color"
            value={fontColor}
            onChange={(e) => handleFontColorChange(e.target.value)}
            style={{
              width: '24px',
              height: '24px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          />
        </div>
      </div>

      {/* Text Formatting Buttons */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Text Formatting:</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={handleBoldToggle}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: fontWeight === 'bold' ? '#007bff' : '#fff',
              color: fontWeight === 'bold' ? '#fff' : '#333',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            title="Bold"
          >
            B
          </button>
          <button
            onClick={handleItalicToggle}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: fontStyle === 'italic' ? '#007bff' : '#fff',
              color: fontStyle === 'italic' ? '#fff' : '#333',
              cursor: 'pointer',
              fontStyle: 'italic'
            }}
            title="Italic"
          >
            I
          </button>
          <button
            onClick={handleUnderlineToggle}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: textDecoration === 'underline' ? '#007bff' : '#fff',
              color: textDecoration === 'underline' ? '#fff' : '#333',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
            title="Underline"
          >
            U
          </button>
        </div>
      </div>

      {/* Text Alignment */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Text Alignment:</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['left', 'center', 'right', 'justify'].map(align => (
            <button
              key={align}
              onClick={() => handleTextAlignChange(align)}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: textAlign === align ? '#007bff' : '#fff',
                color: textAlign === align ? '#fff' : '#333',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
              title={`Align ${align}`}
            >
              {align}
            </button>
          ))}
        </div>
      </div>

      {/* Hyperlink Section */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <label style={{ fontWeight: 'bold', marginRight: '8px' }}>Hyperlink:</label>
          <input
            type="checkbox"
            checked={isHyperlinkEnabled}
            onChange={handleHyperlinkToggle}
            style={{ marginRight: '8px' }}
          />
          <span style={{ fontSize: '12px', color: '#666' }}>Enable hyperlink</span>
        </div>
        
        {isHyperlinkEnabled && (
          <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold' }}>URL:</label>
              <input
                type="url"
                value={hyperlinkUrl}
                onChange={(e) => handleHyperlinkUrlChange(e.target.value)}
                placeholder="https://example.com"
                style={{
                  width: '100%',
                  padding: '6px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold' }}>Display Text (optional):</label>
              <input
                type="text"
                value={hyperlinkText}
                onChange={(e) => handleHyperlinkTextChange(e.target.value)}
                placeholder="Click here to visit..."
                style={{
                  width: '100%',
                  padding: '6px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              />
            </div>
            
            <div style={{ fontSize: '11px', color: '#666', fontStyle: 'italic' }}>
              {hyperlinkText ? `Will display: "${hyperlinkText}"` : `Will display: "${labelText}"`}
            </div>
          </div>
        )}
      </div>

      {/* Preview */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Preview:</label>
        <div
          style={{
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: '#f9f9f9',
            minHeight: '60px',
            fontSize: `${fontSize}px`,
            color: fontColor,
            fontWeight: fontWeight,
            fontStyle: fontStyle,
            textDecoration: textDecoration,
            textAlign: textAlign
          }}
        >
          {isHyperlinkEnabled && hyperlinkUrl ? (
            <span style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}>
              {hyperlinkText || labelText || 'Preview text will appear here...'}
            </span>
          ) : (
            labelText || 'Preview text will appear here...'
          )}
        </div>
      </div>

      {/* Apply Button */}
      <div style={{ marginTop: 'auto' }}>
                 <button
           onClick={() => {
             // Apply all current styles at once
             applyTextStyle('all', {
               fontSize,
               fontColor,
               fontWeight,
               fontStyle,
               textDecoration,
               textAlign
             });
             onClose();
           }}
          style={{
            width: '100%',
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
          Apply Formatting
        </button>
      </div>
    </div>
  );
};

export default ModifyLabel;