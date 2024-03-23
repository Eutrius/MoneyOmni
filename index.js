$("menu-button").addEventListener("click", () => toggleCategoriesDiv());
$("entry-form").addEventListener("submit", (event) => handleSubmit(event));
$("new-category").addEventListener("keyup", (event) =>
  handleAddCategory(event),
);
$("add-category").addEventListener("click", () => {
  showNewCategoryInput(true);
});

const handleAddCategory = ({ key, target }) => {
  if (key !== "Enter" && key !== "Escape") return;
  const value = capitalizeFirstLetter(target.value);
  if (key === "Enter" && value !== "") {
    // Early exit if category is not unique
    if (!storage.isCategoryUnique(value)) {
      return;
    }
    target.value = "";
    storage.addCategory(value);
    const index = storage.getCategoryIndex(value);
    renderCategory(value, index);
  }
  showNewCategoryInput(false);
};

const handleSubmit = (event) => {
  event.preventDefault();
  const inputs = getEntryInputs();
  const [note, amount] = inputs;

  // Check name and amount input value
  if (isInputEmpty(note) || isInputEmpty(amount)) return;
  if (amount.value === "0") {
    showErrorInput(amount);
    return;
  }

  const newEntry = {
    id: Date.now().toString(),
  };
  for (let input of inputs) {
    newEntry[input.id] = input.value;
  }
  if (!newEntry.date) newEntry.date = getDateToday();
  newEntry.note = capitalizeFirstLetter(newEntry.note);

  storage.addEntry(newEntry);
  renderEntry(newEntry, storage.getEntries().indexOf(newEntry));
  updateBalance();
  showCancelButton(false);
  resetEntryForm();
};

const handleEdit = ({ target }) => {
  // Check categories div visibility
  const element = getMainElement(target);
  $("categories").classList.contains("none")
    ? editEntry(element)
    : editCategory(element);
};

const handleDelete = ({ target }) => {
  const element = getMainElement(target);
  $("categories").classList.contains("none")
    ? deleteEntry(element)
    : deleteCategory(element);
};

const handleUpdate = () => {
  const oldEntryElement = document.getElementsByClassName("to-edit")[0];
  deleteEntry(oldEntryElement);
  $("entry-form").removeEventListener("submit", handleUpdate);
};

const handleCancel = () => {
  resetEntryForm();
  removeToEditMark();
  showCancelButton(false);
  $("cancel-button").removeEventListener("click", handleCancel);
  $("entry-form").removeEventListener("submit", handleUpdate);
};

const handleCategoryInputBlur = ({ target }) => {
  target.value = target.placeholder;
  showCategoriesButtons(true);
  target.removeEventListener("keyup", handleCategoryInputKey);
  target.removeEventListener("blur", handleCategoryInputBlur);
};

const handleCategoryInputKey = ({ key, target }) => {
  if (key !== "Enter" && key !== "Escape") return;
  const initialValue = target.placeholder;
  const newValue = capitalizeFirstLetter(target.value);
  if (key === "Enter") {
    if (
      newValue !== initialValue &&
      (!newValue || !storage.isCategoryUnique(newValue))
    ) {
      return;
    }
    // Set the value back to delete the right element
    target.value = initialValue;
    deleteCategory(target.parentNode);

    storage.addCategory(newValue);
    storage.updateEntriesCategory(initialValue, newValue);
    renderCategory(newValue, storage.getCategoryIndex(newValue));
    renderEntries(); // Rerender entry list
  }
  target.blur();
};

const deleteCategory = (categoryElement) => {
  const category = categoryElement.firstElementChild.value;
  storage.deleteCategory(category);
  deleteCategoryOption(category);
  categoryElement.remove();
};

const deleteEntry = (entryElement) => {
  storage.removeEntry(entryElement.id);
  updateBalance();
  entryElement.remove();
};

const deleteCategoryOption = (category) => {
  document.querySelector(`option[value=${category}]`).remove();
};

const editEntry = (entryElement) => {
  // Add the "to-edit" class to the entryElement to mark it
  entryElement.classList.add("to-edit");
  entryElement.toEdit = "false";
  const entry = storage.getEntryById(entryElement.id);
  populateEntryForm(entry);
  showCancelButton(true);

  $("entry-form").addEventListener("submit", handleUpdate);
  $("cancel-button").addEventListener("click", handleCancel);
};

const editCategory = (categoryElement) => {
  // Get the input element
  const input = categoryElement.firstElementChild;
  // Set the current value as its placeholder to preserve it as the initial value.
  input.placeholder = input.value;
  input.focus();

  input.addEventListener("keyup", handleCategoryInputKey);
  input.addEventListener("blur", handleCategoryInputBlur);
  showCategoriesButtons(false);
};

const toggleCategoriesDiv = () => {
  $("home").classList.toggle("none");
  $("categories").classList.toggle("none");
  $("menu-button").classList.toggle("home");
  showNewCategoryInput(false);
};

const showCategoriesButtons = (toShow) => {
  $("add-category").style.visibility = toShow ? "visible" : "hidden";
  const buttonsDivs = document.querySelectorAll(
    "#categories .edit-delete-buttons",
  );
  buttonsDivs.forEach((div) => div.classList.toggle("none", !toShow));
};

const showNewCategoryInput = (toShow) => {
  const input = $("new-category");
  input.classList.toggle("none", !toShow);
  if (toShow) {
    showCategoriesButtons(false);
  } else {
    input.value = "";
    showCategoriesButtons(true);
  }
  input.focus();
};

const showCancelButton = (toShow) => {
  $("cancel-button").classList.toggle("none", !toShow);
  $("entry-list").classList.toggle("none", toShow);
  $("menu-button").classList.toggle("none", toShow);
  $("add-entry").textContent = toShow ? "Update" : "Add";
};

const generateEditDeleteButtons = () => {
  const container = $create("div");
  container.className = "edit-delete-buttons";
  const editButton = $create("button");
  const deleteButton = $create("button");

  editButton.addEventListener("click", handleEdit);
  deleteButton.addEventListener("click", handleDelete);

  container.append(editButton, deleteButton);
  return container;
};

const generateCategoryElement = (category) => {
  const newCategory = $create("div");
  newCategory.className = "category";

  const input = $create("input");
  input.type = "text";
  input.value = category;

  const buttons = generateEditDeleteButtons();
  newCategory.append(input, buttons);
  return newCategory;
};

const generateEntryElement = ({ id, note, amount, date, category }) => {
  const newEntry = $create("div");
  newEntry.id = id;
  newEntry.className = "entry";

  const labelDiv = $create("div");
  const noteElement = $create("h6");
  const dateCategory = $create("p");
  noteElement.textContent = note;
  dateCategory.textContent =
    `${parseDate(date)} ` + (!category ? "" : `• ${category}`);
  labelDiv.append(noteElement, dateCategory);

  const buttons = generateEditDeleteButtons();

  const amountDiv = $create("div");
  if (isAmountPositive(amount)) amountDiv.className = "positive";
  amountDiv.textContent = formatAmount(amount);

  newEntry.append(labelDiv, buttons, amountDiv);
  return newEntry;
};

const renderCategory = (category, index = -1) => {
  const element = generateCategoryElement(category);
  insertElementByClassAndIndex(element, index);
  renderOption(category, index);
};

const renderEntry = (entry, index = -1) => {
  const element = generateEntryElement(entry);
  insertElementByClassAndIndex(element, index);
};

const renderOption = (category, index = -1) => {
  const element = $create("option");
  element.value = category;
  element.textContent = category;
  element.className = "category-option";
  insertElementByClassAndIndex(element, index);
};

const renderEntries = () => {
  // Remove all children to so we can also rerender
  $("entry-list").replaceChildren([]);
  storage.getEntries().forEach((entry) => renderEntry(entry));
};

const renderCategories = () => {
  storage.getCategories().forEach((category) => renderCategory(category));
};

const updateBalance = () => {
  const balanceElement = $("balance");
  const balance = storage.getBalance();
  balanceElement.textContent = isAmountPositive(balance)
    ? formatAmount(balance).replace("+", "") // Remove "+"
    : formatAmount(balance);
  if (balance === "0") {
    balanceElement.className = "";
    return;
  }
  balanceElement.classList.toggle("positive", isAmountPositive(balance));
  balanceElement.classList.toggle("negative", !isAmountPositive(balance));
};

// Initialize app
renderEntries();
renderCategories();
updateBalance();
