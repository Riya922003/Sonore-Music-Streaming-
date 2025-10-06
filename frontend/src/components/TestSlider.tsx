import React, { useState, useRef } from 'react';

const TestSlider: React.FC = () => {
  const [value, setValue] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    console.log('CLICK DETECTED!', e.clientX);
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, relativeX / rect.width));
    const newValue = percentage * 100;
    
    console.log('Setting value to:', newValue);
    setValue(newValue);

    const handleMouseMove = (moveE: MouseEvent) => {
      if (!sliderRef.current) return;
      
      const rect = sliderRef.current.getBoundingClientRect();
      const relativeX = moveE.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, relativeX / rect.width));
      const newValue = percentage * 100;
      
      console.log('Dragging, new value:', newValue);
      setValue(newValue);
    };

    const handleMouseUp = () => {
      console.log('Mouse up');
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '20px', 
      right: '20px', 
      zIndex: 9999, 
      background: 'red', 
      padding: '20px',
      borderRadius: '8px'
    }}>
      <div style={{ color: 'white', marginBottom: '10px' }}>
        Test Slider: {Math.round(value)} {isDragging ? '(dragging)' : ''}
      </div>
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        style={{
          width: '200px',
          height: '30px',
          background: '#333',
          borderRadius: '15px',
          position: 'relative',
          cursor: 'pointer',
          border: '2px solid white'
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: '100%',
            background: 'lime',
            borderRadius: '15px',
            transition: isDragging ? 'none' : 'width 0.1s'
          }}
        />
      </div>
    </div>
  );
};

export default TestSlider;