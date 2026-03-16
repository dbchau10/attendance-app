import { useState, useEffect } from "react";
import { getClasses } from "../services/api";
import { Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material";

export default function ClassSelector({ classId, onClassChange, onStartSession }) {
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getClasses().then((data) => {
            console.log('API response', data)
            setClasses(data)
        }).catch((err) => {
            console.log('API error', err)
            setClasses([])
        }).finally(() => setLoading(false))
    }, [])
    if (loading) {
        return (
            <div className="bg-white rounded-xl p-5 shadow-sm text-center">
                <CircularProgress size={28} />
                <p className="text-sm text-gray-400 mt-2">Đang tải danh sách lớp...</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Chọn lớp</p>
            <FormControl fullWidth size="small">
                <InputLabel>Lớp</InputLabel>
                <Select value={classId} label="Lớp" onChange={(e) => onClassChange(e.target.value)}>
                    <MenuItem value="">-- Chọn lớp</MenuItem>
                    {classes.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                            {c.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {classId && (
                <Stack direction="row" spacing={1} className="mt-3">
                    <Button variant="contained" size="small" onClick={onStartSession} className="flex-1" sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#16213e' } }}>
                        Bắt đầu điểm danh
                    </Button>
                </Stack>
            )}
        </div>
    )
}