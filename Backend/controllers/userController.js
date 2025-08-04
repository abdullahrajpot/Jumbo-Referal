const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const crypto = require('crypto');

const registerUser = async (req, res) => {
  const { name, email, password, referrerCode } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      referralCode,
    });

    if (referrerCode) {
      const referrer = await User.findOne({ referralCode: referrerCode });
      if (!referrer) {
        return res.status(400).json({ error: 'Invalid referral code.' });
      }
      newUser.referrerId = referrer._id;
      await newUser.save();

      referrer.referredUsers.push(newUser._id);
      await referrer.save();
    } else {
      await newUser.save();
    }

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        referralCode: newUser.referralCode,
        referrerId: newUser.referrerId,
        twoFactorEnabled: newUser.twoFactorEnabled,
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, twoFactorCode } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        return res.status(200).json({ 
          requiresTwoFactor: true,
          message: 'Two-factor authentication code required' 
        });
      }

      // Verify 2FA code
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: twoFactorCode,
        window: 2 // Allow 30 seconds before and after
      });

      // If TOTP fails, check backup codes
      if (!verified) {
        const backupCodeIndex = user.backupCodes.findIndex(code => 
          bcrypt.compareSync(twoFactorCode, code)
        );
        
        if (backupCodeIndex === -1) {
          return res.status(400).json({ error: 'Invalid two-factor authentication code' });
        }
        
        // Remove used backup code
        user.backupCodes.splice(backupCodeIndex, 1);
        await user.save();
      }
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        twoFactorEnabled: user.twoFactorEnabled,
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// Generate 2FA secret and QR code
const setup2FA = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `${user.name} (${user.email})`,
      issuer: 'Your App Name',
      length: 20
    });

    // Generate QR code
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    // Store secret temporarily (not enabled yet)
    user.twoFactorSecret = secret.base32;
    await user.save();

    res.json({
      secret: secret.base32,
      qrCode: qrCodeUrl,
      manualEntryKey: secret.base32
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    res.status(500).json({ error: 'Failed to setup 2FA' });
  }
};

// Enable 2FA after verification
const enable2FA = async (req, res) => {
  try {
    const { userId } = req.params;
    const { token } = req.body;
    
    const user = await User.findById(userId);
    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ error: 'No 2FA setup found' });
    }

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 2
    });

    if (!verified) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Generate backup codes
    const backupCodes = [];
    for (let i = 0; i < 10; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      backupCodes.push(code);
    }

    // Hash backup codes before storing
    const hashedBackupCodes = backupCodes.map(code => bcrypt.hashSync(code, 10));

    // Enable 2FA
    user.twoFactorEnabled = true;
    user.backupCodes = hashedBackupCodes;
    await user.save();

    res.json({
      message: '2FA enabled successfully',
      backupCodes: backupCodes // Send unhashed codes to user (they should save these)
    });
  } catch (error) {
    console.error('2FA enable error:', error);
    res.status(500).json({ error: 'Failed to enable 2FA' });
  }
};

// Disable 2FA
const disable2FA = async (req, res) => {
  try {
    const { userId } = req.params;
    const { password, twoFactorCode } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Verify 2FA code if 2FA is enabled
    if (user.twoFactorEnabled) {
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: twoFactorCode,
        window: 2
      });

      if (!verified) {
        return res.status(400).json({ error: 'Invalid two-factor authentication code' });
      }
    }

    // Disable 2FA
    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;
    user.backupCodes = [];
    await user.save();

    res.json({ message: '2FA disabled successfully' });
  } catch (error) {
    console.error('2FA disable error:', error);
    res.status(500).json({ error: 'Failed to disable 2FA' });
  }
};

// Generate new backup codes
const generateBackupCodes = async (req, res) => {
  try {
    const { userId } = req.params;
    const { password, twoFactorCode } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ error: '2FA is not enabled' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Verify 2FA code
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: twoFactorCode,
      window: 2
    });

    if (!verified) {
      return res.status(400).json({ error: 'Invalid two-factor authentication code' });
    }

    // Generate new backup codes
    const backupCodes = [];
    for (let i = 0; i < 10; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      backupCodes.push(code);
    }

    // Hash backup codes before storing
    const hashedBackupCodes = backupCodes.map(code => bcrypt.hashSync(code, 10));
    user.backupCodes = hashedBackupCodes;
    await user.save();

    res.json({
      message: 'New backup codes generated',
      backupCodes: backupCodes
    });
  } catch (error) {
    console.error('Backup codes generation error:', error);
    res.status(500).json({ error: 'Failed to generate backup codes' });
  }
};

module.exports = { 
  registerUser, 
  loginUser, 
  setup2FA, 
  enable2FA, 
  disable2FA, 
  generateBackupCodes 
};
