export default function DSALoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold mb-2">DSA Portal</h1>
        <h2 className="text-xl text-slate-500 mb-6">Agent Login</h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input type="email" className="w-full px-4 py-2 border rounded-lg" placeholder="agent@rupeequik.com" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input type="password" className="w-full px-4 py-2 border rounded-lg" placeholder="********" />
          </div>
          <button type="button" className="w-full py-3 bg-[#4A69FF] text-white font-bold rounded-lg hover:bg-blue-700">
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
