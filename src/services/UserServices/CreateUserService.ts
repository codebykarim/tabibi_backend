import { Gender, User } from "@prisma/client";
import AppError from "../../errors/AppError";
import prisma from "../../prisma";
import { supabase } from "../../utils/supabase";

interface Response {
  user: User;
}

const CreateUserService = async ({
  identitynumber,
  name,
  phone,
  villageId,
  gender,
}: {
  identitynumber: string;
  name: string;
  phone?: string;
  villageId: number;
  gender: Gender;
}): Promise<Response> => {
  const { data, error } = await supabase.auth.signUp({
    email: `${identitynumber}@tabibi.com`,
    password: process.env.DEFAULT_PASSWORD!,
    options: {
      data: {
        name: name,
        identitynumber: identitynumber,
      },
    },
  });

  if (error) throw new AppError("Sorry something went wrong", 400);

  const user = await prisma.user
    .create({
      data: {
        authId: data!.user!.id,
        identitynumber,
        email: `${identitynumber}@tabibi.com`,
        name,
        phone: phone ?? "",
        village: {
          connect: {
            id: Number(villageId),
          },
        },
        gender,
        isverified: true,
      },
    })
    .catch(async (e) => {
      await supabase.auth.admin.deleteUser(data!.user!.id);
      throw new AppError("Sorry Something went wrong");
    });

  return {
    user,
  };
};

export default CreateUserService;
