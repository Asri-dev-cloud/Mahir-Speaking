import React, { useEffect, useRef, useState } from 'react';

/**
 * GoogleSignInButton Component
 * Renders the official Google Sign-In Button using Google Identity Services (GIS) SDK.
 * 
 * @param {Object} props
 * @param {Function} props.onSuccess - Callback triggered with user data from backend on successful login
 * @param {Function} props.onFailure - Callback triggered when login fails or errors out
 * @param {string} props.theme - Button theme: 'outline' (default), 'filled_blue', or 'filled_black'
 * @param {string} props.size - Button size: 'large' (default), 'medium', or 'small'
 */
export default function GoogleSignInButton({ 
  onSuccess, 
  onFailure, 
  theme = 'outline', 
  size = 'large' 
}) {
  const buttonRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasClientId, setHasClientId] = useState(true);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      setHasClientId(false);
      return;
    }

    setHasClientId(true);

    // Helper function to initialize Google Sign-In
    const initializeGoogleSignIn = () => {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          cancel_on_tap_outside: true,
        });

        if (buttonRef.current) {
          window.google.accounts.id.renderButton(buttonRef.current, {
            theme: theme,
            size: size,
            width: '100%', // Makes button responsive
          });
        }
      } catch (err) {
        console.error('Gagal menginisialisasi tombol Google:', err);
        setError('Gagal memuat tombol masuk Google.');
        if (onFailure) onFailure(err);
      }
    };

    // Callback when Google returns the credential (id_token)
    const handleCredentialResponse = async (response) => {
      setLoading(true);
      setError(null);
      
      const idToken = response.credential;
      if (!idToken) {
        const errorMsg = 'Tidak menerima token identitas (ID Token) dari Google.';
        setError(errorMsg);
        setLoading(false);
        if (onFailure) onFailure(new Error(errorMsg));
        return;
      }

      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          if (onSuccess) {
            onSuccess(data);
          }
        } else {
          throw new Error(data.message || 'Autentikasi backend gagal.');
        }
      } catch (err) {
        console.error('Error saat verifikasi token ke backend:', err);
        setError(err.message || 'Gagal terhubung dengan server.');
        if (onFailure) onFailure(err);
      } finally {
        setLoading(false);
      }
    };

    // Load GIS SDK Script dynamically if not already present
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initializeGoogleSignIn();
      };
      script.onerror = () => {
        const errorMsg = 'Gagal memuat SDK Google Sign-In.';
        setError(errorMsg);
        if (onFailure) onFailure(new Error(errorMsg));
      };
      document.head.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }
  }, [theme, size, onSuccess, onFailure]);

  if (!hasClientId) {
    return (
      <div className="w-full text-center p-3.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-bold leading-normal">
        ℹ️ Login Google belum dikonfigurasi. Harap atur VITE_GOOGLE_CLIENT_ID di file .env untuk mengaktifkan masuk lewat Google Cloud.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-2">
      {/* Container di mana GIS SDK akan merender tombol resmi Google secara aman */}
      <div 
        ref={buttonRef} 
        className="w-full min-h-[40px] flex justify-center items-center"
      />

      {/* Tampilan Loading */}
      {loading && (
        <span className="text-xs text-slate-500 font-semibold animate-pulse">
          Memproses autentikasi...
        </span>
      )}

      {/* Tampilan Error */}
      {error && (
        <div className="text-xs text-red-500 font-bold bg-red-50 border border-red-200 px-3 py-2 rounded-xl text-center">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
