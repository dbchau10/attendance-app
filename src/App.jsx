import { useCallback, useRef, useState } from "react"
import * as api from './services/api'
import Header from "./components/Header"
import ClassSelector from "./components/ClassSelector"
import Scanner from "./components/Scanner"
import { Alert, Divider, Snackbar } from "@mui/material"
import ManualInput from "./components/ManualInput"
import ScanResults from "./components/ScanResults"
import AttendanceStats from "./components/AttendanceStats"

function App() {
  const [classId, setClassId] = useState('')
  const [results, setResults] = useState([])
  const [status, setStatus] = useState(null)

  const [toast, setToast] = useState({ open: false, msg: '', severity: 'info' })
  const [busy, setBusy] = useState(false)
  const busyRef = useRef(false)

  const showToast = (msg, severity = 'info') => {
    setToast({ open: true, msg, severity })
  }

  const refreshStatus = useCallback(async (fid) => {
    try {
      const s = await api.getAttendanceStatus(fid)
      setStatus(s)
    } catch { }
  }, [])

  const handleClassChange = (id) => {
    setClassId(id)
    setResults([])
    setStatus(null)
    if (id) refreshStatus(id)
  }

  const handleStartSession = async () => {
    if (!classId) return
    showToast('Đang tạo buổi điểm danh...', 'info')
    try {
      const r = await api.startSession(classId)
      showToast(r.message, r.existing ? 'warning' : 'success')
      refreshStatus(classId)
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error')
    }
  }

  const doMark = useCallback(async (raw) => {
    if (busyRef.current || !classId) return
    busyRef.current = true
    setBusy(true)

    var timer = setTimeout(function () {
      busyRef.current = false;
      setBusy(false)
    }, 5000)
    try {
      var r

      if (raw.indexOf(':') !== -1) {
        var parts = raw.split(':')
        r = await api.smartMark(parts[0], parts[1])

        if (r.className) {
          r.message = '[' + r.className + '] ' + r.message
        }
      } else {
        if (!classId) {
          r = {
            success: false,
            message: 'Chọn lớp trước khi quét mã cũ (không có classId)'
          }
        } else {
          r = await api.markAttendance(classId, raw)
        }
      }

      setResults(function (prev) {
        return [r].concat(prev).slice(0, 20)
      })

      if (classId) refreshStatus(classId)

    } catch (e) {
      setResults(function (prev) {
        return [{
          success: false,
          message: 'Lỗi: ' + e.message
        }].concat(prev).slice(0, 20)
      })
    } finally {
      clearTimeout(timer)
      busyRef.current = false
      setBusy(false)
    }

  }, [classId, refreshStatus])


  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-md mx-auto p-4 space-y-4">

        {/* Scanner luôn hiện — quét QR mới không cần chọn lớp */}
        <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Quét mã QR
          </p>

          <Scanner onScan={doMark} />
        </div>

        <ScanResults results={results} />

        {/* Chọn lớp — chỉ cần khi dùng QR cũ hoặc nhập tay */}
        <details className="bg-white rounded-xl shadow-sm">
          <summary className="p-5 cursor-pointer text-sm font-semibold text-gray-500">
            Nhập mã số tay / Xem danh sách lớp
          </summary>

          <div className="px-5 pb-5 space-y-4">
            <ClassSelector
              classId={classId}
              onClassChange={handleClassChange}
              onStartSession={handleStartSession}
            />

            {classId && (
              <>
                <ManualInput onSubmit={doMark} disabled={busy} />
                <AttendanceStats status={status} />
              </>
            )}
          </div>
        </details>

      </div>
    </div>
  )
}

export default App
