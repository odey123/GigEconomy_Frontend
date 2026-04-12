import { ClientAccountType, ClientStatus } from "../models/client.model";

export interface IClient {
  id: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  address?: string;
  accountType: ClientAccountType;
  registrationNumber?: string;
  estimatedMonthlyVolume?: string;
  totalOrders: number;
  activeOrders: number;
  status: ClientStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientJwtPayload {
  id: string;
  email: string;
  accountType: ClientAccountType;
  tokenType: "client";
  iat?: number;
  exp?: number;
}

export interface RegisterPayAsYouGoRequest {
  company: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}

export interface RegisterCorporateRequest {
  company: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  registrationNumber: string;
  estimatedMonthlyVolume: string;
}

export interface ClientLoginRequest {
  email: string;
  password: string;
}
