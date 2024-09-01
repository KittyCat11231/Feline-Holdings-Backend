function parseFilters(body, company) {
    let filters;
    if (company === 'intra') {
        filters = {
            useAir: true,
            useBahn: true,
            useBus: true,
            useRail: true,
            useSail: true,
            useLocal: true
        }
    }
    if (!body.excludeModes) {
        return filters;
    }
    if (body.excludeModes.includes('air')) {
        filters.useAir = false;
    }
    if (body.excludeModes.includes('bahn')) {
        filters.useBahn = false;
    }
    if (body.excludeModes.includes('bus')) {
        filters.useBus = false;
    }
    if (body.excludeModes.includes('rail')) {
        filters.useRail = false;
    }
    if (body.excludeModes.includes('sail')) {
        filters.useSail = false;
    }
    if (body.excludeModes.includes('local')) {
        filters.useLocal = false;
    }
    return filters;
}

module.exports = { parseFilters };