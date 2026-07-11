import { useState } from 'react'
import { Brain, Lightbulb, RotateCcw, ChevronRight, Check, AlertCircle, Trash2, Calendar } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useData } from '../context/DataContext'

function CBT() {
  const { data, addCbtEntry, deleteCbtEntry } = useData()
  const savedEntries = data.cbt || []
  const [currentStep, setCurrentStep] = useState(0)
  const [thoughts, setThoughts] = useState({
    negative: '',
    distortion: '',
    challenge: '',
    alternative: ''
  })
  const [showSuccess, setShowSuccess] = useState(false)

  const cognitiveDistortions = [
    { id: 'all-or-nothing', name: 'All-or-Nothing Thinking', description: 'Seeing things in black and white categories', example: 'If I\'m not perfect, I\'m a total failure.' },
    { id: 'overgeneralization', name: 'Overgeneralization', description: 'Seeing a single negative event as a never-ending pattern', example: 'I failed once, so I\'ll always fail.' },
    { id: 'mental-filter', name: 'Mental Filter', description: 'Focusing exclusively on negatives while ignoring positives', example: 'Dwelling on one criticism despite many compliments.' },
    { id: 'disqualifying', name: 'Disqualifying the Positive', description: 'Rejecting positive experiences as not counting', example: 'That compliment was just them being nice.' },
    { id: 'jumping-conclusions', name: 'Jumping to Conclusions', description: 'Making negative interpretations without evidence', example: 'They didn\'t text back, they must hate me.' },
    { id: 'magnification', name: 'Magnification/Minimization', description: 'Exaggerating negatives or shrinking positives', example: 'My mistake was huge, my success was nothing.' },
    { id: 'emotional-reasoning', name: 'Emotional Reasoning', description: 'Assuming feelings reflect reality', example: 'I feel anxious, so something bad will happen.' },
    { id: 'should-statements', name: 'Should Statements', description: 'Using "should" as motivation but creating guilt', example: 'I should be doing more with my life.' },
    { id: 'labeling', name: 'Labeling', description: 'Attaching a negative label instead of accepting error', example: 'I made a mistake, so I\'m a loser.' },
    { id: 'personalization', name: 'Personalization', description: 'Taking excessive responsibility for external events', example: 'They\'re upset, it must be my fault.' },
  ]

  const promptQuestions = [
    'What evidence supports this thought? What evidence contradicts it?',
    'Is there another way to look at this situation?',
    'What would I tell a friend who had this thought?',
    'Will this matter in a week? A month? A year?',
    'Am I confusing a thought with a fact?',
    'What\'s the most realistic outcome likely to happen?',
  ]

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = () => {
    if (thoughts.negative && thoughts.alternative) {
      addCbtEntry(thoughts.negative, thoughts.distortion, thoughts.challenge, thoughts.alternative)
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setThoughts({ negative: '', distortion: '', challenge: '', alternative: '' })
        setCurrentStep(0)
      }, 2000)
    }
  }

  const resetExercise = () => {
    setThoughts({ negative: '', distortion: '', challenge: '', alternative: '' })
    setCurrentStep(0)
  }

  const steps = [
    { title: 'Identify', subtitle: 'the negative thought' },
    { title: 'Recognize', subtitle: 'the cognitive distortion' },
    { title: 'Challenge', subtitle: 'the thought' },
    { title: 'Reframe', subtitle: 'with alternative perspective' },
  ]

  return (
    <DashboardLayout>
      <div className="animate-fadeIn">
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
            <div style={{
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--gradient-primary)'
            }}>
              <Brain size={24} color="white" />
            </div>
            <h1 style={{ margin: 0 }}>CBT Thought Reframing</h1>
          </div>
          <p style={{ margin: 0 }}>Challenge negative thoughts and build healthier thinking patterns</p>
        </div>

        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-full)',
                  background: i <= currentStep ? 'var(--gradient-primary)' : 'hsl(var(--color-border))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: i <= currentStep ? 'white' : 'hsl(var(--color-text-muted))'
                }}>
                  {i + 1}
                </div>
                <div style={{ marginLeft: 'var(--space-3)', display: 'none' }} className="step-label">
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{step.title}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'hsl(var(--color-text-muted))' }}>{step.subtitle}</div>
                </div>
                {i < 3 && (
                  <div style={{ flex: 1, height: 2, background: i < currentStep ? 'hsl(var(--color-primary))' : 'hsl(var(--color-border))', margin: '0 var(--space-2)' }} />
                )}
              </div>
            ))}
          </div>

          {showSuccess ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: 'var(--radius-full)',
                background: 'hsl(var(--color-success) / 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-4)'
              }}>
                <Check size={40} color="hsl(var(--color-success))" />
              </div>
              <h3 style={{ marginBottom: 'var(--space-2)' }}>Thought Reframed!</h3>
              <p style={{ margin: 0 }}>Great job challenging that negative thought pattern.</p>
            </div>
          ) : (
            <>
              {currentStep === 0 && (
                <div>
                  <h3 style={{ marginBottom: 'var(--space-4)' }}>Step 1: Identify the Negative Thought</h3>
                  <p style={{ color: 'hsl(var(--color-text-muted))', marginBottom: 'var(--space-4)' }}>
                    Write down the automatic negative thought that's bothering you. Be specific.
                  </p>
                  <textarea
                    className="input"
                    value={thoughts.negative}
                    onChange={(e) => setThoughts({ ...thoughts, negative: e.target.value })}
                    placeholder="I'm thinking that..."
                    rows={4}
                    style={{ width: '100%', resize: 'none', marginBottom: 'var(--space-4)' }}
                  />
                </div>
              )}

              {currentStep === 1 && (
                <div>
                  <h3 style={{ marginBottom: 'var(--space-4)' }}>Step 2: Recognize the Cognitive Distortion</h3>
                  <p style={{ color: 'hsl(var(--color-text-muted))', marginBottom: 'var(--space-4)' }}>
                    Which thinking pattern applies to your thought?
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                    {cognitiveDistortions.map((distortion) => (
                      <button
                        key={distortion.id}
                        onClick={() => setThoughts({ ...thoughts, distortion: distortion.id })}
                        style={{
                          padding: 'var(--space-3) var(--space-4)',
                          borderRadius: 'var(--radius-lg)',
                          border: `2px solid ${thoughts.distortion === distortion.id ? 'hsl(var(--color-primary))' : 'hsl(var(--color-border))'}`,
                          background: thoughts.distortion === distortion.id ? 'hsl(var(--color-primary) / 0.1)' : 'transparent',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all var(--duration-fast) var(--ease-default)'
                        }}
                      >
                        <div style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>{distortion.name}</div>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-muted))' }}>{distortion.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h3 style={{ marginBottom: 'var(--space-4)' }}>Step 3: Challenge the Thought</h3>
                  <p style={{ color: 'hsl(var(--color-text-muted))', marginBottom: 'var(--space-4)' }}>
                    Use these questions to examine your thought more objectively.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                    {promptQuestions.map((q, i) => (
                      <div key={i} style={{
                        padding: 'var(--space-3)',
                        background: 'hsl(var(--color-background))',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 'var(--space-3)'
                      }}>
                        <Lightbulb size={18} color="hsl(45 80% 50%)" style={{ flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: 'var(--text-sm)' }}>{q}</span>
                      </div>
                    ))}
                  </div>
                  <textarea
                    className="input"
                    value={thoughts.challenge}
                    onChange={(e) => setThoughts({ ...thoughts, challenge: e.target.value })}
                    placeholder="Write your reflections..."
                    rows={4}
                    style={{ width: '100%', resize: 'none' }}
                  />
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h3 style={{ marginBottom: 'var(--space-4)' }}>Step 4: Reframe with an Alternative Perspective</h3>
                  <p style={{ color: 'hsl(var(--color-text-muted))', marginBottom: 'var(--space-4)' }}>
                    Now write a more balanced, realistic thought to replace the negative one.
                  </p>
                  <div style={{
                    padding: 'var(--space-4)',
                    background: 'hsl(var(--color-error) / 0.05)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: 'var(--space-4)',
                    borderLeft: '4px solid hsl(var(--color-error))'
                  }}>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: 'var(--space-1)', color: 'hsl(var(--color-error))' }}>ORIGINAL THOUGHT</div>
                    <p style={{ margin: 0 }}>{thoughts.negative}</p>
                  </div>
                  <div style={{
                    padding: 'var(--space-4)',
                    background: 'hsl(var(--color-success) / 0.05)',
                    borderRadius: 'var(--radius-lg)',
                    borderLeft: '4px solid hsl(var(--color-success))'
                  }}>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'hsl(var(--color-success))' }}>REFRAMED THOUGHT</div>
                    <textarea
                      className="input"
                      value={thoughts.alternative}
                      onChange={(e) => setThoughts({ ...thoughts, alternative: e.target.value })}
                      placeholder="A more balanced perspective is..."
                      rows={3}
                      style={{ width: '100%', resize: 'none', background: 'transparent' }}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
                {currentStep > 0 && (
                  <button className="btn btn-secondary" onClick={handleBack}>
                    Back
                  </button>
                )}
                <button className="btn btn-ghost" onClick={resetExercise} style={{ marginLeft: 'auto' }}>
                  <RotateCcw size={18} />
                  Start Over
                </button>
                {currentStep < 3 ? (
                  <button className="btn btn-primary" onClick={handleNext} disabled={currentStep === 0 && !thoughts.negative}>
                    Next <ChevronRight size={18} />
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={handleSave} disabled={!thoughts.alternative}>
                    <Check size={18} />
                    Save Reframe
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* History Section */}
        <div style={{ marginTop: 'var(--space-10)', marginBottom: 'var(--space-8)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ margin: 0 }}>History & Progress</h3>
            <span className="badge">{savedEntries.length} reframes</span>
          </div>

          {savedEntries.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {savedEntries.map((entry) => {
                const distortion = cognitiveDistortions.find(d => d.id === entry.distortion)
                return (
                  <div key={entry.id} className="card animate-fadeIn" style={{ position: 'relative', padding: 'var(--space-5)' }}>
                    <button
                      onClick={() => deleteCbtEntry(entry.id)}
                      style={{
                        position: 'absolute',
                        top: 'var(--space-4)',
                        right: 'var(--space-4)',
                        color: 'hsl(var(--color-text-muted))',
                        padding: 'var(--space-2)',
                        borderRadius: 'var(--radius-md)',
                        transition: 'all var(--duration-fast) var(--ease-default)'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'hsl(var(--color-error))'; e.currentTarget.style.background = 'hsl(var(--color-error) / 0.1)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'hsl(var(--color-text-muted))'; e.currentTarget.style.background = 'transparent'; }}
                      title="Delete entry"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                      <span className="badge" style={{ background: 'hsl(var(--color-primary) / 0.1)', color: 'hsl(var(--color-primary))' }}>
                        {distortion ? distortion.name : 'Thought Reframing'}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'hsl(var(--color-text-muted))' }}>
                        <Calendar size={12} />
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                      <div style={{ padding: 'var(--space-4)', background: 'hsl(var(--color-error) / 0.04)', borderLeft: '4px solid hsl(var(--color-error))', borderRadius: 'var(--radius-lg)' }}>
                        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'hsl(var(--color-error))', marginBottom: 'var(--space-1)', textTransform: 'uppercase' }}>Negative Thought</div>
                        <p style={{ margin: 0, color: 'hsl(var(--color-text-primary))', fontStyle: 'italic' }}>"{entry.negative}"</p>
                      </div>

                      {entry.challenge && (
                        <div style={{ padding: 'var(--space-4)', background: 'hsl(var(--color-warning) / 0.04)', borderLeft: '4px solid hsl(var(--color-warning))', borderRadius: 'var(--radius-lg)' }}>
                          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'hsl(var(--color-warning))', marginBottom: 'var(--space-1)', textTransform: 'uppercase' }}>The Challenge (Evidence)</div>
                          <p style={{ margin: 0, color: 'hsl(var(--color-text-secondary))' }}>{entry.challenge}</p>
                        </div>
                      )}

                      <div style={{ padding: 'var(--space-4)', background: 'hsl(var(--color-success) / 0.04)', borderLeft: '4px solid hsl(var(--color-success))', borderRadius: 'var(--radius-lg)' }}>
                        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'hsl(var(--color-success))', marginBottom: 'var(--space-1)', textTransform: 'uppercase' }}>Reframed Perspective</div>
                        <p style={{ margin: 0, color: 'hsl(var(--color-text-primary))', fontWeight: 500 }}>{entry.alternative}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'hsl(var(--color-text-muted))' }}>
              <Brain size={40} style={{ marginBottom: 'var(--space-3)', opacity: 0.5 }} />
              <p style={{ margin: 0 }}>No saved reframed thoughts yet. Use the tool above to reframe your first negative thought pattern!</p>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
          <div className="card" style={{ padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
              <Brain size={24} color="hsl(var(--color-primary))" />
              <h3 style={{ margin: 0 }}>What is CBT?</h3>
            </div>
            <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-secondary))' }}>
              Cognitive Behavioral Therapy helps identify and change negative thought patterns that affect emotions and behavior.
            </p>
          </div>

          <div className="card" style={{ padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
              <Lightbulb size={24} color="hsl(45 80% 50%)" />
              <h3 style={{ margin: 0 }}>Why Reframe?</h3>
            </div>
            <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'hsl(var(--color-text-secondary))' }}>
              Reframing helps break the cycle of negative thinking, reduces anxiety, and builds emotional resilience over time.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CBT
