import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Brain, Mail, Lock, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-4)',
      background: 'var(--gradient-hero)'
    }}>
      <div className="card animate-scaleIn" style={{
        width: '100%',
        maxWidth: 420,
        padding: 'var(--space-8)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-lg)',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Brain size={22} color="white" />
            </div>
            <span style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>MindFlow</span>
          </Link>
          <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>Welcome back</h1>
          <p style={{ margin: 0 }}>Sign in to continue your wellness journey</p>
        </div>

        {error && (
          <div className="badge badge-error" style={{ 
            marginBottom: 'var(--space-4)', 
            justifyContent: 'center',
            padding: 'var(--space-3)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <label htmlFor="email" style={{ 
              display: 'block', 
              fontSize: 'var(--text-sm)', 
              fontWeight: 500, 
              marginBottom: 'var(--space-2)' 
            }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ 
                position: 'absolute', 
                left: 'var(--space-4)', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'hsl(var(--color-text-muted))'
              }} />
              <input
                id="email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: 'calc(var(--space-4) + 26px)' }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" style={{ 
              display: 'block', 
              fontSize: 'var(--text-sm)', 
              fontWeight: 500, 
              marginBottom: 'var(--space-2)' 
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ 
                position: 'absolute', 
                left: 'var(--space-4)', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'hsl(var(--color-text-muted))'
              }} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: 'calc(var(--space-4) + 26px)', paddingRight: 'calc(var(--space-4) + 40px)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 'var(--space-4)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'hsl(var(--color-text-muted))'
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: 16, height: 16 }} />
              <span style={{ fontSize: 'var(--text-sm)' }}>Remember me</span>
            </label>
            <a href="#" style={{ fontSize: 'var(--text-sm)' }}>Forgot password?</a>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: 'var(--space-4)' }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="divider" style={{ margin: 'var(--space-6) 0' }} />

        <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', margin: 0 }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ fontWeight: 600 }}>Sign up</Link>
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default Login
