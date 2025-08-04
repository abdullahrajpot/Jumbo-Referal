import React, { useState, useEffect } from 'react';
import {
  Box,Card, CardContent,Typography,Button,Stack, Dialog,DialogTitle, DialogContent, DialogActions,TextField,Alert,Stepper,Step,StepLabel,Chip,IconButton,Paper} from '@mui/material';
import {
  Security,
  QrCode,
  ContentCopy,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { toast } from 'react-toastify';

const TwoFactorSettings = ({ userId, user, onUserUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [setupDialog, setSetupDialog] = useState(false);
  const [disableDialog, setDisableDialog] = useState(false);
  const [backupCodesDialog, setBackupCodesDialog] = useState(false);
  
  // Setup states
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [backupCodes, setBackupCodes] = useState([]);
  
  // Disable states
  const [password, setPassword] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('');

  const steps = ['Install App', 'Scan QR Code', 'Verify Setup', 'Save Backup Codes'];

  const handleSetup2FA = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`http://localhost:5001/api/users/2fa/setup/${userId}`);
      setQrCode(response.data.qrCode);
      setSecret(response.data.secret);
      setSetupDialog(true);
      setActiveStep(0);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to setup 2FA');
      toast.error('Failed to setup 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`http://localhost:5001/api/users/2fa/enable/${userId}`, {
        token: verificationCode
      });
      
      setBackupCodes(response.data.backupCodes);
      setActiveStep(3);
      toast.success('2FA enabled successfully');
      onUserUpdate({ ...user, twoFactorEnabled: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!password.trim() || !disableCode.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await axios.post(`http://localhost:5001/api/users/2fa/disable/${userId}`, {
        password: password,
        twoFactorCode: disableCode
      });
      
      setDisableDialog(false);
      setPassword('');
      setDisableCode('');
      toast.success('2FA disabled successfully');
      onUserUpdate({ ...user, twoFactorEnabled: false });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBackupCodes = async () => {
    if (!password.trim() || !disableCode.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`http://localhost:5001/api/users/2fa/backup-codes/${userId}`, {
        password: password,
        twoFactorCode: disableCode
      });
      
      setBackupCodes(response.data.backupCodes);
      setBackupCodesDialog(false);
      setPassword('');
      setDisableCode('');
      
      // Show the codes in a dialog
      setTimeout(() => {
        setSetupDialog(true);
        setActiveStep(3);
      }, 100);
      
      toast.success('New backup codes generated');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate backup codes');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const copyAllBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeText(codesText);
    toast.success('All backup codes copied to clipboard');
  };

  const handleSetupComplete = () => {
    setSetupDialog(false);
    setActiveStep(0);
    setVerificationCode('');
    setQrCode('');
    setSecret('');
    setBackupCodes([]);
    setError('');
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Security color={user?.twoFactorEnabled ? 'success' : 'disabled'} />
            <Box>
              <Typography variant="h6">Two-Factor Authentication</Typography>
              <Typography variant="body2" color="text.secondary">
                Add an extra layer of security to your account
              </Typography>
            </Box>
            <Box sx={{ ml: 'auto' }}>
              <Chip
                label={user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                color={user?.twoFactorEnabled ? 'success' : 'default'}
                variant={user?.twoFactorEnabled ? 'filled' : 'outlined'}
              />
            </Box>
          </Stack>

          {user?.twoFactorEnabled ? (
            <Stack spacing={2}>
              <Alert severity="success" icon={<CheckCircle />}>
                Two-factor authentication is enabled on your account
              </Alert>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setDisableDialog(true)}
                >
                  Disable 2FA
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setBackupCodesDialog(true)}
                >
                  Generate New Backup Codes
                </Button>
              </Stack>
            </Stack>
          ) : (
            <Stack spacing={2}>
              <Alert severity="warning" icon={<Warning />}>
                Your account is not protected by two-factor authentication
              </Alert>
              <Box>
                <LoadingButton
                  variant="contained"
                  startIcon={<Security />}
                  onClick={handleSetup2FA}
                  loading={loading}
                >
                  Enable Two-Factor Authentication
                </LoadingButton>
              </Box>
            </Stack>
          )}
        </Stack>
      </CardContent>

      {/* Setup 2FA Dialog */}
      <Dialog 
        open={setupDialog} 
        onClose={activeStep === 3 ? handleSetupComplete : () => setSetupDialog(false)}
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          Set up Two-Factor Authentication
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {activeStep === 0 && (
              <Stack spacing={2}>
                <Typography variant="h6">Step 1: Install an Authenticator App</Typography>
                <Typography>
                  Download and install an authenticator app like Google Authenticator, 
                  Authy, or Microsoft Authenticator on your phone.
                </Typography>
                <Box>
                  <Button variant="contained" onClick={() => setActiveStep(1)}>
                    I have installed an app
                  </Button>
                </Box>
              </Stack>
            )}

            {activeStep === 1 && (
              <Stack spacing={2}>
                <Typography variant="h6">Step 2: Scan QR Code</Typography>
                <Typography>
                  Open your authenticator app and scan this QR code:
                </Typography>
                {qrCode && (
                  <Box sx={{ textAlign: 'center' }}>
                    <img src={qrCode} alt="2FA QR Code" style={{ maxWidth: '200px' }} />
                  </Box>
                )}
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Can't scan? Enter this code manually:
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {secret}
                    </Typography>
                    <IconButton size="small" onClick={() => copyToClipboard(secret)}>
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Stack>
                </Paper>
                <Box>
                  <Button variant="contained" onClick={() => setActiveStep(2)}>
                    I have scanned the code
                  </Button>
                </Box>
              </Stack>
            )}

            {activeStep === 2 && (
              <Stack spacing={2}>
                <Typography variant="h6">Step 3: Verify Setup</Typography>
                <Typography>
                  Enter the 6-digit code from your authenticator app:
                </Typography>
                <TextField
                  fullWidth
                  label="Verification Code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="000000"
                  inputProps={{ 
                    maxLength: 6,
                    style: { textAlign: 'center', fontSize: '1.2em', letterSpacing: '0.2em' }
                  }}
                />
                {error && <Alert severity="error">{error}</Alert>}
                <Box>
                  <LoadingButton
                    variant="contained"
                    onClick={handleEnable2FA}
                    loading={loading}
                    disabled={!verificationCode.trim()}
                  >
                    Verify and Enable 2FA
                  </LoadingButton>
                </Box>
              </Stack>
            )}

            {activeStep === 3 && (
              <Stack spacing={2}>
                <Typography variant="h6">Step 4: Save Your Backup Codes</Typography>
                <Alert severity="warning">
                  Save these backup codes in a safe place. You can use them to access your account 
                  if you lose your phone. Each code can only be used once.
                </Alert>
                
                <Paper sx={{ p: 2, bgcolor: 'grey.50', maxHeight: '200px', overflow: 'auto' }}>
                  <Stack spacing={1}>
                    {backupCodes.map((code, index) => (
                      <Stack key={index} direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', minWidth: '80px' }}>
                          {code}
                        </Typography>
                        <IconButton size="small" onClick={() => copyToClipboard(code)}>
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Stack>
                    ))}
                  </Stack>
                </Paper>
                
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<ContentCopy />}
                    onClick={copyAllBackupCodes}
                  >
                    Copy All Codes
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSetupComplete}
                  >
                    I have saved my backup codes
                  </Button>
                </Stack>
              </Stack>
            )}
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Disable 2FA Dialog */}
      <Dialog open={disableDialog} onClose={() => setDisableDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Alert severity="warning">
              Disabling 2FA will make your account less secure. Are you sure you want to continue?
            </Alert>
            
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="Current Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
            />
            
            <TextField
              fullWidth
              label="2FA Code"
              value={disableCode}
              onChange={(e) => setDisableCode(e.target.value)}
              placeholder="000000"
              inputProps={{ 
                maxLength: 8,
                style: { textAlign: 'center', fontSize: '1.2em', letterSpacing: '0.2em' }
              }}
            />
            
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDisableDialog(false)}>Cancel</Button>
          <LoadingButton
            color="error"
            onClick={handleDisable2FA}
            loading={loading}
            disabled={!password.trim() || !disableCode.trim()}
          >
            Disable 2FA
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Generate Backup Codes Dialog */}
      <Dialog open={backupCodesDialog} onClose={() => setBackupCodesDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate New Backup Codes</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Alert severity="info">
              This will generate new backup codes and invalidate your old ones. 
              Make sure to save the new codes in a safe place.
            </Alert>
            
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="Current Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
            />
            
            <TextField
              fullWidth
              label="2FA Code"
              value={disableCode}
              onChange={(e) => setDisableCode(e.target.value)}
              placeholder="000000"
              inputProps={{ 
                maxLength: 6,
                style: { textAlign: 'center', fontSize: '1.2em', letterSpacing: '0.2em' }
              }}
            />
            
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBackupCodesDialog(false)}>Cancel</Button>
          <LoadingButton
            onClick={handleGenerateBackupCodes}
            loading={loading}
            disabled={!password.trim() || !disableCode.trim()}
          >
            Generate New Codes
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default TwoFactorSettings;