import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    diagonosedWith: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["M", "F", "O"],
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    admittedIn: {
      typeof: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },
    medicalRecords: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicalrecord",
      },
    ],
  },
  { timestamps: true },
);

export const Patient = mongoose.model("Patient", patientSchema);
