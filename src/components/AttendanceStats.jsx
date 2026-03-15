import { Cancel, CheckCircle } from "@mui/icons-material"
import { Chip } from "@mui/material"


export default function AttendanceStats({ status }) {
    if (!status) return null
    if (!status.started) {
        return (
            <div className="bg-white rounded-xl p-5 shadow-sm text-center text-gray-400 text-sm">
                Bấm "Bắt đầu điểm danh" để tạo buổi hôm nay
            </div>
        )
    }

    const total = status.students.length
    const present = status.students.filter((s) => s.present).length
    const absent = total - present

    return (
        <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Thống kê</p>
            <div className="grid grid-cols-3 gap-3 text-center mb-4">
                <div className="bg-gray-50 rounded-lg py-3">
                    <p className="text-2xl font-extrabold">{total}</p>
                    <p className="text-xs text-gray-400">Tổng số</p>
                </div>
                <div className="bg-emerald-50 rounded-lg py-3">
                    <p className="text-2xl font-extrabold text-emerald-600">{present}</p>
                    <p className="text-xs text-gray-400">Có mặt</p>
                </div>
                <div className="bg-red-50 rounded-lg py-3">
                    <p className="text-2xl font-extrabold text-red-500">{absent}</p>
                    <p className="text-xs text-gray-400">Vắng</p>
                </div>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                {status.students.map((s) => (
                    <div key={s.id} className="flex items-center py-2 px-1 text-sm">
                        {s.present ? (<CheckCircle sx={{ fontSize: 20, color: '#059669', mr: 1 }} />) :
                            (<Cancel sx={{ fontSize: 20, color: '#dc2626', mr: 1 }} />)}
                        <span className="text-gray-300 text-xs mr-2">#{s.id}</span>
                        <span className="flex-1">
                            {s.saintName ? s.saintName + ' ' : ''}{s.fullName}
                        </span>
                        <Chip
                            label={s.present ? 'Có mặt' : 'Vắng'}
                            size="small"
                            color={s.present ? 'success' : 'error'}
                            variant="outlined"
                            sx={{ fontSize: 11 }}
                        />
                    </div>
                ))}

            </div>
        </div>
    )
}