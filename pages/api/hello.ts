// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getSession } from "next-auth/client";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "next-auth/jwt";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession(req);
	const token = await jwt.getToken({ req, secret: process.env.SECRET });
	res.status(200).json({ name: "John Doe", session, token });
};
