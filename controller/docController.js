import documentSchema from "../schema/documentSchema.js";

const docController = async(id) => {
  if(id===null) return;

  const findDocument = await documentSchema.findById(id);

  if(findDocument) return findDocument;

  return await documentSchema.create({_id: id, data:""});
}
export default docController

export const updateDoc = async(id, data)=>{
    // console.log("update", data)
    return await documentSchema.findByIdAndUpdate(id, {data})
}