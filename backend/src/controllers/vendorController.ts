import { Request, Response } from "express";
import VendorService from "../services/VendorService";
import {
  onboardSchema,
  updateVendorSchema,
} from "../validations/vendorValidator";
import { handleValidation } from "../middleware/validate";
import NinService from "../services/api/NinService";
import mongoose from "mongoose";
import { AuthService } from "../services";
import { User } from "../models";

// For new users — no auth required
export const onboardVendor = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const data = handleValidation(onboardSchema, req.body, res);
    
    const ninVerification = await NinService.verifyNin({
      firstName: data.firstName,
      lastName: data.lastName,
      nin: data.nin
    });

    if (!ninVerification.verified) {
      // await session.abortTransaction();
      // return res.status(400).json({
      //   success: false,
      //   message: 'NIN verification failed. Please check your details.'
      // });
      // TODO: restrict registration on NIN failure for prod
    }

    await AuthService.register({
      name: data.name!,
      email: data.email!,
      password: data.password!
    });

    const user = await User.findOne({ email: data.email }).session(session);
    if (!user) throw new Error('Failed to create user account');

    const vendor = await VendorService.onboard(user._id.toString(), {
      firstName: data.firstName,
      lastName: data.lastName,
      businessName: data.businessName,
      nin: data.nin,
      ninData: ninVerification.verified ? {
        appliicant: ninVerification.data?.applicant,
        summary: ninVerification.data?.summary,
        status: ninVerification.data?.status
      } : undefined,
      phoneNumber: data.phoneNumber
    }, session);

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: 'Account and vendor profile created. Please verify your email.',
      data: { vendor, user }
    });

  } catch (error: any) {
    await session.abortTransaction();
    console.log({error});
    
    res.status(400).json({ success: false, message: error.message });
  }
};

export const onboardExistingVendor = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const data = handleValidation(onboardSchema, req.body, res);
    if (!data) {
      await session.abortTransaction();
      return;
    }

    const user = (req as any).user;

    const ninVerification = await NinService.verifyNin({
      firstName: data.firstName,
      lastName: data.lastName,
      nin: data.nin
    });

    if (!ninVerification.verified) {
      // await session.abortTransaction();
      // return res.status(400).json({
      //   success: false,
      //   message: 'NIN verification failed. Please check your details.'
      // });
      // TODO: restrict registration on NIN failure for prod
    }

    const vendor = await VendorService.onboard(user._id.toString(), {
      firstName: data.firstName,
      lastName: data.lastName,
      businessName: data.businessName,
      nin: data.nin,
      phoneNumber: data.phoneNumber
    }, session);

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: 'Vendor profile created successfully.',
      data: { vendor, user }
    });

  } catch (error: any) {
    await session.abortTransaction();
    res.status(400).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const profile = await VendorService.getProfile(user._id);
    res.json({ success: true, data: profile });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const data = handleValidation(updateVendorSchema, req.body, res);
    if (!data) return;
    const user = (req as any).user;
    const updated = await VendorService.updateProfile(user._id, data);
    res.json({ success: true, message: "Profile updated", data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const vendor = (req as any).vendor;
    const products = await VendorService.getProducts(vendor._id);
    res.json({ success: true, data: products });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const vendor = (req as any).vendor;
    const orders = await VendorService.getOrders(vendor._id);
    res.json({ success: true, data: orders });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getBalance = async (req: Request, res: Response) => {
  try {
    const vendor = (req as any).vendor;
    const balance = await VendorService.getBalance(vendor._id);
    res.json({ success: true, data: balance });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPublicVendor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vendor = await VendorService.getPublicProfile(id as string);
    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }
    res.json({ success: true, data: vendor });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
