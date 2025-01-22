import { asyncHandler } from "../utils/asyncHandler";

const registerUser = asyncHandler(async (res, req) => {
  res.status(200).json({
    message: "OK",
  });
});

export { registerUser };
