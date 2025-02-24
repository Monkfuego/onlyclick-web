import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import axios from 'axios';

function SignUpContractor() {
  const location = useLocation();
  const navigate = useNavigate();

  // Generate a random contractor ID
  const generateRandomContractorId = () => {
    return `CON${Math.floor(Math.random() * 10000)}`; // Generates a random ID
  };

  const [contractorId, setContractorId] = useState(
    generateRandomContractorId()
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [role] = useState('contractor');

  useEffect(() => {
    if (location.state && location.state.phoneNumber) {
      setPhoneNumber(location.state.phoneNumber);
    }
  }, [location.state]);

  const onSubmit = async () => {
    const packet = {
      contractorId,
      name,
      email,
      password,
      phoneNumber,
      address,
      role,
    };

    try {
      const response = await axios.post('https://only-click-six.vercel.app/api/auth/register', packet);
      console.log(response);
    } catch (error) {
      console.error('There was an error registering the contractor!', error);
    }
  };

  return (
    <div className="h-max w-[100vw] flex flex-col">
      <div className="h-[20vh] w-full bg-gradient-to-b from-[#0192AD] to-[#002856] rounded-b-3xl flex flex-col justify-center items-center gap-2">
        <p className="text-4xl text-white font-semibold">CONTRACTOR</p>
        <p className="text-4xl text-white font-semibold">REGISTRATION</p>
      </div>
      <div>
        <Formik
          initialValues={{
            contractorId,
            phoneNumber,
            name,
            email,
            password,
            address,
          }}
          onSubmit={onSubmit}
        >
          {({ handleBlur, handleSubmit }) => (
            <form
              className="flex flex-col justify-center gap-7 items-center p-5"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-4">
                <label className="font-medium" htmlFor="contractorId">
                  Contractor ID
                </label>
                <input
                  className="w-[85vw] h-8 rounded-lg pl-3 py-1 bg-[#E2EFF2] focus:border-2 focus:border-[#0097b3] focus:outline-none"
                  type="text"
                  name="contractorId"
                  id="contractorId"
                  onChange={(e) => setContractorId(e.target.value)}
                  onBlur={handleBlur}
                  value={contractorId}
                  readOnly // Make it read-only if you don't want users to change it
                />
              </div>
              <div className="flex flex-col gap-4">
                <label className="font-medium" htmlFor="name">
                  Name
                </label>
                <input
                  className="w-[85vw] h-8 rounded-lg pl-3 py-1 bg-[#E2EFF2] focus:border-2 focus:border-[#0097b3] focus:outline-none"
                  type="text"
                  name="name"
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                  onBlur={handleBlur}
                  value={name}
                />
              </div>
              <div className="flex flex-col gap-4">
                <label className="font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-[85vw] h-8 rounded-lg pl-3 py-1 bg-[#E2EFF2] focus:border-2 focus:border-[#0097b3] focus:outline-none"
                  type="email"
                  name="email"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleBlur}
                  value={email}
                />
              </div>
              <div className="flex flex-col gap-4">
                <label className="font-medium" htmlFor="password">
                  Password
                </label>
                <input
                  className="w-[85vw] h-8 rounded-lg pl-3 py-1 bg-[#E2EFF2] focus:border-2 focus:border-[#0097b3] focus:outline-none"
                  type="password"
                  name="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handleBlur}
                  value={password}
                />
              </div>
              <div className="flex flex-col gap-4">
                <label className="font-medium" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input
                  className="w-[85vw] h-8 rounded-lg pl-3 py-1 bg-[#E2EFF2] focus:border-2 focus:border-[#0097b3] focus:outline-none"
                  type="text"
                  name="phoneNumber"
                  id="phoneNumber"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onBlur={handleBlur}
                  value={phoneNumber}
                />
              </div>
              <div className="flex flex-col gap-4">
                <label className="font-medium" htmlFor="address">
                  Address
                </label>
                <input
                  className="w-[85vw] h-8 rounded-lg pl-3 py-1 bg-[#E2EFF2] focus:border-2 focus:border-[#0097b3] focus:outline-none"
                  type="text"
                  name="address"
                  id="address"
                  onChange={(e) => setAddress(e.target.value)}
                  onBlur={handleBlur}
                  value={address}
                />
              </div>
              <button
                type="submit"
                className="bg-[#0097B3] w-[40vw] py-2 rounded-xl text-white font-lg"
              >
                Submit
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default SignUpContractor;
