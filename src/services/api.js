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

var DEV = window.location.hostname === "localhost";
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbyX9tmXzZ1ck8wWA_PINZZB-3VXr3c1JFQHKm4mVMkw10_OYAab38hmH64mOernQDie/exec";
function buildUrl(action, params) {
  var base = DEV ? "/gas" : GAS_URL;
  var query = "?action=" + action;
  for (var key in params) {
    query += "&" + key + "=" + encodeURIComponent(params[key]);
  }

  return base + query;
}

async function callApi(action, params) {
  var res = await fetch(buildUrl(action, params || {}));
  return res.json();
}

export const getClasses = () => callApi("getClasses");
export const getStudents = (fileId) => callApi("getStudents", { fileId });
export const startSession = (fileId) => callApi("startSession", { fileId });
export const markAttendance = (fileId, studentId) =>
  callApi("markAttendance", { fileId, studentId });
export const getAttendanceStatus = (fileId) => callApi("getStatus", { fileId });

// export async function getClasses(){
//     var res = await fetch('/gas?action=getClasses')
//     return res.json()
// }

// export async function getStudents(fileId){
//     var res = await fetch('/gas?action=getStudents&fileId=' + fileId)
//     return res.json()
// }

// export async function startSession(fileId){
//     var res = await fetch('/gas?action=startSession&fileId=' + fileId)
//     return res.json()
// }
// export async function markAttendance(fileId, studentId){
//     var res = await fetch('/gas?action=markAttendance&fileId=' + fileId + '&studentId='+ studentId)
//     return res.json()
// }

// export async function getAttendanceStatus(fileId){
//     var res = await fetch('/gas?action=getStatus&fileId=' + fileId)
//     return res.json()
// }
