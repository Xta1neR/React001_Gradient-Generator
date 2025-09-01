import React, { useEffect, useState, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [num, setNum] = useState(12);
  const [type, setType] = useState("linear");
  const [gradients, setGradients] = useState([]);

  // Generate random hex color
  const getHexColorCode = () => {
    return `#${Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")}`;
  };

  // Generate gradient set
  const generateGradient = useCallback(() => {
    const colors = Array.from({ length: num }, () => {
      const color1 = getHexColorCode();
      const color2 = getHexColorCode();
      const degree = Math.floor(Math.random() * 360);

      if (type === "linear") {
        return {
          gradient: `linear-gradient(${degree}deg, ${color1}, ${color2})`,
          css: `background: linear-gradient(${degree}deg, ${color1}, ${color2});`,
        };
      } else {
        return {
          gradient: `radial-gradient(circle, ${color1}, ${color2})`,
          css: `background: radial-gradient(circle, ${color1}, ${color2});`,
        };
      }
    });

    setGradients(colors);
  }, [num, type]);

  // Copy CSS to clipboard
  const onCopy = useCallback((css) => {
    navigator.clipboard.writeText(css);
    toast.success("CSS Copied to Clipboard!", {
      position: "top-center",
      autoClose: 1500,
    });
  }, []);

  useEffect(() => {
    generateGradient();
  }, [generateGradient]);

  return (
    <div className="min-h-screen py-20 bg-gray-50">
      <div className="w-9/12 mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">🎨 Gradient Generator</h1>
          <div className="flex gap-4">
            <input
              type="number"
              value={num}
              min="1"
              className="border border-slate-300 bg-white rounded-lg w-[100px] p-2"
              placeholder="12"
              onChange={(e) => setNum(Number(e.target.value) || 1)}
            />
            <select
              value={type}
              className="border border-slate-300 bg-white rounded-lg w-[100px] p-2"
              onChange={(e) => setType(e.target.value)}
            >
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-12 p-2">
        {gradients.map((item, index) => (
          <div
            key={index}
            className="h-[180px] rounded-xl relative shadow-md transition hover:scale-105"
            style={{ background: item.gradient }}
          >
            <button
              className="bg-black/50 text-white rounded absolute bottom-3 right-3 px-2 py-1 text-xs hover:bg-black"
              onClick={() => onCopy(item.css)}
            >
              COPY
            </button>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;
