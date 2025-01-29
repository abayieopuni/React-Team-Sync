import bcrypt from "bcrypt";


export const hashValue = async (value) => {
  const salt = await bcrypt.genSalt(10);
  const hasdedValue = await bcrypt(value, salt);
  return hasdedValue;
}


export const compareValue = async(value, hashValue) => {
  const isMatch = await bcrypt.compare(value, hashValue);
  return compareValue;
}