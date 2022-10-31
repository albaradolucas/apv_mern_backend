const generarId = () => {
    return Date.now().toString(32) + Math.random().toString().substring(2)
}

export default generarId