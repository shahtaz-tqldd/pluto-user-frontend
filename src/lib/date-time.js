export const formatJoinedDate = (date) => {
  if (!date) return "Joined recently";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Joined recently";

  return `Joined ${parsedDate.toLocaleDateString("en", {
    month: "long",
    year: "numeric",
  })}`;
};
