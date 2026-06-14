import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../utils/api';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadProfileData() {
      try {
        const data = await getProfile();
        if (data) {
          setName(data.name || '');
          setEmail(data.email || '');
          setBio(data.profile?.bio || '');
          setPhone(data.profile?.phoneNumber || '');
        }
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    loadProfileData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const payload = {
        name,
        profile: {
          bio,
          phoneNumber: phone,
        },
      };

      const updated = await updateProfile(payload);
      
      // Update local context state so Navbar reflects new name
      const updatedUser = {
        ...user,
        name: updated.name,
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main>
        <div className="container text-center mt-4">
          <div className="spinner"></div> Loading profile...
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="container">
        <h1>My Profile</h1>
        <div className="card mt-4">
          <div className="card-body">
            <form id="profile-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullname">Full Name</label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  disabled
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="4"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? 'Updating...' : 'Update Profile'}
              </button>
              {error && (
                <div className="alert alert-error mt-4" id="error-message">
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success mt-4" id="success-message">
                  {success}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
