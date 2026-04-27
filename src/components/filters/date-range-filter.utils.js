export const formatDateForApi = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getThisWeekRange = () => {
  const today = new Date();
  const currentDay = today.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  const dateFrom = new Date(today);
  dateFrom.setDate(today.getDate() + mondayOffset);

  return {
    dateFrom: formatDateForApi(dateFrom),
    dateTo: formatDateForApi(today),
  };
};

export const getThisMonthRange = () => {
  const today = new Date();
  const dateFrom = new Date(today.getFullYear(), today.getMonth(), 1);

  return {
    dateFrom: formatDateForApi(dateFrom),
    dateTo: formatDateForApi(today),
  };
};

export const getRangeFromPreset = (preset, customRange) => {
  if (preset === "this_month") return getThisMonthRange();
  if (preset === "custom") return customRange;
  return getThisWeekRange();
};
