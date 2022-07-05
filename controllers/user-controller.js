const { User } = require("../models");

const userController = {
  // Get all users
  getAllUsers(req, res) {
    User.find({})
      .select("-__v")
      .then((dbUser) => {
        res.json(dbUser);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },

  // Get a single user
  getUserbyId({ params }, res) {
    User.findOne({ _id: params.id })
      .select("-__v")
      .then((dbUser) => {
        if (!dbUser) {
          res.status(404).json({ message: "No user found with this id" });
          return;
        }
        res.json(dbUser);
      })
      .catch(err => res.status(500).json(err));
  },

  // Create a user
  createUser({ body }, res) {
    User.create(body)
      .then((dbUser) => {
        res.json(dbUser);
      })
      .catch(err => res.status(400).json(err));
  },

  // Update user by id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbUser) => {
        if (!dbUser) {
          res.status(404).json({ message: "No user found with this id" });
          return;
        }
        res.json(dbUser);
      })
      .catch(err => res.status(400).json(err));
  },

  // Delete a user by id
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then((dbUser) => {
        if (!dbUser) {
          res.status(404).json({ message: "No user found with this id" });
          return;
        }
        res.json(dbUser);
      })
      .catch(err => res.status(400).json(err));
  },

  // Add a new friend
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: params.friendId } },
      { new: true }
    )
      .then((dbUser) => {
        if (!dbUser) {
          res.status(404).json({ message: "No user found with this id" });
          return;
        }
        res.json(dbUser);
      })
      .catch(err => {
        console.log(err)
        res.status(400).json(err)
    })
  },

  // Delete a friend
  removeFriend({ params }, res) {
    User.findOneAndDelete({ _id: params.friendId })
      .then((deletedFriend) => {
        if (!deletedFriend) {
          res.status(404).json({ message: "No friend found with this id" });
          return;
        }
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { friends: params.friendId } },
          { new: true }
        );
      })
      .then((dbUser) => {
        if (!dbUser) {
          res.status(404).json({ message: "No user found with this id" });
          return;
        }
        res.json(dbUser);
      })
      .catch(err => {
        console.log(err)
        res.status(400).json(err)
    });
  },
};

module.exports = userController;