export const createUserModel = ({
  uid,
  name,
  email,
  phone = "",
  role = "student",
}) => {
  return {
    uid,
    name,
    email,
    phone,
    role,
    createdAt: new Date(),
  };
};