import React, { useState, useEffect } from "react";
import { AdminService } from "../../services/AdminService";
import { motion, AnimatePresence } from "framer-motion";
import { getFullUrl } from "../../utils/url";

export const VentureAdmin: React.FC = () => {
  const [ventures, setVentures] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ name: "", type: "OWN", discount_percentage: "" });
  const [branches, setBranches] = useState<{id: string, branch_name: string}[]>([{id: Date.now().toString(), branch_name: ""}]);
  
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVentures();
  }, [search]);

  const fetchVentures = async () => {
    try {
      const data = await AdminService.getAdminVentures(search);
      setVentures(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await AdminService.toggleAdminVentureStatus(id);
      fetchVentures();
    } catch (e) {
      console.error("Toggle error", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this venture?")) return;
    try {
      await AdminService.deleteAdminVenture(id);
      fetchVentures();
    } catch (e) {
      console.error("Delete error", e);
    }
  };

  const handleEdit = (venture: any) => {
    setEditingId(venture.id);
    setFormData({
      name: venture.name,
      type: venture.type,
      discount_percentage: venture.discount_percentage.toString()
    });
    
    if (venture.branches && venture.branches.length > 0) {
      setBranches(venture.branches.map((b: any) => ({id: b.id.toString(), branch_name: b.branch_name})));
    } else {
      setBranches([]);
    }
    
    setIconFile(null);
    setError(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", type: "OWN", discount_percentage: "" });
    setBranches([{id: Date.now().toString(), branch_name: ""}]);
    setIconFile(null);
    setError(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.discount_percentage) {
      setError("Please fill required fields (Name, Discount)");
      return;
    }

    try {
      setError(null);
      
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("type", formData.type);
      payload.append("discount_percentage", formData.discount_percentage);
      
      const branchesArr = branches.map(b => b.branch_name.trim()).filter(Boolean);
      payload.append("branches", JSON.stringify(branchesArr));
      
      if (iconFile) {
        payload.append("icon", iconFile);
      }

      if (editingId) {
        await AdminService.updateAdminVenture(editingId, payload);
      } else {
        await AdminService.createAdminVenture(payload);
      }
      
      resetForm();
      fetchVentures();
    } catch (e: any) {
      setError(e.message || e.errors?.error || e.error || "Failed to save venture");
    }
  };

  const addBranchField = () => {
    setBranches([...branches, {id: Date.now().toString(), branch_name: ""}]);
  };
  
  const updateBranchField = (id: string, value: string) => {
    setBranches(branches.map(b => b.id === id ? {...b, branch_name: value} : b));
  };
  
  const removeBranchField = (id: string) => {
    setBranches(branches.filter(b => b.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="bg-[#161118] border border-white/10 rounded-2xl p-6">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">storefront</span>
            Venture Management
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group min-w-[200px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">search</span>
              <input type="text" placeholder="Search ventures..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-primary/50" />
            </div>
            <button onClick={() => showForm ? resetForm() : setShowForm(true)} className="px-4 py-2 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-primary/80 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">{showForm ? "close" : "add"}</span>
              {showForm ? "Cancel" : "New Venture"}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-6">
              <div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-4">
                <h4 className="text-white font-bold">{editingId ? "Edit Venture" : "Create New Venture"}</h4>
                {error && <div className="text-red-500 text-xs font-bold">{error}</div>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Venture Name *</label>
                     <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-white" />
                  </div>
                  <div>
                     <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Type *</label>
                     <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-white">
                        <option value="OWN">Club369 Venture (OWN)</option>
                        <option value="PARTNER">Partner Venture</option>
                     </select>
                  </div>
                  <div>
                     <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Discount Percentage *</label>
                     <input type="number" value={formData.discount_percentage} onChange={e => setFormData({...formData, discount_percentage: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-white" />
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Branches</label>
                    <div className="space-y-2">
                      {branches.map((idx, i) => (
                        <div key={idx.id} className="flex items-center gap-2">
                          <input type="text" placeholder={`Branch Name ${i + 1}`} value={idx.branch_name} onChange={e => updateBranchField(idx.id, e.target.value)} className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-white" />
                          <button onClick={() => removeBranchField(idx.id)} className="text-red-500 hover:bg-white/5 p-1 rounded-lg">
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      ))}
                      <button onClick={addBranchField} className="text-xs text-primary font-bold flex items-center gap-1 hover:underline">
                        <span className="material-symbols-outlined text-[14px]">add</span> Add Branch
                      </button>
                    </div>
                  </div>

                  <div>
                     <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Icon Image</label>
                     <input type="file" accept="image/*" onChange={e => setIconFile(e.target.files?.[0] || null)} className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 cursor-pointer" />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                   <button onClick={handleSubmit} className="px-6 py-2 bg-emerald-600 text-white text-xs font-bold uppercase rounded-lg hover:bg-emerald-500">
                     {editingId ? "Save Changes" : "Create Venture"}
                   </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-[10px] uppercase font-bold text-gray-500 bg-white/5">
              <tr>
                <th className="px-6 py-4">Venture Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Branches</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ventures.map((v) => (
                <tr key={v.id} className="hover:bg-white/[0.025]">
                  <td className="px-6 py-4 font-bold text-white">
                    <div className="flex items-center gap-3">
                      {v.icon && <img src={getFullUrl(v.icon)} className="w-8 h-8 rounded-md object-cover flex-shrink-0" />}
                      {v.name}
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500">{v.type}</span></td>
                  <td className="px-6 py-4 text-emerald-500 font-bold">{Math.round(parseFloat(v.discount_percentage))}%</td>
                  <td className="px-6 py-4 text-xs">{v.branch_count}</td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${v.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>{v.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button onClick={() => handleEdit(v)} className="px-3 py-1 rounded text-[10px] font-bold uppercase bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white">Edit</button>
                    <button onClick={() => handleToggle(v.id)} className="px-3 py-1 rounded text-[10px] font-bold uppercase bg-amber-600/10 text-amber-500 hover:bg-amber-600 hover:text-white">Toggle Status</button>
                    <button onClick={() => handleDelete(v.id)} className="px-3 py-1 rounded text-[10px] font-bold uppercase bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {ventures.length === 0 && !isLoading && <div className="p-8 text-center text-gray-500">No ventures found.</div>}
        </div>
      </div>
    </motion.div>
  );
};
