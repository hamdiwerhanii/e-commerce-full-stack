import type { Request, Response } from "express";
import { parseInput, parseObjectId } from "../common/utils/validation.utils.js";
import { captureOrderDto, createOrderDto, updateOrderStatusDto } from "./dto/order.dto.js";
import * as ordersService from "./orders.service.js";

const userIdOf = (req: Request) => req.user!.id as string;
const orderIdOf = (req: Request) => parseObjectId(req.params.id, "order id");

export async function create(req: Request, res: Response) {
  const result = await ordersService.createOrder(
    userIdOf(req),
    parseInput(createOrderDto, req.body),
  );
  res.status(201).json(result);
}

export async function capture(req: Request, res: Response) {
  const order = await ordersService.capturePayment(
    userIdOf(req),
    orderIdOf(req),
    parseInput(captureOrderDto, req.body),
  );
  res.json({ order });
}

export async function listMine(req: Request, res: Response) {
  res.json({ orders: await ordersService.listMyOrders(userIdOf(req)) });
}

export async function getMine(req: Request, res: Response) {
  res.json({ order: await ordersService.getMyOrder(userIdOf(req), orderIdOf(req)) });
}

export async function listAll(_req: Request, res: Response) {
  res.json({ orders: await ordersService.listAllOrders() });
}

export async function getAny(req: Request, res: Response) {
  res.json({ order: await ordersService.getOrder(orderIdOf(req)) });
}

export async function updateStatus(req: Request, res: Response) {
  const { orderStatus } = parseInput(updateOrderStatusDto, req.body);
  res.json({ order: await ordersService.updateOrderStatus(orderIdOf(req), orderStatus) });
}
