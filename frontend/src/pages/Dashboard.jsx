import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, User, MessageSquare, Bell, Search } from 'lucide-react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

export default function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setNotifications(res.data);
        setUnreadCount(res.data.filter(n => !n.isRead).length);
      }).catch(err => console.error(err));
    }
  }, [token]);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-brand-600">SkillSphere</span>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <Link to="/dashboard" className="border-brand-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/projects" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Find Work
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="text-gray-400 hover:text-gray-500 relative p-1 focus:outline-none"
                >
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>}
                </button>
                
                {showNotifications && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-2 border-b border-gray-100 flex justify-between items-center px-4">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      <span className="text-xs text-brand-600 font-medium">{unreadCount} unread</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-sm text-gray-500">No notifications yet.</div>
                      ) : (
                        notifications.map(notif => (
                          <div key={notif._id} onClick={() => handleMarkAsRead(notif._id)} className={`px-4 py-3 border-b border-gray-50 last:border-0 cursor-pointer transition ${notif.isRead ? 'opacity-60 bg-white' : 'bg-brand-50 hover:bg-brand-100'}`}>
                            <p className={`text-sm ${notif.isRead ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{new Date(notif.createdAt).toLocaleDateString()}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <Link to="/chat" className="text-gray-400 hover:text-gray-500 p-1">
                <MessageSquare className="h-6 w-6" />
              </Link>
              <Link to="/profile" className="flex items-center ml-2">
                <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold border border-brand-200 uppercase">
                  {user?.name?.charAt(0) || 'A'}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back, {user?.name || 'User'}</h1>
          <p className="mt-1 text-sm text-gray-500">Here's what's happening with your projects today.</p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search for skills, projects, or freelancers..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
          <button className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 transition">
            Search
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-brand-50 rounded-lg p-3 border border-brand-100">
                  <Briefcase className="h-6 w-6 text-brand-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Projects</dt>
                    <dd className="text-2xl font-semibold text-gray-900 mt-1">12</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Profile Views</dt>
                    <dd className="text-2xl font-semibold text-gray-900 mt-1">48</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
