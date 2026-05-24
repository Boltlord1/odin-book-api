function parseQuery(query: unknown) {
  if (typeof query === 'string') {
    return query
  }
  if (Array.isArray(query) && typeof query[0] === 'string') {
    return query[0]
  }
}

export default parseQuery
