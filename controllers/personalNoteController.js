const {validationResult} = require("express-validator");
const {User, PersonalNote, LabelNote} = require("../models");
const jwt_decode = require("jwt-decode");

const getAllNotes = async (req, res) => {};

const createNote = async (req, res) => {};

const updateNote = async (req, res) => {};

const getNote = async (req, res) => {};

const deleteNote = async (req, res) => {};

module.exports = {getAllNotes, createNote, updateNote, getNote, deleteNote};
