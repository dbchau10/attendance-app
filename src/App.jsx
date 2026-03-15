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
      const r = await api.startSessions(classId)
      showToast(r.message, r.existing ? 'warning' : 'success')
      refreshStatus(classId)
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error')
    }
  }

  const doMark = useCallback(async (studentId) => {
    if (busyRef.current || !classId) return
    busyRef.current = true
    setBusy(true)

    try {
      const r = await api.markAttendance(classId, studentId)
      setResults((prev) => [r, ...prev].slice(0, 15))
      refreshStatus(classId)
    } catch (e) {
      setResults((prev) => [{ success: false, message: 'Lỗi: ' + e.message }, ...prev].slice(0, 15))
    }

    setTimeout(() => {
      busyRef.current = false;
      setBusy(false)
    }, 1200)
  }, [classId, refreshStatus])


  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-md mx-auto p-4 space-y-4">
        <ClassSelector classId={classId} onClassChange={handleClassChange} onStartSession={handleStartSession} />

        {classId && (
          <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Quét mã QR
            </p>
            <Scanner onScan={doMark} disabled={busy} />
            <Divider>hoặc nhập mã số</Divider>
            <ManualInput onSubmit={doMark} disabled={busy} />
          </div>
        )}

        <ScanResults results={results} />
        <AttendanceStats status={status} />
      </div>

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={toast.severity} variant="filled" sx={{ width: '100%' }}>{toast.msg}</Alert>
      </Snackbar>
    </div>
  )
}

export default App
