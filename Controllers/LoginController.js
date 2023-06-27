import jwt from "jsonwebtoken";

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({
        status: false,
        message: "Please provide all the required field",
      });
    }

    const staticEmail = "mail@gmail.com";
    const statisPassword = "mail123";

    const expireTokenDate = new Date();
    expireTokenDate.setDate(expireTokenDate.getDate() + 1);

    if (staticEmail !== email || statisPassword !== password) {
      return res
        .status(422)
        .json({ status: false, message: "Invalid email or password" });
    }

    if (staticEmail === email && statisPassword === password) {
      const token = jwt.sign("mail@gmail.com", process.env.SECRETKEY, {
        expiresIn: 86400,
      });

      const sessionToken = {
        token,
        expireTokenDate,
      };

      res.cookie("sessiontoken", JSON.stringify(sessionToken), {
        maxAge: 86400,
        httpOnly: true,
      });

      res.status(202).json({
        status: true,
        message: "Admin login successfully",
        token: token,
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Something went wrong", err: error });
  }
};
