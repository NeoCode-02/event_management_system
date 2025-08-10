import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ToastProvider';

export function VerifyEmailPage() {
  const { verify, resendCode } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const initialEmail = location?.state?.email ?? localStorage.getItem('ems_email') ?? '';
  const [email, setEmail] = React.useState(initialEmail);
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      await verify(email, code);
      showToast('Email verified. You can now login.', 'success');
      navigate('/login');
    } catch (e: any) {
      setError(e.message ?? 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    setError(null);
    try {
      await resendCode(email);
      showToast('Verification code resent.', 'success');
    } catch (e: any) {
      setError(e.message ?? 'Failed to resend');
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Verify your email</h1>
      <p className="muted">Enter the 6-digit code sent to your email.</p>
      {error && <div className="card">{error}</div>}
      <form className="form" onSubmit={onSubmit}>
        <div className="field">
          <label>Email</label>
          <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Verification code</label>
          <input className="input" value={code} onChange={(e) => setCode(e.target.value)} minLength={6} required />
        </div>
        <div className="actions">
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Loading...' : 'Verify'}</button>
          <button className="btn secondary" type="button" onClick={onResend}>Resend code</button>
        </div>
      </form>
    </div>
  );
}


