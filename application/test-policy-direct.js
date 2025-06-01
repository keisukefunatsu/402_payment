// Direct test of sponsorship policy
const POLICY_ID = 'sp_parched_lethal_legion';
console.log('Testing with Policy ID:', POLICY_ID);

// Check if the policy is being used
if (process.env.PIMLICO_SPONSORSHIP_POLICY_ID !== POLICY_ID) {
  console.error('⚠️  Environment variable not updated. Current value:', process.env.PIMLICO_SPONSORSHIP_POLICY_ID);
} else {
  console.log('✅ Environment variable correctly set');
}

// Output current environment for debugging
console.log('\nCurrent sponsorship configuration:');
console.log('- Policy ID:', process.env.PIMLICO_SPONSORSHIP_POLICY_ID || 'NOT SET');
console.log('- API Key:', process.env.PIMLICO_API_KEY ? 'SET' : 'NOT SET');