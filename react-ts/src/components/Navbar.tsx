import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, LogIn, LogOut, PlusCircle, User, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-semibold text-gray-900">EventHub</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/events/create"
                  className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>Create Event</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600"
                >
                  <User className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Sign Up</span>
                </Link>
                <Link
                  to="/login"
                  className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;