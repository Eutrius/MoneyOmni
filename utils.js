// Get element by id
const $ = (id) => {
  return document.getElementById(id);
};
// Create element
const $create = (element) => {
  return document.createElement(element);
};

const insertElementByClassAndIndex = (element, index) => {
  let referenceElement = getElementByClassAndIndex(element.className, index);
  let list;

  switch (element.className) {
    case "entry":
      list = $("entry-list");
      break;
    case "category":
      list = $("category-list");
      if (!referenceElement) referenceElement = list.lastElementChild;
      break;
    default:
      list = $("category");
  }

  if (!referenceElement) {
    list.appendChild(element);
    return;
  }
  list.insertBefore(element, referenceElement);
};

const getElementByClassAndIndex = (className, index) => {
  if (index === -1) return null;
  const elements = document.getElementsByClassName(className);
  return elements[index];
};

const resetEntryForm = () => {
  $("entry-form").reset();
};

const isInputEmpty = (input) => {
  if (input.value !== "") return false;
  showErrorInput(input);
  return true;
};

const showErrorInput = (input, toShow = true) => {
  input.classList.toggle("error", toShow);
  if (!toShow) {
    input.addEventListener("blur", handleOnBlur);
    return;
  }

  input.focus();
  const handleOnBlur = () => {
    showErrorInput(input, false);
    input.removeEventListener("blur", handleOnBlur);
  };
};

const getEntryInputs = () => {
  // Return all inputs inside entry form excluding the add button
  return [...$("entry-form").children].slice(0, -1);
};

const getMainElement = (button) => {
  return button.parentNode.parentNode;
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const parseDate = (date) => {
  return new Date(date).toLocaleString("default", {
    month: "short",
    day: "numeric",
  });
};

const formatAmount = (amount) => {
  if (Number(amount) === 0) return "$0";
  return isAmountPositive(amount)
    ? `+$${Number(amount)}`
    : `-$${amount.slice(1)}`;
};

const isAmountPositive = (amount) => {
  return Number(amount) > 0;
};

const getDateToday = () => {
  const date = new Date()
    .toLocaleDateString("en-GB") // This  will return "dd/mm/yyyy"
    .split("/");
  return date.reverse().join("-"); // This will return "yyyy-mm-dd"
};

const populateEntryForm = (entry) => {
  const inputs = getEntryInputs();
  inputs.forEach((input) => (input.value = entry[input.id]));
};

const removeToEditMark = () => {
  const entryElement = document.getElementsByClassName("to-edit")[0];
  entryElement.classList.remove("to-edit");
};
