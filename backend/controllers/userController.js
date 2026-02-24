const User = require('../models/User');

// @desc    Get all users
exports.getUsers = async (req, res)=> {
  try {
    const users = await User.find().select('-password').sort({ createdDate: -1 });
    res.json(users);
  } 
  catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// @desc    Get single user
exports.getUser = async (req, res)=> {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  }
   catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// @desc    Update user
exports.updateUser = async (req, res)=> {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email, role, isActive } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    res.json(user);
  } 
  catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// @desc    Deactivate user
exports.deactivateUser = async (req, res)=> {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = false;
    await user.save();

    res.json({ message: 'User deactivated successfully' });
  } 
  catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({ message: 'Error deactivating user', error: error.message });
  }
};
