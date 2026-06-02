function parseQuery(query: unknown) {
  if (typeof query === 'string') {
    const str = query.trim()
    return str === '' ? undefined : str
  }
  if (Array.isArray(query) && typeof query[0] === 'string') {
    const str = query[0].trim()
    return str === '' ? undefined : str
  }
}

export default parseQuery
