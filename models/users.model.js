const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"],
  },

  email: {
    type: String,
    required: [true, "Please provide an email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "supplier", "admin"],
    default: "user",
  },
  verificationStatus: {
    type: String,
    enum: ["unverified", "pending", "verified"],
    default: "unverified",
  },
  verificationDocuments: [
    {
      documentType: String,
      documentUrl: String,
      uploadDate: Date,
      verificationDate: Date,
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
    },
  ],

  hospitalInfo: {
    name: String,
    type: {
      type: String,
      enum: ["hospital", "clinic", "private practice", "other"],
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    licenseNumber: String,
    specialties: [String],
    size: String, // e.g., 'small', 'medium', 'large'
  },

  companyInfo: {
    name: String,
    registrationNumber: String,
    taxId: String,
    foundedYear: Number,
    website: String,
    address: {
      headquarters: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
      },
      branches: [
        {
          street: String,
          city: String,
          state: String,
          zipCode: String,
          country: String,
        },
      ],
    },
    certifications: [
      {
        name: String,
        issuingBody: String,
        issueDate: Date,
        expiryDate: Date,
        documentUrl: String,
      },
    ],
  },

  lastLogout: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
