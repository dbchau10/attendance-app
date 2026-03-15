import { Button } from "@mui/material";
import { Html5Qrcode } from "html5-qrcode";
import { useCallback, useEffect, useRef, useState } from "react";


export default function Scanner({ onScan, disabled }) {
    const [scanning, setScanning] = useState(false)
    const scannerRef = useRef(null)
    const containerRef = useRef(null)

    const startScanner = useCallback(async () => {
        try {
            const qr = new Html5Qrcode('qr-reader')
            scannerRef.current = qr;

            await qr.start({
                facingMode: 'environment'
            }, {
                fps: 10, qrbox: { width: 250, height: 250 }
            },
                (text) => {
                    if (!disabled) onScan(text.trim())
                })
            setScanning(true)
        } catch (err) {
            alert('Không mở được camera', + (err.message || err));
        }
    }, [onScan, disabled])

    const stopScanner = useCallback(async () => {
        if (scannerRef.current) {
            await scannerRef.current.stop().catch(() => { })
            scannerRef.current = null;
        }
        setScanning(false)
    }, [])

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => { })
            }
        }
    }, [])

    return (
        <div>
            <div id='qr-reader' ref={containerRef} className="w-full rounded-lg overflow-hidden bg-black" />
            <div className="mt-3">
                {!scanning ? (
                    <Button fullWidth variant="contained" color="success" onClick={startScanner}
                        sx={{ py: 1.5, fontWeight: 600 }}
                    >Mở camera quét QR</Button>) : (
                    <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        onClick={stopScanner}
                        sx={{ py: 1.5, fontWeight: 600 }}
                    >Tắt camera</Button>)}
            </div>
        </div>
    )
}