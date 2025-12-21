import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function App() {
  const [msg, setmsg] = useState("");
  const [status, setstatus] = useState(false);
  const [emailList, setEmailList] = useState([]);
  const [fileName, setFileName] = useState("");
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [progress, setProgress] = useState({ sent: 0, total: 0 });

  function handlemsg(evt) {
    setmsg(evt.target.value);
  }

  function handlefile(event) {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
      const totalemail = emailList.map((item) => item.A);
      setEmailList(totalemail);
      setProgress({ sent: 0, total: totalemail.length });
    };
    reader.readAsBinaryString(file);
  }

  function send() {
    if (!msg || emailList.length === 0) return;

    setstatus(true);

    // Simulated progress for demo
    let sentCount = 0;
    setProgress({ sent: 0, total: emailList.length });

    emailList.forEach((email, idx) => {
      setTimeout(() => {
        sentCount++;
        setProgress({ sent: sentCount, total: emailList.length });
        if (sentCount === emailList.length) {
          axios
            .post("https://bulkmail-website-8eic.onrender.com/sendemail", { msg: msg, emailList })
            .then((res) => {
              setToast({
                show: true,
                type: "success",
                message: res.data?.message || "Mail sent successfully ✅",
              });
              setstatus(false);
            })
            .catch((err) => {
              setToast({
                show: true,
                type: "error",
                message: "Error sending email ❌",
              });
              setstatus(false);
            });
        }
      }, idx * 200); // staggered delay for demo animation
    });
  }

  return (
    <div className="min-h-screen bg-slate-100 relative">
      {/* Header */}
      <div className="bg-blue-950 text-white text-center shadow-md">
        <h1 className="text-3xl font-bold py-4 tracking-wide">📧 BulkMail</h1>
        <p className="text-sm text-blue-200 pb-3">
          Send bulk emails easily & professionally
        </p>
      </div>

      {/* Main Card */}
      <div className="flex justify-center mt-12 px-4">
        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 relative">

          {/* Badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-900 text-white px-5 py-1 rounded-full text-sm shadow-md animate-bounce">
            Bulk Email Sender
          </div>

          {/* Instruction */}
          <div className="mt-8 mb-6 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-900 text-center">
            📌 Excel file must have email addresses in <b>Column A</b>
          </div>

          {/* Message Card */}
          <div className="mt-4 bg-blue-50 p-4 rounded-xl shadow hover:shadow-lg transition">
            <label className="font-semibold text-gray-700 block mb-2">
              ✍️ Email Message
            </label>
            <textarea
              onChange={handlemsg}
              value={msg}
              placeholder="Type your email message here"
              className="w-full h-36 px-4 py-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              Characters: {msg.length}
            </p>
          </div>

          {/* File Upload Card */}
          <div className="mt-6 bg-blue-50 p-4 rounded-xl shadow hover:shadow-lg transition">
            <label className="font-semibold text-gray-700 block mb-2">
              📂 Upload Excel File
            </label>
            <div className="border-2 border-dashed border-blue-500 rounded-xl p-6 text-center cursor-pointer">
              <input
                onChange={handlefile}
                type="file"
                className="w-full cursor-pointer"
              />
              {fileName && (
                <p className="text-sm text-green-700 mt-2 text-center">
                  ✅ Selected File: {fileName}
                </p>
              )}
              <p className="text-sm text-gray-600 mt-2">
                Click or drag your Excel file here
              </p>
            </div>
          </div>

          {/* Progress */}
          {progress.total > 0 && (
            <div className="mt-6 text-center">
              <div className="text-sm text-gray-700 mb-1">
                Progress: {progress.sent} / {progress.total}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{
                    width: `${(progress.sent / progress.total) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Send Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={send}
              disabled={status || msg.trim() === "" || emailList.length === 0}
              className={`px-10 py-3 rounded-full text-white font-semibold text-lg transition-all duration-300 shadow-lg
              ${
                status || msg.trim() === "" || emailList.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-950 hover:bg-blue-800 hover:scale-105 hover:shadow-xl"
              }`}
            >
              {status ? (
                <div className="flex items-center space-x-2">
                  <span className="loader-border border-white mr-2"></span>
                  Sending...
                </div>
              ) : (
                "🚀 Send Emails"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 mt-16 pb-6">
        © 2025 BulkMail • Built with React & Node.js
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-5 right-5 px-6 py-3 rounded-lg text-white font-semibold shadow-lg transition-all ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
          <button
            className="ml-4 font-bold"
            onClick={() => setToast({ ...toast, show: false })}
          >
            ✖
          </button>
        </div>
      )}

      {/* Loader CSS */}
      <style>{`
        .loader-border {
          width: 18px;
          height: 18px;
          border: 3px solid transparent;
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default App;