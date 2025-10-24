exports.baseURLSafeParse = (baseUrl, redirectUrl) => {
    return baseUrl === '/' ? redirectUrl : `${baseUrl}${redirectUrl}`
}