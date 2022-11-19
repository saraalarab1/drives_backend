const formatLocalDate = (dateTime) => {
  const date = dateTime.toLocaleDateString().split("/");
  const time = dateTime.toTimeString().substring(0, 8);
  return `${date[2]}-${parseInt(date[0]) < 10 ? "0" : ""}${date[0]}-${
    parseInt(date[1]) < 10 ? "0" : ""
  }${date[1]} ${time}`;
};

export default formatLocalDate;
