export const createMenuModel = ({
  name,
  description = "",
  price,
  category,
  imageUrl = "",
}) => {
  return {
    name,
    description,
    price,
    category,
    imageUrl,
    available: true,
    createdAt: new Date(),
  };
};