import { supabase } from "./sb_config";

export async function createTable(tableName: string, schema: any){
  
}

export async function addDoc(table: string, doc: any){
    const { error } = await supabase
  .from(table)
  .insert(doc)
  return error;
}

export async function addDocs(table: string, docs: any[]){
    const { error } = await supabase
  .from(table)
  .insert(docs)
  return error;
}

export async function updateDoc(table: string, filters: any, fieldToUpdate: string, newVlaue: any){
    const { error } = await supabase
    .from(table)
    .update(filters)
    .eq(fieldToUpdate, newVlaue)
    
    return error;
}

export async function getDocs(table: string, filters: any){

const { data, error } = await supabase
    .from(table)
    .select(filters)
}

export async function deleteDocs(table: string, filters: any){
    const { error } = await supabase
    .from(table)
    .delete(filters)
    .eq('id', 1)
}