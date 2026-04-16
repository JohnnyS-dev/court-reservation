/**
 * ConfirmationScreen
 * Shown after a successful reservation.
 *
 * Props:
 *   confirmationCode - string
 *   onDone           - callback() — resets to the calendar
 */
export default function ConfirmationScreen({ confirmationCode, onDone }) {
  return (
    <div style={styles.container}>
      <div style={styles.iconWrap} aria-hidden="true">
        ✓
      </div>

      <h1 style={styles.heading}>You're booked!</h1>
      <p style={styles.subtext}>Your court has been reserved.</p>

      <div style={styles.codeCard}>
        <p style={styles.codeLabel}>Confirmation Code</p>
        <p style={styles.code}>{confirmationCode}</p>
      </div>

      <p style={styles.hint}>
        Screenshot this screen or check your email for a copy of your
        confirmation code.
      </p>

      <button style={styles.doneButton} onClick={onDone}>
        Back to Calendar
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem 1.25rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    textAlign: 'center',
  },
  iconWrap: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: '#16a34a',
    color: '#fff',
    fontSize: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1a1a1a',
  },
  subtext: {
    fontSize: '1rem',
    color: '#6b7280',
  },
  codeCard: {
    width: '100%',
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '10px',
    padding: '1.25rem 1rem',
    marginTop: '0.5rem',
  },
  codeLabel: {
    fontSize: '0.8rem',
    fontWeight: 500,
    color: '#15803d',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '0.5rem',
  },
  code: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#14532d',
    letterSpacing: '0.12em',
    // TODO: if codes get long (e.g. UUIDs) consider font-size: clamp(1.25rem, 5vw, 2rem)
    wordBreak: 'break-all',
  },
  hint: {
    fontSize: '0.875rem',
    color: '#6b7280',
    lineHeight: 1.5,
    maxWidth: '320px',
  },
  doneButton: {
    marginTop: '0.75rem',
    width: '100%',
    padding: '0.875rem',
    background: '#16a34a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    minHeight: '48px',
  },
};
