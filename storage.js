const storage = (() => {
  const entries = JSON.parse(localStorage.getItem("moneyOmni-entries")) || [];
  const categories =
    JSON.parse(localStorage.getItem("moneyOmni-categories")) || [];
  let balance = localStorage.getItem("moneyOmni-balance") || "0";

  const addCategory = (newCategory) => {
    for (let category of categories) {
      if (newCategory < category) {
        categories.splice(getCategoryIndex(category), 0, newCategory);
        save("categories");
        return;
      }
    }
    categories.push(newCategory);
    save("categories");
  };

  const deleteCategory = (category) => {
    categories.splice(getCategoryIndex(category), 1);
    save("categories");
  };

  const updateEntriesCategory = (category, newCategory) => {
    for (let entry of entries) {
      if (entry.category === category) {
        entry.category = newCategory;
      }
      console.log(entries);
    }
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
    for (let entry of entries) {
      if (newEntry.date < entry.date) {
        entries.splice(getEntryIndexById(entry.id), 0, newEntry);
        save("entries");
        return;
      }
    }
    entries.push(newEntry);
    save("entries");
  };

  const removeEntry = (id) => {
    const index = getEntryIndexById(id);
    updateBalance(-entries[index].amount);
    entries.splice(index, 1);
    save("entries");
  };

  const getEntryIndexById = (id) => {
    return entries.findIndex((entry) => entry.id === id);
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
    getEntryIndexById,
  };
})();
