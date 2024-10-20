import { Item } from "@/app/page";
import axios from "axios";

const base_url = "http://localhost:3001/item";
export async function createItem(item: Item) {
    const {name, quantity, quantityType, category} = item;
    const res = await axios.post(`${base_url}/new`, {name, quantity, quantityType, category});
    return res.data.id;
}

export async function getItens(page: number = 1) {
    const res = await axios.get(`${base_url}`, {params: {page: page}});
    return res.data;
}

export async function changeItem(id: number, {name, quantity, quantityType, category, complete}: Item) {
    const res = await axios.put(`${base_url}/${id}`, {name, quantity, quantityType, category, complete});
}