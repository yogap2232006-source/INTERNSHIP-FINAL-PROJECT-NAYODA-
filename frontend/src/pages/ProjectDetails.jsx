import { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, Clock, Send, Shield, CheckCircle } from 'lucide-react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

export default function ProjectDetails() {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handlePayment = async () => {
    try {
      // Ensure projectId is a valid MongoDB ObjectId (24 chars) even if we are on a mock route like /projects/1
      const validProjectId = id.length === 24 ? id : "507f1f77bcf86cd799439011";

      const res = await fetch('http://localhost:5000/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ amount: 500, projectId: validProjectId })
      });
      
      const order = await res.json();

      if (!res.ok) {
        throw new Error(order.message || 'Authentication failed or Server Error. Make sure you are logged in as a Client!');
      }

      const scriptLoaded = await new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      if (!scriptLoaded) throw new Error('Razorpay SDK failed to load');

      const options = {
        key: "rzp_test_Sn00srcSNz2YO4", 
        amount: order.amount,
        currency: order.currency,
        name: "SkillSphere Escrow",
        description: "Fund Project Escrow",
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await fetch('http://localhost:5000/api/payments/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            })
          });
          const result = await verifyRes.json();
          if(result.message === 'Payment verified successfully') {
             setPaymentStatus('Paid');
             alert('Payment Successful!');
          }
        },
        theme: { color: "#2563eb" }
      };
      
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert(`Payment failed to initialize: ${error.message}`);
    }
  };
  const [bidAmount, setBidAmount] = useState('');
  const [estimatedDays, setEstimatedDays] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proposalSuccess, setProposalSuccess] = useState('');
  const [proposalError, setProposalError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const validProjectId = id.length === 24 ? id : "507f1f77bcf86cd799439011";
        const res = await axios.get(`http://localhost:5000/api/projects/${validProjectId}`);
        setProject(res.data);
      } catch (err) {
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    if (!token) {
        setProposalError('You must be logged in to submit a proposal.');
        return;
    }
    setProposalError('');
    setProposalSuccess('');
    setIsSubmitting(true);
    
    try {
      const validProjectId = id.length === 24 ? id : "507f1f77bcf86cd799439011";
      await axios.post('http://localhost:5000/api/proposals', {
        projectId: validProjectId,
        bidAmount: Number(bidAmount),
        estimatedDays: Number(estimatedDays),
        coverLetter
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProposalSuccess('Proposal submitted successfully!');
      setBidAmount('');
      setEstimatedDays('');
      setCoverLetter('');
    } catch (err) {
      setProposalError(err.response?.data?.message || 'Failed to submit proposal');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  if (error || !project) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-500">{error || 'Project not found'}</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/projects" className="text-gray-500 hover:text-gray-900 flex items-center transition">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Projects
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Project Details Left Side */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
            <p className="text-sm text-gray-500 mt-2">Posted recently by <span className="font-medium text-brand-600">{project.client?.name || 'Client'}</span></p>

            <div className="flex flex-wrap items-center gap-6 mt-6 py-6 border-y border-gray-100">
              <div className="flex items-center text-gray-700">
                <div className="bg-brand-50 p-2 rounded-lg mr-3 border border-brand-100">
                  <DollarSign className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Budget</p>
                  <p className="font-semibold text-gray-900">${project.budget}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <div className="bg-blue-50 p-2 rounded-lg mr-3 border border-blue-100">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Location</p>
                  <p className="font-semibold text-gray-900">{project.location}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <div className="bg-purple-50 p-2 rounded-lg mr-3 border border-purple-100">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Duration</p>
                  <p className="font-semibold text-gray-900">Long-term</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Project Description</h2>
              <div className="prose prose-brand max-w-none text-gray-600 whitespace-pre-line leading-relaxed text-sm sm:text-base">
                {project.description}
              </div>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {project.skillsRequired?.map(skill => (
                  <span key={skill} className="px-4 py-2 rounded-full bg-gray-50 text-gray-700 border border-gray-200 text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Proposal Right Side */}
        <aside className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Submit a Proposal</h2>
            
            <form onSubmit={handleSubmitProposal} className="space-y-5">
              {proposalError && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{proposalError}</div>}
              {proposalSuccess && <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm">{proposalSuccess}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bid Amount ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-500 focus:border-brand-500"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Days to Complete</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-500 focus:border-brand-500"
                    value={estimatedDays}
                    onChange={(e) => setEstimatedDays(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
                <textarea
                  required
                  rows="6"
                  placeholder="Explain why you are the best fit for this project. Include examples of past work..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-500 focus:border-brand-500 resize-none text-sm"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition disabled:opacity-70"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
                {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
              </button>
            </form>

            {/* Escrow Payment Action (Mock Client View) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-200 mt-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 to-blue-400"></div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                <Shield className="h-5 w-5 text-brand-600 mr-2" /> Fund Escrow
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Securely fund this project. The payment will be held in escrow and released to the freelancer upon completion.
              </p>
              {paymentStatus === 'Paid' ? (
                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-200 flex items-center justify-center font-medium">
                  <CheckCircle className="h-5 w-5 mr-2" /> Funded Successfully
                </div>
              ) : (
                <button onClick={handlePayment} className="w-full bg-brand-600 text-white font-medium py-3 px-4 rounded-xl hover:bg-brand-700 transition shadow-sm hover:shadow-md flex justify-center items-center">
                  Pay via Razorpay
                </button>
              )}
            </div>

          </div>
        </aside>

      </main>
    </div>
  );
}
