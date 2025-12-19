import React from 'react';
import { PieChart } from 'lucide-react';
import { formatMoney } from '../utils'; // Import confirmed

// Helper: parse a possibly-string amount into a number (strip non-numeric chars)
const parseAmount = (raw) => {
  if (raw == null) return 0;
  if (typeof raw === 'number') return raw;
  const cleaned = String(raw).replace(/[^0-9.-]+/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
};

// Helper function to prepare data for the chart
const getChartData = (expenses) => {
  if (!expenses || expenses.length === 0) return [];

  // Aggregate totals by category (robust parsing)
  const dataMap = expenses.reduce((acc, curr) => {
    const category = curr.category || 'Other';
    const amt = parseAmount(curr.amount);
    if (amt <= 0) return acc; // ignore zero/invalid amounts
    acc[category] = (acc[category] || 0) + amt;
    return acc;
  }, {});

  return Object.keys(dataMap)
    .map(label => ({ label, value: dataMap[label] }))
    .filter(entry => entry.value > 0)
    .sort((a, b) => b.value - a.value);
};

// Custom Simple Bar Chart Component
const SimpleBarChart = ({ data }) => {
  if (data.length === 0) return <div className="text-center text-slate-400 py-10">No spending recorded for charts.</div>;

  const maxValue = Math.max(...data.map(d => d.value), 0);

  return (
    <div className="flex items-end justify-between h-56 pt-6 pb-2 space-x-3 w-full">
      {data.slice(0, 6).map((item, index) => ( // Show top 6 categories
        <div key={index} className="flex flex-col items-center flex-1 group h-full">
          <div className="relative w-full flex justify-center items-end h-full">
            {/* Persistent value label (helps debug invisible bars) */}
            <div className="absolute bottom-full mb-2 bg-slate-800 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap shadow-md">
              {formatMoney(item.value)}
            </div>
            {/* The Bar */}
            <div 
              className={`w-10 rounded-t-lg transition-all duration-700 ease-out hover:shadow-lg hover:brightness-110 
                ${index % 3 === 0 ? 'bg-indigo-500' : index % 3 === 1 ? 'bg-purple-500' : 'bg-pink-500'}`}
              style={{ height: `${maxValue ? (item.value / maxValue) * 100 : 0}%`, minHeight: '8px' }}
            />
          </div>
          <span className="text-xs text-slate-500 mt-2 font-medium truncate max-w-20 text-center">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};


const ChartSection = ({ expenses }) => {
  const chartData = getChartData(expenses);
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
        <PieChart className="w-6 h-6 text-indigo-500" /> Spending Breakdown
      </h2>
      <SimpleBarChart data={chartData} />
    </div>
  );
};

export default ChartSection;