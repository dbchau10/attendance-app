// const API_URL =
//   "https://script.google.com/macros/s/AKfycbyX9tmXzZ1ck8wWA_PINZZB-3VXr3c1JFQHKm4mVMkw10_OYAab38hmH64mOernQDie/exec";

// async function callApi(action, params) {
//   //   const url = new URL(API_URL);
//   const url = API_URL + "?action=" + action;
//   const queryString = Object.keys(params)
//     .map((k) => "&" + k + "=" + encodeURIComponent(params[k]))
//     .join('');
//   //   url.searchParams.set("action", action);
//   // Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
//   // const res = await fetch(url.toString());

//   // if (!res.ok) throw new Error('Network error')
//   //     return res.json();

//   //   const res = await fetch(url.toString(), {
//   //     method: "GET",
//   //     redirect: "follow",
//   //   });

//   //   const text = await res.text();
//   //   try {
//   //     return JSON.parse(text);
//   //   } catch {
//   //     throw new Error("Invalid response: " + text.substring(0, 100));
//   //   }

//   const res = await fetch(url + queryString);
//   const text = await res.text();
//   console.log(res)
//   return JSON.parse(text);
// }


// export const getClasses = () => callApi("getClasses");
// export const getStudents = (fieldId) => callApi("getStudents", { fieldId });
// export const startSessions = (fieldId) => callApi("startSessions", { fieldId });
// export const markAttendance = (fieldId, studentId) =>
//   callApi("markAttendance", { fieldId, studentId });
// export const getAttendanceStatus = (fieldId) =>
//   callApi("getAttendanceStatus", { fieldId });

export async function getClasses(){
    var res = await fetch('/gas?action=getClasses')
    return res.json()
}

export async function getStudents(fileId){
    var res = await fetch('/gas?action=getStudents&fileId=' + fileId)
    return res.json()
}


export async function startSession(fileId){
    var res = await fetch('/gas?action=startSession&fileId=' + fileId)
    return res.json()
}
export async function markAttendance(fileId, studentId){
    var res = await fetch('/gas?action=markAttendance&fileId=' + fileId + '&studentId='+ studentId)
    return res.json()
}

export async function getAttendanceStatus(fileId){
    var res = await fetch('/gas?action=getStatus&fileId=' + fileId)
    return res.json()
}


