import React, { useState } from 'react';
import { BlockPicker, ColorResult } from 'react-color';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const predefinedColors = [
  "#FF6633",
  "#FFB399",
  "#FF33FF",
  "#FFFF99",
  "#00B3E6",
  "#E6B333",
  "#3366E6",
  "#999966",
  "#99FF99",
  "#B34D4D",
];

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (colorResult: ColorResult) => {
    onChange(colorResult.hex);
  };

  // ✨ Estilos en línea modernos
  const styles = {
    color: {
      width: '36px',
      height: '24px',
      background: color,
      borderRadius: '12px',
      cursor: 'pointer',
    },
    swatch: {
      padding: '10px 10px',
      background: 'hsl(var(--heroui-default-100))',
      borderRadius: '12px',
      boxShadow: '0 0 5px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      cursor: 'pointer',
    },
    popover: {
      position: 'fixed' as 'fixed',
      zIndex: 1000,
    },
    cover: {
      position: 'fixed' as 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    },
  };

  return (
    <div>
      <div style={styles.swatch} onClick={handleClick}>
        Elija un color:
        <div style={styles.color} />
      </div>
      {displayColorPicker && (
        <div style={styles.popover}>
          <div style={styles.cover} onClick={handleClose} />
          <BlockPicker
            color={color}
            styles={{ default: {
              card: {
                background: 'hsl(var(--heroui-background-100))', // Fondo negro
              },
              body: {
                background: 'hsl(var(--heroui-background-100))', // Fondo negro para el cuerpo
              },
              input: {
                background: 'hsl(var(--heroui-default-100))', // Fondo gris oscuro para el input
                color: 'hsl(var(--heroui-default-800))', // Texto blanco para el input
              },
            },}}
            colors={predefinedColors}
            onChangeComplete={handleChange}
          />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
