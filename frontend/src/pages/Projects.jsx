import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, DollarSign, Clock, Filter } from 'lucide-react';
import axios from 'axios';

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/projects');
        setProjects(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load projects');
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-brand-600">SkillSphere</span>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <Link to="/dashboard" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/projects" className="border-brand-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Find Work
                </Link>
              </div>
            </div>
            <div className="flex items-center">
                <Link to="/profile" className="flex items-center ml-2">
                  <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold border border-brand-200">
                    A
                  </div>
                </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        {/* Left Sidebar Filters */}
        <aside className="w-64 hidden lg:block flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center"><input type="checkbox" className="rounded text-brand-600 focus:ring-brand-500" /> <span className="ml-2 text-sm text-gray-600">Web Development</span></label>
                  <label className="flex items-center"><input type="checkbox" className="rounded text-brand-600 focus:ring-brand-500" /> <span className="ml-2 text-sm text-gray-600">Mobile Apps</span></label>
                  <label className="flex items-center"><input type="checkbox" className="rounded text-brand-600 focus:ring-brand-500" /> <span className="ml-2 text-sm text-gray-600">Design</span></label>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Budget</h3>
                <div className="space-y-2">
                  <label className="flex items-center"><input type="checkbox" className="rounded text-brand-600 focus:ring-brand-500" /> <span className="ml-2 text-sm text-gray-600">Less than $1k</span></label>
                  <label className="flex items-center"><input type="checkbox" className="rounded text-brand-600 focus:ring-brand-500" /> <span className="ml-2 text-sm text-gray-600">$1k - $5k</span></label>
                  <label className="flex items-center"><input type="checkbox" className="rounded text-brand-600 focus:ring-brand-500" /> <span className="ml-2 text-sm text-gray-600">$5k+</span></label>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="mb-6 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search projects by keywords..." 
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {loading && <div className="text-center py-8 text-gray-500">Loading projects...</div>}
            {error && <div className="text-center py-8 text-red-500">{error}</div>}
            {!loading && !error && filteredProjects.length === 0 && (
              <div className="text-center py-8 text-gray-500">No projects found.</div>
            )}
            {filteredProjects.map(project => (
              <div key={project._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <Link to={`/projects/${project._id}`} className="text-xl font-bold text-gray-900 hover:text-brand-600 transition">
                      {project.title}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">Posted recently by {project.client?.name || 'Client'}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mt-4 text-sm leading-relaxed line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 mt-5 text-sm text-gray-500">
                  <div className="flex items-center text-gray-700 font-medium">
                    <DollarSign className="h-4 w-4 text-brand-600 mr-1" />
                    Est. Budget: ${project.budget}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {project.location || 'Remote'}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Long-term
                  </div>
                </div>

                <div className="mt-5 pt-5 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex gap-2">
                    {project.skillsRequired?.map(skill => (
                      <span key={skill} className="px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <Link to={`/projects/${project._id}`} className="text-sm font-medium text-brand-600 hover:text-brand-700 transition">
                    View Details &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
