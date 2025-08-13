import React, { useState, useEffect } from 'react';

const NodeProperties = ({ nodeProperties, onPropertyChange, onClose }) => {
  const [hyperlinkUrl, setHyperlinkUrl] = useState('');
  const [hyperlinkText, setHyperlinkText] = useState('');
  const [isHyperlinkEnabled, setIsHyperlinkEnabled] = useState(false);

  useEffect(() => {
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

  const handleHyperlinkToggle = () => {
    const newEnabled = !isHyperlinkEnabled;
    setIsHyperlinkEnabled(newEnabled);
    if (!newEnabled) {
      // Clear hyperlink data when disabling
      setHyperlinkUrl('');
      setHyperlinkText('');
      onPropertyChange('hyperlink', null);
    }
  };

  const handleHyperlinkUrlChange = (url) => {
    setHyperlinkUrl(url);
    onPropertyChange('hyperlink', { url, text: hyperlinkText });
  };

  const handleHyperlinkTextChange = (text) => {
    setHyperlinkText(text);
    onPropertyChange('hyperlink', { url: hyperlinkUrl, text });
  };

  const handleNavigateToLink = () => {
    if (hyperlinkUrl) {
      window.open(hyperlinkUrl, '_blank');
    }
  };

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
        <h3 style={{ margin: 0, fontSize: '16px' }}>Node Properties</h3>
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
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Label:</label>
          <input 
            type="text" 
            value={nodeProperties.label || ''} 
            onChange={(e) => onPropertyChange('label', e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Description:</label>
          <textarea 
            value={nodeProperties.description || ''} 
            onChange={(e) => onPropertyChange('description', e.target.value)}
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
              
              <div style={{ fontSize: '11px', color: '#666', fontStyle: 'italic', marginBottom: '8px' }}>
                {hyperlinkText ? `Will display: "${hyperlinkText}"` : `Will display: "${nodeProperties.label || 'Node'}"`}
              </div>

              {/* Navigation Button */}
              {hyperlinkUrl && (
                <button
                  onClick={handleNavigateToLink}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <span>🌐</span>
                  Navigate to Link
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NodeProperties; 