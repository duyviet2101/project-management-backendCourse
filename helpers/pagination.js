module.exports = (objectPagination, query, counItems) => {
    
    
    if (query.page) {
        objectPagination.currentPage = parseInt(query.page);
    }
    
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;

    objectPagination.totalPage = Math.ceil(counItems / objectPagination.limitItems);
    
    return objectPagination;
}