$("menu-button").addEventListener("click", () => toggleCategoriesDiv());
$("entry-form").addEventListener("submit", (event) => handleSubmit(event));
$("new-category").addEventListener("keyup", (event) =>
  handleAddCategory(event),
);
$("add-category").addEventListener("click", () => {
  showNewCategoryInput(true);
});

const handleAddCategory = ({ key, target }) => {
  const value = capitalizeFirstLetter(target.value);
  if (key === "Enter" || key === "Escape") {
    if (key === "Enter" && value !== "") {
      // early exit if category is not unique
      if (!storage.isCategoryUnique(value)) {
        return;
      }
      target.value = "";
      storage.addCategory(value);
      const index = storage.getCategoryIndex(value);
      renderCategory(value, index);
    }
    showNewCategoryInput(false);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  const inputs = getEntryInputs();
  const [note, amount] = inputs;

  // check name and amount input value
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
  renderEntry(newEntry, storage.getEntryIndexById(newEntry.id));
  updateBalance();
  showCancelButton(false);
  resetEntryForm();
};

const handleEdit = ({ target }) => {
  // check categories div visibility
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
  const entry = storage.getEntryById(entryElement.id);
  populateEntryForm(entry);
  showCancelButton(true);

  const entryForm = $("entry-form");

  const handleUpdate = () => {
    deleteEntry(entryElement);
    entryForm.removeEventListener("submit", handleUpdate);
  };

  const cancelButton = $("cancel-button");

  const handleCancel = () => {
    resetEntryForm();
    showCancelButton(false);
    cancelButton.removeEventListener("click", handleCancel);
    entryForm.removeEventListener("submit", handleUpdate);
  };

  entryForm.addEventListener("submit", handleUpdate);
  cancelButton.addEventListener("click", handleCancel);
};

const editCategory = (categoryElement) => {
  // get the input element
  const input = categoryElement.firstElementChild;
  let initialValue = input.value;
  let newValue;

  input.focus();

  const handleKeyPress = ({ key }) => {
    if (key === "Enter" || key === "Escape") {
      if (key === "Enter") {
        if (
          input.value !== initialValue &&
          (!input.value || !storage.isCategoryUnique(input.value))
        ) {
          return;
        }
        newValue = capitalizeFirstLetter(input.value);
        // set the value back to delete the right element
        input.value = initialValue;
        deleteCategory(categoryElement);

        storage.addCategory(newValue);
        storage.updateEntriesCategory(initialValue, newValue);
        renderCategory(newValue, storage.getCategoryIndex(newValue));
        renderEntries(); // rerender Entry
      }
      input.blur();
    }
  };

  const handleOnBlur = () => {
    input.value = initialValue;
    showCategoriesButtons(true);
    input.removeEventListener("keyup", handleKeyPress);
    input.removeEventListener("blur", handleOnBlur);
  };

  input.addEventListener("keyup", handleKeyPress);
  input.addEventListener("blur", handleOnBlur);
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
  for (let div of buttonsDivs) {
    div.classList.toggle("none", !toShow);
  }
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
  const container = create$("div");
  container.className = "edit-delete-buttons";
  const editButton = create$("button");
  const deleteButton = create$("button");

  editButton.addEventListener("click", handleEdit);
  deleteButton.addEventListener("click", handleDelete);

  container.append(editButton, deleteButton);
  return container;
};

const generateCategoryElement = (category) => {
  const newCategory = create$("div");
  newCategory.className = "category";

  const input = create$("input");
  input.type = "text";
  input.value = category;

  const buttons = generateEditDeleteButtons();
  newCategory.append(input, buttons);
  return newCategory;
};

const generateEntryElement = ({ id, note, amount, date, category }) => {
  const newEntry = create$("div");
  newEntry.id = id;
  newEntry.className = "entry";

  const labelDiv = create$("div");
  const noteElement = create$("h6");
  const dateCategory = create$("p");
  noteElement.textContent = note;
  dateCategory.textContent =
    `${parseDate(date)} ` + (!category ? "" : `• ${category}`);
  labelDiv.append(noteElement, dateCategory);

  const buttons = generateEditDeleteButtons();

  const amountDiv = create$("div");
  if (isAmountPositive(amount)) amountDiv.className = "positive";
  amountDiv.textContent = parseAmount(amount);

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
  const element = create$("option");
  element.value = category;
  element.textContent = category;
  element.className = "category-option";
  insertElementByClassAndIndex(element, index);
};

const renderEntries = () => {
  // remove all children to so we can also rerender
  $("entry-list").replaceChildren([]);
  for (let entry of storage.getEntries()) {
    renderEntry(entry);
  }
};

const renderCategories = () => {
  for (let category of storage.getCategories()) {
    renderCategory(category);
  }
};

const updateBalance = () => {
  const balanceElement = $("balance");
  const balance = storage.getBalance();
  balanceElement.textContent = isAmountPositive(balance)
    ? parseAmount(balance).replace("+", "") // remove +
    : parseAmount(balance);
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
