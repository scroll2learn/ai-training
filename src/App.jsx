import React, { useState } from 'react';
import NotebookCell from './components/Notebookcell';
import Sidebar from './components/Sidebar';
import AiPanel from './components/AiPanel';
import './App.css';

function App() {
  const [cells, setCells] = useState([
    { id: 1, value: '', language: 'python' }
  ]);

  const addCell = () => {
    const newId = cells.length + 1;
    setCells([...cells, { id: newId, value: '', language: 'python' }]);
  };

  const updateCellValue = (id, newValue) => {
    setCells(cells.map(cell => cell.id === id ? { ...cell, value: newValue } : cell));
  };

  const updateCellLanguage = (id, newLang) => {
    setCells(cells.map(cell => cell.id === id ? { ...cell, language: newLang } : cell));
  };

  return (
    <div className="app-layout">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Notebook Center */}
      <div className="notebook-panel">
      <header className="app-header">
      <h2 className="text-3xl font-bold">BigHammer-Notebook</h2>
</header>


        {cells.map((cell) => (
          <NotebookCell
            key={cell.id}
            cellId={cell.id}
            value={cell.value}
            setValue={(val) => updateCellValue(cell.id, val)}
            language={cell.language}
            setLanguage={(lang) => updateCellLanguage(cell.id, lang)}
          />
        ))}

        <div className="add-cell-wrapper">
          <button className="add-cell-btn" onClick={addCell}>➕ Add Cell</button>
        </div>
      </div>

      {/* Right AI Panel */}
      <AiPanel />
    </div>
  );
}

export default App;
