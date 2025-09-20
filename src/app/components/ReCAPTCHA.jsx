"use client";

import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function ReCAPTCHAComponent({ onVerify, onError }) {
  const [isVerified, setIsVerified] = useState(false);
  const recaptchaRef = useRef(null);

  const handleRecaptchaChange = (value) => {
    if (value) {
      setIsVerified(true);
      onVerify(value);
    } else {
      setIsVerified(false);
    }
  };

  const handleRecaptchaError = () => {
    setIsVerified(false);
    if (onError) {
      onError("reCAPTCHA verification failed");
    }
  };

  const resetRecaptcha = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
      setIsVerified(false);
    }
  };

  return (
    <div className="flex justify-center my-4">
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        onChange={handleRecaptchaChange}
        onErrored={handleRecaptchaError}
        onExpired={handleRecaptchaError}
        theme="dark"
        size="normal"
      />
    </div>
  );
}

export { ReCAPTCHAComponent };
