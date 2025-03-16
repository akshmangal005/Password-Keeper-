import { Response } from "express";
import { prisma } from "../db/db";
import Cryptr from "cryptr";
import { Cloudinary } from "../utils/Cloudinary";

const cryptr = new Cryptr(process.env.CRYPTR_SECRET as string);
const uploadFile = async (file: any, id: any) => {
  try {
    console.log(file);
    const uploadResult = await Cloudinary.uploader.upload(file.path, {
      public_id: `PasswordManager/${id}/${file.originalname}`,
      resource_type: "raw",
      timeout: 120000
    });

    const fileUrl = uploadResult.secure_url;
    return {
      status: "success",
      url: fileUrl,
    }

  } catch (error) {
    return {
      status: "error",
      message: error,
    }
  }
}
const deleteFile = async (fileUrl: string) => {
  try {
    console.log(fileUrl);
    const publicId = fileUrl.split("/");
    console.log(publicId);

    // await Cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.log(err)
  }
}
const getAll = async (req: any, res: Response) => {
  try {
    const id = req.user.id;
    const skip = req.query.skip ? parseInt(req.query.skip) : 1;
    const contents = await prisma.post.findMany({
      where: {
        ownerId: id,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      skip: (skip - 1) * 10,
    });
    await Promise.all(contents.map(async e => {
      e.content = await cryptr.decrypt(e.content as string)
    }));

    res.status(200).json(contents);
  } catch (err) {
    console.error("Error fetching passwords:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createPassword = async (req: any, res: any) => {
  try {
    const { title, content, username } = req.body;
    const { file } = req
    let fileUrl: string = "";
    // if (file) {
    //   try {
    //     const result = await uploadFile(req.file, req.user.id);

    //     if (result.status === "success") {
    //       fileUrl = result.url as string;
    //     } else {
    //       console.log("❌ File Upload Error:", result.message);
    //       return res.json({ message: result.message });
    //     }
    //   } catch (error) {
    //     console.error("❌ Upload Failed:", error);
    //     return res.json({ message: "File upload failed" });
    //   }
    // }
    const encryptPass = cryptr.encrypt(content);
    await prisma.post.create({
      data: {
        title: title,
        content: encryptPass,
        username: username,
        file: fileUrl,
        ownerId: req.user.id,
      },
    });
    res.json({
      message: "Password added successfully",
    });
  } catch (err) {
    throw "Internal server error";
  }
};
const modifyPassword = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { content, title, username } = req.body;
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
        ownerId: req.user.id,
      },
    });
    if (!post) {
      res.status(404).json({ message: "Not Found" });
      return;
    }
    await prisma.post.update({
      where: {
        id: parseInt(id),
        ownerId: req.user.id,
      },
      data: {
        content: content ? content : post?.content,
        username: username ? username : post?.username,
        title: title ? title : post?.title,
      },
    });
    res.status(200).json({ message: "Post updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server errror" });
  }
};

const deletePassword = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
        ownerId: req.user.id,
      },
    });
    if (!post) {
      res.status(404).json({ message: "Invalid any" });
      return;
    }
    if (post.file) {
      await deleteFile(post.file)
    }
    await prisma.post.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).json({ message: "Password Deleted Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sharePassword = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { uuid } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        uuid,
      },
    });
    if (!user) {
      res.status(404).json({ message: "Invalid share Id" });
      return;
    }
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
        ownerId: req.user.id,
      },
    });
    if (!post) {
      res.status(404).json({ message: "Invalid Post" });
      return;
    }
    await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        ownerId: user.id,
        sharedAt: new Date(),
      },
    });
    res.status(200).json({ message: "Password shared" });
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error");
  }
};

const searchPassword = async (req: any, res: Response) => {
  try {
    const { search } = req.query;
    const id = req.user.id;
    search.toString();
    const contents = await prisma.post.findMany({
      where: {
        ownerId: id,
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            username: {
              contains: search,
              mode: "insensitive",
            }
          }
        ],
      },
      orderBy: { createdAt: "asc" },
    });
    await Promise.all(contents.map(async e => {
      e.content = await cryptr.decrypt(e.content as string)
    }));
    res.status(200).json(contents)
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error");
  }
}
export {
  getAll,
  createPassword,
  modifyPassword,
  deletePassword,
  sharePassword,
  searchPassword,
};
