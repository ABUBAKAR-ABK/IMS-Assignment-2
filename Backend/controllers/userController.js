const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const [users] = await pool.execute('SELECT id, email, role, company_name FROM users WHERE id = ?', [req.user.id]);
    const user = users[0];

    if (user) {
      res.json({
        id: user.id,
        email: user.email,
        role: user.role,
        companyName: user.company_name, // Include company_name
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const { companyName, password } = req.body; // Assuming companyName is passed in the body

  try {
    const [users] = await pool.execute('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const user = users[0];

    if (user) {
      let updateFields = [];
      let queryParams = [];

      // Handle password update
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updateFields.push('password = ?');
        queryParams.push(hashedPassword);
      }

      // Handle companyName update (assuming a new column 'company_name' in 'users' table for simplicity)
      // If companyName is for Admin only, we might need a separate table or conditional logic.
      // For now, let's assume we add a company_name column to the users table.
      if (companyName !== undefined) { // Allow setting to empty string
        updateFields.push('company_name = ?');
        queryParams.push(companyName);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
      }

      const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
      queryParams.push(user.id);

      await pool.execute(updateQuery, queryParams);

      // Fetch updated user data to return
      const [updatedUsers] = await pool.execute('SELECT id, email, role, company_name FROM users WHERE id = ?', [user.id]);
      const updatedUser = updatedUsers[0];

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role,
          companyName: updatedUser.company_name,
        },
      });

    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
