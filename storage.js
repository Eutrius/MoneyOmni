const storage = (() => {
  const entries = JSON.parse(localStorage.getItem("moneyOmni-entries")) || [];
  const categories =
    JSON.parse(localStorage.getItem("moneyOmni-categories")) || [];
  let balance = localStorage.getItem("moneyOmni-balance") || "0";

  const addCategory = (newCategory) => {
    const index = categories.findIndex((category) => newCategory < category);
    index != -1
      ? categories.splice(index, 0, newCategory)
      : categories.push(newCategory);
    save("categories");
  };

  const deleteCategory = (category) => {
    categories.splice(getCategoryIndex(category), 1);
    save("categories");
  };

  const updateEntriesCategory = (category, newCategory) => {
    entries.forEach((entry) =>
      entry.category === category ? (entry.category = newCategory) : null,
    );
    save("entries");
  };

  const getCategoryIndex = (category) => {
    return categories.indexOf(category);
  };

  const isCategoryUnique = (category) => {
    return !categories.includes(category);
  };

  const addEntry = (newEntry) => {
    updateBalance(newEntry.amount);
    const index = entries.findIndex((entry) => newEntry.date < entry.date);
    index != -1 ? entries.splice(index, 0, newEntry) : entries.push(newEntry);
    save("entries");
  };

  const removeEntry = (id) => {
    const entry = getEntryById(id);
    updateBalance(-entry.amount);
    entries.splice(entries.indexOf(entry), 1);
    save("entries");
  };

  const getEntryById = (id) => {
    return entries.find((entry) => entry.id === id);
  };

  const updateBalance = (amount) => {
    balance = `${Number(balance) + Number(amount)}`;
    save("balance");
  };

  const getBalance = () => {
    return balance;
  };

  const getCategories = () => {
    return categories;
  };

  const getEntries = () => {
    return entries;
  };

  const save = (dataType) => {
    let data;
    switch (dataType) {
      case "entries":
        data = JSON.stringify(entries);
        break;
      case "categories":
        data = JSON.stringify(categories);
        break;
      default:
        data = balance;
    }
    localStorage.setItem(`moneyOmni-${dataType}`, data);
  };

  return {
    getEntries,
    getCategories,
    getBalance,
    addCategory,
    deleteCategory,
    updateEntriesCategory,
    getCategoryIndex,
    isCategoryUnique,
    addEntry,
    removeEntry,
    getEntryById,
  };
})();
