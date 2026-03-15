import { Stack, TextField } from "@mui/material";
import { useState } from "react";


export default function ManualInput({ onSubmit, disabled }) {
    const [value, setValue] = useState('')

    const handleSubmit = () => {
        const v = value.trim()
        if (!v) return
        onSubmit(v)
        setValue('')
    }

    return (
        <Stack direction="row" spacing={1}>
            <TextField size="small" fullWidth placeholder="Nhập mã số..." inputMode="numeric" value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                disabled={disabled}
            />
            <Button variant="contained" color="success" onClick={handleSubmit} disabled={disabled || !value.trim()}
                sx={{ fontWeight: 600, px: 3 }}
            >
                OK
            </Button>
        </Stack>
    )
}