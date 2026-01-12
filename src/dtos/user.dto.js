
export const responseFromUser = ({ user, preferences }) => {
  const preferFoods = preferences.map(
    (preference) => preference.foodCategory.name
  );

  return {
    email: user.email,
    name: user.name,
    preferCategory: preferFoods,
  };
};