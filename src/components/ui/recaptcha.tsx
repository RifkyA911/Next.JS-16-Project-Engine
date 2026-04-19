"use client";

import ReCAPTCHA from "react-google-recaptcha";
import { useState, useEffect } from "react";

interface ReCAPTCHAProps {
  onChange: (token: string) => void;
  onError?: () => void;
  onExpired?: () => void;
}

export function ReCAPTCHAV3({ onChange, onError, onExpired }: ReCAPTCHAProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const loadScript = () => {
      if (typeof window !== 'undefined' && !(window as any).grecaptcha) {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY}`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          setScriptLoaded(true);
        };

        script.onerror = () => {
          console.error('Failed to load reCAPTCHA v3 script');
          onError?.();
        };

        document.head.appendChild(script);
      } else if ((window as any).grecaptcha) {
        setScriptLoaded(true);
      }
    };

    loadScript();
  }, [onError]);

  const executeRecaptcha = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).grecaptcha && scriptLoaded) {
        const token = await (window as any).grecaptcha.execute(
          process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY!,
          { action: 'login' }
        );
        onChange(token);
      } else {
        console.error('reCAPTCHA v3 not ready');
        onError?.();
      }
    } catch (error) {
      console.error('reCAPTCHA v3 execution failed:', error);
      onError?.();
    }
  };

  return (
    <div className="hidden">
      <button
        type="button"
        onClick={executeRecaptcha}
        className="hidden"
        id="recaptcha-v3-trigger"
        disabled={!scriptLoaded}
      />
    </div>
  );
}

export function ReCAPTCHAV2({ onChange, onError, onExpired }: ReCAPTCHAProps) {
  return (
    <ReCAPTCHA
      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY!}
      onChange={(token) => token && onChange(token)}
      onErrored={onError}
      onExpired={onExpired}
      size="invisible"
    />
  );
}

export function ReCAPTCHAWrapper({ onChange, onError, onExpired }: ReCAPTCHAProps) {
  const [useV3, setUseV3] = useState(true);
  const [v3Error, setV3Error] = useState(false);

  const handleV3Error = () => {
    console.warn('reCAPTCHA v3 failed, falling back to v2');
    setV3Error(true);
    setUseV3(false);
    onError?.();
  };

  const handleChange = (token: string) => {
    onChange(token);
  };

  // Execute v3 on component mount
  useEffect(() => {
    if (useV3 && !v3Error) {
      const timer = setTimeout(() => {
        const trigger = document.getElementById('recaptcha-v3-trigger') as HTMLButtonElement;
        if (trigger && !trigger.disabled) {
          trigger.click();
        }
      }, 2000); // Increased delay to ensure script loads
      return () => clearTimeout(timer);
    }
  }, [useV3, v3Error]);

  if (useV3 && !v3Error) {
    return <ReCAPTCHAV3 onChange={handleChange} onError={handleV3Error} onExpired={onExpired} />;
  }

  return <ReCAPTCHAV2 onChange={handleChange} onError={onError} onExpired={onExpired} />;
}
