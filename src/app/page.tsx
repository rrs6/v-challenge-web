"use client";

import { changeItem, createItem, getItens } from "@/services/api";
import { Apple, Beef, CakeSlice, Carrot, Milk } from "lucide-react";
import { useEffect, useState } from "react";

export interface Item {
  name: string;
  quantity: number;
  quantityType: string;
  category: string;
  complete?: boolean;
  id?: number;
}

export default function Home() {
  const background: {[key: string]: string} = {'fruta': '#261A17', 'padaria': '#211E12', 'legume': '#1C2015', 'bebida': '#1A1D23', 'carne': '#251622'};
  const textColor: {[key: string]: string} = {'fruta': '#E07B67', 'padaria': '#BB9F3A', 'legume': '#8CAD51', 'bebida': '#7B94CB', 'carne': '#DB5BBF'};
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(0);
  const [actualPage, setActualPage] = useState(1);

  async function fetchItems(page: number = 1) {
    try {
      const data = await getItens(page);
      setItems(data.items);
      setPages(data.totalPages);
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  function toggleComplete(e: any, id: number, idx: number) {
    setItems(items.map((item: Item, i: number) => (idx === i ? {...item, complete: e.target.checked} : item)));
    changeItem(id, {...items[idx], complete: e.target.checked});
  }

  async function submitHandle(event: any) {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const name: string = formData.get('name') as string;
    const quantity: number = Number(formData.get('quantity'));
    const quantityType: string = formData.get('quantityType') as string;
    const category: string = formData.get('category') as string;
    const id = await createItem({name, quantity, quantityType, category});
    setItems([{name, quantity, quantityType, category, complete: false, id}, ...items.slice(-4)]);
    fetchItems(actualPage);
    form.reset();
  }

  return (
    <div className="flex justify-center flex-col w-100">
      <h1 className="text-4xl">Lista de Compras</h1>
      <form onSubmit={submitHandle} className="flex gap-10 justify-start py-10">
        <div className="flex flex-col">
          <label className="lbl" htmlFor="name">Item</label>
          <input className="inpt" id="name" name="name" type="text"/>
        </div>
        <div className="flex flex-col">
            <label className="lbl" htmlFor="quantity">Quantidade</label>
          <div className="flex">
            <input className="inpt" id="quantity" name="quantity" type="number"/>
            <select className="slct" name="quantityType" id="quantityType">
              <option value="unidade">UN.</option>
              <option value="kilo">KG.</option>
              <option value="litro">L.</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <label className="lbl" htmlFor="category">Categoria</label>
          <select className="slct" name="category" id="category">
            <option value="fruta">Fruta</option>
            <option value="padaria">Padaria</option>
            <option value="legume">Legume</option>
            <option value="bebida">Bebida</option>
            <option value="carne">Carne</option>
          </select>
        </div>
        <button className="btn" type="submit">+</button>
      </form>
      <ul>
        {items.map((item: Item, idx: number)=> {
          return (
            <li key={idx} className={`flex item flex-row justify-between px-5 py-3 items-center rounded-lg mb-3 ${item.complete ? 'item-checked' : 'item'}`}>
              <div className="flex gap-5 items-center">
                <input type="checkbox" id={`custom-checkbox-${idx}`} hidden onChange={(e) => toggleComplete(e, item.id as number, idx)} checked={item.complete}/>
                <label htmlFor={`custom-checkbox-${idx}`} className="custom-label text-center"></label>
                <div>
                  <p className={`${item.complete ? 'name-checked' : 'name'}`}>{item.name}</p>
                  <p className="text-slate-400">{item.quantity} {item.quantity>1 ? item.quantityType+'s' : item.quantityType}</p>
                </div>
              </div>
              <div className="flex gap-2 flag" style={{background: background[item.category], borderRadius: '10px', padding: '5px 10px'}}>
                {item.category === 'carne' && <Beef color={textColor[item.category]} size={24}/>}
                {item.category === 'fruta' && <Apple color={textColor[item.category]} size={24}/>}
                {item.category === 'bebida' && <Milk color={textColor[item.category]} size={24}/>}
                {item.category === 'legume' && <Carrot color={textColor[item.category]} size={24}/>}
                {item.category === 'padaria' && <CakeSlice color={textColor[item.category]} size={24}/>}
                <div style={{color: textColor[item.category]}}>{item.category}</div>
              </div>
            </li>
        )
        })}
      </ul>
      <ul className="flex gap-10 px-20 py-10">
        {Array.from({ length: pages }, (_, idx: number) => (
          <li onClick={() => {setActualPage(idx+1); fetchItems(idx+1);}} className={`px-4 py-2 links rounded cursor-pointer ${(idx+1)===actualPage ? 'selected' : ''}`} key={idx}>{idx + 1}</li>
        ))}
      </ul>
      {!items.length && !loading && <div className="text-3xl font-extralight text-center">Não há itens</div>}
    </div>
  );
}
