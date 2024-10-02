const mongoose = require("mongoose");
const NoteSchema = new mongoose.Schema({
  note: { type: "String" },
  date: { type: "Date", default: Date.now() },
  status: { type: "Boolean" },
});
const Notes = mongoose.model("Notes", NoteSchema);
module.exports = Notes;
