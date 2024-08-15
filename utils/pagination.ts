export const paginationData = (records: unknown[], limit: number) => {
  return {
    recordsNo: records.length,
    nextPageCursor: (records.length > 0 && records.length === limit)
      ? (records as Record<string, unknown>[])[records.length - 1].id
      : null,
    records
  }
}
