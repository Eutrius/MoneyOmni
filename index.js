// getElementById
const $ = (id) => {
  return document.getElementById(id);
};

$("menu-button").addEventListener("click", () => toggleCategoriesDiv());
$("entry-form").addEventListener("submit", (event) => {
  event.preventDefault();
  handleAddEntry();
});

const newCategoryInput = $("new-category");

newCategoryInput.addEventListener("keyup", ({ key }) => {
  if (key === "Enter" || key === "Esc") {
    if (key === "Enter") generateCategory(newCategoryInput.value);
    newCategoryInput.value = "";
    newCategoryInput.classList.add("none");
    showCategoriesButtons(true);
  }
});

$("add-category").addEventListener("click", () => {
  newCategoryInput.classList.remove("none");
  showCategoriesButtons(false);
});

const toggleCategoriesDiv = () => {
  const menuButton = $("menu-button");
  const categoriesDiv = $("categories");

  $("home").classList.toggle("none");
  categoriesDiv.classList.toggle("none");

  menuButton.style.backgroundImage = categoriesDiv.classList.contains("none")
    ? "url('./images/menu.png')"
    : "url('./images/home.png')";
};

const handleAddEntry = () => {
  // Get all inputs and select tag excluding the add button from entry form
  const inputs = [...$("entry-form").children].slice(0, -1);

  // Toggle .error when an input has no value
  for (let input of inputs) {
    if (input.value === "") {
      input.addEventListener("blur", () => {
        input.classList.remove("error");
      });
      input.classList.add("error");
      return null;
    }
  }
  // Reset form
  for (let input of inputs) {
    input.value = "";
  }
};

const showCategoriesButtons = (toShow) => {
  $("add-category").style.visibility = toShow ? "visible" : "hidden";
  const buttonsDivs = document.querySelectorAll(
    "#categories .edit-delete-buttons",
  );
  for (let div of buttonsDivs) {
    if (toShow) {
      div.classList.remove("none");
    } else {
      div.classList.add("none");
    }
  }
};

const generateEditDeleteButtons = () => {
  const container = document.createElement("div");
  container.className = "edit-delete-buttons";
  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");

  editButton.addEventListener("click", (event) => edit(event));

  container.append(editButton, deleteButton);
  return container;
};

const generateCategory = (name) => {
  const categoryList = $("category-list");
  const newCategory = document.createElement("div");
  newCategory.className = "category";

  const input = document.createElement("input");
  input.type = "text";
  input.value = name;
  input.addEventListener("keyup", ({ key }) => {
    if (key === "Enter") {
      input.style.pointerEvents = "none";
      input.style.backgroundColor = "inherit";
      input.blur();
      showCategoriesButtons(true);
    }
  });

  const buttons = generateEditDeleteButtons();

  newCategory.append(input, buttons);
  categoryList.insertBefore(newCategory, categoryList.lastElementChild);
};

const edit = (event) => {
  // check categories div visibility
  const toEditEntry = $("categories").classList.contains("none");

  if (toEditEntry) {
    console.log("Edit entry");
  } else {
    // Edit category
    // select the input element of the target category
    const input = event.target.parentNode.previousSibling;
    input.style.pointerEvents = "auto";
    input.style.backgroundColor = "var(--middle-grey)";
    input.focus();
    showCategoriesButtons(false);
  }
};

const categories = ["Bills", "Groceries", "Income", "Misc", "Presents"];
for (let category of categories) {
  generateCategory(category);
}
