import { useMutation } from '@apollo/react-hooks';
import { useState } from 'react';
import { REQ_OTP, VERIFY_OTP } from '../../components/GraphQL';


const useOtpHook = () => {
  const [error, setError] = useState(null);
  const [_reqOtp] = useMutation(REQ_OTP);
  const [_verifyOtp] = useMutation(VERIFY_OTP);

  const reqOtp = async (phoneNum) => {
    try {
      setError(null);
      const { data } = await _reqOtp({
        variables: {
            input:{
                phoneNumber: phoneNum,
            }
        },
      });
      if (data && data.generateOtpCode) {
        const res = data.generateOtpCode;
        if (res.success) {
          return res.data
        } else if(res.success === false) {
          setError(res.message);
        } else {
          setError('Oops something when wrong');
        }
      }
      return null;
    } catch (err) {
      setError('Oops something when wrong');
    }
  };

  const verifyOtp = async (otpCode, CodeUuid) => {
    try {
      setError(null);
      const { data } = await _verifyOtp({
        variables: {
            input:{
              code: otpCode,
              uuid: CodeUuid,
            }
        },
      });
      if (data && data.verifyOtpCode) {
        const res = data.verifyOtpCode;
        if(res.success){
          return res.success
        } else if(res.success === false) {
          setError(res.message);
        } else {
          setError('Oops something when wrong');
        }
      }
      return null
    } catch (err) {
      setError('Oops something when wrong');
    }
  }

  return {
    error,
    reqOtp,
    verifyOtp,
  }
};


export default useOtpHook;