import prisma from "../database.js";

export const getAllPhones = async (req, res) => {
  try {
    const phones = await prisma.phone.findMany();
    res.status(200).json({
      status: "success",
      data: phones,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
