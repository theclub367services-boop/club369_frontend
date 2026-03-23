import React, { useState, useEffect } from "react";
import { AdminService } from "../../services/AdminService";
import { motion, AnimatePresence } from "framer-motion";
import { getFullUrl } from "../../utils/url";

export const RedemptionReportAdmin: React.FC = () => {
  const [ventures, setVentures] = useState<any[]>([]);
  const [selectedVenture, setSelectedVenture] = useState<any | null>(null);

  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [totals, setTotals] = useState<any>({});
  
  const [scope, setScope] = useState("current_month");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [branchId, setBranchId] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedVenture) {
      fetchVentures();
    }
  }, [selectedVenture]);

  useEffect(() => {
    if (selectedVenture) {
      fetchRedemptions();
    }
  }, [scope, fromDate, toDate, branchId, selectedVenture]);

  const fetchVentures = async () => {
    setIsLoading(true);
    try {
      const data = await AdminService.getAdminVentures();
      setVentures(data);
      setError(null);
    } catch (e: any) {
      setError(e.message || e.errors?.error || "Failed to fetch ventures");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRedemptions = async () => {
    if (!selectedVenture) return;
    setIsLoading(true);
    try {
      const vId = selectedVenture.id;
      const data = await AdminService.getAdminRedemptions(
          scope, 
          scope === 'custom' ? fromDate : undefined, 
          scope === 'custom' ? toDate : undefined,
          branchId,
          vId
      );
      if (data.results) {
        setRedemptions(data.results);
        setTotals(data.totals);
      } else {
        setRedemptions(data);
        setTotals({});
      }
      setError(null);
    } catch (e: any) {
      setError(e.message || e.errors?.error || "Failed to fetch redemptions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
      if (!selectedVenture) return;
      let url = `/api/admin/vouchers/redemptions/?export=excel&scope=${scope}&venture_id=${selectedVenture.id}`;
      if (scope === 'custom' && fromDate) url += `&from_date=${fromDate}`;
      if (scope === 'custom' && toDate) url += `&to_date=${toDate}`;
      if (branchId) url += `&branch_id=${branchId}`;
      
      // Fix: Use credentials: 'include' to send HttpOnly cookies for authentication
      const isDev = import.meta.env.DEV;
      const baseUrl = import.meta.env.VITE_API_BASE_URL || (isDev ? 'http://localhost:8000' : 'https://api.theclub369.com');
      fetch(`${baseUrl}${url}`, {
          credentials: 'include',
          headers: {
              'Accept': 'application/json, text/plain, */*'
          }
      })
      .then(response => response.blob())
      .then(blob => {
          const dlUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = dlUrl;
          a.download = `redemptions_${selectedVenture.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(dlUrl);
      })
      .catch(console.error);
  };

  if (!selectedVenture) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="bg-[#161118] border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">assessment</span>
              Venture Reports
            </h3>
          </div>
          {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-xs font-bold">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ventures.map((v) => (
              <div 
                key={v.id} 
                onClick={() => {
                  setSelectedVenture(v);
                  setBranchId("");
                  setScope("current_month");
                }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer hover:border-primary/50 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  {v.icon ? (
                    <img src={getFullUrl(v.icon)} alt={v.name} className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center">
                      <span className="material-symbols-outlined text-gray-500">storefront</span>
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-white text-sm">{v.name}</div>
                    <div className="text-[10px] text-primary">{v.type === 'OWN' ? 'Club369' : 'Partner'}</div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{v.branch_count} Branches</span>
                  <span className="text-emerald-500 font-bold">{Math.round(parseFloat(v.discount_percentage))}% OFF</span>
                </div>
              </div>
            ))}
            {ventures.length === 0 && !isLoading && (
              <div className="col-span-full py-12 text-center text-gray-500">No ventures found.</div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="bg-[#161118] border border-white/10 rounded-2xl flex flex-col h-[calc(100vh-120px)] relative overflow-hidden">
        
        {/* Header and Filters (Sticky Top) */}
        <div className="p-6 border-b border-white/10 shrink-0 bg-[#161118] z-10">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedVenture(null)} 
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {selectedVenture.name} <span className="text-gray-500 font-normal">Reports</span>
              </h3>
            </div>

            {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-xs font-bold">{error}</div>}
            
            <button onClick={handleExport} className="px-4 py-2 bg-emerald-600/10 text-emerald-500 border border-emerald-600/20 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-emerald-600 hover:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">download</span>
              Download Excel
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select value={scope} onChange={(e) => setScope(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-6 py-2 text-xs text-gray-400 outline-none focus:border-primary/50 cursor-pointer">
              <option value="current_month">Current Month</option>
              <option value="all">All Data</option>
              <option value="custom">Custom Date Range</option>
            </select>
            
            {scope === 'custom' && (
              <>
                <span className="text-gray-400 text-xs">From : <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-400 [color-scheme:dark]" /></span>
                <span className="text-gray-400 text-xs">To : <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-400 [color-scheme:dark]" /></span>
              </>
            )}

            <select value={branchId} onChange={(e) => setBranchId(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-400 outline-none focus:border-primary/50 cursor-pointer min-w-[150px]">
              <option value="">All Branches</option>
              {selectedVenture.branches?.map((b: any) => (
                <option key={b.id} value={b.id}>{b.branch_name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Scrollable Table Area */}
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-[10px] uppercase font-bold text-gray-500 sticky top-0 bg-[#0a0a0a]">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">S.No</th>
                <th className="px-6 py-4 whitespace-nowrap">User Name</th>
                <th className="px-6 py-4 whitespace-nowrap">Branch Name</th>
                <th className="px-6 py-4 whitespace-nowrap">Actual Bill Amount</th>
                <th className="px-6 py-4 whitespace-nowrap text-emerald-500">Discount Amount</th>
                <th className="px-6 py-4 whitespace-nowrap text-white">Final Paid Amount</th>
                <th className="px-6 py-4 whitespace-nowrap">Redeemed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {redemptions.map((r, i) => (
                <tr key={i} className="hover:bg-white/[0.025]">
                  <td className="px-6 py-4">{i + 1}</td>
                  <td className="px-6 py-4 font-bold text-white whitespace-nowrap">{r.user_name || r.user?.full_name || r.user?.email || 'User'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{r.branch_name || r.branch?.branch_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">₹ {parseFloat(r.actual_bill_amount).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-emerald-500 font-bold">-₹ {parseFloat(r.discount_amount).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-primary font-black">₹ {parseFloat(r.final_paid_amount).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{r.redeemed_date || r.redeemed_at}</td>
                </tr>
              ))}
              {redemptions.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">No redemptions found in this timeframe.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Sticky Footer Totals */}
        <div className="p-6 border-t border-white/10 shrink-0 bg-[#0a0a0a] z-10">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-xl">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Bill</div>
                  <div className="text-xl font-bold text-white font-mono">₹ {totals.total_bill?.toLocaleString() || '0'}</div>
              </div>
              <div className="flex justify-between items-center bg-primary/5 border border-primary/20 p-4 rounded-xl">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Discount</div>
                  <div className="text-xl font-bold text-emerald-500 font-mono">₹ {totals.total_discount?.toLocaleString() || '0'}</div>
              </div>
              <div className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-xl">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Collected</div>
                  <div className="text-xl font-bold text-primary font-mono">₹ {totals.total_collected?.toLocaleString() || '0'}</div>
              </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
