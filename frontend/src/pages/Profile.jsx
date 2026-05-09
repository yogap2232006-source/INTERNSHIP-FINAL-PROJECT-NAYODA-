import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Briefcase, Mail, Star } from 'lucide-react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

export default function Profile() {
  const { token, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
          setLoading(false);
          return;
      }
      try {
        const res = await axios.get('http://localhost:5000/api/profile', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  if (!profile) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Please log in to view your profile.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/dashboard" className="text-gray-500 hover:text-gray-900 flex items-center transition">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-2xl border border-gray-200 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-brand-400 to-brand-600 relative">
             <div className="absolute inset-0 bg-black/10"></div>
          </div>
          <div className="px-6 sm:px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="h-24 w-24 rounded-full border-4 border-white bg-brand-100 flex items-center justify-center text-4xl text-brand-700 font-bold shadow-sm">
                A
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition shadow-sm mr-2">
                Edit Profile
              </button>
              <button onClick={logout} className="px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition shadow-sm">
                Logout
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-brand-600 font-medium mt-1">{profile.profile?.title || profile.role}</p>
                
                <div className="mt-3 flex items-center text-sm text-gray-500 space-x-6">
                  <span className="flex items-center"><MapPin className="h-4 w-4 mr-1.5" /> {profile.profile?.location || 'Not set'}</span>
                  {profile.role === 'Freelancer' && <span className="flex items-center"><Briefcase className="h-4 w-4 mr-1.5" /> ${profile.profile?.hourlyRate || '0'}/hr</span>}
                  <span className="flex items-center"><Mail className="h-4 w-4 mr-1.5" /> {profile.email}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">About Me</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {profile.profile?.bio || 'No bio provided.'}
                </p>
              </div>

              {profile.role === 'Freelancer' && (
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.profile?.skills?.length > 0 ? profile.profile.skills.map(skill => (
                    <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-50 text-brand-700 border border-brand-200">
                      {skill}
                    </span>
                  )) : <span className="text-sm text-gray-500">No skills added yet.</span>}
                </div>
              </div>
              )}

              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Client Reviews</h2>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-bold text-gray-900">5.0</span>
                    <span className="ml-1 text-gray-500">(1 review)</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-gray-900 text-sm">TechVision Inc</p>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">"Excellent developer. Delivered the platform ahead of schedule and the code quality was top-notch. Highly recommended!"</p>
                    <p className="text-xs text-gray-400 mt-2">Just now • Completed Project: E-commerce Platform</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
