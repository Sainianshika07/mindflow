import { Link } from 'react-router-dom'
import { 
  Brain, Heart, Activity, Moon, TrendingUp, Shield, 
  ChevronRight, Star, Check, Menu, X, Sparkles, Smile, Users
} from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()

  const features = [
    {
      icon: Brain,
      title: 'Mood Tracking',
      description: 'Track your emotional journey with intuitive daily check-ins and visual insights.'
    },
    {
      icon: Heart,
      title: 'Gratitude Journal',
      description: 'Cultivate positivity with guided prompts and reflective writing exercises.'
    },
    {
      icon: Activity,
      title: 'Habit Building',
      description: 'Build lasting habits with streaks, reminders, and progress celebrations.'
    },
    {
      icon: Moon,
      title: 'Sleep Analysis',
      description: 'Monitor sleep patterns and discover what helps you rest better.'
    },
    {
      icon: TrendingUp,
      title: 'Progress Insights',
      description: 'Beautiful charts reveal patterns and progress over time.'
    },
    {
      icon: Shield,
      title: 'Private & Secure',
      description: 'Your mental health data stays yours with end-to-end encryption.'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Designer',
      content: 'MindFlow has transformed how I understand my emotions. The insights helped me identify triggers I never knew existed.',
      rating: 5
    },
    {
      name: 'Michael Torres',
      role: 'Software Engineer',
      content: 'The habit tracking feature is incredible. I\'ve maintained a 30-day meditation streak for the first time in my life.',
      rating: 5
    },
    {
      name: 'Emily Watson',
      role: 'Marketing Manager',
      content: 'Beautiful design, thoughtful features. It feels like having a supportive companion throughout my mental health journey.',
      rating: 5
    }
  ]

  const stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '2M+', label: 'Moods Tracked' },
    { value: '4.9', label: 'App Rating' },
    { value: '98%', label: 'Satisfaction' }
  ]

  return (
    <div className="landing">
      <nav className="navbar glass" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: 'var(--space-4) 0',
        borderBottom: '1px solid hsl(var(--color-border) / 0.5)'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-lg)',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Brain size={20} color="white" />
            </div>
            <span style={{ 
              fontSize: 'var(--text-xl)', 
              fontWeight: 700,
              color: 'hsl(var(--color-text-primary))'
            }}>MindFlow</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }} className="nav-links">
            <a href="#features" className="btn btn-ghost">Features</a>
            <a href="#testimonials" className="btn btn-ghost">Stories</a>
            <Link to="/login" className="btn btn-ghost">Sign In</Link>
            <Link to="/signup" className="btn btn-primary">Get Started</Link>
          </div>

          <button 
            className="btn btn-ghost mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            style={{ display: 'none' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu glass" style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            padding: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)'
          }}>
            <a href="#features" className="btn btn-ghost" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#testimonials" className="btn btn-ghost" onClick={() => setMobileMenuOpen(false)}>Stories</a>
            <Link to="/login" className="btn btn-ghost" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
            <Link to="/signup" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
          </div>
        )}
      </nav>

      <section className="hero" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 'calc(var(--space-24) + 60px)',
        paddingBottom: 'var(--space-24)',
        background: 'var(--gradient-hero)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <div className="badge animate-fadeIn" style={{ marginBottom: 'var(--space-6)' }}>
              <Sparkles size={14} />
              <span>Your mental wellness companion</span>
            </div>
            
            <h1 className="animate-slideUp" style={{ 
              marginBottom: 'var(--space-6)',
              animationDelay: '0.1s',
              opacity: 0
            }}>
              Understand Your Mind,
              <br />
              <span className="text-gradient">Transform Your Life</span>
            </h1>
            
            <p className="animate-slideUp" style={{ 
              fontSize: 'var(--text-lg)',
              marginBottom: 'var(--space-8)',
              maxWidth: 600,
              margin: '0 auto var(--space-8)',
              animationDelay: '0.2s',
              opacity: 0
            }}>
              MindFlow helps you track moods, build healthy habits, and gain insights 
              into your emotional patterns — all in a beautiful, private space.
            </p>
            
            <div className="animate-slideUp" style={{ 
              display: 'flex', 
              gap: 'var(--space-4)', 
              justifyContent: 'center',
              flexWrap: 'wrap',
              animationDelay: '0.3s',
              opacity: 0
            }}>
              <Link to="/signup" className="btn btn-gradient" style={{ padding: 'var(--space-4) var(--space-8)' }}>
                Start Your Journey
                <ChevronRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: 'var(--space-4) var(--space-8)' }}>
                Sign In
              </Link>
            </div>

            <div className="animate-slideUp" style={{
              marginTop: 'var(--space-12)',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'var(--space-8)',
              animationDelay: '0.4s',
              opacity: 0
            }}>
              {stats.map((stat, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: 'var(--text-3xl)', 
                    fontWeight: 800,
                    color: 'hsl(var(--color-text-primary))'
                  }}>{stat.value}</div>
                  <div style={{ 
                    fontSize: 'var(--text-sm)',
                    color: 'hsl(var(--color-text-muted))'
                  }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'hsl(var(--color-primary) / 0.1)',
          filter: 'blur(80px)',
          animation: 'float 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'hsl(var(--color-secondary) / 0.1)',
          filter: 'blur(80px)',
          animation: 'float 6s ease-in-out infinite',
          animationDelay: '2s'
        }} />
      </section>

      {/* 4-Step Ecosystem Pathway Section */}
      <section id="pathway" style={{
        padding: 'var(--space-24) 0',
        background: 'var(--gradient-subtle)',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid hsl(var(--color-border) / 0.5)'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
            <span className="badge" style={{ marginBottom: 'var(--space-4)' }}>THE CORE JOURNEY</span>
            <h2 style={{ marginBottom: 'var(--space-4)' }}>
              Your Pathway to
              <br />
              <span className="text-gradient">Complete Mental Wellness</span>
            </h2>
            <p style={{ fontSize: 'var(--text-lg)', maxWidth: 600, margin: '0 auto', color: 'hsl(var(--color-text-secondary))' }}>
              We guide you step-by-step from secure authentication to everyday tracking, evidence-based solution tools, and professional care.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--space-6)',
            position: 'relative'
          }}>
            {[
              {
                step: '01',
                title: 'Secure Portal (Login)',
                subtitle: 'First, establish your space',
                description: 'Log in to your private vault. Your data is end-to-end encrypted and safeguarded with authentication protocols, keeping your reflections fully private.',
                icon: Shield,
                color: 'hsl(var(--color-primary))'
              },
              {
                step: '02',
                title: 'Mental Health Tracking',
                subtitle: 'Then, log feelings & metrics',
                description: 'Uncover patterns and indicators. Log your daily moods, private journals, sleep quality, and express gratitude on cards that compile into rich visual trends.',
                icon: Smile,
                color: 'hsl(var(--color-secondary))'
              },
              {
                step: '03',
                title: 'Proactive Solution Tools',
                subtitle: 'Next, apply clinical methods',
                description: 'Improve daily state with actionable coping strategies: CBT reframing of negative distortions, guided breathing patterns, habits tracking, and custom goals.',
                icon: Brain,
                color: 'hsl(var(--color-success))'
              },
              {
                step: '04',
                title: 'Therapist Matchmaking',
                subtitle: 'Finally, professional help',
                description: 'When self-care exercises require a professional touch, instantly get matched with licensed therapist recommendations based on your mood logs and filters.',
                icon: Users,
                color: 'hsl(45 90% 55%)'
              }
            ].map((path, i) => {
              const PathIcon = path.icon;
              return (
                <div key={i} className="card animate-fadeIn" style={{
                  position: 'relative',
                  padding: 'var(--space-6)',
                  background: 'hsl(var(--color-surface))',
                  border: `1px solid hsl(var(--color-border))`,
                  borderRadius: 'var(--radius-2xl)',
                  transition: 'all var(--duration-medium) var(--ease-default)',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  e.currentTarget.style.borderColor = path.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'hsl(var(--color-border))';
                }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    fontSize: 'var(--text-6xl)',
                    fontWeight: 900,
                    color: `${path.color}08`,
                    userSelect: 'none',
                    lineHeight: 1
                  }}>
                    {path.step}
                  </div>
                  
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-xl)',
                    background: `${path.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-4)'
                  }}>
                    <PathIcon size={24} color={path.color} />
                  </div>

                  <span style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: path.color,
                    letterSpacing: '0.05em',
                    display: 'block',
                    marginBottom: 'var(--space-1)'
                  }}>
                    {path.subtitle}
                  </span>
                  
                  <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-3)' }}>
                    {path.title}
                  </h3>
                  
                  <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-secondary))', lineHeight: 1.6 }}>
                    {path.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="features" className="features" style={{
        padding: 'var(--space-24) 0',
        background: 'hsl(var(--color-surface))'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
            <h2 style={{ marginBottom: 'var(--space-4)' }}>
              Everything You Need for
              <br />
              <span className="text-gradient">Mental Wellness</span>
            </h2>
            <p style={{ fontSize: 'var(--text-lg)', maxWidth: 600, margin: '0 auto' }}>
              Science-backed tools designed to help you understand and improve your mental health.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-6)'
          }}>
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="card card-interactive"
                style={{
                  animationDelay: `${i * 0.1}s`
                }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-4)'
                }}>
                  <feature.icon size={24} color="white" />
                </div>
                <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>
                  {feature.title}
                </h3>
                <p style={{ margin: 0 }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{
        padding: 'var(--space-24) 0',
        background: 'var(--gradient-subtle)'
      }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: 'var(--space-16)',
            alignItems: 'center'
          }}>
            <div>
              <h2 style={{ marginBottom: 'var(--space-6)' }}>
                Track Your Mood,
                <br />
                <span className="text-gradient">Discover Yourself</span>
              </h2>
              <p style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-6)' }}>
                Our intuitive mood tracker helps you identify patterns and triggers 
                in your emotional life, empowering you to make positive changes.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {[
                  'Quick daily check-ins with emoji-based tracking',
                  'Weekly and monthly trend analysis',
                  'Personalized insights and recommendations',
                  'Private notes for reflection'
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{
                      width: 24,
                      height: 24,
                      borderRadius: 'var(--radius-full)',
                      background: 'hsl(var(--color-success) / 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Check size={14} color="hsl(var(--color-success))" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{
                background: 'var(--gradient-primary)',
                padding: 'var(--space-8)',
                color: 'white',
                textAlign: 'center'
              }}>
                <h3 style={{ color: 'white', marginBottom: 'var(--space-2)' }}>How are you feeling?</h3>
                <p style={{ opacity: 0.9, color: 'white' }}>Select your current mood</p>
              </div>
              <div style={{ 
                padding: 'var(--space-8)',
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 'var(--space-4)'
              }}>
                {['😢', '😔', '😐', '🙂', '😊'].map((emoji, i) => (
                  <button 
                    key={i}
                    style={{
                      fontSize: '2rem',
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-lg)',
                      border: i === 4 ? '2px solid hsl(var(--color-primary))' : '2px solid transparent',
                      background: i === 4 ? 'hsl(var(--color-primary) / 0.1)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all var(--duration-fast) var(--ease-default)'
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <div style={{ padding: '0 var(--space-8) var(--space-8)' }}>
                <textarea 
                  className="input"
                  placeholder="Add a note about how you're feeling..."
                  rows={3}
                  style={{ resize: 'none' }}
                />
                <button className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-4)' }}>
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" style={{
        padding: 'var(--space-24) 0',
        background: 'hsl(var(--color-surface))'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <h2 style={{ marginBottom: 'var(--space-4)' }}>
              Loved by <span className="text-gradient">Thousands</span>
            </h2>
            <p style={{ fontSize: 'var(--text-lg)', maxWidth: 600, margin: '0 auto' }}>
              See how MindFlow is helping people transform their mental wellness journey.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-6)'
          }}>
            {testimonials.map((testimonial, i) => (
              <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: 'var(--space-1)', marginBottom: 'var(--space-4)' }}>
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} size={16} fill="hsl(var(--color-warning))" color="hsl(var(--color-warning))" />
                  ))}
                </div>
                <p style={{ 
                  flex: 1, 
                  fontSize: 'var(--text-base)',
                  fontStyle: 'italic',
                  marginBottom: 'var(--space-4)'
                }}>
                  "{testimonial.content}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div className="avatar">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{testimonial.name}</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))' }}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{
        padding: 'var(--space-24) 0',
        background: 'var(--gradient-hero)'
      }}>
        <div className="container">
          <div className="card" style={{ 
            background: 'var(--gradient-primary)',
            textAlign: 'center',
            padding: 'var(--space-16)'
          }}>
            <h2 style={{ color: 'white', marginBottom: 'var(--space-4)' }}>
              Ready to Start Your Journey?
            </h2>
            <p style={{ 
              color: 'white', 
              opacity: 0.9,
              fontSize: 'var(--text-lg)',
              maxWidth: 600,
              margin: '0 auto var(--space-8)'
            }}>
              Join thousands of people who are taking control of their mental wellness 
              with MindFlow. Your journey to a better you starts today.
            </p>
            <Link 
              to="/signup" 
              className="btn"
              style={{ 
                background: 'white',
                color: 'hsl(var(--color-primary))',
                padding: 'var(--space-4) var(--space-8)'
              }}
            >
              Get Started Free
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <footer style={{
        padding: 'var(--space-16) 0',
        borderTop: '1px solid hsl(var(--color-border))'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-8)',
            marginBottom: 'var(--space-12)'
          }}>
            <div>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Brain size={18} color="white" />
                </div>
                <span style={{ fontWeight: 700, color: 'hsl(var(--color-text-primary))' }}>MindFlow</span>
              </Link>
              <p style={{ fontSize: 'var(--text-sm)', margin: 0 }}>
                Your personal mental wellness companion. Track, understand, and improve your mental health.
              </p>
            </div>
            
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Download', 'Updates'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Resources', links: ['Help Center', 'Community', 'Guides', 'API'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Cookies'] }
            ].map((section, i) => (
              <div key={i}>
                <h4 style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)', fontWeight: 600 }}>
                  {section.title}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {section.links.map((link, j) => (
                    <a 
                      key={j} 
                      href="#" 
                      style={{ 
                        fontSize: 'var(--text-sm)',
                        color: 'hsl(var(--color-text-muted))'
                      }}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="divider" style={{ marginBottom: 'var(--space-6)' }} />
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-4)'
          }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))', margin: 0 }}>
              © 2024 MindFlow. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
              {['Twitter', 'Instagram', 'LinkedIn'].map((social, i) => (
                <a 
                  key={i}
                  href="#"
                  style={{ 
                    fontSize: 'var(--text-sm)',
                    color: 'hsl(var(--color-text-muted))'
                  }}
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .nav-links {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
          .hero .animate-slideUp:nth-child(5) {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Landing
