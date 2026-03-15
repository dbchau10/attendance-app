import { Alert } from "@mui/material"

export default function ScanResults({ results }) {
    if (results.length === 0) return null
    return (
        <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Kết quả</p>

            <div className="space-y-2">
                {results.map((r, i) => (
                    <Alert key={i} severity={r.success ? 'success' : r.duplicate ? 'warning' : 'error'}
                        sx={{ py: 0.5, animation: 'fadeIn 0.3s ease' }}>
                        {r.message}
                    </Alert>
                ))}
            </div>
        </div>
    )
}