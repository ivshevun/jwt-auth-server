export const getActivationLinkByActivationId = (activationId: string) => {
    return `${process.env.API_URL}/api/activate/${activationId}`
}
