import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, ChevronLeft, ChevronRight, Shield } from 'lucide-react'
import { adminService } from '../../services'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchUsers = async (page = 1, q = search) => {
    setLoading(true)
    try {
      const res = await adminService.getUsers({ page, limit: 20, search: q || undefined })
      setUsers(res.data.users || [])
      setPagination(res.data.pagination || { page: 1, pages: 1, total: 0 })
    } catch {
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchUsers(1, search)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#F5EAF7] flex items-center justify-center">
              <Users size={18} className="text-[#641A78]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
              User <span className="gold-text">Management</span>
            </h1>
          </div>
          <p className="text-[#35243B]/60 text-sm">{pagination.total} registered accounts</p>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#35243B]/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email address..."
            className="input-field pl-10"
          />
        </div>
        <button type="submit" className="btn-primary px-6 text-sm font-semibold">
          Search
        </button>
      </form>

      {loading ? (
        <div className="card p-12 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#641A78] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="card p-12 text-center">
          <Users size={40} className="text-[#641A78]/30 mx-auto mb-3" />
          <p className="text-[#35243B]/60 text-sm">No matching users found</p>
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#EADFED] bg-[#F5EAF7]/50">
                    <th className="text-left px-5 py-3.5 text-[#641A78] text-xs font-bold uppercase tracking-wider">User</th>
                    <th className="text-left px-5 py-3.5 text-[#641A78] text-xs font-bold uppercase tracking-wider hidden sm:table-cell">Role</th>
                    <th className="text-left px-5 py-3.5 text-[#641A78] text-xs font-bold uppercase tracking-wider hidden md:table-cell">Scans</th>
                    <th className="text-left px-5 py-3.5 text-[#641A78] text-xs font-bold uppercase tracking-wider hidden lg:table-cell">Joined</th>
                    <th className="text-left px-5 py-3.5 text-[#641A78] text-xs font-bold uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EADFED]">
                  {users.map((u, i) => (
                    <motion.tr
                      key={u._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="hover:bg-[#FFF9F0]/60 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl purple-gradient flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[#35243B] text-sm font-bold">{u.name}</p>
                            <p className="text-[#35243B]/50 text-xs">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize border ${
                          u.role === 'superadmin' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          u.role === 'admin' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-[#F5EAF7] text-[#641A78] border-[#EADFED]'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#35243B]/70 text-sm font-medium hidden md:table-cell">
                        {u.scanCount || 0}
                      </td>
                      <td className="px-5 py-4 text-[#35243B]/50 text-xs hidden lg:table-cell">
                        {new Date(u.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          u.isActive !== false
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {u.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={() => fetchUsers(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 card rounded-xl disabled:opacity-30 hover:bg-[#F5EAF7] transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} className="text-[#641A78]" />
              </button>
              <span className="text-[#35243B]/60 text-sm font-medium">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => fetchUsers(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="p-2 card rounded-xl disabled:opacity-30 hover:bg-[#F5EAF7] transition-colors cursor-pointer"
              >
                <ChevronRight size={16} className="text-[#641A78]" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
