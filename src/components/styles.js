export const printStyles = `
  @media print {
    body * {
      visibility: hidden;
    }
    
    .print-area,
    .print-area * {
      visibility: visible;
    }
    
    .print-area {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
    
    .no-print {
      display: none !important;
    }
    
    @page {
      size: landscape;
      margin: 0.5in;
    }
    
    table {
      font-size: 10px !important;
      width: 100% !important;
    }
    
    th, td {
      padding: 4px !important;
      font-size: 9px !important;
      border: 1px solid #ccc !important;
    }

    td > div:not([draggable]) {
      display: none !important;
    }
    
    .activity-block {
      font-size: 8px !important;
      padding: 2px !important;
    }
    
    h1 {
      font-size: 18px !important;
      margin-bottom: 10px !important;
      text-align: center;
    }
  }

  input[type="color"] {
  -webkit-appearance: none;
  border: 2px solid #e5e7eb;
  border-radius: 4px;
  padding: 0;
}
input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}
input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 2px;
}

.color-option {
  transition: transform 0.2s, border-color 0.2s;
}

.color-option:hover {
  transform: scale(1.1);
  border-color: #000 !important;
}

.color-input-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.color-value {
  font-family: monospace;
  background-color: #f3f4f6;
  padding: 4px 8px;
  border-radius: 4px;
}

.context-menu-item {
  transition: background-color 0.2s;
}

.context-menu-item:hover {
  background-color: #f3f4f6;
}
`;
