export default function filterBySearchTerm(searchTerm, arr) {
  if(!arr) return;
  const regex = new RegExp(searchTerm, 'gi');
  return arr.filter(item => {
    let condition = false;
    for (let i in item) {
      let value = JSON.stringify(item[i]);
      if (value.search(regex) > -1) {
        condition = true;
      }
    }
    return item && condition;
  });
}