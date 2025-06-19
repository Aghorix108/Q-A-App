import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout, adminUser } = useAuth();
  const navigate = useNavigate();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white shadow-lg transition-all duration-300 ease-in-out fixed h-full z-10`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className={`font-bold text-blue-600 ${!isSidebarOpen && 'hidden'}`}>Admin Portal</h1>
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <svg 
              className="w-6 h-6 text-gray-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Admin user info */}
        {isSidebarOpen && adminUser && (
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {adminUser.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">{adminUser.name || 'Admin User'}</p>
                <p className="text-xs text-gray-500">{adminUser.email || ''}</p>
              </div>
            </div>
          </div>
        )}
        
        <nav className="mt-6">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => 
              `flex items-center py-3 px-4 ${
                isActive ? 'bg-blue-50 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
              } ${!isSidebarOpen && 'justify-center'}`
            }
            end
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            <span className={`ml-4 font-medium ${!isSidebarOpen && 'hidden'}`}>Dashboard</span>
          </NavLink>
          
          <NavLink
            to="/dashboard/submissions"
            className={({ isActive }) => 
              `flex items-center py-3 px-4 ${
                isActive ? 'bg-blue-50 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
              } ${!isSidebarOpen && 'justify-center'}`
            }
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 000-2H7zm3 0a1 1 0 000 2h3a1 1 0 000-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            <span className={`ml-4 font-medium ${!isSidebarOpen && 'hidden'}`}>Submissions</span>
          </NavLink>
          
          <NavLink
            to="/dashboard/questions"
            className={({ isActive }) => 
              `flex items-center py-3 px-4 ${
                isActive ? 'bg-blue-50 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
              } ${!isSidebarOpen && 'justify-center'}`
            }
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span className={`ml-4 font-medium ${!isSidebarOpen && 'hidden'}`}>Questions</span>
          </NavLink>
          
          <div className="mt-auto absolute bottom-0 w-full border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className={`flex items-center text-red-500 hover:text-red-600 ${!isSidebarOpen && 'justify-center'}`}
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              <span className={`ml-4 font-medium ${!isSidebarOpen && 'hidden'}`}>Logout</span>
            </button>
          </div>
        </nav>
      </div>
      
      {/* Main content */}
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 ease-in-out`}>
        <header className="bg-white shadow-sm py-4 px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
            {adminUser && (
              <div className="text-sm text-gray-600">
                <span className="hidden sm:inline">Welcome, </span>
                <span className="font-medium">{adminUser.name || 'Admin'}</span>
              </div>
            )}
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
