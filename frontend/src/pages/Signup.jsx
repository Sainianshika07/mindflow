import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Brain, Mail, Lock, User, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { signup } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      await signup(name, email, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Failed to create account. Please try again.')
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
        maxWidth: 440,
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
          <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>Create your account</h1>
          <p style={{ margin: 0 }}>Start your mental wellness journey today</p>
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
            <label htmlFor="name" style={{ 
              display: 'block', 
              fontSize: 'var(--text-sm)', 
              fontWeight: 500, 
              marginBottom: 'var(--space-2)' 
            }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ 
                position: 'absolute', 
                left: 'var(--space-4)', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'hsl(var(--color-text-muted))'
              }} />
              <input
                id="name"
                type="text"
                className="input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ paddingLeft: 'calc(var(--space-4) + 26px)' }}
              />
            </div>
          </div>

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
                placeholder="Create a password"
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

          <div>
            <label htmlFor="confirmPassword" style={{ 
              display: 'block', 
              fontSize: 'var(--text-sm)', 
              fontWeight: 500, 
              marginBottom: 'var(--space-2)' 
            }}>
              Confirm Password
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
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                className="input"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ paddingLeft: 'calc(var(--space-4) + 26px)' }}
              />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', cursor: 'pointer' }}>
            <input type="checkbox" style={{ width: 16, height: 16, marginTop: 2 }} required />
            <span style={{ fontSize: 'var(--text-sm)' }}>
              I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </span>
          </label>

          <button 
            type="submit" 
            className="btn btn-gradient"
            disabled={loading}
            style={{ width: '100%', padding: 'var(--space-4)' }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="divider" style={{ margin: 'var(--space-6) 0' }} />

        <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', margin: 0 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
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

export default Signup
