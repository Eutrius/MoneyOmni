// get element by id
const $ = (id) => {
  return document.getElementById(id);
};
// create element
const create$ = (element) => {
  return document.createElement(element);
};

const insertElementByClassAndIndex = (element, index) => {
  let referenceElement = getElementbyClassAndIndex(element.className, index);
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

const getElementbyClassAndIndex = (className, index) => {
  if (index === -1) return null;
  const elements = document.getElementsByClassName(className);
  return elements[index];
};

const resetEntryForm = () => {
  $("entry-form").reset();
};

const isInputEmpty = (input) => {
  if (input.value === "") {
    showErrorInput(input);
    return true;
  }
  return false;
};

const showErrorInput = (input, toShow = true) => {
  input.classList.toggle("error", toShow);
  if (toShow) {
    input.focus();
    const handleOnBlur = () => {
      showErrorInput(input, false);
      input.removeEventListener("blur", handleOnBlur);
    };
    input.addEventListener("blur", handleOnBlur);
  }
};

const getEntryInputs = () => {
  // return all inputs inside entry form excluding the add button
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

const parseAmount = (amount) => {
  if (Number(amount) === 0) return "$0";
  if (isAmountPositive(amount)) {
    return `+$${Number(amount)}`;
  } else {
    return `-$${amount.slice(1)}`;
  }
};

const isAmountPositive = (amount) => {
  return Number(amount) > 0;
};

const getDateToday = () => {
  const date = new Date()
    .toLocaleDateString("en-GB") // will return "dd/mm/yyyy"
    .split("/");
  return date.reverse().join("-"); // will return "yyyy-mm-dd"
};

const populateEntryForm = (entry) => {
  const inputs = getEntryInputs();
  for (let input of inputs) {
    input.value = entry[input.id];
  }
};
