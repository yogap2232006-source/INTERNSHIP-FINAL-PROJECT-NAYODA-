import { useState, useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Users, Briefcase, DollarSign, Activity, FileText } from 'lucide-react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

export default function AdminDashboard() {
  const { token, user } = useContext(AuthContext);
  const [metrics, setMetrics] = useState({
    users: { total: 0, clients: 0, freelancers: 0 },
    projects: { active: 0, completed: 0 },
    proposals: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && user?.role === 'Admin') {
      axios.get('http://localhost:5000/api/admin/metrics', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setMetrics(res.data))
      .catch(err => console.error("Failed to load metrics", err))
      .finally(() => setLoading(false));
    } else {
        setLoading(false);
    }
  }, [token, user]);

  if (!user || user.role !== 'Admin') {
      return <Navigate to="/dashboard" />;
  }

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">SkillSphere <span className="text-brand-600 text-lg">Admin</span></span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold border border-gray-700 shadow-sm uppercase">
                  {user?.name?.charAt(0) || 'A'}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Platform Overview</h1>
          <p className="mt-1 text-sm text-gray-500">Real-time metrics and system health.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd className="text-2xl font-semibold text-gray-900 mt-1">{metrics.users.total}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-brand-50 rounded-lg p-3 border border-brand-100">
                  <Briefcase className="h-6 w-6 text-brand-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Projects</dt>
                    <dd className="text-2xl font-semibold text-gray-900 mt-1">{metrics.projects.active}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-50 rounded-lg p-3 border border-purple-100">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Proposals Submitted</dt>
                    <dd className="text-2xl font-semibold text-gray-900 mt-1">{metrics.proposals}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-50 rounded-lg p-3 border border-green-100">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Platform Revenue</dt>
                    <dd className="text-2xl font-semibold text-gray-900 mt-1">${metrics.revenue.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><Activity className="mr-2 h-5 w-5 text-gray-400" /> System Activity</h2>
            <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Client Accounts</span>
                    <span className="text-sm font-bold text-gray-900">{metrics.users.clients}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Freelancer Accounts</span>
                    <span className="text-sm font-bold text-gray-900">{metrics.users.freelancers}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Completed Projects</span>
                    <span className="text-sm font-bold text-brand-600">{metrics.projects.completed}</span>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
