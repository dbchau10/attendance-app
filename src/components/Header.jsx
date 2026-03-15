import { Box, Typography } from "@mui/material"



const today = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
})

export default function Header() {
    return (
        <Box className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-4 px-5 text-center sticky top-0 z-50">
            <Typography variant="h6" fontWeight={700}>Điểm danh lớp học</Typography>
            <Typography variant="caption" className="opacity-75">{today}</Typography>
        </Box>
    )

}