import React, { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../../utils/context/Context';
import Header from '../User/Components/Header';
import { FaPlusCircle, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Footer from '../User/Components/Footer';
import OTPInput from 'react-otp-input';
import axios from 'axios';

// Validation Utilities
const isValidPhoneNumber = (phone) => {
  return true;
};

function ContractorProfile() {
  // Context and Navigation
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // State Management
  const [workers, setWorkers] = useState([]);
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);

  // Worker Form States
  const [workerName, setWorkerName] = useState('');
  const [workerPhoneNumber, setWorkerPhone] = useState('');

  // Profile States
  const [username, setUsername] = useState(user?.name || 'John Doe');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [secondaryPhone, setSecondaryPhone] = useState('');
  const [address, setAddress] = useState(
    user?.address ||
      'Vit Ap, University, Near Vandalur Zoo, Chennai, Tamil Nadu, India, 600127'
  );

  // OTP States
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Error and Loading States
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch Workers Function (Memoized)
  const fetchWorkers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://only-click-six.vercel.app/api/taskmaster/getProfiles', {
        params: {
          role: 'all',
          contractorId: user?.id,
        },
      });

      if (response.data.statusCode === 200) {
        setWorkers(response.data.data || []);
      } else {
        setError('Failed to fetch workers');
      }
    } catch (error) {
      console.error('Error fetching workers:', error);
      setError('An error occurred while fetching workers');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Fetch Workers on Component Mount
  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  // Add Worker Handler
  // Add Worker Handler
  const handleAddWorker = async (e) => {
    e.preventDefault();

    // Comprehensive Validation
    if (!workerName.trim()) {
      setError('Worker name is required');
      return;
    }

    if (!isValidPhoneNumber(workerPhoneNumber)) {
      setError('Invalid worker phone number');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('https://only-click-six.vercel.app/api/taskmaster/createProfile', {
        name: workerName,
        phoneNumber: workerPhoneNumber,
        contractorId: '67b61b511bf7eb298ccec4b8', // Use dynamic contractorId from context
        role: ['Plumber'], // Keep role if required by backend
      });

      console.log(response.data);
      if (response.data.statusCode === 201) {
        // Refresh workers list after successful addition

        setWorkerName('');
        setWorkerPhone('');
        setIsAddWorkerOpen(false);
        setError('');
        await fetchWorkers();
      } else {
        setError(response.data.message || 'Failed to add worker');
      }
    } catch (error) {
      console.error('Error adding worker:', error);
      setError(
        error.response?.data?.message || 'An error occurred while adding worker'
      );
    } finally {
      setLoading(false);
    }
  };

  // Send OTP Handler
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!isValidPhoneNumber(secondaryPhone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('https://only-click-six.vercel.app/api/otp/send', {
        phoneNumber: secondaryPhone,
      });

      if (response.data.success) {
        setOtpSent(true);
        setError('');
      } else {
        setError(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('An error occurred while sending OTP');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP Handler
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('https://only-click-six.vercel.app/api/otp/verify', {
        phoneNumber: secondaryPhone,
        otp: otp,
      });

      if (response.data.success) {
        alert('Phone number verified successfully');
        setOtpSent(false);
        setSecondaryPhone('');
        setOtp('');
        setError('');
      } else {
        setError(response.data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('An error occurred while verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col gap-4">
      {/* Header */}
      <Header username={username} address={address} />

      {/* Navigation */}
      <div className="w-full px-4 py-2 flex items-center gap-4">
        <FaArrowLeft
          className="text-2xl cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h2 className="text-black font-bold text-2xl">Profile</h2>
      </div>

      {/* Profile Details */}
      <div className="w-full px-4 flex flex-col gap-5">
        {/* Profile Image and Name */}
        <div className="flex w-full justify-between items-center">
          <img
            src="/assets/image.jpg"
            className="bg-slate-400 w-[25vw] h-[25vw] rounded-full object-cover"
            alt="Profile"
          />
          <div className="w-[70vw] text-4xl font-bold text-center">
            {username}
          </div>
        </div>

        {/* Contact Details */}
        <div className="w-full bg-slate-100 p-5 rounded-lg">
          <p className="mb-2">
            <span className="font-bold mr-4">Phone Number:</span>
            +91 {phoneNumber}
          </p>
          <div className="flex">
            <p className="font-bold mr-4">Address:</p>
            <p className="leading-relaxed tracking-wide">{address}</p>
          </div>
        </div>
      </div>

      {/* Workers Section */}
      <div className="w-full bg-slate-200 px-3 py-4 flex flex-col gap-4">
        {/* Workers Header */}
        <div className="flex justify-between items-center px-4">
          <h3 className="font-semibold text-2xl text-[#0097b3]">Workers</h3>
          <FaPlusCircle
            className="text-2xl cursor-pointer"
            onClick={() => setIsAddWorkerOpen(!isAddWorkerOpen)}
          />
        </div>

        {/* Add Worker Form */}
        {isAddWorkerOpen && (
          <div className="px-4">
            <form
              onSubmit={handleAddWorker}
              className="bg-white p-4 rounded-lg"
            >
              <input
                type="text"
                placeholder="Worker Name"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                className="w-full p-2 border rounded mb-2"
                required
              />
              <input
                type="tel"
                placeholder="Worker Phone Number"
                value={workerPhoneNumber}
                onChange={(e) => setWorkerPhone(e.target.value)}
                className="w-full p-2 border rounded mb-2"
                required
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="w-[48%] py-2 bg-[#0192AD] text-white rounded"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add'}
                </button>
                <button
                  type="button"
                  className="w-[48%] py-2 bg-gray-300 text-black rounded"
                  onClick={() => setIsAddWorkerOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Workers List */}
        <div className="px-4 space-y-2">
          {workers.map((worker, index) => (
            <div key={index} className="bg-white p-3 rounded-lg">
              <p className="font-semibold">{worker.name}</p>
              <p className="text-gray-500">{worker.phoneNumber}</p>
            </div>
          ))}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 text-center">{error}</div>
        )}

        {/* Secondary Phone Number */}
        <form onSubmit={handleSendOTP} className="px-4 flex flex-col gap-4">
          <label className="font-medium">Enter Secondary Phone Number</label>
          <input
            type="tel"
            placeholder="10 digit phone number"
            value={secondaryPhone}
            onChange={(e) => setSecondaryPhone(e.target.value)}
            maxLength={10}
            className="w-full h-12 rounded-lg text-center"
            required
          />
          <button
            type="submit"
            className="bg-[#0192AD] text-white w-full h-12 rounded-lg"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>

        {/* OTP Verification */}
        {otpSent && (
          <div className="px-4 flex flex-col gap-4">
            <label className="font-medium">Enter OTP</label>
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span className="mx-1">-</span>}
              renderInput={(props) => (
                <input {...props} className="w-10 text-center border" />
              )}
            />
            <button
              onClick={handleVerifyOTP}
              className="bg-[#0192AD] text-white w-full h-12 rounded-lg"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default ContractorProfile;
