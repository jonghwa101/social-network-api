const { Thought, User } = require("../models");

const thoughtController = {
  // Get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .select("-__v")
      .then((dbThought) => {
        res.json(dbThought);
      })
      .catch(err => {
        console.log(err)
        res.status(400).json(err)
    });
  },

  // Get a single thought
  getThoughtbyId({ params }, res) {
    Thought.findOne({ _id: params.id })
      .select("-__v")
      .then((dbThought) => {
        if (!dbThought) {
          res.status(404).json({ message: "No thought found with this id" });
          return;
        }
        res.json(dbThought);
      })
      .catch(err => {
        console.log(err)
        res.status(400).json(err)
    });
  },

  // Create a thought
  createThought({ body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
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

  // Update a thought
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbThought) => {
        if (!dbThought) {
          res.status(404).json({ message: "No thought found with this id" });
          return;
        }
        res.json(dbThought);
      })
      .catch(err => {
        console.log(err)
        res.status(400).json(err)
    });
  },

  // Delete a thought
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then((dbThought) => {
        if (!dbThought) {
          res.status(404).json({ message: "No thought found with this id" });
          return;
        }
        res.json(dbThought);
      })
      .catch(err => {
        console.log(err)
        res.status(400).json(err)
    });
  },

  // Add a reaction
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((dbThought) => {
        if (!dbThought) {
          res.status(404).json({ message: "No thought found with this id" });
          return;
        }
        res.json(dbThought);
      })
      .catch(err => {
        console.log(err)
        res.status(400).json(err)
    });
  },

  // Delete a reaction
  deleteReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: body.reactionId } } },
      { new: true, runValidators: true }
    )
      .then((dbThought) => {
        if (!dbThought) {
          res.status(404).json({ message: "No thought found with this id" });
          return;
        }
        res.json(dbThought);
      })
      .catch(err => {
        console.log(err)
        res.status(400).json(err)
    });
  },
};

module.exports = thoughtController;