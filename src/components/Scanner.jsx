import { Button } from "@mui/material";
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";
import { useCallback, useEffect, useRef, useState } from "react";


export default function Scanner({ onScan }) {
    const [started, setStarted] = useState(false)
    const [error, setError] = useState('')
    const videoRef = useRef(null)
    const streamRef = useRef(null)
    const timerRef = useRef(null)

    // const scannerRef = useRef(null)
    const lastScanRef = useRef({ text: '', time: 0 })
    // const containerRef = useRef(null)
    // useEffect(() => {
    //     var scanner = new Html5QrcodeScanner('qr-reader',
    //         {
    //             fps: 15,
    //             qrbox: { width: 250, height: 250 },
    //             rememberLastUsedCamera: true,
    //             aspectRatio: 1.0,
    //         },
    //         false
    //     )

    //     scanner.render(
    //         function onSuccess(text) {
    //             var now = Date.now()
    //             if (text === lastScanRef.current && now - lastScanRef.current.time < 3000) {
    //                 scanner.resume()
    //                 return
    //             }
    //             lastScanRef.current = { text: text, time: now }
    //             onScan(text.trim())

    //             setTimeout(() => {
    //                 scanner.resume()
    //             }, 1000)

    //         },
    //         function onError() { }
    //     )

    //     scannerRef.current = scanner
    //     return function () {
    //         if (scannerRef.current) {
    //             scannerRef.current.clear().catch(function () { })
    //         }
    //     }
    // }, [onScan])

    // const startScanner = useCallback(async () => {
    //     try {
    //         const qr = new Html5Qrcode('qr-reader')
    //         scannerRef.current = qr;

    //         await qr.start({
    //             facingMode: 'environment'
    //         }, {
    //             fps: 10, qrbox: { width: 250, height: 250 }
    //         },
    //             (text) => {
    //                 alert('QR detected: ', text)
    //                 if (!disabled) onScan(text.trim())
    //             })
    //         setScanning(true)
    //     } catch (err) {
    //         alert('Không mở được camera', + (err.message || err));
    //     }
    // }, [onScan, disabled])

    // const stopScanner = useCallback(async () => {
    //     if (scannerRef.current) {
    //         await scannerRef.current.stop().catch(() => { })
    //         scannerRef.current = null;
    //     }
    //     setScanning(false)
    // }, [])

    // useEffect(() => {
    //     return () => {
    //         if (scannerRef.current) {
    //             scannerRef.current.stop().catch(() => { })
    //         }
    //     }
    // }, [])


    async function startCamera() {
        setError('')
        if (!('BarcodeDetector' in window)) {
            setError('Trinh duyet khong ho tro. Dung Chrome')
            return
        }
        try {
            // var qr = new Html5Qrcode('qr-reader')
            // qrRef.current = qr

            // await qr.start({
            //     facingMode: 'environment'
            // }, {
            //     fps: 15, qrbox: { width: 250, height: 250 }
            // },
            //     (text) => {
            //         var now = Date.now()
            //         if (text === lastRef.current && now - lastRef.current.time < 3000) return
            //         lastRef.current = { text: text, time: now }
            //         onScan(text.trim())
            //     },
            //     () => { }
            // )
            // setStarted(true)
            var stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                }
            })
            streamRef.current = stream
            videoRef.current.srcObject = stream
            await videoRef.current.play()
            setStarted(true)


            var detector = new BarcodeDetector({ format: ['qr_code'] })

            timerRef.current = setInterval(async function () {
                if (!videoRef.current || videoRef.current.readyState < 2) return
                try {
                    var codes = await detector.detect(videoRef.current)
                    if (codes.length > 0) {
                        var text = codes[0].rawValue.trim()
                        var now = Date.now()
                        if (text === lastScanRef.current.text && now - lastScanRef.current.time < 3000) return
                        lastScanRef.current = { text: text, time: now }
                        onScan(text)
                    }
                } catch (e) { }
            }, 300)

        } catch (err) {
            setError('Khong mo dc camera: ' + (err.message || err))
        }
    }


    function stopCamera() {
        // if (qrRef.current) {
        //     qrRef.current.stop().catch(function () { })
        //     qrRef.current = null
        // }
        if (timerRef.current) clearInterval(timerRef.current)
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(function (t) { t.stop() })
            streamRef.current = null
        }
        if (videoRef.current) videoRef.current.srcObject = null
        setStarted(false)
    }

    useEffect(() => {
        // return () => {
        //     if (qrRef.current) {
        //         qrRef.current.stop().catch(() => { })
        //     }
        // }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(function (t) { t.stop() })
            }
        }
    }, [])


    return (
        // <div>
        //     <div id='qr-reader' ref={containerRef} className="w-full rounded-lg overflow-hidden bg-black" />
        //     <div className="mt-3">
        //         {!scanning ? (
        //             <Button fullWidth variant="contained" color="success" onClick={startScanner}
        //                 sx={{ py: 1.5, fontWeight: 600 }}
        //             >Mở camera quét QR</Button>) : (
        //             <Button
        //                 fullWidth
        //                 variant="contained"
        //                 color="error"
        //                 onClick={stopScanner}
        //                 sx={{ py: 1.5, fontWeight: 600 }}
        //             >Tắt camera</Button>)}
        //     </div>
        // </div>
        //2 <div id="qr-reader" style={{ width: '100%', minHeight: 300 }} />
        // <div>
        //     <div id='qr-reader' style={{ width: '100%' }} />
        //     {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        // </div>

        <div>
            <video ref={videoRef} playsInline muted style={{ width: '100%', borderRadius: 12, display: started ? 'block' : 'none', background: '#000' }} />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {!started ? (
                <Button fullWidth variant="contained" color="success" onClick={startCamera}
                    sx={{ py: 1.5, fontWeight: 600 }}
                >Mở camera quét QR</Button>) : (
                <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    onClick={stopCamera}
                    sx={{ py: 1.5, fontWeight: 600 }}
                >Tắt camera</Button>)}
        </div>
    )
}