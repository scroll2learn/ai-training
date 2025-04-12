import React, { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import axios from "axios";
import "./Notebookcell.css";

const NotebookCell = ({ value, setValue, language, setLanguage }) => {
  const [output, setOutput] = useState("No output");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOutput("No output");
  }, [language]);

  const runCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/execute", {
        code: value,
        language: language,
      });

      if (response?.data?.output !== undefined) {
        setOutput(response.data.output || "No output");
      } else {
        setOutput("Error: Unexpected response structure from backend.");
      }
    } catch (err) {
      console.error("Error executing code:", err.message);
      setOutput("Error: Network issue or server is not responding.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notebook-cell">
      <div className="notebook-header">
        <span className="notebook-language-label">
          {language.charAt(0).toUpperCase() + language.slice(1)}
        </span>
        <div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="notebook-select"
          >
            <option value="python">Python</option>
            <option value="sql">SQL</option>
          </select>
          <button className="notebook-run-button" onClick={runCode}>
            ▶
          </button>
        </div>
      </div>

      <MonacoEditor
        height={language === "sql" ? "100px" : "40px"}
        language={language}
        theme="vs-light"
        value={value}
        onChange={setValue}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          overviewRulerBorder: false,
          placeholder:
            language === "python"
              ? "Enter your Python code here..."
              : "Enter your SQL query here...",
          scrollbar: {
            horizontal: "hidden",
            vertical: "hidden",
            handleMouseWheel: false,
            useShadows: false,
            horizontalScrollbarSize: 0,
            verticalScrollbarSize: 0,
          },
        }}
      />

      <pre className="notebook-output">
        {loading
          ? "Running..."
          : typeof output === "string"
          ? output
          : JSON.stringify(output, null, 2)}
      </pre>
    </div>
  );
};

export default NotebookCell;
