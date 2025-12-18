import React, { useState, useEffect, useMemo } from "react";
import { DollarSign, Activity, Calendar, Download, Edit2 } from "lucide-react";

// utils
import { formatMoney } from "./utils";

// components
import Navbar from "./components/Navbar";
import StatCard from "./components/StatCard";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseItem from "./components/ExpenseItem";
import BillSplitter from "./components/BillSplitter";
import ChartSection from "./components/ChartSection";
import FilterControls from "./components/FilterControls";

// auth
import { useAuth } from "./contexts/authContext";
import Login from "./components/Login";

export default function App() {
  /* ================= AUTH GUARD ================= */
  const { currentUser } = useAuth();

  /* ================= STATE ================= */
  const [view, setView] = useState("tracker");
  
  // FIXED: Improved budget initialization to prevent 0 or NaN
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem("budget");
    const parsed = Number(saved);
    return (parsed && parsed > 0) ? parsed : 10000; 
  });

  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("date_desc");

  const [people, setPeople] = useState(() => {
    const saved = localStorage.getItem("masterPeopleList");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, name: "Dhruv Saini" },
          { id: 2, name: "Harsh" },
          { id: 3, name: "Kshitij" },
        ];
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  /* ================= EFFECTS ================= */
  useEffect(() => {
    localStorage.setItem("budget", budget);
  }, [budget]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("masterPeopleList", JSON.stringify(people));
  }, [expenses, people]);

  /* ================= ACTIONS ================= */
  const addExpense = (expense) => {
    setExpenses([{ ...expense, id: Date.now() }, ...expenses]);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const editExpense = (id, updatedData) => {
    setExpenses(expenses.map((e) => (e.id === id ? updatedData : e)));
  };

  const handleUpdateBudget = () => {
    const newBudget = prompt("Enter your new budget limit (₹):", budget);
    if (newBudget !== null && !isNaN(newBudget) && Number(newBudget) > 0) {
      setBudget(Number(newBudget));
    }
  };

  /* ================= FILTER + SORT ================= */
  const filteredAndSortedExpenses = useMemo(() => {
    let result = [...expenses];

    if (filter !== "All") {
      result = result.filter((e) => e.category === filter);
    }

    result.sort((a, b) => {
      if (sort === "date_desc") return new Date(b.date) - new Date(a.date);
      if (sort === "date_asc") return new Date(a.date) - new Date(b.date);
      if (sort === "amount_desc") return b.amount - a.amount;
      if (sort === "amount_asc") return a.amount - b.amount;
      return 0;
    });

    return result;
  }, [expenses, filter, sort]);

  /* ================= CSV EXPORT ================= */
  const exportCSV = () => {
    const headers = ["ID,Title,Amount,Category,Date,PaidBy,Participants"];
    const rows = expenses.map(
      (e) =>
        `${e.id},"${e.title}",${e.amount},${e.category},${e.date},${e.paidBy || ""},"${
          e.participants ? e.participants.join("|") : ""
        }"`
    );

    const csv = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "expenses.csv";
    link.click();
  };

  /* ================= CALCULATIONS ================= */
  const totalSpending = expenses.reduce((acc, e) => acc + e.amount, 0);
  const highestExpense = expenses.length > 0 ? Math.max(...expenses.map((e) => e.amount)) : 0;
  
  // FIXED: Safeguard against NaN and division by zero
  const budgetProgress = budget > 0 ? Math.min((totalSpending / budget) * 100, 100) : 0;
  const remainingBudget = budget - totalSpending;

  if (!currentUser) {
    return <Login />;
  }

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      <Navbar view={view} setView={setView} />

      <div className="max-w-6xl mx-auto px-6">
        {view === "tracker" ? (
          <>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-slate-500">Track your expenses (₹)</p>
              </div>
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow hover:bg-slate-50 transition-colors"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>

            {/* BUDGET BAR (USER SPECIFIED) */}
            <div className="bg-slate-900 p-6 rounded-2xl text-white mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <p className="text-slate-400">Remaining Budget</p>
                  <button 
                    onClick={handleUpdateBudget}
                    className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg border border-slate-700 transition-all"
                  >
                    <Edit2 className="w-3 h-3" /> Set Goal
                  </button>
                </div>
                <p className="font-medium">{Math.round(budgetProgress)}% used</p>
              </div>
              
              <h2 className="text-4xl font-bold">
                {formatMoney(remainingBudget)}
              </h2>
              
              <div className="w-full bg-slate-800 h-3 rounded-full mt-4 overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ease-out ${
                    budgetProgress > 85 ? 'bg-rose-500' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${budgetProgress}%` }}
                />
              </div>
              
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>Spent: {formatMoney(totalSpending)}</span>
                <span>Limit: {formatMoney(budget)}</span>
              </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Total Spent"
                value={formatMoney(totalSpending)}
                icon={DollarSign}
                colorClass="bg-indigo-500"
              />
              <StatCard
                title="Highest Expense"
                value={formatMoney(highestExpense)}
                icon={Activity}
                colorClass="bg-rose-500"
              />
              <StatCard
                title="Transactions"
                value={expenses.length}
                icon={Calendar}
                colorClass="bg-emerald-500"
              />
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-6">
                <ExpenseForm
                  onAdd={addExpense}
                  people={people}
                  setPeople={setPeople}
                />
                <ChartSection expenses={expenses} />
              </div>

              <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <FilterControls
                  filter={filter}
                  setFilter={setFilter}
                  sort={sort}
                  setSort={setSort}
                />

                <div className="mt-4 space-y-3">
                  {filteredAndSortedExpenses.length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-slate-400 italic">No expenses found</p>
                    </div>
                  )}

                  {filteredAndSortedExpenses.map((expense) => (
                    <ExpenseItem
                      key={expense.id}
                      expense={expense}
                      onDelete={deleteExpense}
                      onEdit={editExpense}
                      people={people}
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <BillSplitter expenses={expenses} people={people} />
        )}
      </div>
    </div>
  );
}