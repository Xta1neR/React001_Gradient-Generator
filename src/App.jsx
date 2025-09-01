import React, { useEffect, useState, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Helper function to generate a random hex color code.
const getHexColorCode = () => {
  return `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0")}`;
};

// Helper function to create a single gradient object based on type and provided colors.
const createGradient = (type, colors) => {
  let color1, color2;
  const degree = Math.floor(Math.random() * 360);

  // If a palette is provided, use colors from it.
  if (colors && colors.length >= 2) {
    const randomIdx1 = Math.floor(Math.random() * colors.length);
    let randomIdx2 = Math.floor(Math.random() * colors.length);
    // Ensure the two colors are different
    while (randomIdx1 === randomIdx2) {
      randomIdx2 = Math.floor(Math.random() * colors.length);
    }
    color1 = colors[randomIdx1];
    color2 = colors[randomIdx2];
  } else {
    // Fallback to random colors if the palette is not available or has too few colors.
    color1 = getHexColorCode();
    color2 = getHexColorCode();
  }

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
};

const App = () => {
  const [settings, setSettings] = useState({
    num: 12,
    type: "linear",
  });
  const [gradients, setGradients] = useState([]);
  const [palette, setPalette] = useState(["#3498db", "#e74c3c", "#f1c40f"]); // Example initial palette

  // Generate a set of gradients based on the current settings and palette.
  const generateGradients = useCallback(() => {
    const numberOfGradients = Math.min(Math.max(1, settings.num), 100); 
    const newGradients = Array.from({ length: numberOfGradients }, () =>
      createGradient(settings.type, palette)
    );
    setGradients(newGradients);
  }, [settings, palette]);

  // Handle setting changes with validation.
  const handleNumChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setSettings((prev) => ({ ...prev, num: isNaN(value) ? 1 : Math.max(1, value) }));
  };

  const handleTypeChange = (e) => {
    setSettings((prev) => ({ ...prev, type: e.target.value }));
  };

  // Handle palette input changes
  const handlePaletteChange = (index, value) => {
    const newPalette = [...palette];
    newPalette[index] = value;
    setPalette(newPalette);
  };

  const addPaletteColor = () => {
    if (palette.length < 5) { // Limit palette size to prevent clutter
      setPalette([...palette, getHexColorCode()]);
    } else {
      toast.warn("Palette limited to 5 colors for better harmony!", { position: "top-center" });
    }
  };

  const removePaletteColor = (index) => {
    const newPalette = palette.filter((_, i) => i !== index);
    setPalette(newPalette);
  };

  // Copy CSS to clipboard.
  const onCopy = useCallback((css) => {
    navigator.clipboard.writeText(css);
    toast.success("CSS Copied to Clipboard! 🎉", {
      position: "top-center",
      autoClose: 1500,
    });
  }, []);

  // Effect to regenerate gradients whenever settings or palette changes.
  useEffect(() => {
    generateGradients();
  }, [generateGradients]);

  return (
    <div className="min-h-screen py-20 bg-gray-50">
      <div className="w-9/12 mx-auto space-y-8">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-4xl font-bold">🎨 Gradient Generator</h1>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={settings.num}
              min="1"
              className="border border-slate-300 bg-white rounded-lg w-[100px] p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="12"
              onChange={handleNumChange}
            />
            <select
              value={settings.type}
              className="border border-slate-300 bg-white rounded-lg w-[100px] p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleTypeChange}
            >
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
            </select>
          </div>
        </div>
        
        {/* New Color Palette Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Color Palette</h2>
            <button 
              onClick={addPaletteColor}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              + Add Color
            </button>
          </div>
          <div className="flex flex-wrap gap-4">
            {palette.map((color, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  className="w-8 h-8 rounded-full cursor-pointer"
                  onChange={(e) => handlePaletteChange(index, e.target.value)}
                />
                <input
                  type="text"
                  value={color}
                  className="border border-slate-300 rounded-lg p-1 text-sm w-24"
                  onChange={(e) => handlePaletteChange(index, e.target.value)}
                />
                <button
                  onClick={() => removePaletteColor(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-12 p-2">
        {gradients.map((item, index) => (
          <div
            key={index}
            className="h-[180px] rounded-xl relative shadow-md transition-all duration-300 hover:scale-105"
            style={{ background: item.gradient }}
          >
            <button
              className="bg-black/50 text-white rounded absolute bottom-3 right-3 px-2 py-1 text-xs hover:bg-black/70 transition-colors"
              onClick={() => onCopy(item.css)}
              aria-label={`Copy CSS for gradient ${index + 1}`}
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