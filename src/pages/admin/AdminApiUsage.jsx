import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart2, CheckCircle, XCircle, Clock, Zap } from 'lucide-react'
import { adminService } from '../../services'

export default function AdminApiUsage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService.getApiUsage()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#641A78] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-[#F5EAF7] flex items-center justify-center">
            <BarChart2 size={18} className="text-[#641A78]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
            API Usage & <span className="gold-text">Tokens</span>
          </h1>
        </div>
        <p className="text-[#35243B]/60 text-sm">OpenAI GPT-4o and Astronomy API telemetry metrics</p>
      </div>

      {/* Summary Cards */}
      {data?.summary?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.summary.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card p-5 sm:p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#641A78] capitalize">{item._id} Service</span>
                <div className="w-8 h-8 rounded-lg bg-[#F5EAF7] flex items-center justify-center">
                  <Zap size={16} className="text-[#D9A441]" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-[#35243B] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                {(item.totalTokens || 0).toLocaleString()}
              </p>
              <p className="text-[#35243B]/50 text-xs">Total tokens utilized</p>
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#EADFED]">
                <span className="text-xs font-medium text-[#35243B]/70">{item.count} total calls</span>
                {item.errors > 0 && <span className="text-rose-600 font-semibold text-xs">{item.errors} errors</span>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Recent Logs Table */}
      {data?.usage?.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="card overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-[#EADFED] bg-[#F5EAF7]/50">
            <h2 className="text-[#35243B] font-bold text-sm uppercase tracking-wider">Recent API Execution Logs</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#EADFED] bg-[#FFF9F0]">
                  <th className="text-left px-5 py-3 text-[#641A78] text-xs font-bold uppercase tracking-wider">User</th>
                  <th className="text-left px-5 py-3 text-[#641A78] text-xs font-bold uppercase tracking-wider hidden sm:table-cell">Service</th>
                  <th className="text-left px-5 py-3 text-[#641A78] text-xs font-bold uppercase tracking-wider hidden md:table-cell">Endpoint</th>
                  <th className="text-left px-5 py-3 text-[#641A78] text-xs font-bold uppercase tracking-wider hidden md:table-cell">Tokens</th>
                  <th className="text-left px-5 py-3 text-[#641A78] text-xs font-bold uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-[#641A78] text-xs font-bold uppercase tracking-wider hidden lg:table-cell">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EADFED]">
                {data.usage.map((log) => (
                  <tr key={log._id} className="hover:bg-[#FFF9F0]/60 transition-colors">
                    <td className="px-5 py-3.5 text-[#35243B] text-sm font-semibold">{log.user?.name || 'System/Guest'}</td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="badge-purple text-[11px] capitalize py-0.5">{log.service}</span>
                    </td>
                    <td className="px-5 py-3.5 text-[#35243B]/60 text-xs hidden md:table-cell font-mono">{log.endpoint}</td>
                    <td className="px-5 py-3.5 text-[#35243B] text-sm font-bold hidden md:table-cell">{log.tokensUsed || 0}</td>
                    <td className="px-5 py-3.5">
                      {log.success ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium">
                          <CheckCircle size={14} /> Success
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-rose-600 text-xs font-medium">
                          <XCircle size={14} /> Failed
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-[#35243B]/50 text-xs hidden lg:table-cell">
                      <span className="flex items-center gap-1">
                        <Clock size={11} className="text-[#D9A441]" />
                        {new Date(log.createdAt).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {(!data?.usage?.length && !data?.summary?.length) && (
        <div className="card p-12 text-center">
          <BarChart2 size={40} className="text-[#641A78]/30 mx-auto mb-3" />
          <p className="text-[#35243B]/60 text-sm">No API usage recorded yet</p>
        </div>
      )}
    </div>
  )
}
