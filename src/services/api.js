const API_URL = 'https://script.google.com/macros/s/AKfycbyX9tmXzZ1ck8wWA_PINZZB-3VXr3c1JFQHKm4mVMkw10_OYAab38hmH64mOernQDie/exec'

async function callApi(action, params) {
    const url = new URL(API_URL)
    url.searchParams.set('action',action)
    Object.entries(params).forEach(([k,v]) => url.searchParams.set(k,v))
    const res = await fetch(url.toString());

    if (!res.ok) throw new Error('Network error')
        return res.json();
}

export const getClasses = () => callApi('getClasses')
export const getStudents = (fieldId) => callApi('getStudents',{fieldId})
export const startSessions = (fieldId) => callApi('startSessions',{fieldId})
export const markAttendance = (fieldId,studentId) => callApi('markAttendance',{fieldId, studentId})
export const getAttendanceStatus = (fieldId) => callApi('getAttendanceStatus',{fieldId})
