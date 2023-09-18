module.exports = (objectPagination, query, countProduct) => {
    
    
    if (query.page) {
        objectPagination.currentPage = parseInt(query.page);
    }
    
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;

    objectPagination.totalPage = Math.ceil(countProduct / objectPagination.limitItems);
    
    return objectPagination;
}