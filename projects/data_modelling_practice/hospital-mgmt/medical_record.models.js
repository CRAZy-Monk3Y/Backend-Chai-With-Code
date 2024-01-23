import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    entryName: {
      type: String,
      required: true,
    },
    treatedUnder: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Doctor",
        },
      ],
    },
    hospitals: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Hospital",
        },
      ],
    },
  },
  { timestamps: true },
);

export const MedicalRecord = mongoose.model(
  "MedicalRecord",
  medicalRecordSchema,
);
