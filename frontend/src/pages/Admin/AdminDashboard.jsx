import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyExamsApi, deleteExamApi } from "../../api/adminApi";
import useAuthStore from "../../store/authStore";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const fetchExams = async () => {
    try {
      const res = await getMyExamsApi();
      setExams(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Nuke any stuck student invite codes the moment an Admin loads this page
    localStorage.removeItem('examforge-redirect-code'); 
    
    fetchExams();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this exam?")) return;
    setDeletingId(id);
    try {
      await deleteExamApi(id);
      setExams(exams.filter((e) => e.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLogoutWithLoader = async () => {
    setIsLoggingOut(true);
    
    // Add a tiny 500ms delay so the user actually sees the spinner
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    handleLogout(); 
  };

  const statusColor = (status) => {
    if (status === "draft") return "bg-yellow-100 text-yellow-700";
    if (status === "active") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">ExamForge</h1>
          <p className="text-sm text-gray-500">
            Welcome, {user?.name || "Admin"}
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/create")}
          className="bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-800 transition"
        >
          + New Exam
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">My Exams</h2>

        {loading ? (
          <p className="text-gray-400">Loading exams...</p>
        ) : exams.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <p className="text-gray-400 text-lg mb-4">No exams yet</p>
            <button
              onClick={() => navigate("/admin/create")}
              className="bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              Create your first exam
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-gray-800">
                      {exam.title}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor(exam.status)}`}
                    >
                      {exam.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {exam.subject} • {exam.durationMinutes} mins •{" "}
                    {exam.totalMarks} marks
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {exam.questions.length} question
                    {exam.questions.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* View Details — always visible */}
                  <button
                    onClick={() => navigate(`/admin/exam/${exam.id}`)}
                    className="border border-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition"
                  >
                    View Details
                  </button>

                  {/* View Results — only for active exams */}
                  {exam.status === "active" && (
                    <button
                      onClick={() => navigate(`/admin/exam/${exam.id}/results`)}
                      className="border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-50 transition"
                    >
                      View Results
                    </button>
                  )}

                  {/* Delete — always visible */}
                  <button
                    onClick={() => handleDelete(exam.id)}
                    disabled={deletingId === exam.id}
                    className="border border-red-200 text-red-500 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {deletingId === exam.id ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-red-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleLogoutWithLoader}
        disabled={isLoggingOut}
        className="fixed bottom-6 left-6 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
      >
        {isLoggingOut && (
          <svg className="animate-spin h-4 w-4 text-red-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        )}
        {isLoggingOut ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
}
